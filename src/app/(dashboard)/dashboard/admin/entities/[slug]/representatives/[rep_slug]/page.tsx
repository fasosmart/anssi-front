"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  User,
  Building,
  Calendar,
  Download,
  Eye,
  Shield,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Award
} from "lucide-react";
import Link from "next/link";
import { Representative, Degree, Experience, Training } from "@/types/api";
import { AdminAPI, API } from "@/lib/api";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepresentativeDetailPage() {
  const params = useParams();
  const entitySlug = params.slug as string;
  const repSlug = params.rep_slug as string;

  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!entitySlug || !repSlug) return;
      
      setIsLoading(true);
      try {
        // Récupérer les détails du représentant
        const repResponse = await AdminAPI.getRepresentative(repSlug);
        const degreesRepResponse = repResponse.degrees;
        const experiencesRepResponse = repResponse.experiences;
        const trainingsRepResponse = repResponse.trainings;
        // console.log("degreesRepResponse", degreesRepResponse);
        // console.log("experiencesRepResponse", experiencesRepResponse);
        // console.log("trainingsRepResponse", trainingsRepResponse);
        setRepresentative(repResponse);
        setDegrees(degreesRepResponse);
        setExperiences(experiencesRepResponse);setRepresentative
        setTrainings(trainingsRepResponse);
      } catch (e) {
        toast.error("Impossible de charger les détails du représentant");
      } finally {
        setIsLoading(false);
      } 
    };

    fetchData();
  }, [entitySlug, repSlug]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!representative) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Représentant introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/admin/entities/${entitySlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l&apos;entité
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {representative.first_name} {representative.last_name}
            </h1>
            <p className="text-muted-foreground">
              {representative.job_title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="degrees">
            Diplômes ({degrees.length})
          </TabsTrigger>
          <TabsTrigger value="experiences">
            Expériences ({experiences.length})
          </TabsTrigger>
          <TabsTrigger value="trainings">
            Formations ({trainings.length})
          </TabsTrigger>
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
                {representative.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{representative.email}</p>
                  </div>
                )}
                {representative.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p className="text-sm">{representative.phone}</p>
                  </div>
                )}
                {representative.mobile && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                    <p className="text-sm">{representative.mobile}</p>
                  </div>
                )}
                {representative.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                    <p className="text-sm">{representative.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations d'identité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Informations d&apos;identité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {representative.idcard_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Numéro de carte d&apos;identité</label>
                    <p className="text-sm">{representative.idcard_number}</p>
                  </div>
                )}
                {representative.idcard_issued_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date de délivrance</label>
                    <p className="text-sm">
                      {new Date(representative.idcard_issued_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                {representative.idcard_expires_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date d&apos;expiration</label>
                    <p className="text-sm">
                      {new Date(representative.idcard_expires_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                {representative.idcard_file && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Carte d&apos;identité</label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={String(representative.idcard_file)} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={String(representative.idcard_file)} download>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="degrees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Diplômes et certifications</span>
              </CardTitle>
              <CardDescription>
                Diplômes universitaires et certifications professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {degrees.length > 0 ? (
                <div className="space-y-4">
                  {degrees.map((degree) => (
                    <div key={degree.slug} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{degree.degree_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {degree.institution} • {degree.year_obtained}
                          </p>
                          {degree.specialty && (
                            <p className="text-sm text-muted-foreground">
                              Spécialité: {degree.specialty}
                            </p>
                          )}
                        </div>
                      </div>
                      {degree.file && (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(degree.file)} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(degree.file)} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun diplôme associé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Expériences professionnelles</span>
              </CardTitle>
              <CardDescription>
                Historique des expériences professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.slug} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{exp.job_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.company} • {new Date(exp.start_date).toLocaleDateString('fr-FR')} - 
                            {exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR') : 'En cours'}
                          </p>
                        </div>
                      </div>
                      {exp.file && (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(exp.file)} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(exp.file)} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune expérience associée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Formations et certifications</span>
              </CardTitle>
              <CardDescription>
                Formations continues et certifications techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainings.length > 0 ? (
                <div className="space-y-4">
                  {trainings.map((training) => (
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
                      {training.file && (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(training.file)} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={String(training.file)} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune formation associée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


