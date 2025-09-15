"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Building, FileText, Users } from "lucide-react";

// Mock data - to be replaced with actual API calls
const stats = {
  totalDossiers: 12,
  totalEntities: 3,
  totalRepresentatives: 8,
};

const recentDossiers = [
  { id: "DOS-0012", entity: "FasoSmart", submittedAt: "2023-10-26", status: "Approved" },
  { id: "DOS-0011", entity: "Tech Innovate", submittedAt: "2023-10-24", status: "Pending" },
  { id: "DOS-0010", entity: "CyberSec Solutions", submittedAt: "2023-10-15", status: "Rejected" },
  { id: "DOS-0009", entity: "FasoSmart", submittedAt: "2023-09-30", status: "Approved" },
];

type DossierStatus = "Approved" | "Pending" | "Rejected";

const statusStyles: Record<DossierStatus, string> = {
  Approved: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};


export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-8">
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
        <Button asChild>
          <Link href="/dashboard/user/dossiers/new">Nouvelle demande d'accréditation</Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDossiers}</div>
            <p className="text-xs text-muted-foreground">+2 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Structures gérées</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntities}</div>
            <p className="text-xs text-muted-foreground">Aucune nouvelle structure</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Représentants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRepresentatives}</div>
            <p className="text-xs text-muted-foreground">+1 depuis le mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Dossiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'accréditation récentes</CardTitle>
          <CardDescription>
            Voici la liste de vos dernières demandes soumises.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro du dossier</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Date de soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDossiers.map((dossier) => (
                <TableRow key={dossier.id}>
                  <TableCell className="font-medium">{dossier.id}</TableCell>
                  <TableCell>{dossier.entity}</TableCell>
                  <TableCell>{dossier.submittedAt}</TableCell>
                  <TableCell>
                     <Badge 
                      variant="outline" 
                      className={statusStyles[dossier.status as DossierStatus]}
                    >
                      {dossier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                       <Link href={`/dashboard/user/dossiers/${dossier.id}`} className="flex items-center gap-2">
                          Voir
                          <ArrowUpRight className="h-4 w-4" />
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}