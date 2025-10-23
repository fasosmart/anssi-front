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
  User,
  Building,
  Calendar,
  Download,
  Eye,
  Edit,
  MessageSquare,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Shield,
  Plus
} from "lucide-react";
import Link from "next/link";

// Mock data - sera remplacé par l'API
const mockRepresentativeDetail = {
  slug: "rep-001",
  first_name: "Moussa",
  last_name: "Diallo",
  job_title: "Directeur Technique",
  phone: "+224 123 456 789",
  mobile: "+224 123 456 790",
  email: "moussa.diallo@techcorp.gn",
  address: "Conakry, Guinée",
  idcard_number: "123456789",
  idcard_issued_at: "2020-01-15",
  idcard_expires_at: "2030-01-15",
  idcard_file: "/documents/id-card.pdf",
  status: "active",
  created_at: "2024-01-10T10:30:00Z",
  updated_at: "2024-01-15T14:20:00Z"
};

const mockEntity = {
  slug: "techcorp",
  name: "TechCorp SARL",
  acronym: "TC",
  business_sector: "Technologies de l'information",
  entity_type: "business" as const
};

const mockDegrees = [
  {
    slug: "deg-001",
    degree_name: "Master en Cybersécurité",
    institution: "Université de Conakry",
    year_obtained: 2020,
    file: "/documents/master-cybersecurite.pdf"
  },
  {
    slug: "deg-002",
    degree_name: "Licence en Informatique",
    institution: "Institut Supérieur de Technologie",
    year_obtained: 2018,
    file: "/documents/licence-informatique.pdf"
  },
  {
    slug: "deg-003",
    degree_name: "Certificat CISSP",
    institution: "ISC2",
    year_obtained: 2021,
    file: "/documents/cissp-certificate.pdf"
  }
];

const mockExperiences = [
  {
    slug: "exp-001",
    experience_type: "cdi" as const,
    job_title: "Directeur Technique",
    company: "TechCorp SARL",
    start_date: "2022-01-01",
    end_date: null,
    file: "/documents/experience-techcorp.pdf"
  },
  {
    slug: "exp-002",
    experience_type: "cdi" as const,
    job_title: "Ingénieur Sécurité",
    company: "SecureIT",
    start_date: "2020-06-01",
    end_date: "2021-12-31",
    file: "/documents/experience-secureit.pdf"
  },
  {
    slug: "exp-003",
    experience_type: "consultant" as const,
    job_title: "Consultant Cybersécurité",
    company: "CyberGuard",
    start_date: "2019-01-01",
    end_date: "2020-05-31",
    file: "/documents/experience-cyberguard.pdf"
  }
];

const mockTrainings = [
  {
    slug: "train-001",
    training_name: "Formation ISO 27001",
    institution: "ANSSI Guinée",
    year_obtained: 2023,
    file: "/documents/formation-iso27001.pdf"
  },
  {
    slug: "train-002",
    training_name: "Certification CEH",
    institution: "EC-Council",
    year_obtained: 2022,
    file: "/documents/ceh-certificate.pdf"
  },
  {
    slug: "train-003",
    training_name: "Formation Pentesting",
    institution: "Offensive Security",
    year_obtained: 2021,
    file: "/documents/pentesting-training.pdf"
  }
];

const mockActivityHistory = [
  {
    id: 1,
    action: "Profil créé",
    user: "Moussa Diallo",
    date: "2024-01-10T10:30:00Z",
    status: "completed",
    comment: "Nouveau profil représentant créé"
  },
  {
    id: 2,
    action: "Diplômes ajoutés",
    user: "Moussa Diallo",
    date: "2024-01-12T14:20:00Z",
    status: "completed",
    comment: "3 diplômes ajoutés au profil"
  },
  {
    id: 3,
    action: "Profil validé",
    user: "Admin ANSSI",
    date: "2024-01-15T09:15:00Z",
    status: "completed",
    comment: "Profil validé et approuvé"
  }
];

const statusConfig = {
  active: { label: "Actif", color: "bg-green-500", textColor: "text-green-700" },
  pending: { label: "En attente", color: "bg-orange-500", textColor: "text-orange-700" },
  blocked: { label: "Bloqué", color: "bg-red-500", textColor: "text-red-700" },
  inactive: { label: "Inactif", color: "bg-gray-500", textColor: "text-gray-700" }
};

const experienceTypeConfig = {
  stage: { label: "Stage", color: "bg-blue-500" },
  cdd: { label: "CDD", color: "bg-green-500" },
  cdi: { label: "CDI", color: "bg-purple-500" },
  contractuel: { label: "Contractuel", color: "bg-orange-500" },
  consultant: { label: "Consultant", color: "bg-red-500" }
};

export default function RepresentativeDetailPage({ params }: { params: { slug: string } }) {
  const representative = mockRepresentativeDetail;
  const statusConfig_item = statusConfig[representative.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin/representatives">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {representative.first_name} {representative.last_name}
            </h1>
            <p className="text-muted-foreground">
              {representative.job_title} • {mockEntity.name}
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
                Créé le {new Date(representative.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="flex gap-2">
              {representative.status === "pending" && (
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
              {representative.status === "active" && (
                <Button variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Bloquer
                </Button>
              )}
              {representative.status === "blocked" && (
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
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="degrees">Diplômes</TabsTrigger>
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="trainings">Formations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-sm">{representative.first_name} {representative.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poste</label>
                  <p className="text-sm">{representative.job_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{representative.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-sm">{representative.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                  <p className="text-sm">{representative.mobile}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                  <p className="text-sm">{representative.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informations d'identité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Informations d'identité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Numéro de carte d'identité</label>
                  <p className="text-sm">{representative.idcard_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de délivrance</label>
                  <p className="text-sm">{new Date(representative.idcard_issued_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date d'expiration</label>
                  <p className="text-sm">{new Date(representative.idcard_expires_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Carte d'identité</label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entité d'appartenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Entité d'appartenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{mockEntity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mockEntity.acronym} • {mockEntity.business_sector}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/admin/entities/${mockEntity.slug}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Voir l'entité
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="degrees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Diplômes et certifications</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Diplômes universitaires et certifications professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDegrees.map((degree) => (
                  <div key={degree.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <GraduationCap className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{degree.degree_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {degree.institution} • {degree.year_obtained}
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

        <TabsContent value="experiences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Expériences professionnelles</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Historique des expériences professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExperiences.map((exp) => (
                  <div key={exp.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{exp.job_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company} • {new Date(exp.start_date).toLocaleDateString('fr-FR')} - 
                          {exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR') : 'En cours'}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {experienceTypeConfig[exp.experience_type].label}
                        </Badge>
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

        <TabsContent value="trainings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Formations et certifications</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Formations continues et certifications techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrainings.map((training) => (
                  <div key={training.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Award className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{training.training_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {training.institution} • {training.year_obtained}
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

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents du représentant</CardTitle>
              <CardDescription>
                Tous les documents associés à ce représentant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Carte d'identité</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Document d'identité officiel
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Autres documents</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Diplômes, expériences, formations
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir tous
                      </Button>
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
                Chronologie des événements pour ce représentant
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
