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
  User,
  Download,
  MoreHorizontal,
  Calendar,
  Building,
  FileText,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Award
} from "lucide-react";
import Link from "next/link";

// Mock data - sera remplacé par l'API
const mockRepresentatives = [
  {
    slug: "rep-001",
    first_name: "Moussa",
    last_name: "Diallo",
    job_title: "Directeur Technique",
    email: "moussa.diallo@techcorp.gn",
    phone: "+224 123 456 789",
    entity: "TechCorp SARL",
    entity_slug: "techcorp",
    status: "active",
    created_at: "2024-01-10T10:30:00Z",
    degrees_count: 3,
    experiences_count: 5,
    trainings_count: 8
  },
  {
    slug: "rep-002",
    first_name: "Fatoumata",
    last_name: "Bah",
    job_title: "Responsable Cybersécurité",
    email: "fatoumata.bah@techcorp.gn",
    phone: "+224 123 456 791",
    entity: "TechCorp SARL",
    entity_slug: "techcorp",
    status: "active",
    created_at: "2024-01-12T14:20:00Z",
    degrees_count: 2,
    experiences_count: 4,
    trainings_count: 6
  },
  {
    slug: "rep-003",
    first_name: "Ibrahim",
    last_name: "Traoré",
    job_title: "Expert Sécurité",
    email: "ibrahim.traore@secureit.gn",
    phone: "+224 987 654 321",
    entity: "SecureIT",
    entity_slug: "secureit",
    status: "pending",
    created_at: "2024-01-15T09:15:00Z",
    degrees_count: 1,
    experiences_count: 3,
    trainings_count: 4
  },
  {
    slug: "rep-004",
    first_name: "Aminata",
    last_name: "Keita",
    job_title: "Consultante IT",
    email: "aminata.keita@cyberguard.gn",
    phone: "+224 555 123 456",
    entity: "CyberGuard",
    entity_slug: "cyberguard",
    status: "blocked",
    created_at: "2024-01-08T16:45:00Z",
    degrees_count: 2,
    experiences_count: 2,
    trainings_count: 3
  }
];

const statusConfig = {
  active: { label: "Actif", color: "bg-green-500", textColor: "text-green-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  blocked: { label: "Bloqué", color: "bg-red-500", textColor: "text-red-700" },
  inactive: { label: "Inactif", color: "bg-gray-500", textColor: "text-gray-700" }
};

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actif" },
  { value: "pending", label: "En attente" },
  { value: "blocked", label: "Bloqué" },
  { value: "inactive", label: "Inactif" }
];

const entityOptions = [
  { value: "all", label: "Toutes les entités" },
  { value: "techcorp", label: "TechCorp SARL" },
  { value: "secureit", label: "SecureIT" },
  { value: "cyberguard", label: "CyberGuard" }
];

export default function RepresentativesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedRepresentative, setSelectedRepresentative] = useState<any>(null);

  const filteredRepresentatives = mockRepresentatives.filter(rep => {
    const matchesSearch = `${rep.first_name} ${rep.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rep.status === statusFilter;
    const matchesEntity = entityFilter === "all" || rep.entity_slug === entityFilter;
    
    return matchesSearch && matchesStatus && matchesEntity;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Représentants
          </h1>
          <p className="text-muted-foreground">
            Suivi et validation des profils des représentants
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <User className="h-4 w-4 mr-2" />
            Nouveau représentant
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
                  placeholder="Nom, poste, entité..."
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
              <label className="text-sm font-medium">Entité</label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entité" />
                </SelectTrigger>
                <SelectContent>
                  {entityOptions.map((entity) => (
                    <SelectItem key={entity.value} value={entity.value}>
                      {entity.label}
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
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total représentants</span>
            </div>
            <div className="text-2xl font-bold">
              {mockRepresentatives.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Actifs</span>
            </div>
            <div className="text-2xl font-bold">
              {mockRepresentatives.filter(rep => rep.status === "active").length}
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
              {mockRepresentatives.filter(rep => rep.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Bloqués</span>
            </div>
            <div className="text-2xl font-bold">
              {mockRepresentatives.filter(rep => rep.status === "blocked").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des représentants */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des représentants</CardTitle>
          <CardDescription>
            {filteredRepresentatives.length} représentant(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Représentant</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Compétences</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepresentatives.map((rep) => (
                  <TableRow key={rep.slug}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{rep.first_name} {rep.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rep.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{rep.job_title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{rep.entity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{rep.phone}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rep.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {rep.degrees_count} diplômes
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {rep.experiences_count} expériences
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {rep.trainings_count} formations
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/admin/representatives/${rep.slug}`}>
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
                                Choisissez une action pour ce représentant
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => setSelectedRepresentative(rep)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir le profil
                              </Button>
                              {rep.status === "pending" && (
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
                              {rep.status === "active" && (
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Bloquer
                                </Button>
                              )}
                              {rep.status === "blocked" && (
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
