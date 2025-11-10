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
import { AdminDashboardData } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Couleurs pour les types d'accréditation (temporaire, en attendant les données)
const accreditationTypeColors: Record<string, string> = {
  "APACS": "bg-blue-500",
  "APASSI": "bg-green-500",
  "APDIS": "bg-purple-500",
  "APRIS": "bg-orange-500",
  "APIN": "bg-red-500",
};

const getAccreditationTypeColor = (type: string): string => {
  // Chercher une correspondance partielle
  for (const [key, color] of Object.entries(accreditationTypeColors)) {
    if (type.includes(key)) return color;
  }
  // Couleur par défaut
  return "bg-gray-500";
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await AdminAPI.getDashboard();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Erreur lors du chargement du dashboard:", e);
        setError("Impossible de charger les données du dashboard");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
    totalRepresentatives: dashboardData.total_representative,
    activeAccreditations: dashboardData.accreditations.approved,
  } : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
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

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accréditations totales
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccreditations}</div>
            <p className="text-xs text-muted-foreground">
              Total des accréditations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une révision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approuvées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              Accréditations approuvées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejetées
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejectedAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              Accréditations rejetées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métriques secondaires */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entités actives
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntities}</div>
            <p className="text-xs text-muted-foreground">
              Entités enregistrées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Représentants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRepresentatives}</div>
            <p className="text-xs text-muted-foreground">
              Représentants enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accréditations actives
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              Accréditations approuvées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="activities">Activités récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Graphique des accréditations par mois */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des accréditations</CardTitle>
                <CardDescription>
                  Nombre d&apos;accréditations par mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Graphique d&apos;évolution</p>
                    <p className="text-xs text-muted-foreground">Données en attente du backend</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
                <CardDescription>
                  Distribution des accréditations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.last_accreditation.length > 0 ? (
                  <div className="space-y-4">
                    {(() => {
                      // Calculer la répartition par type depuis les dernières accréditations
                      const typeCounts = dashboardData.last_accreditation.reduce((acc, accr) => {
                        const typeName = accr.type_accreditation.split(' ')[0] || accr.type_accreditation;
                        acc[typeName] = (acc[typeName] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      return Object.entries(typeCounts).map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getAccreditationTypeColor(name)}`} />
                            <span className="text-sm font-medium">{name}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ));
                    })()}
                    <p className="text-xs text-muted-foreground mt-4">
                      * Basé sur les dernières accréditations (données complètes en attente)
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune donnée disponible</p>
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
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/admin/accreditations">
                <FileText className="h-6 w-6 mb-2" />
                Gérer les accréditations
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/admin/entities">
                <Building className="h-6 w-6 mb-2" />
                Gérer les entités
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/admin/settings">
                <Activity className="h-6 w-6 mb-2" />
                Paramètres système
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
