"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { Experience, Entity } from "@/types/api";
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

export default function ExperienceDetailPage() {
    const params = useParams<{ slug: string; expSlug: string }>();
    const { slug: repSlug, expSlug } = params;
    const { data: session, status } = useSession();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [entity, setEntity] = useState<Entity | null>(null);

    useEffect(() => {
        const getEntityAndExperience = async () => {
            if (session?.accessToken) {
                try {
                    const entityResponse = await apiClient.get(API.entities.list());
                    if (entityResponse.data.results && entityResponse.data.results.length > 0) {
                        const fetchedEntity = entityResponse.data.results[0];
                        setEntity(fetchedEntity);
                        
                        const expResponse = await apiClient.get(API.experiences.details(fetchedEntity.slug, repSlug, expSlug));
                        setExperience(expResponse.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        if (status === "authenticated") {
            getEntityAndExperience();
        }
    }, [status, session, repSlug, expSlug]);

    if (isLoading) {
        return <div>Chargement de l'expérience...</div>;
    }

    if (!experience) {
        return <div>Détails de l'expérience non trouvés.</div>;
    }

    return (
        <div className="space-y-6">
            <Link href={`/dashboard/user/representatives/${repSlug}`} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au profil du représentant
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>{experience.job_title} chez {experience.company}</CardTitle>
                    <CardDescription>Détails de l'expérience professionnelle.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl>
                        <InfoField label="Poste occupé" value={experience.job_title} />
                        <InfoField label="Entreprise" value={experience.company} />
                        <InfoField label="Date de début" value={experience.start_date} />
                        <InfoField label="Date de fin" value={experience.end_date} />
                        <InfoField label="Justificatif" value={experience.file ? "Un fichier est joint" : "Aucun fichier joint"} />
                        {experience.file && (
                             <div className="pt-4">
                                <Link href={experience.file as string} target="_blank" rel="noopener noreferrer">
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
