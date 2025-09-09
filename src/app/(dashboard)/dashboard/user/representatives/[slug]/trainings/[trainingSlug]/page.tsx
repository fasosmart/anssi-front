"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { Training, Entity } from "@/types/api";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-3 border-b">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2">{value || "N/A"}</dd>
    </div>
);

export default function TrainingDetailPage() {
    const params = useParams<{ slug: string; trainingSlug: string }>();
    const { slug: repSlug, trainingSlug } = params;
    const { data: session, status } = useSession();
    const [training, setTraining] = useState<Training | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [entity, setEntity] = useState<Entity | null>(null);

    useEffect(() => {
        const getEntityAndTraining = async () => {
            if (session?.accessToken) {
                try {
                    const entityResponse = await apiClient.get(API.entities.list());
                    if (entityResponse.data.results && entityResponse.data.results.length > 0) {
                        const fetchedEntity = entityResponse.data.results[0];
                        setEntity(fetchedEntity);
                        
                        const trainingResponse = await apiClient.get(API.trainings.details(fetchedEntity.slug, repSlug, trainingSlug));
                        setTraining(trainingResponse.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        if (status === "authenticated") {
            getEntityAndTraining();
        }
    }, [status, session, repSlug, trainingSlug]);

    if (isLoading) {
        return <div>Chargement de la formation...</div>;
    }

    if (!training) {
        return <div>Détails de la formation non trouvés.</div>;
    }

    return (
        <div className="space-y-6">
            <Link href={`/dashboard/user/representatives/${repSlug}`} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au profil du représentant
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>{training.training_name}</CardTitle>
                    <CardDescription>Détails de la formation ou certification.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl>
                        <InfoField label="Titre de la formation" value={training.training_name} />
                        <InfoField label="Institution" value={training.institution} />
                        <InfoField label="Année d'obtention" value={String(training.year_obtained)} />
                        <InfoField label="Justificatif" value={training.file ? "Un fichier est joint" : "Aucun fichier joint"} />
                        {training.file && (
                             <div className="pt-4">
                                <Link href={training.file as string} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline">Voir le justificatif</Button>
                                </Link>
                            </div>
                        )}
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
