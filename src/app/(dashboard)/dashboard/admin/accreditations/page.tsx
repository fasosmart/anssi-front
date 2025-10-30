"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Download,
  MoreHorizontal,
  Calendar,
  Building,
  User
} from "lucide-react";
import Link from "next/link";
import { AccreditationList } from "@/types/api";

// Mock data - sera remplacé par l'API
const mockAccreditations = [
  {
    slug: "acc-001",
    status: "pending" as const,
    type_accreditation: "APASSI",
    representative: "Moussa Diallo",
    entity: "TechCorp SARL",
    submission_date: "2024-01-15",
    review_date: null,
    approval_date: null,
    rejection_date: null,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    slug: "acc-002", 
    status: "under_review" as const,
    type_accreditation: "APACS",
    representative: "Fatoumata Bah",
    entity: "SecureIT",
    submission_date: "2024-01-10",
    review_date: "2024-01-12",
    approval_date: null,
    rejection_date: null,
    created_at: "2024-01-10T14:20:00Z"
  },
  {
    slug: "acc-003",
    status: "approved" as const,
    type_accreditation: "APDIS",
    representative: "Ibrahim Traoré",
    entity: "CyberGuard",
    submission_date: "2024-01-05",
    review_date: "2024-01-08",
    approval_date: "2024-01-12",
    rejection_date: null,
    created_at: "2024-01-05T09:15:00Z"
  },
  {
    slug: "acc-004",
    status: "rejected" as const,
    type_accreditation: "APRIS",
    representative: "Aminata Keita",
    entity: "DataProtect",
    submission_date: "2024-01-03",
    review_date: "2024-01-06",
    approval_date: null,
    rejection_date: "2024-01-10",
    created_at: "2024-01-03T16:45:00Z"
  }
];

const statusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500", textColor: "text-gray-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  under_review: { label: "En révision", color: "bg-blue-500", textColor: "text-blue-700" },
  approved: { label: "Approuvée", color: "bg-green-500", textColor: "text-green-700" },
  rejected: { label: "Rejetée", color: "bg-red-500", textColor: "text-red-700" }
};

const accreditationTypes = [
  { value: "all", label: "Tous les types" },
  { value: "APACS", label: "APACS - Accompagnement et Conseil" },
  { value: "APASSI", label: "APASSI - Audit Sécurité SI" },
  { value: "APDIS", label: "APDIS - Détection Incidents" },
  { value: "APRIS", label: "APRIS - Réponse Incidents" },
  { value: "APIN", label: "APIN - Investigation Numérique" }
];

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "under_review", label: "En révision" },
  { value: "approved", label: "Approuvée" },
  { value: "rejected", label: "Rejetée" }
];

export default function AccreditationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAccreditation, setSelectedAccreditation] = useState<AccreditationList | null>(null);

  const filteredAccreditations = mockAccreditations.filter(acc => {
    const matchesSearch = acc.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.representative.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || acc.status === statusFilter;
    const matchesType = typeFilter === "all" || acc.type_accreditation === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge 
        variant="secondary" 
        className={`${config.color} ${config.textColor} border-0`}
      >
        {config.label}
      </Badge>
    );
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Nouvelle accréditation
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Entité, représentant..."
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
              <label className="text-sm font-medium">Type d&apos;accréditation</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {accreditationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres avancés
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">En attente</span>
            </div>
            <div className="text-2xl font-bold">
              {mockAccreditations.filter(acc => acc.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">En révision</span>
            </div>
            <div className="text-2xl font-bold">
              {mockAccreditations.filter(acc => acc.status === "under_review").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Approuvées</span>
            </div>
            <div className="text-2xl font-bold">
              {mockAccreditations.filter(acc => acc.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Rejetées</span>
            </div>
            <div className="text-2xl font-bold">
              {mockAccreditations.filter(acc => acc.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des accréditations */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des accréditations</CardTitle>
          <CardDescription>
            {filteredAccreditations.length} accréditation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Représentant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date soumission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccreditations.map((accreditation) => (
                  <TableRow key={accreditation.slug}>
                    <TableCell className="font-medium">
                      {accreditation.slug}
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
                      {new Date(accreditation.submission_date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/admin/accreditations/${accreditation.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Actions rapides</DialogTitle>
                              <DialogDescription>
                                Choisissez une action pour cette accréditation
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => setSelectedAccreditation(accreditation as unknown as AccreditationList)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </Button>
                              {accreditation.status === "pending" && (
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mettre en révision
                                </Button>
                              )}
                              {accreditation.status === "under_review" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approuver
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rejeter
                                  </Button>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
