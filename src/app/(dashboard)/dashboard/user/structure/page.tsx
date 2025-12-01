"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { Document, Entity, Representative } from "@/types/api";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DocumentManager } from "./_components/DocumentManager";
import { useEntity } from "@/contexts/EntityContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, XCircle, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmitEntityConfirmationDialog } from "@/components/ui/submit-entity-confirmation-dialog";

export default function StructurePage() {
  const { 
    activeEntity, 
    isLoading: isEntityLoading, 
    error: entityError,
    canEditEntity,
    canManageRepresentatives,
    canCreateDemands,
    getEntityStatusLabel,
    getEntityStatusColor,
    submitEntityForReview
  } = useEntity();
  const router = useRouter();

  const [entityDetails, setEntityDetails] = useState<Partial<Entity> | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [representativeDetails, setRepresentativeDetails] = useState<Representative | null>(null);
  const isPersonalEntity = (entityDetails?.entity_type || activeEntity?.entity_type) === "personal";

  const fetchRepresentative = async (slug: string) => {
    try {
      const response = await apiClient.get(API.representatives.list(slug));
      setRepresentativeDetails(response.data.results?.[0] ?? null);
    } catch {
      setRepresentativeDetails(null);
    }
  };

  const fetchDetailsAndDocuments = async (slug: string) => {
    setIsLoading(true);
    try {
      const detailsResponse = await apiClient.get(API.entities.details(slug));
      setEntityDetails(detailsResponse.data);
      if (detailsResponse.data.entity_type === "personal") {
        await fetchRepresentative(slug);
      } else {
        setRepresentativeDetails(null);
      }
      const documentsResponse = await apiClient.get(API.documents.list(slug));
      setDocuments(documentsResponse.data.results || []);
    } catch {
      toast.error("Erreur lors de la récupération des détails de la structure.");
      setEntityDetails(null);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEntityLoading) {
      if (activeEntity?.slug) {
        fetchDetailsAndDocuments(activeEntity.slug);
      } else {
        setIsLoading(false); // No active entity, stop loading
      }
    }
  }, [activeEntity, isEntityLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntityDetails((prev) => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityDetails?.slug) return;

    setIsSubmitting(true);
    const url = API.entities.update(entityDetails.slug);
    
    try {
      const response = await apiClient.put(url, entityDetails);
      setEntityDetails(response.data);
      toast.success(`Structure mise à jour avec succès !`);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error(`Erreur: ${axiosError.response?.data?.detail || axiosError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!activeEntity?.slug) return;
    
    setIsSubmittingForReview(true);
    try {
      const success = await submitEntityForReview(activeEntity.slug);
      if (success) {
        // Rafraîchir les détails de l'entité
        await fetchDetailsAndDocuments(activeEntity.slug);
        setShowSubmitDialog(false);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  const handleSubmitButtonClick = () => {
    setShowSubmitDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <AlertCircle className="h-4 w-4" />;
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4" />;
      case 'blocked':
        return <Ban className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading || isEntityLoading) {
    return <div>Chargement de la structure...</div>;
  }

  if (!activeEntity) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucune structure sélectionnée</CardTitle>
                <CardDescription>
                    Veuillez sélectionner une structure à gérer depuis la page &quot;Mes Structures&quot;.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={() => router.push('/dashboard/user/entities')}>
                    Choisir une structure
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {
        !isPersonalEntity && (
        <Link href="/dashboard/user/entities" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des structures
        </Link>
        )
      }
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{entityDetails?.name || "Ma Structure"}</h1>
            {activeEntity?.status && (
              <Badge 
                variant="secondary" 
                className={`${getEntityStatusColor(activeEntity.status)} text-primary flex items-center gap-1`}
              >
                {getStatusIcon(activeEntity.status)}
                {getEntityStatusLabel(activeEntity.status)}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Gérez les informations de votre entreprise ou organisation.
          </p>
        </div>
        {(activeEntity?.status === 'new' || activeEntity?.status === 'declined') && (
          <Button 
            onClick={handleSubmitButtonClick}
            disabled={isSubmittingForReview}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmittingForReview ? 'Soumission...' : 'Soumettre pour validation'}
          </Button>
        )}
      </div>
      
      {/* Messages explicatifs selon le statut */}
      {activeEntity?.status && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              {getStatusIcon(activeEntity.status)}
              <div className="space-y-1">
                <h3 className="font-semibold">
                  {activeEntity.status === 'new' && "Structure en cours de création"}
                  {activeEntity.status === 'submitted' && "Structure soumise"}
                  {activeEntity.status === 'under_review' && "Structure en cours de validation"}
                  {activeEntity.status === 'validated' && "Structure validée"}
                  {activeEntity.status === 'blocked' && "Structure bloquée"}
                  {activeEntity.status === 'declined' && "Structure refusée"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeEntity.status === 'new' && "Vous pouvez modifier les informations de votre structure et la soumettre pour validation."}
                  {activeEntity.status === 'submitted' && "Votre structure a été soumise et sera bientôt examinée par nos équipes."}
                  {activeEntity.status === 'under_review' && "Votre structure est en cours d'examen par nos équipes. Vous ne pouvez plus la modifier pour le moment."}
                  {activeEntity.status === 'validated' && "Votre structure est validée ! Vous pouvez maintenant gérer vos représentants et créer des demandes d'accréditation."}
                  {activeEntity.status === 'blocked' && "Votre structure est temporairement bloquée. Contactez le support pour plus d'informations."}
                  {activeEntity.status === 'declined' && "Votre structure a été refusée. Vous pouvez la modifier et la soumettre à nouveau."}
                </p>
              </div>
            </div>

            {activeEntity.status === 'declined' && entityDetails?.rejection_reason && (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
                <p className="font-semibold text-destructive">
                  Raison du refus
                </p>
                <p className="mt-1 whitespace-pre-line text-destructive">
                  {entityDetails.rejection_reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="general">
        <TabsList className={`grid w-full ${isPersonalEntity ? "grid-cols-1" : "grid-cols-2"}`}>
          <TabsTrigger value="general">Informations Générales</TabsTrigger>
          {!isPersonalEntity && <TabsTrigger value="documents">Documents</TabsTrigger>}
        </TabsList>
        <TabsContent value="general">
          {isPersonalEntity ? (
            <Card>
              <CardHeader>
                <CardTitle>Données personnelles</CardTitle>
                <CardDescription>
                  {entityDetails?.status === "validated"
                    ? "Votre profil est validé. Mettez à jour vos coordonnées via votre profil représentant."
                    : "Les informations ci-dessous sont synchronisées avec votre profil de représentant."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Désignation</Label>
                    <Input value={entityDetails?.name || ""} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Statut</Label>
                    <Input value={entityDetails?.status || ""} disabled />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Nom complet</Label>
                    <Input value={`${representativeDetails?.first_name ?? ""} ${representativeDetails?.last_name ?? ""}`.trim()} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fonction / Titre</Label>
                    <Input value={representativeDetails?.job_title || ""} disabled />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Téléphone</Label>
                    <Input value={representativeDetails?.phone || representativeDetails?.mobile || ""} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={representativeDetails?.email || ""} disabled />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Adresse</Label>
                  <Textarea value={representativeDetails?.address || ""} disabled />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>N° de pièce d&apos;identité</Label>
                    <Input value={representativeDetails?.idcard_number || ""} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Délivrée le</Label>
                    <Input value={representativeDetails?.idcard_issued_at || ""} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Expire le</Label>
                    <Input value={representativeDetails?.idcard_expires_at || ""} disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link
                  href={`/dashboard/user/representatives/${representativeDetails?.slug || ""}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" disabled={!representativeDetails?.slug}>
                    Modifier mon profil
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations sur l&apos;entreprise</CardTitle>
                  <CardDescription>
                    {canEditEntity()
                      ? "Assurez-vous que ces informations sont exactes et à jour."
                      : "Ces informations sont en lecture seule car votre structure est en cours de validation."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                      <Input
                        id="name"
                        name="name"
                        value={entityDetails?.name || ""}
                        onChange={handleChange}
                        placeholder="Ex: FasoSmart"
                        required
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="acronym">Sigle</Label>
                      <Input
                        id="acronym"
                        name="acronym"
                        value={entityDetails?.acronym || ""}
                        onChange={handleChange}
                        placeholder="Ex: FS"
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="business_sector">Secteur d&apos;activité</Label>
                      <Input
                        id="business_sector"
                        name="business_sector"
                        value={entityDetails?.business_sector || ""}
                        onChange={handleChange}
                        placeholder="Ex: Technologies de l'Information et de la Communication"
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input
                        id="address"
                        name="address"
                        value={entityDetails?.address || ""}
                        onChange={handleChange}
                        placeholder="Siège social, ville, pays"
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tax_id">Numéro d&apos;identifiant fiscal (NIF)</Label>
                      <Input
                        id="tax_id"
                        name="tax_id"
                        value={entityDetails?.tax_id || ""}
                        onChange={handleChange}
                        placeholder="NIF"
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="commercial_register">Numéro du Registre de Commerce (RCCM)</Label>
                      <Input
                        id="commercial_register"
                        name="commercial_register"
                        value={entityDetails?.commercial_register || ""}
                        onChange={handleChange}
                        placeholder="RCCM..."
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="total_staff">Effectif Total</Label>
                      <Input
                        id="total_staff"
                        name="total_staff"
                        type="number"
                        value={entityDetails?.total_staff || ""}
                        onChange={handleChange}
                        placeholder="Ex: 10"
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cybersecurity_experts">Nombre d&apos;experts en cybersécurité</Label>
                      <Input
                        id="cybersecurity_experts"
                        name="cybersecurity_experts"
                        type="number"
                        value={entityDetails?.cybersecurity_experts || ""}
                        onChange={handleChange}
                        placeholder="Ex: 3"
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={entityDetails?.phone || ""}
                        onChange={handleChange}
                        placeholder="+224 XX XX XX XX"
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="mobile">Téléphone mobile</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={entityDetails?.mobile || ""}
                        onChange={handleChange}
                        placeholder="+224 XX XX XX XX"
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email de l&apos;entreprise</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={entityDetails?.email || ""}
                        onChange={handleChange}
                        placeholder="contact@example.com"
                        disabled={!canEditEntity()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Site web</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={entityDetails?.website || ""}
                        onChange={handleChange}
                        placeholder="https://www.example.com"
                        disabled={!canEditEntity()}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" disabled={isSubmitting || !canEditEntity()}>
                    {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </TabsContent>
        {!isPersonalEntity && (
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents de l&apos;entreprise</CardTitle>
                <CardDescription>
                  {canEditEntity()
                    ? "Gérez les documents administratifs et légaux de votre structure."
                    : "Les documents sont en lecture seule car votre structure est en cours de validation."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entityDetails?.slug ? (
                  <DocumentManager 
                    entity={entityDetails as Entity}
                    initialDocuments={documents}
                    onDocumentsUpdate={() => fetchDetailsAndDocuments(entityDetails.slug!)}
                    canEdit={canEditEntity()}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Veuillez d&apos;abord enregistrer les informations générales de la structure pour gérer les documents.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      
      {/* Modal de confirmation pour la soumission */}
      <SubmitEntityConfirmationDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmitForReview}
        isLoading={isSubmittingForReview}
        entityName={entityDetails?.name || activeEntity?.name || "cette structure"}
      />
    </div>
  );
}