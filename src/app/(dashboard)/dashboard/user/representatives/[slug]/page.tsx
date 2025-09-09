"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Representative, Entity } from "@/types/api";
import { API } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CursusManager } from "./_components/CursusManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddEditRepresentativeDialog } from "../_components/AddEditRepresentativeDialog";

export default function RepresentativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session, status } = useSession();
  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRepresentativeDetails = async (entitySlug: string) => {
    if (entitySlug && slug && session?.accessToken) {
      setIsLoading(true);
      try {
        const response = await apiClient.get(API.representatives.details(entitySlug, slug));
        setRepresentative(response.data);
      } catch (error) {
        console.error("Failed to fetch representative details", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const getEntity = async () => {
        if (session?.accessToken) {
            const response = await apiClient.get(API.entities.list());
            if (response.data.results && response.data.results.length > 0) {
                const fetchedEntity = response.data.results[0];
                setEntity(fetchedEntity);
                fetchRepresentativeDetails(fetchedEntity.slug);
            }
        }
    };
    if (status === "authenticated") {
        getEntity();
    }
  }, [status, session, slug]);


  const handleSuccess = () => {
    setIsDialogOpen(false);
    if(entity?.slug) {
        fetchRepresentativeDetails(entity.slug);
    }
  }

  if (isLoading) {
    return <div>Chargement du profil du représentant...</div>;
  }

  if (!representative || !entity) {
    return <div>Représentant non trouvé.</div>;
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

  const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2">{value || "N/A"}</dd>
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

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Informations Générales</TabsTrigger>
          <TabsTrigger value="degrees">Diplômes</TabsTrigger>
          <TabsTrigger value="trainings">Formations & Certifications</TabsTrigger>
          <TabsTrigger value="experiences">Expériences Professionnelles</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
                    <InfoField label="Date de délivrance" value={representative.idcard_issued_at} />
                    <InfoField label="Date d'expiration" value={representative.idcard_expires_at} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="degrees">
          <CursusManager
            itemType="degree"
            title="Diplômes et Titres Académiques"
            description="Gérez les diplômes et titres académiques du représentant."
            listApiEndpoint={API.degrees.list(entity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.degrees.details(entity.slug!, slug, itemId) : API.degrees.create(entity.slug!, slug)}
            columns={degreeColumns}
          />
        </TabsContent>
        <TabsContent value="trainings">
           <CursusManager
            itemType="training"
            title="Formations et Certifications"
            description="Gérez les formations et certifications professionnelles."
            listApiEndpoint={API.trainings.list(entity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.trainings.details(entity.slug!, slug, itemId) : API.trainings.create(entity.slug!, slug)}
            columns={trainingColumns}
          />
        </TabsContent>
        <TabsContent value="experiences">
           <CursusManager
            itemType="experience"
            title="Expériences Professionnelles"
            description="Gérez l&apos;historique professionnel du représentant."
            listApiEndpoint={API.experiences.list(entity.slug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.experiences.details(entity.slug!, slug, itemId) : API.experiences.create(entity.slug!, slug)}
            columns={experienceColumns}
          />
        </TabsContent>
      </Tabs>

       <AddEditRepresentativeDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSuccess}
        entity={entity}
        representative={representative}
      />
    </div>
  );
}
