"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, Plus, Lock } from "lucide-react";
import { useEntity } from "@/contexts/EntityContext";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { DemandsEvolutionChart } from "@/components/dashboard/DemandsEvolutionChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { ActiveEntityCard } from "@/components/dashboard/ActiveEntityCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Building, Users, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Entity } from "@/types/api";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardPage() {
  const { activeEntity, canCreateDemands } = useEntity();
  const { stats, isLoading, error } = useDashboardData();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Un aperçu de vos activités et demandes récentes.
          </p>
        </div>
        <TooltipProvider>
          {canCreateDemands() ? (
            <Button asChild>
              <Link href="/dashboard/user/dossiers/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Link>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled className="opacity-50 cursor-not-allowed">
                  <Lock className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disponible après validation de votre structure</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      {/* Première ligne - KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard
          title="Demandes totales"
          value={stats.totalDemands}
          change={{ value: "+15% depuis le mois dernier", type: "positive" }}
          icon={FileText}
        />
        <KPICard
          title="En attente"
          value={stats.pendingDemands}
          icon={Clock}
        />
        <KPICard
          title="Approuvées"
          value={stats.approvedDemands}
          icon={CheckCircle}
        />
        <KPICard
          title="Rejetées"
          value={stats.rejectedDemands}
          icon={XCircle}
        />
      </div>

      {/* Deuxième ligne - KPI Cards secondaires */}
      <div className="grid gap-4 md:grid-cols-2">
        <KPICard
          title="Structures"
          value={stats.totalStructures}
          change={{ value: "+0% nouvelles structures", type: "neutral" }}
          icon={Building}
        />
        <KPICard
          title="Représentants"
          value={stats.totalRepresentatives}
          change={{ value: "+12% nouveaux représentants", type: "positive" }}
          icon={Users}
        />
      </div>

      {/* Troisième ligne - Graphique d'évolution */}
      <DemandsEvolutionChart />

      {/* Quatrième ligne - Actions récentes */}
      <RecentActivities />

      {/* Cinquième ligne - Structure active et Actions rapides */}
      <div className="grid gap-4 md:grid-cols-2">
        <ActiveEntityCard entity={activeEntity as Entity} />
        <QuickActions />
      </div>
    </div>
  );
}