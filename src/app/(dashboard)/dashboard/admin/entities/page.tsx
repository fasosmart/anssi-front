"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  // Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building,
  Download,
  MoreHorizontal,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  User
} from "lucide-react";
import Link from "next/link";
import { EntityList, EntityStatus } from "@/types/api";
import { AdminAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type AdminEntityList = EntityList & {
  accreditations_count?: number;
  representatives_count?: number;
};

const entityTypeConfig = {
  personal: { label: "Personne physique", color: "bg-blue-500" },
  business: { label: "Entreprise", color: "bg-green-500" },
  ngo: { label: "ONG", color: "bg-purple-500" }
};

const statusConfig: Record<
  EntityStatus,
  { label: string; color: string; textColor: string }
> = {
  new: {
    label: "Nouvelle",
    color: "bg-blue-500",
    textColor: "text-blue-700"
  },
  submitted: {
    label: "Soumise",
    color: "bg-yellow-500",
    textColor: "text-yellow-700"
  },
  under_review: {
    label: "En cours de validation",
    color: "bg-orange-500",
    textColor: "text-orange-700"
  },
  validated: {
    label: "Validée",
    color: "bg-green-500",
    textColor: "text-green-700"
  },
  blocked: {
    label: "Bloquée",
    color: "bg-red-500",
    textColor: "text-red-700"
  },
  declined: {
    label: "Refusée",
    color: "bg-gray-500",
    textColor: "text-gray-700"
  }
};

const entityTypeOptions = [
  { value: "all", label: "Tous les types" },
  { value: "personal", label: "Personne physique" },
  { value: "business", label: "Entreprise" },
  { value: "ngo", label: "ONG" }
];

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "new", label: "Nouvelle" },
  { value: "submitted", label: "Soumise" },
  { value: "under_review", label: "En cours de validation" },
  { value: "validated", label: "Validée" },
  { value: "blocked", label: "Bloquée" },
  { value: "declined", label: "Refusée" }
];

export default function EntitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [entities, setEntities] = useState<AdminEntityList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const offset = (page - 1) * pageSize;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rowNumber = (index: number) => offset + index + 1;

  useEffect(() => {
    const fetchEntities = async () => {
      setIsLoading(true);
      try {
        const params: {
          limit?: number;
          offset?: number;
          status?: string;
          entity_type?: string;
          search?: string;
        } = {};
        if (statusFilter !== "all") params.status = statusFilter;
        if (typeFilter !== "all") params.entity_type = typeFilter;
        if (searchTerm) params.search = searchTerm;
        const data = await AdminAPI.listEntities(params);
        setEntities(data.results || data || []);
        setTotalCount(data.count ?? (data.results ? data.results.length : 0));
      } catch (e) {
        toast.error("Impossible de charger les entités administratives");
        setEntities([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntities();
  }, [searchTerm, statusFilter, typeFilter, page, pageSize]);

  const filteredEntities = entities; // Already filtered server-side

  const getStatusBadge = (status: string) => {
    const config =
      statusConfig[status as EntityStatus] || {
        label: "Inconnu",
        color: "bg-gray-300",
        textColor: "text-gray-700"
      };
    return (
      <Badge
        variant="secondary"
        className={`${config.color} ${config.textColor} border-0`}
      >
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    // Fallback visuel si le type n'est pas reconnu
    const config =
      entityTypeConfig[type as keyof typeof entityTypeConfig] || {
        label: "Type inconnu"
      };
    return (
      <Badge variant="outline" className="text-xs">
        {config.label}
      </Badge>
    );
  };

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

        {/* Filtres Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tableau Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Entité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Entités
          </h1>
          <p className="text-muted-foreground">
            Suivi et validation des entités enregistrées
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Building className="h-4 w-4 mr-2" />
            Nouvelle entité
          </Button>
        </div> */}
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom, secteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type d&apos;entité</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total entités</span>
            </div>
            <div className="text-2xl font-bold">{entities.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Actives</span>
            </div>
            <div className="text-2xl font-bold">
              {entities.filter((entity) => entity.status === "validated").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">En attente</span>
            </div>
            <div className="text-2xl font-bold">
              {
                entities.filter(
                  (entity) =>
                    entity.status === "submitted" ||
                    entity.status === "under_review"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Bloquées</span>
            </div>
            <div className="text-2xl font-bold">
              {entities.filter((entity) => entity.status === "blocked").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des entités */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des entités</CardTitle>
          <CardDescription>
            {filteredEntities.length} entité(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoading) {
                    return (
                      <>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  }

                  if (filteredEntities.length === 0) {
                    return (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-6 text-muted-foreground"
                        >
                          Aucune entité trouvée
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return filteredEntities.map((entity, index) => (
                  <TableRow key={entity.slug}>
                    <TableCell className="text-muted-foreground">{rowNumber(index)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{entity.name}</div>
                        <div className="text-sm text-muted-foreground">{entity.acronym}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(entity.entity_type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(entity.status as unknown as string)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/admin/entities/${entity.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {/* <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Actions rapides</DialogTitle>
                              <DialogDescription>
                                Choisissez une action pour cette entité
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog> */}
                      </div>
                    </TableCell>
                  </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                {offset + 1}-{Math.min(offset + pageSize, totalCount)} sur{" "}
                {totalCount}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Par page
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      setPage(1);
                      setPageSize(Number(v));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
                  </Button>
                  <div className="text-sm">
                    Page {page} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
