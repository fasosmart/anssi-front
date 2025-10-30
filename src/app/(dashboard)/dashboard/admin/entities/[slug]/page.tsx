"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  CheckCircle, 
  XCircle, 
  Clock, 
  Building,
  User,
  Calendar,
  Download,
  Eye,
  Edit,
  MessageSquare,
  AlertTriangle,
  FileText,
  Users,
  Shield,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import Link from "next/link";

// Mock data - sera remplacé par l'API
const mockEntityDetail = {
  slug: "techcorp",
  name: "TechCorp SARL",
  acronym: "TC",
  business_sector: "Technologies de l'information",
  tax_id: "123456789",
  commercial_register: "RC-2024-001",
  total_staff: 25,
  cybersecurity_experts: 8,
  address: "Rue du Commerce, Conakry, Guinée",
  phone: "+224 123 456 789",
  mobile: "+224 123 456 790",
  email: "contact@techcorp.gn",
  website: "https://techcorp.gn",
  entity_type: "business" as const,
  status: "active",
  created_at: "2024-01-10T10:30:00Z",
  updated_at: "2024-01-15T14:20:00Z"
};

const mockRepresentatives = [
  {
    slug: "rep-001",
    first_name: "Moussa",
    last_name: "Diallo",
    job_title: "Directeur Technique",
    email: "moussa.diallo@techcorp.gn",
    phone: "+224 123 456 789",
    status: "active"
  },
  {
    slug: "rep-002",
    first_name: "Fatoumata",
    last_name: "Bah",
    job_title: "Responsable Cybersécurité",
    email: "fatoumata.bah@techcorp.gn",
    phone: "+224 123 456 791",
    status: "active"
  }
];

const mockAccreditations = [
  {
    slug: "acc-001",
    type_accreditation: "APASSI",
    status: "approved",
    submission_date: "2024-01-15",
    approval_date: "2024-01-20"
  },
  {
    slug: "acc-002",
    type_accreditation: "APACS",
    status: "under_review",
    submission_date: "2024-01-18",
    approval_date: null
  },
  {
    slug: "acc-003",
    type_accreditation: "APDIS",
    status: "pending",
    submission_date: "2024-01-20",
    approval_date: null
  }
];

const mockDocuments = [
  {
    slug: "doc-001",
    name: "Statuts de l'entreprise",
    document_type: "Statuts",
    file: "/documents/statuts.pdf",
    issued_at: "2024-01-10",
    expires_at: null
  },
  {
    slug: "doc-002",
    name: "Carte d'identification fiscale",
    document_type: "Fiscal",
    file: "/documents/carte-fiscale.pdf",
    issued_at: "2024-01-08",
    expires_at: "2025-01-08"
  },
  {
    slug: "doc-003",
    name: "Registre du commerce",
    document_type: "Commerce",
    file: "/documents/registre-commerce.pdf",
    issued_at: "2024-01-05",
    expires_at: null
  }
];

const mockActivityHistory = [
  {
    id: 1,
    action: "Entité créée",
    user: "Moussa Diallo",
    date: "2024-01-10T10:30:00Z",
    status: "completed",
    comment: "Nouvelle entité enregistrée dans le système"
  },
  {
    id: 2,
    action: "Documents validés",
    user: "Admin ANSSI",
    date: "2024-01-12T14:20:00Z",
    status: "completed",
    comment: "Tous les documents requis ont été validés"
  },
  {
    id: 3,
    action: "Entité approuvée",
    user: "Admin ANSSI",
    date: "2024-01-15T09:15:00Z",
    status: "completed",
    comment: "Entité approuvée et activée"
  }
];

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", textColor: "text-green-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  blocked: { label: "Bloquée", color: "bg-red-500", textColor: "text-red-700" },
  inactive: { label: "Inactive", color: "bg-gray-500", textColor: "text-gray-700" }
};

const accreditationStatusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500" },
  pending: { label: "En attente", color: "bg-orange-500" },
  under_review: { label: "En révision", color: "bg-blue-500" },
  approved: { label: "Approuvée", color: "bg-green-500" },
  rejected: { label: "Rejetée", color: "bg-red-500" }
};

export default function EntityDetailPage() {
  const entity = mockEntityDetail;
  const statusConfig_item = statusConfig[entity.status as keyof typeof statusConfig];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin/entities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {entity.name}
            </h1>
            <p className="text-muted-foreground">
              {entity.acronym} • {entity.business_sector}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Statut et actions rapides */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className={`${statusConfig_item.color} ${statusConfig_item.textColor} border-0 text-white`}
              >
                {statusConfig_item.label}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Créée le {new Date(entity.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="flex gap-2">
              {entity.status === "pending" && (
                <>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </>
              )}
              {entity.status === "active" && (
                <Button variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Bloquer
                </Button>
              )}
              {entity.status === "blocked" && (
                <Button className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Débloquer
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="representatives">Représentants</TabsTrigger>
          <TabsTrigger value="accreditations">Accréditations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Informations générales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-sm">{entity.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Acronyme</label>
                  <p className="text-sm">{entity.acronym}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d&apos;activité</label>
                  <p className="text-sm">{entity.business_sector}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type d&apos;entité</label>
                  <p className="text-sm">
                    {entity.entity_type === "business" ? "Entreprise" : 
                     entity.entity_type === "personal" ? "Personne physique" : "ONG"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Identifiant fiscal</label>
                  <p className="text-sm">{entity.tax_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registre du commerce</label>
                  <p className="text-sm">{entity.commercial_register}</p>
                </div>
              </CardContent>
            </Card>

            {/* Effectif et ressources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Effectif et ressources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Effectif total</label>
                  <p className="text-sm">{entity.total_staff} employés</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experts cybersécurité</label>
                  <p className="text-sm">{entity.cybersecurity_experts} experts</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pourcentage d&apos;experts</label>
                  <p className="text-sm">
                    {Math.round((entity.cybersecurity_experts / entity.total_staff) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact et localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact et localisation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                    <p className="text-sm">{entity.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p className="text-sm">{entity.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                    <p className="text-sm">{entity.mobile}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{entity.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Site web</label>
                    <p className="text-sm">{entity.website}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="representatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Représentants de l&apos;entité</CardTitle>
              <CardDescription>
                Liste des représentants légaux et techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRepresentatives.map((rep) => (
                  <div key={rep.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{rep.first_name} {rep.last_name}</p>
                        <p className="text-sm text-muted-foreground">{rep.job_title}</p>
                        <p className="text-sm text-muted-foreground">{rep.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{rep.status}</Badge>
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

        <TabsContent value="accreditations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accréditations de l&apos;entité</CardTitle>
              <CardDescription>
                Historique des demandes d&apos;accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAccreditations.map((acc) => (
                  <div key={acc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{acc.type_accreditation}</p>
                        <p className="text-sm text-muted-foreground">
                          Soumise le {new Date(acc.submission_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`${accreditationStatusConfig[acc.status as keyof typeof accreditationStatusConfig].color} text-white border-0`}
                      >
                        {accreditationStatusConfig[acc.status as keyof typeof accreditationStatusConfig].label}
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

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents de l&apos;entité</CardTitle>
              <CardDescription>
                Pièces justificatives et documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_type} • Émis le {new Date(doc.issued_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>
                Chronologie des événements pour cette entité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityHistory.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {item.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {item.status === "in_progress" && <Clock className="h-5 w-5 text-blue-500" />}
                      {item.status === "pending" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.action}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Par {item.user}
                      </p>
                      {item.comment && (
                        <p className="text-sm mt-1">{item.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
