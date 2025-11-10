"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  FileText,
  Building,
  User,
  Download,
  Eye
} from "lucide-react";
import Link from "next/link";
import { AdminAccreditationRetrieve } from "@/types/api";
import { AdminAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500", textColor: "text-gray-700" },
  submitted: { label: "Soumise", color: "bg-yellow-500", textColor: "text-yellow-700" },
  under_review: { label: "En révision", color: "bg-blue-500", textColor: "text-blue-700" },
  approved: { label: "Approuvée", color: "bg-green-500", textColor: "text-green-700" },
  rejected: { label: "Rejetée", color: "bg-red-500", textColor: "text-red-700" }
};

export default function AccreditationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [accreditation, setAccreditation] = useState<AdminAccreditationRetrieve | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccreditation = async () => {
      setIsLoading(true);
      try {
        const data = await AdminAPI.getAccreditation(slug);
        setAccreditation(data);
      } catch (e) {
        toast.error("Impossible de charger les détails de l'accréditation");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchAccreditation();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!accreditation) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Accréditation introuvable</p>
      </div>
    );
  }

  const statusConfig_item = statusConfig[accreditation.status] || statusConfig.draft;
  const entitySlug = accreditation.entity.slug;

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
          {entitySlug && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/admin/entities/${entitySlug}`}>
                <Building className="h-4 w-4 mr-2" />
                Retour à l&apos;entité
              </Link>
            </Button>
          )}
          <div>
            {/* <h1 className="text-3xl font-bold tracking-tight">
              Accréditation {accreditation.slug}
            </h1> */}
            <p className="text-muted-foreground">
              {accreditation.type_accreditation}
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
              {accreditation.submission_date && (
                <div className="text-sm text-muted-foreground">
                  Soumise le {new Date(accreditation.submission_date).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <div className="space-y-4">
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
              {accreditation.entity.acronym && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Acronyme</label>
                  <p className="text-sm">{accreditation.entity.acronym}</p>
                </div>
              )}
              {accreditation.entity.business_sector && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d&apos;activité</label>
                  <p className="text-sm">{accreditation.entity.business_sector}</p>
                </div>
              )}
              {accreditation.entity.total_staff && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Effectif total</label>
                  <p className="text-sm">{accreditation.entity.total_staff} employés</p>
                </div>
              )}
              {accreditation.entity.cybersecurity_experts && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experts cybersécurité</label>
                  <p className="text-sm">{accreditation.entity.cybersecurity_experts} experts</p>
                </div>
              )}
              {accreditation.entity.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{accreditation.entity.email}</p>
                </div>
              )}
              {accreditation.entity.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-sm">{accreditation.entity.phone}</p>
                </div>
              )}
              {entitySlug && (
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/admin/entities/${entitySlug}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir l&apos;entité
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations du représentant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Représentant légal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                <p className="text-sm">
                  {accreditation.representative.first_name} {accreditation.representative.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Poste</label>
                <p className="text-sm">{accreditation.representative.job_title}</p>
              </div>
              {accreditation.representative.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{accreditation.representative.email}</p>
                </div>
              )}
              {accreditation.representative.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-sm">{accreditation.representative.phone}</p>
                </div>
              )}
              {entitySlug && (
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/admin/entities/${entitySlug}/representatives/${accreditation.representative.slug}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir le représentant
                    </Link>
                  </Button>
                </div>
              )}
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
                <p className="text-sm">{accreditation.type_accreditation}</p>
              </div>
              {accreditation.submission_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de soumission</label>
                  <p className="text-sm">
                    {new Date(accreditation.submission_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.review_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de révision</label>
                  <p className="text-sm">
                    {new Date(accreditation.review_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.approval_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date d&apos;approbation</label>
                  <p className="text-sm">
                    {new Date(accreditation.approval_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.rejection_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de rejet</label>
                  <p className="text-sm">
                    {new Date(accreditation.rejection_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.valid_from && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valide du</label>
                  <p className="text-sm">
                    {new Date(accreditation.valid_from).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.valid_to && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valide jusqu&apos;au</label>
                  <p className="text-sm">
                    {new Date(accreditation.valid_to).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {accreditation.certificate_number && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Numéro de certificat</label>
                  <p className="text-sm font-mono">{accreditation.certificate_number}</p>
                </div>
              )}
            </div>
            {accreditation.reason_for_rejection && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <label className="text-sm font-medium text-red-700">Raison du rejet</label>
                <p className="text-sm text-red-600 mt-1">{accreditation.reason_for_rejection}</p>
              </div>
            )}
            {accreditation.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm">{accreditation.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
