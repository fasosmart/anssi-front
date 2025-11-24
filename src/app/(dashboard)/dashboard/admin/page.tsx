"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  Eye,
  Download,
  Filter
} from "lucide-react";
import Link from "next/link";
import { AdminAPI } from "@/lib/api";
import { AdminDashboardData, AdminDashboardCharts } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const typeColorPalette = ["#2563eb", "#16a34a", "#9333ea", "#f97316", "#dc2626", "#0ea5e9", "#f59e0b"];
const typeColorClassPalette = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-sky-500", "bg-amber-500"];

const resolveTypeName = (
  entry: {
    type?: string;
    name?: string;
    type_accreditation__name?: string;
  },
  index: number
): string => {
  const candidates = [entry.type, entry.name, entry.type_accreditation__name];
  const match = candidates.find((value): value is string => Boolean(value && value.trim().length > 0));
  if (match) {
    return match;
  }
  return `Type ${index + 1}`;
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyChartData, setMonthlyChartData] = useState<Array<{ month: string; accreditations: number; entities: number }>>([]);
  const [typeDistribution, setTypeDistribution] = useState<Array<{ id: string; name: string; value: number; color: string; className: string }>>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  
  // Récupération des permissions pour conditionner l'affichage des actions rapides
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  // Vérification des permissions pour chaque action rapide
  const canViewEntities = hasPermission("entities.view_entity");
  const canViewAccreditations = hasPermission("accreditations.view_accreditation");
  const canManageUsers = hasAnyPermission(["users.can_edit_staff", "users.manage_user_groups"]);
  // Les paramètres système sont accessibles à tous les staff (pas de permission spécifique requise)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await AdminAPI.getDashboard();
        setDashboardData(data);
      } catch (e: unknown) {
        const err = e as AxiosError<{ detail?: string}>;
        toast.error(err.response?.data?.detail || "Une erreur est survenue");
        setError(err.response?.data?.detail || "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDashboardCharts = async () => {
      setIsChartLoading(true);
      setChartError(null);
      try {
        const charts: AdminDashboardCharts = await AdminAPI.getDashboardCharts();

        const monthMap = new Map<string, { month: string; accreditations: number; entities: number }>();
        const formatMonthLabel = (value: string | number | undefined, fallbackIndex: number) => {
          if (typeof value === "number" && Number.isFinite(value)) {
            const date = new Date(2000, Math.max(0, Number(value) - 1), 1);
            return date.toLocaleString("fr-FR", { month: "short" });
          }
          if (typeof value === "string" && value.trim().length > 0) {
            const parsed = Date.parse(value);
            if (!Number.isNaN(parsed)) {
              return new Date(parsed).toLocaleString("fr-FR", { month: "short", year: "2-digit" });
            }
            return value;
          }
          return `M${fallbackIndex + 1}`;
        };

        const ensureMonthEntry = (label: string) => {
          if (!monthMap.has(label)) {
            monthMap.set(label, { month: label, accreditations: 0, entities: 0 });
          }
          return monthMap.get(label)!;
        };

        (charts.accreditations_per_month ?? []).forEach((entry, index) => {
          const label = formatMonthLabel(entry.month, index);
          const monthEntry = ensureMonthEntry(label);
          monthEntry.accreditations = entry.count ?? entry.total ?? entry.value ?? 0;
        });

        (charts.entities_per_month ?? []).forEach((entry, index) => {
          const label = formatMonthLabel(entry.month, index);
          const monthEntry = ensureMonthEntry(label);
          monthEntry.entities = entry.count ?? entry.total ?? entry.value ?? 0;
        });

        const monthlyData = Array.from(monthMap.values());
        if (
          monthlyData.length === 0 &&
          (typeof charts.accreditation_shart !== "undefined" || typeof charts.entity_shart !== "undefined")
        ) {
          monthlyData.push({
            month: "Ce mois",
            accreditations: charts.accreditation_shart ?? 0,
            entities: charts.entity_shart ?? 0,
          });
        }
        setMonthlyChartData(monthlyData);

        const rawTypeStats =
          charts.type_accreditation_stats?.map((entry, index) => {
            const name = resolveTypeName(entry, index);
            return {
              name,
              value: entry.total ?? entry.count ?? entry.value ?? 0,
              id: `${name}-${index}`,
            };
          }) ?? [];

        const processedTypeStats = rawTypeStats
          .filter((entry) => entry.value > 0)
          .map((entry, index) => ({
            ...entry,
            color: typeColorPalette[index % typeColorPalette.length],
            className: typeColorClassPalette[index % typeColorClassPalette.length],
          }));

        setTypeDistribution(processedTypeStats);
      } catch (e) {
        const err = e as AxiosError<{ detail?: string }>;
        const message = err.response?.data?.detail || "Impossible de charger les statistiques mensuelles";
        toast.error(message);
        setChartError(message);
        setMonthlyChartData([]);
        setTypeDistribution([]);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchDashboardData();
    fetchDashboardCharts();
  }, []);

  // Construire les activités récentes à partir des données API
  const recentActivities = dashboardData ? [
    ...dashboardData.last_accreditation.map((acc) => ({
      id: acc.slug,
      type: "accreditation" as const,
      action: acc.status === "submitted" ? "Nouvelle demande soumise" :
              acc.status === "approved" ? "Accréditation approuvée" :
              acc.status === "rejected" ? "Demande rejetée" :
              acc.status === "under_review" ? "Demande en révision" :
              "Demande en brouillon",
      entity: acc.entity,
      type_accreditation: acc.type_accreditation,
      timestamp: acc.submission_date || acc.review_date || acc.approval_date || new Date().toISOString(),
      status: acc.status,
      slug: acc.slug,
    })),
    ...dashboardData.last_entity.map((entity) => ({
      id: entity.slug,
      type: "entity" as const,
      action: "Nouvelle entité enregistrée",
      entity: entity.name,
      type_accreditation: undefined,
      timestamp: entity.created_at,
      status: entity.status,
      slug: entity.slug,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10) : [];

  // Calculer les stats depuis les données API
  const stats = dashboardData ? {
    totalAccreditations: dashboardData.accreditations.total,
    pendingAccreditations: dashboardData.accreditations.submitted + dashboardData.accreditations.under_review,
    approvedAccreditations: dashboardData.accreditations.approved,
    rejectedAccreditations: dashboardData.accreditations.rejected,
    totalEntities: dashboardData.entity.total,
    entitySubmitted: dashboardData.entity.submitted,
    entityUnderReview: dashboardData.entity.under_review,
    entityValidated: dashboardData.entity.validated,
    entityBlocked: dashboardData.entity.blocked,
    totalRepresentatives: dashboardData.total_representative,
    activeAccreditations: dashboardData.accreditations.approved,
  } : null;
  const totalTypeDistribution = typeDistribution.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>

        {/* Métriques principales - 4 cartes KPI */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Métriques secondaires - 3 cartes KPI */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets Skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Contenu onglet "Vue d'ensemble" */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Graphique skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>

            {/* Répartition skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes - Accréditations */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 border-l-4 border-l-blue-500 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <Skeleton className="h-5 w-5 rounded mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-56" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activités récentes - Entités */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 border-l-4 border-l-purple-500 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <Skeleton className="h-5 w-5 rounded mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-52" />
                      <Skeleton className="h-3 w-60" />
                      <Skeleton className="h-3 w-48" />
                      <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !dashboardData || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive mb-4">{error || "Données indisponibles"}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }
  const accreditationCards = [
    {
      label: "Accréditations totales",
      value: stats.totalAccreditations,
      icon: FileText,
      subLabel: "Total des accréditations",
      accent: "",
    },
    {
      label: "Soumises",
      value: dashboardData.accreditations.submitted,
      icon: FileText,
      subLabel: "En attente de revue",
      accent: "text-blue-600",
    },
    {
      label: "En révision",
      value: dashboardData.accreditations.under_review,
      icon: Clock,
      subLabel: "Nécessitent une action",
      accent: "text-orange-600",
    },
    {
      label: "Approuvées",
      value: stats.approvedAccreditations,
      icon: CheckCircle,
      subLabel: "Accréditations validées",
      accent: "text-green-600",
    },
    {
      label: "Rejetées",
      value: stats.rejectedAccreditations,
      icon: XCircle,
      subLabel: "Accréditations rejetées",
      accent: "text-red-600",
    },
  ];

  const entityCards = [
    {
      label: "Entités totales",
      value: stats.totalEntities,
      icon: Building,
      subLabel: "Entités enregistrées",
      accent: "",
    },
    {
      label: "Soumises",
      value: stats.entitySubmitted,
      icon: FileText,
      subLabel: "En attente de revue",
      accent: "text-blue-600",
    },
    {
      label: "En révision",
      value: stats.entityUnderReview,
      icon: Clock,
      subLabel: "En cours d'analyse",
      accent: "text-orange-600",
    },
    {
      label: "Validées",
      value: stats.entityValidated,
      icon: CheckCircle,
      subLabel: "Entités approuvées",
      accent: "text-green-600",
    },
    {
      label: "Bloquées",
      value: stats.entityBlocked,
      icon: XCircle,
      subLabel: "Mises en attente",
      accent: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord Admin
          </h1>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble des accréditations et gestion du système ANSSI
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div> */}
      </div>

      {/* Métriques organisées par onglets */}
      <Tabs defaultValue="accreditations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accreditations">Accréditations</TabsTrigger>
          <TabsTrigger value="entities">Entités</TabsTrigger>
        </TabsList>

        <TabsContent value="accreditations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {accreditationCards.map((card) => (
              <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                  <div className={`text-2xl font-bold ${card.accent}`}>{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subLabel}</p>
          </CardContent>
        </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="entities">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {entityCards.map((card) => (
              <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                  <div className={`text-2xl font-bold ${card.accent}`}>{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subLabel}</p>
          </CardContent>
        </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Indicateurs globaux (chips) */}
        <Card>
        <CardHeader>
          <CardTitle>Indicateurs globaux</CardTitle>
          <CardDescription>
            Vue synthétique sur les ressources clés
          </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Représentants enregistrés</p>
                <p className="text-2xl font-bold mt-1">{stats.totalRepresentatives}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accréditations actives</p>
                <p className="text-2xl font-bold mt-1">{stats.activeAccreditations}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
      </div>
          </CardContent>
        </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="activities">Activités récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Graphique des accréditations / entités du mois */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des accréditations</CardTitle>
                <CardDescription>
                  Accréditations vs entités créées ce mois-ci
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isChartLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                ) : chartError ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed rounded-lg p-4">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                    <p className="text-sm">{chartError}</p>
                  </div>
                ) : monthlyChartData.length === 0 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                    <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">Aucune statistique disponible</p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="accreditations" name="Accréditations" fill="#2563eb" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="entities" name="Entités" fill="#9333ea" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
                <CardDescription>
                  Distribution des accréditations par famille
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isChartLoading ? (
                  <div className="h-[280px] flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                ) : chartError ? (
                  <div className="h-[280px] flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed rounded-lg p-4">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                    <p className="text-sm">{chartError}</p>
                  </div>
                ) : typeDistribution.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune donnée disponible</p>
                      </div>
                ) : (
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 w-full h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip />
                          <Pie
                            data={typeDistribution}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            stroke="#fff"
                          >
                            {typeDistribution.map((entry) => (
                              <Cell key={`pie-${entry.id}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      {typeDistribution.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${entry.className}`} />
                            <div>
                              <p className="text-sm font-medium">{entry.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {entry.value} accréditation{entry.value > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {totalTypeDistribution ? Math.round((entry.value / totalTypeDistribution) * 100) : 0}%
                          </Badge>
                    </div>
                  ))}
                </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          {/* Accréditations récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>Accréditations récentes</span>
              </CardTitle>
              <CardDescription>
                Dernières demandes d&apos;accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData && dashboardData.last_accreditation.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.last_accreditation.map((acc) => (
                    <div 
                      key={acc.slug} 
                      className="flex items-start space-x-4 p-4 border-l-4 border-l-blue-500 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {acc.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : acc.status === "rejected" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : acc.status === "under_review" ? (
                          <Clock className="h-5 w-5 text-orange-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {acc.status === "submitted" ? "Nouvelle demande soumise" :
                               acc.status === "approved" ? "Accréditation approuvée" :
                               acc.status === "rejected" ? "Demande rejetée" :
                               acc.status === "under_review" ? "Demande en révision" :
                               "Demande en brouillon"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">{acc.entity}</span>
                              {acc.representative && ` • ${acc.representative}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {acc.type_accreditation}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {acc.submission_date || acc.review_date || acc.approval_date ? (
                                new Date(acc.submission_date || acc.review_date || acc.approval_date || '').toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              ) : (
                                'Date non disponible'
                              )}
                      </p>
                    </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge 
                              variant={acc.status === "approved" ? "default" : 
                                      acc.status === "rejected" ? "destructive" : "secondary"}
                              className="whitespace-nowrap"
                            >
                              {acc.status === "submitted" ? "Soumise" :
                               acc.status === "under_review" ? "En révision" :
                               acc.status === "approved" ? "Approuvée" :
                               acc.status === "rejected" ? "Rejetée" :
                               acc.status === "draft" ? "Brouillon" :
                               acc.status}
                      </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/admin/accreditations/${acc.slug}`}>
                        <Eye className="h-4 w-4" />
                              </Link>
                      </Button>
                          </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune accréditation récente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entités récentes */}
          <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-500" />
                <span>Entités récentes</span>
                  </CardTitle>
                  <CardDescription>
                Dernières entités enregistrées
                  </CardDescription>
                </CardHeader>
                <CardContent>
              {dashboardData && dashboardData.last_entity.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.last_entity.map((entity) => (
                    <div 
                      key={entity.slug} 
                      className="flex items-start space-x-4 p-4 border-l-4 border-l-purple-500 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <Building className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Nouvelle entité enregistrée
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">{entity.name}</span>
                              {entity.acronym && ` (${entity.acronym})`}
                            </p>
                            {entity.business_sector && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {entity.business_sector}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {entity.entity_type === "business" ? "Entreprise" :
                                 entity.entity_type === "ngo" ? "ONG" :
                                 "Personne physique"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(entity.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge 
                              variant={entity.status === "validated" ? "default" : 
                                      entity.status === "blocked" ? "destructive" : "secondary"}
                              className="whitespace-nowrap"
                            >
                              {entity.status === "new" ? "Nouvelle" :
                               entity.status === "submitted" ? "Soumise" :
                               entity.status === "under_review" ? "En révision" :
                               entity.status === "validated" ? "Validée" :
                               entity.status === "blocked" ? "Bloquée" :
                               entity.status === "declined" ? "Rejetée" :
                               entity.status}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/admin/entities/${entity.slug}`}>
                                <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune entité récente</p>
                </div>
              )}
                </CardContent>
              </Card>
        </TabsContent>

      </Tabs>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctions principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Bouton "Gérer les entités" : visible uniquement si l'utilisateur a la permission entities.view_entity */}
            {canViewEntities && (
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/dashboard/admin/entities">
                  <Building className="h-6 w-6 mb-2" />
                  Gérer les entités
                </Link>
              </Button>
            )}
            
            {/* Bouton "Gérer les accréditations" : visible uniquement si l'utilisateur a la permission accreditations.view_accreditation */}
            {canViewAccreditations && (
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/dashboard/admin/accreditations">
                  <FileText className="h-6 w-6 mb-2" />
                  Gérer les accréditations
                </Link>
              </Button>
            )}
            
            {/* Bouton "Gérer les utilisateurs" : visible si l'utilisateur a au moins une des permissions users.can_edit_staff ou users.manage_user_groups */}
            {canManageUsers && (
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/dashboard/admin/users">
                  <Users className="h-6 w-6 mb-2" />
                  Gérer les utilisateurs
                </Link>
              </Button>
            )}
            
            {/* Bouton "Paramètres système" : accessible à tous les staff (pas de permission spécifique requise) */}
            {/* <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/admin/settings">
                <Activity className="h-6 w-6 mb-2" />
                Paramètres système
              </Link>
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
