import { useState, useEffect } from 'react';
import { useEntity } from '@/contexts/EntityContext';
import { EntityDashboardAPI } from '@/lib/api';
import { UserEntityDashboardCharts, UserEntityDashboardData } from '@/types/api';

interface DashboardStats {
  totalStructures: number;
  totalRepresentatives: number;
  totalDemands: number;
  pendingDemands: number;
  approvedDemands: number;
  rejectedDemands: number;
}

interface DashboardChartPoint {
  label: string;
  demandes: number;
  structures: number;
}

interface DashboardData {
  stats: DashboardStats;
  chartData: DashboardChartPoint[];
  recentDemands: RecentDemandSummary[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY_STATS: DashboardStats = {
  totalStructures: 0,
  totalRepresentatives: 0,
  totalDemands: 0,
  pendingDemands: 0,
  approvedDemands: 0,
  rejectedDemands: 0,
};

// Format minimal pour alimenter le composant RecentActivities
export interface RecentDemandSummary {
  id: string;
  entity: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "rejected" | "under_review";
}

const mergeChartsToSeries = (charts: UserEntityDashboardCharts): DashboardChartPoint[] => {
  const byKey: Record<string, DashboardChartPoint> = {};

  const monthShort = (month: number) => {
    const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    return labels[Math.max(0, Math.min(11, month - 1))] ?? String(month);
  };

  charts.accreditations_per_month?.forEach((item) => {
    const key = `${item.year}-${item.month}`;
    if (!byKey[key]) {
      byKey[key] = {
        label: `${monthShort(item.month)} ${item.year}`,
        demandes: 0,
        structures: 0,
      };
    }
    byKey[key].demandes = item.total ?? 0;
  });

  charts.entities_per_month?.forEach((item) => {
    const key = `${item.year}-${item.month}`;
    if (!byKey[key]) {
      byKey[key] = {
        label: `${monthShort(item.month)} ${item.year}`,
        demandes: 0,
        structures: 0,
      };
    }
    byKey[key].structures = item.total ?? 0;
  });

  return Object.values(byKey).sort((a, b) => a.label.localeCompare(b.label));
};

export const useDashboardData = (): DashboardData => {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [chartData, setChartData] = useState<DashboardChartPoint[]>([]);
  const [recentDemands, setRecentDemands] = useState<RecentDemandSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { activeEntity } = useEntity();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!activeEntity?.slug) {
        setStats(EMPTY_STATS);
        setChartData([]);
        setRecentDemands([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [summary, charts]: [UserEntityDashboardData, UserEntityDashboardCharts] = await Promise.all([
          EntityDashboardAPI.getDashboard(activeEntity.slug),
          EntityDashboardAPI.getDashboardCharts(activeEntity.slug),
        ]);
        // console.log('summary', summary);
        // console.log('charts', charts);

        const nextStats: DashboardStats = {
          totalStructures: summary.total_entity,
          totalRepresentatives: summary.total_representative,
          totalDemands: summary.accreditations.total,
          pendingDemands: summary.accreditations.submitted + summary.accreditations.under_review,
          approvedDemands: summary.accreditations.approved,
          rejectedDemands: summary.accreditations.rejected,
        };

        // Mapper les dernières accréditations vers un format adapté aux activités récentes
        const mapStatus = (status: string): RecentDemandSummary["status"] => {
          switch (status) {
            case "approved":
              return "approved";
            case "rejected":
              return "rejected";
            case "under_review":
              return "under_review";
            case "submitted":
            default:
              return "pending";
          }
        };

        const nextRecentDemands: RecentDemandSummary[] = (summary.last_accreditation ?? []).map((item) => ({
          id: item.slug,
          entity: activeEntity?.name ?? item.representative,
          type: item.type_accreditation,
          date: item.submission_date
            ? new Date(item.submission_date).toLocaleDateString("fr-FR")
            : "",
          status: mapStatus(item.status),
        }));

        setStats(nextStats);
        setChartData(mergeChartsToSeries(charts));
        setRecentDemands(nextRecentDemands);
      } catch (err) {
        console.error('Erreur lors du chargement des données du dashboard:', err);
        setError('Impossible de charger les données du tableau de bord utilisateur.');
        setStats(EMPTY_STATS);
        setChartData([]);
        setRecentDemands([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeEntity?.slug]);

  return {
    stats,
    chartData,
    recentDemands,
    isLoading,
    error,
  };
};
