import { useState, useEffect } from 'react';
import { useEntity } from '@/contexts/EntityContext';

interface DashboardStats {
  totalStructures: number;
  totalRepresentatives: number;
  totalDemands: number;
  pendingDemands: number;
  approvedDemands: number;
  rejectedDemands: number;
}

interface DashboardData {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStructures: 0,
    totalRepresentatives: 0,
    totalDemands: 0,
    pendingDemands: 0,
    approvedDemands: 0,
    rejectedDemands: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { entities } = useEntity();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Remplacer par les vrais appels API quand l'endpoint sera disponible
        // const [statsResponse, demandsResponse] = await Promise.all([
        //   apiClient.get('/api/dashboard/stats'),
        //   apiClient.get('/api/dashboard/demands')
        // ]);

        // Données mockées pour l'instant
        const mockStats: DashboardStats = {
          totalStructures: entities.length,
          totalRepresentatives: 8,
          totalDemands: 12,
          pendingDemands: 3,
          approvedDemands: 7,
          rejectedDemands: 2,
        };

        setStats(mockStats);
      } catch (err) {
        console.error('Erreur lors du chargement des données du dashboard:', err);
        setError('Impossible de charger les données du dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [entities.length]);

  return {
    stats,
    isLoading,
    error,
  };
};
