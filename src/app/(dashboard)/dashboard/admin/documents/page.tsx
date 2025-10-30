"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
  AlertTriangle,
  Building,
  User,
  Shield,
  FileImage,
//   FilePdf,
  FileSpreadsheet,
  Archive
} from "lucide-react";
import Link from "next/link";

// Mock data - sera remplacé par l'API
const mockDocuments = [
  {
    slug: "doc-001",
    name: "Statuts de l'entreprise TechCorp",
    document_type: "Statuts",
    file: "/documents/statuts-techcorp.pdf",
    issued_at: "2024-01-10",
    expires_at: null,
    status: "approved",
    entity: "TechCorp SARL",
    entity_slug: "techcorp",
    representative: "Moussa Diallo",
    representative_slug: "rep-001",
    file_size: "2.3 MB",
    file_type: "PDF",
    created_at: "2024-01-10T10:30:00Z"
  },
  {
    slug: "doc-002",
    name: "Carte d'identification fiscale",
    document_type: "Fiscal",
    file: "/documents/carte-fiscale.pdf",
    issued_at: "2024-01-08",
    expires_at: "2025-01-08",
    status: "pending",
    entity: "TechCorp SARL",
    entity_slug: "techcorp",
    representative: "Moussa Diallo",
    representative_slug: "rep-001",
    file_size: "1.8 MB",
    file_type: "PDF",
    created_at: "2024-01-08T14:20:00Z"
  },
  {
    slug: "doc-003",
    name: "Certificat CISSP",
    document_type: "Certification",
    file: "/documents/cissp-certificate.pdf",
    issued_at: "2024-01-05",
    expires_at: "2027-01-05",
    status: "approved",
    entity: "TechCorp SARL",
    entity_slug: "techcorp",
    representative: "Fatoumata Bah",
    representative_slug: "rep-002",
    file_size: "3.1 MB",
    file_type: "PDF",
    created_at: "2024-01-05T09:15:00Z"
  },
  {
    slug: "doc-004",
    name: "Rapport d'expérience professionnelle",
    document_type: "Expérience",
    file: "/documents/experience-report.pdf",
    issued_at: "2024-01-12",
    expires_at: null,
    status: "rejected",
    entity: "SecureIT",
    entity_slug: "secureit",
    representative: "Ibrahim Traoré",
    representative_slug: "rep-003",
    file_size: "4.2 MB",
    file_type: "PDF",
    created_at: "2024-01-12T16:45:00Z"
  }
];

const mockDocumentTypes = [
  {
    slug: "statuts",
    name: "Statuts",
    description: "Statuts de l'entreprise ou de l'association",
    status: "ON",
    documents_count: 15
  },
  {
    slug: "fiscal",
    name: "Documents fiscaux",
    description: "Carte d'identification fiscale, déclarations",
    status: "ON",
    documents_count: 23
  },
  {
    slug: "commerce",
    name: "Registre du commerce",
    description: "Extrait du registre du commerce",
    status: "ON",
    documents_count: 18
  },
  {
    slug: "certification",
    name: "Certifications",
    description: "Certificats professionnels et techniques",
    status: "ON",
    documents_count: 45
  },
  {
    slug: "experience",
    name: "Expérience",
    description: "Rapports d'expérience professionnelle",
    status: "ON",
    documents_count: 32
  }
];

const statusConfig = {
  approved: { label: "Approuvé", color: "bg-green-500", textColor: "text-green-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  rejected: { label: "Rejeté", color: "bg-red-500", textColor: "text-red-700" },
  expired: { label: "Expiré", color: "bg-gray-500", textColor: "text-gray-700" }
};

const fileTypeConfig = {
  PDF: { icon: FileText, color: "text-red-500" },
  JPG: { icon: FileImage, color: "text-blue-500" },
  PNG: { icon: FileImage, color: "text-green-500" },
  XLSX: { icon: FileSpreadsheet, color: "text-green-600" },
  DOC: { icon: FileText, color: "text-blue-600" }
};

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "approved", label: "Approuvé" },
  { value: "pending", label: "En attente" },
  { value: "rejected", label: "Rejeté" },
  { value: "expired", label: "Expiré" }
];

const typeOptions = [
  { value: "all", label: "Tous les types" },
  { value: "statuts", label: "Statuts" },
  { value: "fiscal", label: "Documents fiscaux" },
  { value: "commerce", label: "Registre du commerce" },
  { value: "certification", label: "Certifications" },
  { value: "experience", label: "Expérience" }
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.representative.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.document_type.toLowerCase() === typeFilter;
    
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

  const getFileTypeIcon = (fileType: string) => {
    const config = fileTypeConfig[fileType as keyof typeof fileTypeConfig];
    if (!config) return FileText;
    const IconComponent = config.icon;
    return <IconComponent className={`h-4 w-4 ${config.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Documents
          </h1>
          <p className="text-muted-foreground">
            Centre de validation et archivage des documents ANSSI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Nouveau document
          </Button>
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="types">Types de documents</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
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
                      placeholder="Nom, entité, représentant..."
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
                  <label className="text-sm font-medium">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
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
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total documents</span>
                </div>
                <div className="text-2xl font-bold">
                  {mockDocuments.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Approuvés</span>
                </div>
                <div className="text-2xl font-bold">
                  {mockDocuments.filter(doc => doc.status === "approved").length}
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
                  {mockDocuments.filter(doc => doc.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Rejetés</span>
                </div>
                <div className="text-2xl font-bold">
                  {mockDocuments.filter(doc => doc.status === "rejected").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableau des documents */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} document(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entité</TableHead>
                      <TableHead>Représentant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.slug}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {/* {getFileTypeIcon(doc.file_type)} */}
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {doc.file_size} • {doc.file_type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.document_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.entity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.representative}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(doc.issued_at).toLocaleDateString('fr-FR')}
                          </div>
                          {doc.expires_at && (
                            <div className="text-xs text-muted-foreground">
                              Expire: {new Date(doc.expires_at).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(doc.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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
                                    Choisissez une action pour ce document
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => setSelectedDocument(doc as unknown as Document)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir le document
                                  </Button>
                                  {doc.status === "pending" && (
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
                                  <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger
                                  </Button>
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
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Types de documents</span>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Nouveau type
                </Button>
              </CardTitle>
              <CardDescription>
                Gestion des catégories de documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocumentTypes.map((type) => (
                  <div key={type.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {type.documents_count} documents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={type.status === "ON" ? "default" : "secondary"}>
                        {type.status === "ON" ? "Actif" : "Inactif"}
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

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation des documents</CardTitle>
              <CardDescription>
                Documents en attente de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.filter(doc => doc.status === "pending").map((doc) => (
                  <div key={doc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.entity} • {doc.representative}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Soumis le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button variant="outline" className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
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

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archive des documents</CardTitle>
              <CardDescription>
                Documents archivés et expirés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun document archivé pour le moment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
