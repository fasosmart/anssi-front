"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Representative } from "@/types/api";
import { API } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CursusManager } from "./_components/CursusManager";

export default function RepresentativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session, status } = useSession();
  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We need the entity slug to fetch the representative details.
  // For now, let's assume we can get it. This will be improved.
  const [entitySlug, setEntitySlug] = useState<string | null>(null);

  useEffect(() => {
    // A simple way to get the entity slug is to fetch the list first.
    // In a real app, this might be stored in a global state/context.
    const getEntitySlug = async () => {
        if (session?.accessToken) {
            const response = await apiClient.get(API.entities.list());
            if (response.data.results && response.data.results.length > 0) {
                setEntitySlug(response.data.results[0].slug);
            }
        }
    };
    if (status === "authenticated") {
        getEntitySlug();
    }
  }, [status, session]);


  useEffect(() => {
    const fetchRepresentativeDetails = async () => {
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
    fetchRepresentativeDetails();
  }, [entitySlug, slug, session]);

  if (isLoading) {
    return <div>Chargement du profil du représentant...</div>;
  }

  if (!representative) {
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


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {representative.first_name} {representative.last_name}
          </h1>
          <p className="text-muted-foreground">
            Gérez le profil et le cursus de {representative.job_title}.
          </p>
        </div>
        {/* We will add an edit button here later */}
      </div>

      <Tabs defaultValue="degrees">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="degrees">Diplômes</TabsTrigger>
          <TabsTrigger value="trainings">Formations & Certifications</TabsTrigger>
          <TabsTrigger value="experiences">Expériences Professionnelles</TabsTrigger>
        </TabsList>
        <TabsContent value="degrees">
          <CursusManager
            itemType="degree"
            title="Diplômes et Titres Académiques"
            description="Gérez les diplômes et titres académiques du représentant."
            listApiEndpoint={API.degrees.list(entitySlug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.degrees.details(entitySlug!, slug, itemId) : API.degrees.create(entitySlug!, slug)}
            columns={degreeColumns}
          />
        </TabsContent>
        <TabsContent value="trainings">
           <CursusManager
            itemType="training"
            title="Formations et Certifications"
            description="Gérez les formations et certifications professionnelles."
            listApiEndpoint={API.trainings.list(entitySlug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.trainings.details(entitySlug!, slug, itemId) : API.trainings.create(entitySlug!, slug)}
            columns={trainingColumns}
          />
        </TabsContent>
        <TabsContent value="experiences">
           <CursusManager
            itemType="experience"
            title="Expériences Professionnelles"
            description="Gérez l'historique professionnel du représentant."
            listApiEndpoint={API.experiences.list(entitySlug!, slug)}
            itemApiEndpoint={(itemId) => itemId ? API.experiences.details(entitySlug!, slug, itemId) : API.experiences.create(entitySlug!, slug)}
            columns={experienceColumns}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
