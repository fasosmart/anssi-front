"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useEntity } from '@/contexts/EntityContext';
import { getDemandDetails } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  approved: "default",
  submitted: "secondary",
  rejected: "destructive",
  under_review: "outline",
  draft: "secondary",
};

const statusLabel: { [key: string]: string } = {
  approved: "Approuvé",
  submitted: "Soumis",
  rejected: "Rejeté",
  under_review: "En cours d'examen",
  draft: "Brouillon",
};

export default function DossierDetailPage() {
  const { slug } = useParams();
  const { activeEntity } = useEntity();
  const [demand, setDemand] = useState<any>(null); // Use a proper type later
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (activeEntity?.slug && typeof slug === 'string') {
        setIsLoading(true);
        try {
          const data = await getDemandDetails(activeEntity.slug, slug);
          setDemand(data);
        } catch (error) {
          toast.error("Impossible de charger les détails de la demande.");
          console.error("Failed to fetch demand details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();
  }, [activeEntity, slug]);

  if (isLoading) {
    return <div className="text-center p-8">Chargement des détails de la demande...</div>;
  }

  if (!demand) {
    return <div className="text-center p-8">Aucune donnée trouvée pour cette demande.</div>;
  }
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/user/dossiers" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des demandes
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Détails de la demande</CardTitle>
              <CardDescription>
                Informations complètes sur la demande d'accréditation.
              </CardDescription>
            </div>
            <Badge variant={statusVariant[demand.status] || "secondary"}>
                {statusLabel[demand.status] || demand.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Type d'accréditation</p>
                <p>{demand.type_accreditation?.name || demand.type_accreditation || 'N/A'}</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Représentant</p>
                <p>{demand.representative?.first_name} {demand.representative?.last_name || demand.representative || 'N/A'}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date de soumission</p>
                <p>{formatDate(demand.submission_date)}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date d'approbation</p>
                <p>{formatDate(demand.approval_date)}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date de rejet</p>
                <p>{formatDate(demand.rejection_date)}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Numéro de certificat</p>
                <p>{demand.certificate_number || 'N/A'}</p>
            </div>
             <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Raison du rejet</p>
                <p>{demand.reason_for_rejection || 'N/A'}</p>
            </div>
             <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Remarques</p>
                <p>{demand.notes || 'N/A'}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
