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

// Mock data - sera remplacé par l'API
const mockEntities = [
  {
    slug: "techcorp",
    name: "TechCorp SARL",
    acronym: "TC",
    business_sector: "Technologies de l'information",
    entity_type: "business" as const,
    total_staff: 25,
    cybersecurity_experts: 8,
    email: "contact@techcorp.gn",
    phone: "+224 123 456 789",
    status: "active",
    created_at: "2024-01-10T10:30:00Z",
    accreditations_count: 3,
    representatives_count: 2
  },
  {
    slug: "secureit",
    name: "SecureIT",
    acronym: "SI",
    business_sector: "Cybersécurité",
    entity_type: "business" as const,
    total_staff: 15,
    cybersecurity_experts: 12,
    email: "info@secureit.gn",
    phone: "+224 987 654 321",
    status: "pending",
    created_at: "2024-01-12T14:20:00Z",
    accreditations_count: 1,
    representatives_count: 1
  },
  {
    slug: "cyberguard",
    name: "CyberGuard",
    acronym: "CG",
    business_sector: "Sécurité informatique",
    entity_type: "business" as const,
    total_staff: 8,
    cybersecurity_experts: 6,
    email: "contact@cyberguard.gn",
    phone: "+224 555 123 456",
    status: "active",
    created_at: "2024-01-05T09:15:00Z",
    accreditations_count: 2,
    representatives_count: 1
  },
  {
    slug: "dataprotect",
    name: "DataProtect",
    acronym: "DP",
    business_sector: "Protection des données",
    entity_type: "business" as const,
    total_staff: 12,
    cybersecurity_experts: 9,
    email: "info@dataprotect.gn",
    phone: "+224 777 888 999",
    status: "blocked",
    created_at: "2024-01-08T16:45:00Z",
    accreditations_count: 0,
    representatives_count: 1
  }
];

const entityTypeConfig = {
  personal: { label: "Personne physique", color: "bg-blue-500" },
  business: { label: "Entreprise", color: "bg-green-500" },
  ngo: { label: "ONG", color: "bg-purple-500" }
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", textColor: "text-green-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  blocked: { label: "Bloquée", color: "bg-red-500", textColor: "text-red-700" },
  inactive: { label: "Inactive", color: "bg-gray-500", textColor: "text-gray-700" }
};

const entityTypeOptions = [
  { value: "all", label: "Tous les types" },
  { value: "personal", label: "Personne physique" },
  { value: "business", label: "Entreprise" },
  { value: "ngo", label: "ONG" }
];

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Active" },
  { value: "pending", label: "En attente" },
  { value: "blocked", label: "Bloquée" },
  { value: "inactive", label: "Inactive" }
];

export default function EntitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const filteredEntities = mockEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.business_sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
    const matchesType = typeFilter === "all" || entity.entity_type === typeFilter;
    
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

  const getTypeBadge = (type: string) => {
    const config = entityTypeConfig[type as keyof typeof entityTypeConfig];
    return (
      <Badge variant="outline" className="text-xs">
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
            Gestion des Entités
          </h1>
          <p className="text-muted-foreground">
            Suivi et validation des entités enregistrées
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Building className="h-4 w-4 mr-2" />
            Nouvelle entité
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
              <label className="text-sm font-medium">Type d'entité</label>
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
              <Building className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total entités</span>
            </div>
            <div className="text-2xl font-bold">
              {mockEntities.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Actives</span>
            </div>
            <div className="text-2xl font-bold">
              {mockEntities.filter(entity => entity.status === "active").length}
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
              {mockEntities.filter(entity => entity.status === "pending").length}
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
              {mockEntities.filter(entity => entity.status === "blocked").length}
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
                  <TableHead>Entité</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Effectif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Accréditations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities.map((entity) => (
                  <TableRow key={entity.slug}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{entity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entity.acronym} • {entity.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{entity.business_sector}</div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(entity.entity_type)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{entity.total_staff} employés</div>
                        <div className="text-muted-foreground">
                          {entity.cybersecurity_experts} experts cybersécurité
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(entity.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {entity.accreditations_count} accréditations
                        </Badge>
                        <Badge variant="outline">
                          {entity.representatives_count} représentants
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/admin/entities/${entity.slug}`}>
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
                                Choisissez une action pour cette entité
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => setSelectedEntity(entity)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </Button>
                              {entity.status === "pending" && (
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
                              {entity.status === "active" && (
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Bloquer
                                </Button>
                              )}
                              {entity.status === "blocked" && (
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Débloquer
                                </Button>
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
