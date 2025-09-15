"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Representative, Entity } from "@/types/api";
import { API } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CursusManager } from "./_components/CursusManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddEditRepresentativeDialog } from "../_components/AddEditRepresentativeDialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEntity } from "@/contexts/EntityContext";
import Link from "next/link";

export default function RepresentativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { activeEntity, isLoading: isEntityLoading } = useEntity();
  
  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchRepresentativeDetails = async (entitySlug: string) => {
    if (entitySlug && slug) {
      setIsLoading(true);
      try {
        const response = await apiClient.get(API.representatives.details(entitySlug, slug));
        setRepresentative(response.data);
      } catch {
        toast.error("Erreur lors de la récupération des détails du représentant.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isEntityLoading) {
      if (activeEntity?.slug) {
        fetchRepresentativeDetails(activeEntity.slug);
      } else {
        setIsLoading(false); // No active entity, stop loading
      }
    }
  }, [isEntityLoading, activeEntity, slug]);


  const handleSuccess = () => {
    setIsDialogOpen(false);
    if(activeEntity?.slug) {
        fetchRepresentativeDetails(activeEntity.slug);
    }
  }

  if (isLoading || isEntityLoading) {
    return <div>Chargement du profil du représentant...</div>;
  }

  if (!activeEntity) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucune structure sélectionnée</CardTitle>
                <CardDescription>
                    Veuillez sélectionner une structure pour voir ses représentants.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Link href="/dashboard/user/entities">
                    <Button>Choisir une structure</Button>
                </Link>
            </CardFooter>
        </Card>
    )
  }

  if (!representative) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Représentant non trouvé</CardTitle>
                <CardDescription>
                    Ce représentant n'a pas été trouvé pour la structure active.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Link href="/dashboard/user/representatives">
                    <Button>Retour à la liste</Button>
                </Link>
            </CardFooter>
        </Card>
    )
  }


  const degreeColumns = [
    { key: 'degree_name', header: 'Diplôme' },
    { key: 'institution', header: 'Institution' },
    { key: 'year_obtained', header: 'Année' },
  ];
  
  const trainingColumns = [
    { key: 'training_name', header: 'Formation/Certification' },
    { key: 'institution', header: 'Institution' },
    { key: 'year_obtained', header: 'Année' },
  ];

  const experienceColumns = [
    { key: 'job_title', header: 'Poste' },
    { key: 'company', header: 'Entreprise' },
    { key: 'start_date', header: 'Début' },
    { key: 'end_date', header: 'Fin' },
  ];

  const InfoField = ({ label, value, isLink }: { label: string; value?: string | null, isLink?: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm md:col-span-2">
        {isLink && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Voir le fichier
          </a>
        ) : (
          value || "N/A"
        )}
      </dd>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {representative.first_name} {representative.last_name}
          </h1>
          <p className="text-muted-foreground">
            Gérez le profil et le cursus de : {representative.job_title}.
          </p>
        </div>
      </div>

      {isMobile ? (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Informations Générales</SelectItem>
            <SelectItem value="degrees">Diplômes</SelectItem>
            <SelectItem value="trainings">Formations & Certifications</SelectItem>
            <SelectItem value="experiences">Expériences Professionnelles</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="degrees">Diplômes</TabsTrigger>
            <TabsTrigger value="trainings">Formations & Certifications</TabsTrigger>
            <TabsTrigger value="experiences">Expériences Professionnelles</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {activeTab === 'general' && (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Détails du profil</CardTitle>
                  <CardDescription>Informations personnelles et de contact.</CardDescription>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>Modifier</Button>
          </CardHeader>
          <CardContent className="space-y-4">
              <InfoField label="Nom complet" value={`${representative.first_name} ${representative.last_name}`} />
              <InfoField label="Fonction" value={representative.job_title} />
              <InfoField label="Email" value={representative.email} />
              <InfoField label="Téléphone" value={representative.phone} />
              <InfoField label="Mobile" value={representative.mobile} />
              <InfoField label="N° Pièce d'identité" value={representative.idcard_number} />
              <InfoField label="Pièce d'identité" value={representative.idcard_file as string} isLink={true} />
              <InfoField label="Date de délivrance" value={representative.idcard_issued_at} />
              <InfoField label="Date d'expiration" value={representative.idcard_expires_at} />
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'degrees' && (
        <div className="mt-4">
          <CursusManager
            itemType="degree"
            title="Diplômes et Titres Académiques"
            description="Gérez les diplômes et titres académiques du représentant."
            listApiEndpoint={API.degrees.list(activeEntity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.degrees.details(activeEntity.slug!, slug, itemId) : API.degrees.create(activeEntity.slug!, slug)}
            columns={degreeColumns}
          />
        </div>
      )}

      {activeTab === 'trainings' && (
        <div className="mt-4">
          <CursusManager
            itemType="training"
            title="Formations et Certifications"
            description="Gérez les formations et certifications professionnelles."
            listApiEndpoint={API.trainings.list(activeEntity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.trainings.details(activeEntity.slug!, slug, itemId) : API.trainings.create(activeEntity.slug!, slug)}
            columns={trainingColumns}
          />
        </div>
      )}

      {activeTab === 'experiences' && (
        <div className="mt-4">
          <CursusManager
            itemType="experience"
            title="Expériences Professionnelles"
            description="Gérez l&apos;historique professionnel du représentant."
            listApiEndpoint={API.experiences.list(activeEntity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.experiences.details(activeEntity.slug!, slug, itemId) : API.experiences.create(activeEntity.slug!, slug)}
            columns={experienceColumns}
          />
        </div>
      )}
      
       <AddEditRepresentativeDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSuccess}
        entity={activeEntity as Entity}
        representative={representative}
      />
    </div>
  );
}
