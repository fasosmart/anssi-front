"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  CheckCircle, 
  XCircle, 
  Clock, 
  Building,
  User,
  Calendar,
  Download,
  Eye,
  Edit,
  MessageSquare,
  AlertTriangle,
  FileText,
  Users,
  Shield,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import Link from "next/link";
import { use as usePromise, useEffect, useMemo, useState } from "react";
import { AdminAPI } from "@/lib/api";
import { EntityDetail, EntityDetailAdmin, EntityStatus, RepresentativeList, AccreditationList, Document } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from "axios";

// Les données sont maintenant récupérées depuis l'API via EntityDetailAdmin

const statusConfig: Record<EntityStatus, { label: string; color: string; textColor: string }> = {
  new: { label: "Nouvelle", color: "bg-blue-500", textColor: "text-blue-700" },
  submitted: { label: "Soumise", color: "bg-yellow-500", textColor: "text-yellow-700" },
  under_review: { label: "En cours de validation", color: "bg-orange-500", textColor: "text-orange-700" },
  validated: { label: "Validée", color: "bg-green-500", textColor: "text-green-700" },
  blocked: { label: "Bloquée", color: "bg-red-500", textColor: "text-red-700" },
  declined: { label: "Réjetée", color: "bg-gray-500", textColor: "text-gray-700" },
};

const accreditationStatusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500" },
  pending: { label: "En attente", color: "bg-orange-500" },
  under_review: { label: "En révision", color: "bg-blue-500" },
  approved: { label: "Approuvée", color: "bg-green-500" },
  rejected: { label: "Rejetée", color: "bg-red-500" }
};

interface PageProps { params: Promise<{ slug: string }> }

