"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { Degree, Entity } from "@/types/api";
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

export default function DegreeDetailPage() {
    const params = useParams<{ slug: string; degreeSlug: string }>();
    const { slug: repSlug, degreeSlug } = params;
    const { data: session, status } = useSession();
    const [degree, setDegree] = useState<Degree | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [entity, setEntity] = useState<Entity | null>(null);

    useEffect(() => {
        const getEntityAndDegree = async () => {
            if (session?.accessToken) {
                try {
                    const entityResponse = await apiClient.get(API.entities.list());
                    if (entityResponse.data.results && entityResponse.data.results.length > 0) {
                        const fetchedEntity = entityResponse.data.results[0];
                        setEntity(fetchedEntity);
                        
                        const degreeResponse = await apiClient.get(API.degrees.details(fetchedEntity.slug, repSlug, degreeSlug));
                        setDegree(degreeResponse.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        if (status === "authenticated") {
            getEntityAndDegree();
        }
    }, [status, session, repSlug, degreeSlug]);

    if (isLoading) {
        return <div>Chargement du diplôme...</div>;
    }

    if (!degree) {
        return <div>Détails du diplôme non trouvés.</div>;
    }

    return (
        <div className="space-y-6">
            <Link href={`/dashboard/user/representatives/${repSlug}`} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au profil du représentant
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>{degree.degree_name}</CardTitle>
                    <CardDescription>Détails du diplôme ou titre académique.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl>
                        <InfoField label="Titre du diplôme" value={degree.degree_name} />
                        <InfoField label="Institution" value={degree.institution} />
                        <InfoField label="Année d'obtention" value={String(degree.year_obtained)} />
                        <InfoField label="Justificatif" value={degree.file ? "Un fichier est joint" : "Aucun fichier joint"} />
                        {degree.file && (
                             <div className="pt-4">
                                <Link href={degree.file as string} target="_blank" rel="noopener noreferrer">
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
