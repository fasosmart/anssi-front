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
  FileText,
  Building,
  User,
  Calendar,
  Download,
  Eye,
  Edit,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

// Mock data - sera remplacé par l'API
const mockAccreditationDetail = {
  slug: "acc-001",
  status: "under_review" as const,
  type_accreditation: {
    slug: "apassi",
    name: "APASSI - Audit de la Sécurité des Systèmes d'Information",
    duration: 12
  },
  representative: {
    slug: "rep-001",
    first_name: "Moussa",
    last_name: "Diallo",
    job_title: "Directeur Technique",
    email: "moussa.diallo@techcorp.gn",
    phone: "+224 123 456 789",
    address: "Conakry, Guinée"
  },
  entity: {
    slug: "techcorp",
    name: "TechCorp SARL",
    acronym: "TC",
    business_sector: "Technologies de l'information",
    tax_id: "123456789",
    commercial_register: "RC-2024-001",
    total_staff: 25,
    cybersecurity_experts: 8,
    address: "Rue du Commerce, Conakry",
    phone: "+224 123 456 789",
    email: "contact@techcorp.gn",
    website: "https://techcorp.gn",
    entity_type: "business" as const
  },
  submission_date: "2024-01-15",
  review_date: "2024-01-18",
  approval_date: null,
  rejection_date: null,
  reason_for_rejection: null,
  valid_from: null,
  valid_to: null,
  certificate_number: null,
  notes: "Demande en cours d'évaluation technique",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-18T14:20:00Z"
};

const mockDocuments = [
  {
    slug: "doc-001",
    name: "Demande d'accréditation APASSI",
    document_type: "Demande officielle",
    file: "/documents/demande-apassi.pdf",
    issued_at: "2024-01-15",
    expires_at: null
  },
  {
    slug: "doc-002", 
    name: "Certificats de compétence",
    document_type: "Certificats",
    file: "/documents/certificats.pdf",
    issued_at: "2024-01-10",
    expires_at: "2025-01-10"
  },
  {
    slug: "doc-003",
    name: "Rapport d'expérience",
    document_type: "Expérience professionnelle",
    file: "/documents/experience.pdf",
    issued_at: "2024-01-12",
    expires_at: null
  }
];

const mockReviewHistory = [
  {
    id: 1,
    action: "Demande soumise",
    user: "Moussa Diallo",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    comment: "Demande d'accréditation APASSI soumise avec tous les documents requis"
  },
  {
    id: 2,
    action: "Vérification des documents",
    user: "Admin ANSSI",
    date: "2024-01-16T09:15:00Z",
    status: "completed",
    comment: "Tous les documents sont conformes et complets"
  },
  {
    id: 3,
    action: "Évaluation technique en cours",
    user: "Expert Technique",
    date: "2024-01-18T14:20:00Z",
    status: "in_progress",
    comment: "Évaluation des compétences techniques en cours"
  }
];

const statusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500", textColor: "text-gray-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  under_review: { label: "En révision", color: "bg-blue-500", textColor: "text-blue-700" },
  approved: { label: "Approuvée", color: "bg-green-500", textColor: "text-green-700" },
  rejected: { label: "Rejetée", color: "bg-red-500", textColor: "text-red-700" }
};

export default function AccreditationDetailPage() {
  const accreditation = mockAccreditationDetail;
  const statusConfig_item = statusConfig[accreditation.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin/accreditations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Accréditation {accreditation.slug}
            </h1>
            <p className="text-muted-foreground">
              {accreditation.type_accreditation.name}
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
                Soumise le {new Date(accreditation.submission_date).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="flex gap-2">
              {accreditation.status === "under_review" && (
                <Button>
                  <Clock className="h-4 w-4 mr-2" />
                  Mettre en révision
                </Button>
              )}
              {accreditation.status === "under_review" && (
                <>
                  <Button variant="outline" className="text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="review">Révision</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informations de l'entité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Informations de l&apos;entité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom</label>
                  <p className="text-sm">{accreditation.entity.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d&apos;activité</label>
                  <p className="text-sm">{accreditation.entity.business_sector}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Effectif total</label>
                  <p className="text-sm">{accreditation.entity.total_staff} employés</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experts cybersécurité</label>
                  <p className="text-sm">{accreditation.entity.cybersecurity_experts} experts</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact</label>
                  <p className="text-sm">{accreditation.entity.email}</p>
                  <p className="text-sm">{accreditation.entity.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informations du représentant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Représentant l&apos;legal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-sm">{accreditation.representative.first_name} {accreditation.representative.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poste</label>
                  <p className="text-sm">{accreditation.representative.job_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{accreditation.representative.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-sm">{accreditation.representative.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                  <p className="text-sm">{accreditation.representative.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détails de l'accréditation */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de l&apos;accréditation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type d&apos;accréditation</label>
                  <p className="text-sm">{accreditation.type_accreditation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durée</label>
                  <p className="text-sm">{accreditation.type_accreditation.duration} mois</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de soumission</label>
                  <p className="text-sm">{new Date(accreditation.submission_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de révision</label>
                  <p className="text-sm">
                    {accreditation.review_date ? new Date(accreditation.review_date).toLocaleDateString('fr-FR') : 'Non définie'}
                  </p>
                </div>
              </div>
              {accreditation.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm">{accreditation.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents associés</CardTitle>
              <CardDescription>
                Liste des documents fournis pour cette accréditation&apos;
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

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processus de révision</CardTitle>
              <CardDescription>
                Évaluation et validation de l&apos;accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Commentaires de révision</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">
                          Évaluation technique en cours. Les documents sont conformes.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expert Technique • {new Date().toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Ajouter un commentaire</h4>
                  <div className="space-y-2">
                    <textarea 
                      className="w-full p-2 border rounded-md"
                      placeholder="Ajoutez vos commentaires de révision..."
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button size="sm">Ajouter</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>
                Chronologie des événements pour cette accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviewHistory.map((item, index) => (
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