export default function EntityDetailPage({ params }: PageProps) {
  const { slug } = usePromise(params);
  const [entity, setEntity] = useState<EntityDetailAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | "under_review" | "validated" | "blocked" | "unblock">(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminAPI.getEntity(slug);
      setEntity(data as EntityDetailAdmin);
    } catch (e) {
      setError("Impossible de charger les détails de l&apos;entité");
      toast.error("Échec du chargement des détails de l&apos;entité");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchEntity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await AdminAPI.getEntity(slug);
        if (!isMounted) return;
        setEntity(data as EntityDetailAdmin);
      } catch (e) {
        if (!isMounted) return;
        setError("Impossible de charger les détails de l&apos;entité");
        toast.error("Échec du chargement des détails de l&apos;entité");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchEntity();
    return () => { isMounted = false; };
  }, [slug]);

  const statusConfig_item = useMemo(() => {
    if (!entity) return null;
    return statusConfig[entity.status];
  }, [entity]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[260px]" />
              <Skeleton className="h-4 w-[240px]" />
            </div>
          </div>
        </div>

        {/* Statut et actions Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets Skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Contenu onglet "Vue d'ensemble" Skeleton */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin/entities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {entity?.name}
            </h1>
            <div className="text-muted-foreground">
              {entity?.acronym} • {entity?.business_sector}
            </div>
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div> */}
      </div>

      {/* Statut et actions rapides */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : statusConfig_item ? (
              <Badge 
                variant="secondary" 
                className={`${statusConfig_item.color} ${statusConfig_item.textColor} border-0 text-white`}
              >
                {statusConfig_item.label}
              </Badge>
              ) : null}
              <div className="text-sm text-muted-foreground">
                {isLoading ? <Skeleton className="h-4 w-40" /> : entity?.created_at ? (
                  <>Créée le {new Date(entity.created_at).toLocaleDateString('fr-FR')}</>
                ) : null}
              </div>
            </div>
            <div className="flex gap-2">
              {/* Statut blocked : Débloquer en premier (action unique) */}
              {!isLoading && entity?.status === "blocked" && (
                <Button disabled={isActing} onClick={() => setConfirmAction("unblock")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Débloquer
                </Button>
              )}
              
              {/* Statuts new / submitted : Valider, Mettre en révision, Rejeter */}
              {!isLoading && entity?.status && (entity.status === "new" || entity.status === "submitted") && (
                <>
                  <Button disabled={isActing} onClick={() => setConfirmAction("validated")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                  <Button variant="outline" disabled={isActing} onClick={() => setConfirmAction("under_review")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Mettre en révision
                  </Button>
                  <Button variant="outline" className="text-red-600" disabled={isActing} onClick={() => setRejectOpen(true)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </>
              )}
              
              {/* Statut under_review : Valider, Rejeter, Bloquer */}
              {!isLoading && entity?.status === "under_review" && (
                <>
                  <Button disabled={isActing} onClick={() => setConfirmAction("validated")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                  <Button variant="outline" className="text-red-600" disabled={isActing} onClick={() => setRejectOpen(true)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button variant="outline" className="text-red-600" disabled={isActing} onClick={() => setConfirmAction("blocked")}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Bloquer
                  </Button>
                </>
              )}
              
              {/* Statut validated : Bloquer uniquement */}
              {!isLoading && entity?.status === "validated" && (
                <Button variant="outline" className="text-red-600" disabled={isActing} onClick={() => setConfirmAction("blocked")}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Bloquer
                </Button>
              )}
              
              {/* Statut declined : Mettre en révision, Valider */}
              {!isLoading && entity?.status === "declined" && (
                <>
                  <Button disabled={isActing} onClick={() => setConfirmAction("validated")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                  <Button variant="outline" disabled={isActing} onClick={() => setConfirmAction("under_review")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Mettre en révision
                </Button>
                </>
              )}
            </div>
          </div>
          {/* Afficher la raison du rejet si applicable */}
          {!isLoading && entity?.status === "declined" && entity?.rejection_reason && (
            <div className="mt-4 text-sm text-red-700">
              Raison du refus: {entity.rejection_reason}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {!isLoading && entity?.documents && entity.documents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {entity.documents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="representatives">
            Représentants
            {!isLoading && entity?.representatives && entity.representatives.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {entity.representatives.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accreditations">
            Accréditations
            {!isLoading && entity?.accreditations && entity.accreditations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {entity.accreditations.length}
              </Badge>
            )}
          </TabsTrigger>
          {/* <TabsTrigger value="history">Historique</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Informations générales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-sm">{isLoading ? "…" : entity?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Acronyme</label>
                  <p className="text-sm">{isLoading ? "…" : entity?.acronym}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d&apos;activité</label>
                  <p className="text-sm">{isLoading ? "…" : entity?.business_sector}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type d&apos;entité</label>
                  <p className="text-sm">
                    {isLoading ? "…" : entity?.entity_type === "business" ? "Entreprise" : 
                     entity?.entity_type === "personal" ? "Personne physique" : "ONG"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Identifiant fiscal</label>
                  <p className="text-sm">{isLoading ? "…" : entity?.tax_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registre du commerce</label>
                  <p className="text-sm">{isLoading ? "…" : entity?.commercial_register}</p>
                </div>
              </CardContent>
            </Card>

            {/* Effectif et ressources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Effectif et ressources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Effectif total</label>
                  <p className="text-sm">{isLoading ? "…" : (entity?.total_staff ?? 0)} employés</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experts cybersécurité</label>
                  <p className="text-sm">{isLoading ? "…" : (entity?.cybersecurity_experts ?? 0)} experts</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pourcentage d&apos;experts</label>
                  <p className="text-sm">
                    {isLoading ? "…" : (() => {
                      const experts = entity?.cybersecurity_experts ?? 0;
                      const total = entity?.total_staff ?? 0;
                      if (!total) return "0%";
                      return `${Math.round((experts / total) * 100)}%`;
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact et localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact et localisation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                    <p className="text-sm">{isLoading ? "…" : entity?.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p className="text-sm">{isLoading ? "…" : entity?.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                    <p className="text-sm">{isLoading ? "…" : entity?.mobile}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{isLoading ? "…" : entity?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Site web</label>
                    <p className="text-sm">{isLoading ? "…" : entity?.website}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="representatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Représentants de l&apos;entité</CardTitle>
              <CardDescription>
                Liste des représentants légaux et techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : entity?.representatives && entity.representatives.length > 0 ? (
              <div className="space-y-4">
                  {entity.representatives.map((rep) => (
                  <div key={rep.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{rep.first_name} {rep.last_name}</p>
                        <p className="text-sm text-muted-foreground">{rep.job_title}</p>
                          {rep.email && (
                        <p className="text-sm text-muted-foreground">{rep.email}</p>
                          )}
                          {rep.phone && (
                            <p className="text-sm text-muted-foreground">{rep.phone}</p>
                          )}
                        </div>
                      </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/entities/${entity?.slug}/representatives/${rep.slug}`}>
                        <Eye className="h-4 w-4" />
                            </Link>
                      </Button>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun représentant trouvé pour cette entité</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accreditations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accréditations de l&apos;entité</CardTitle>
              <CardDescription>
                Historique des demandes d&apos;accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : entity?.accreditations && entity.accreditations.length > 0 ? (
              <div className="space-y-4">
                  {entity.accreditations.map((acc) => {
                    const statusKey = acc.status as keyof typeof accreditationStatusConfig;
                    const statusInfo = accreditationStatusConfig[statusKey] || { label: acc.status, color: "bg-gray-500" };
                    return (
                  <div key={acc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{acc.type_accreditation}</p>
                            {acc.submission_date && (
                        <p className="text-sm text-muted-foreground">
                          Soumise le {new Date(acc.submission_date).toLocaleDateString('fr-FR')}
                        </p>
                            )}
                            {acc.approval_date && (
                              <p className="text-sm text-muted-foreground">
                                Approuvée le {new Date(acc.approval_date).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                            {acc.rejection_date && (
                              <p className="text-sm text-red-600">
                                Rejetée le {new Date(acc.rejection_date).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                            className={`${statusInfo.color} text-white border-0`}
                      >
                            {statusInfo.label}
                      </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/entities/${entity?.slug}/accreditations/${acc.slug}`}>
                        <Eye className="h-4 w-4" />
                            </Link>
                      </Button>
                    </div>
                  </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune accréditation trouvée pour cette entité</p>
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents de l&apos;entité</CardTitle>
              <CardDescription>
                Pièces justificatives et documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : entity?.documents && entity.documents.length > 0 ? (
              <div className="space-y-4">
                  {entity.documents.map((doc) => (
                  <div key={doc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Émis le {new Date(doc.issued_at).toLocaleDateString('fr-FR')}
                          </p>
                          {doc.expires_at && (
                            <p className="text-sm text-muted-foreground">
                              Expire le {new Date(doc.expires_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          {doc.created_at && (
                            <p className="text-xs text-muted-foreground">
                              Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {typeof doc.file === 'string' && (
                          <>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.file} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                              </a>
                      </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.file} download>
                        <Download className="h-4 w-4" />
                              </a>
                      </Button>
                          </>
                        )}
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun document trouvé pour cette entité</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>
                Chronologie des événements pour cette entité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Historique des actions à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Confirm generic actions */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l&apos;action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "under_review" && "Mettre cette entité en révision ?"}
              {confirmAction === "validated" && "Valider définitivement cette entité ?"}
              {confirmAction === "blocked" && "Bloquer cette entité ? Elle ne pourra plus effectuer d&apos;actions."}
              {confirmAction === "unblock" && "Débloquer cette entité ? Elle pourra à nouveau effectuer des actions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActing}>Annuler</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={async () => {
                if (!entity) return;
                setIsActing(true);
                try {
                  const eslug = entity.slug as string;
                  if (confirmAction === "under_review") await AdminAPI.setUnderReview(eslug);
                  if (confirmAction === "validated") await AdminAPI.setValidated(eslug);
                  if (confirmAction === "blocked") await AdminAPI.setBlocked(eslug);
                  if (confirmAction === "unblock") await AdminAPI.unblock(eslug);
                  toast.success("Statut mis à jour");
                  await refetch();
                } catch (e: unknown) {
                  const err = e as AxiosError<{ detail?: string; message?: string }>;
                
                  const message =
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.message ||
                    "Erreur inconnue";
                
                  toast.error(`Échec de la mise à jour du statut: ${message}`);
                }
                finally {
                  setIsActing(false);
                  setConfirmAction(null);
                }
              }} disabled={isActing}>
                Confirmer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject with reason */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l&apos;entité</DialogTitle>
            <DialogDescription>Indiquez la raison du rejet. Elle sera visible par l&apos;entité.</DialogDescription>
          </DialogHeader>
          <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Motif de rejet" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={isActing}>Annuler</Button>
            <Button onClick={async () => {
              if (!entity) return;
              if (!rejectReason || rejectReason.trim().length < 5) { toast.warning("Veuillez renseigner un motif (min 5 caractères)"); return; }
              setIsActing(true);
              try {
                await AdminAPI.setDeclined(entity.slug as string, rejectReason.trim());
                toast.success("Entité rejetée");
                setRejectOpen(false);
                setRejectReason("");
                await refetch();
              } catch (e) {
                toast.error("Échec du rejet de l&apos;entité");
              } finally {
                setIsActing(false);
              }
            }} disabled={isActing}>
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
