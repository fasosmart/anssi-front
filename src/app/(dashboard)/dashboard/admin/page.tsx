"use client";

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

// Mock data - sera remplacé par l'API
const mockStats = {
  totalAccreditations: 156,
  pendingAccreditations: 23,
  approvedAccreditations: 98,
  rejectedAccreditations: 35,
  totalEntities: 89,
  totalRepresentatives: 234,
  monthlyRevenue: 12500000, // GNF
  activeAccreditations: 45
};

const mockRecentActivities = [
  {
    id: 1,
    type: "accreditation",
    action: "Nouvelle demande soumise",
    entity: "TechCorp SARL",
    type_accreditation: "APASSI",
    timestamp: "2024-01-15T10:30:00Z",
    status: "pending"
  },
  {
    id: 2,
    type: "approval",
    action: "Accréditation approuvée",
    entity: "SecureIT",
    type_accreditation: "APACS",
    timestamp: "2024-01-15T09:15:00Z",
    status: "approved"
  },
  {
    id: 3,
    type: "rejection",
    action: "Demande rejetée",
    entity: "CyberGuard",
    type_accreditation: "APDIS",
    timestamp: "2024-01-15T08:45:00Z",
    status: "rejected"
  },
  {
    id: 4,
    type: "entity",
    action: "Nouvelle entité enregistrée",
    entity: "DataProtect",
    timestamp: "2024-01-15T08:00:00Z",
    status: "new"
  }
];

const mockAccreditationTypes = [
  { name: "APACS", count: 45, color: "bg-blue-500" },
  { name: "APASSI", count: 38, color: "bg-green-500" },
  { name: "APDIS", count: 28, color: "bg-purple-500" },
  { name: "APRIS", count: 25, color: "bg-orange-500" },
  { name: "APIN", count: 20, color: "bg-red-500" }
];

export default function AdminDashboard() {
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
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
            <div className="text-2xl font-bold">{mockStats.totalAccreditations}</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
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
              {mockStats.pendingAccreditations}
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
              {mockStats.approvedAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% ce mois-ci
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
              {mockStats.rejectedAccreditations}
            </div>
            <p className="text-xs text-muted-foreground">
              -5% ce mois-ci
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
            <div className="text-2xl font-bold">{mockStats.totalEntities}</div>
            <p className="text-xs text-muted-foreground">
              +3 nouvelles ce mois
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
            <div className="text-2xl font-bold">{mockStats.totalRepresentatives}</div>
            <p className="text-xs text-muted-foreground">
              +15 nouveaux profils
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus mensuels
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.monthlyRevenue.toLocaleString()} GNF
            </div>
            <p className="text-xs text-muted-foreground">
              +18% vs mois précédent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="activities">Activités récentes</TabsTrigger>
          <TabsTrigger value="types">Types d&apos;accréditation</TabsTrigger>
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
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  📊 Graphique Recharts à implémenter
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
                <div className="space-y-4">
                  {mockAccreditationTypes.map((type) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                      <Badge variant="secondary">{type.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Dernières actions sur le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "accreditation" && <FileText className="h-5 w-5 text-blue-500" />}
                      {activity.type === "approval" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {activity.type === "rejection" && <XCircle className="h-5 w-5 text-red-500" />}
                      {activity.type === "entity" && <Building className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.entity} - {activity.type_accreditation}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={activity.status === "approved" ? "default" : 
                                activity.status === "rejected" ? "destructive" : "secondary"}
                      >
                        {activity.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockAccreditationTypes.map((type) => (
              <Card key={type.name}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <span>{type.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Accréditation {type.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.count}</div>
                  <p className="text-sm text-muted-foreground">
                    Accréditations actives
                  </p>
                  <div className="mt-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/admin/accreditations?type=${type.name}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <Link href="/dashboard/admin/representatives">
                <Users className="h-6 w-6 mb-2" />
                Gérer les représentants
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
