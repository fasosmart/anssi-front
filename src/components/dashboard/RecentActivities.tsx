"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface RecentDemand {
  id: string;
  entity: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "rejected" | "under_review";
}

interface RecentActivitiesProps {
  demands?: RecentDemand[];
  className?: string;
}

const statusConfig = {
  approved: { label: "Approuvé", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "En attente", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  rejected: { label: "Rejeté", variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
  under_review: { label: "En examen", variant: "outline" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
};

export function RecentActivities({ 
  demands = [], 
  className 
}: RecentActivitiesProps) {
  const displayDemands = demands;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Demandes récentes</CardTitle>
            <CardDescription>
              Vos dernières demandes d&apos;accréditation
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/user/dossiers">
              Voir toutes
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche et filtres */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par structure ou numéro..." 
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="under_review">En examen</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Tableau des demandes */}
        {displayDemands.length === 0 ? (
          <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
            Aucune demande récente pour le moment. Vos prochaines demandes apparaîtront ici dès que vous en créerez.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Numéro</TableHead> */}
                  <TableHead>Structure</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayDemands.map((demand) => {
                  const status = statusConfig[demand.status];
                  return (
                    <TableRow key={demand.id}>
                      {/* <TableCell className="font-medium">{demand.id}</TableCell> */}
                      <TableCell>{demand.entity}</TableCell>
                      <TableCell>{demand.type}</TableCell>
                      <TableCell>{demand.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={status.variant}
                          className={status.className}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/user/dossiers/${demand.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
