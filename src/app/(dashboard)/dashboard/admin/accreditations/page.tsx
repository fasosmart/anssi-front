"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Download,
  Building,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AdminAccreditationList, DemandStatus } from "@/types/api";
import { AdminAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

const statusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500", textColor: "text-gray-700" },
  submitted: { label: "Soumise", color: "bg-yellow-500", textColor: "text-yellow-700" },
  under_review: { label: "En révision", color: "bg-blue-500", textColor: "text-blue-700" },
  approved: { label: "Approuvée", color: "bg-green-500", textColor: "text-green-700" },
  rejected: { label: "Rejetée", color: "bg-red-500", textColor: "text-red-700" }
};

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "draft", label: "Brouillon" },
  { value: "submitted", label: "Soumise" },
  { value: "under_review", label: "En révision" },
  { value: "approved", label: "Approuvée" },
  { value: "rejected", label: "Rejetée" }
];

export default function AccreditationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accreditations, setAccreditations] = useState<AdminAccreditationList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const offset = (page - 1) * pageSize;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Statistiques par statut
  const [stats, setStats] = useState({
    draft: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchAccreditations = async () => {
      setIsLoading(true);
      try {
        const params: { limit?: number; offset?: number; status?: string; search?: string } = {
          limit: pageSize,
          offset,
        };
        if (statusFilter !== "all") params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        
        const data = await AdminAPI.listAccreditations(params);
        setAccreditations(data.results || data || []);
        setTotalCount(data.count ?? (data.results ? data.results.length : 0));
      } catch (e) {
        toast.error("Impossible de charger les accréditations");
        setAccreditations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccreditations();
  }, [searchTerm, statusFilter, page, pageSize]);

  // Calculer les statistiques depuis les données chargées
  useEffect(() => {
    if (accreditations.length > 0) {
      const newStats = {
        draft: accreditations.filter(acc => acc.status === "draft").length,
        submitted: accreditations.filter(acc => acc.status === "submitted").length,
        under_review: accreditations.filter(acc => acc.status === "under_review").length,
        approved: accreditations.filter(acc => acc.status === "approved").length,
        rejected: accreditations.filter(acc => acc.status === "rejected").length,
      };
      setStats(newStats);
    }
  }, [accreditations]);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: "bg-gray-500", 
      textColor: "text-gray-700" 
    };
    return (
      <Badge 
        variant="secondary" 
        className={`${config.color} ${config.textColor} border-0 text-white`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Accréditations
          </h1>
          <p className="text-muted-foreground">
            Suivi et validation des demandes d&apos;accréditation ANSSI
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
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
                  placeholder="Entité, représentant..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset à la première page lors de la recherche
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1); // Reset à la première page lors du changement de filtre
                }}
              >
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
              <label className="text-sm font-medium">Taille de page</label>
              <Select 
                value={pageSize.toString()} 
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Brouillon</span>
            </div>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Soumise</span>
            </div>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">En révision</span>
            </div>
            <div className="text-2xl font-bold">{stats.under_review}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Approuvées</span>
            </div>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Rejetées</span>
            </div>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des accréditations */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des accréditations</CardTitle>
          <CardDescription>
            {isLoading ? (
              <SkeletonText className="h-4 w-20" />
            ) : (
              `${totalCount} accréditation(s) trouvée(s)`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : accreditations.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Entité</TableHead>
                      <TableHead>Représentant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date soumission</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accreditations.map((accreditation, index) => (
                      <TableRow key={accreditation.slug}>
                        <TableCell className="font-medium">
                          {offset + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{accreditation.entity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{accreditation.representative}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {accreditation.type_accreditation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(accreditation.status)}
                        </TableCell>
                        <TableCell>
                          {accreditation.submission_date ? (
                            new Date(accreditation.submission_date).toLocaleDateString('fr-FR')
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/admin/accreditations/${accreditation.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages} • {totalCount} résultat(s)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucune accréditation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
