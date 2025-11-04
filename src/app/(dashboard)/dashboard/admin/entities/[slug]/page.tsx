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
import { EntityDetail, EntityStatus } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Les mocks ci-dessous (représentants, accréditations, documents, historique)
// restent temporairement pour l'onglet UI;

const mockRepresentatives = [
  {
    slug: "rep-001",
    first_name: "Moussa",
    last_name: "Diallo",
    job_title: "Directeur Technique",
    email: "moussa.diallo@techcorp.gn",
    phone: "+224 123 456 789",
    status: "active"
  },
  {
    slug: "rep-002",
    first_name: "Fatoumata",
    last_name: "Bah",
    job_title: "Responsable Cybersécurité",
    email: "fatoumata.bah@techcorp.gn",
    phone: "+224 123 456 791",
    status: "active"
  }
];

const mockAccreditations = [
  {
    slug: "acc-001",
    type_accreditation: "APASSI",
    status: "approved",
    submission_date: "2024-01-15",
    approval_date: "2024-01-20"
  },
  {
    slug: "acc-002",
    type_accreditation: "APACS",
    status: "under_review",
    submission_date: "2024-01-18",
    approval_date: null
  },
  {
    slug: "acc-003",
    type_accreditation: "APDIS",
    status: "pending",
    submission_date: "2024-01-20",
    approval_date: null
  }
];

const mockDocuments = [
  {
    slug: "doc-001",
    name: "Statuts de l'entreprise",
    document_type: "Statuts",
    file: "/documents/statuts.pdf",
    issued_at: "2024-01-10",
    expires_at: null
  },
  {
    slug: "doc-002",
    name: "Carte d'identification fiscale",
    document_type: "Fiscal",
    file: "/documents/carte-fiscale.pdf",
    issued_at: "2024-01-08",
    expires_at: "2025-01-08"
  },
  {
    slug: "doc-003",
    name: "Registre du commerce",
    document_type: "Commerce",
    file: "/documents/registre-commerce.pdf",
    issued_at: "2024-01-05",
    expires_at: null
  }
];

const mockActivityHistory = [
  {
    id: 1,
    action: "Entité créée",
    user: "Moussa Diallo",
    date: "2024-01-10T10:30:00Z",
    status: "completed",
    comment: "Nouvelle entité enregistrée dans le système"
  },
  {
    id: 2,
    action: "Documents validés",
    user: "Admin ANSSI",
    date: "2024-01-12T14:20:00Z",
    status: "completed",
    comment: "Tous les documents requis ont été validés"
  },
  {
    id: 3,
    action: "Entité approuvée",
    user: "Admin ANSSI",
    date: "2024-01-15T09:15:00Z",
    status: "completed",
    comment: "Entité approuvée et activée"
  }
];

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
  const [entity, setEntity] = useState<EntityDetail | null>(null);
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
      setEntity(data as EntityDetail);
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
        setEntity(data as EntityDetail);
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
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-[260px] mb-2" />
                <Skeleton className="h-4 w-[240px] mt-2" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">
                  {entity?.name}
                </h1>
                <div className="text-muted-foreground">
                  {entity?.acronym} • {entity?.business_sector}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
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
          <TabsTrigger value="representatives">Représentants</TabsTrigger>
          <TabsTrigger value="accreditations">Accréditations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
              <div className="space-y-4">
                {mockRepresentatives.map((rep) => (
                  <div key={rep.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{rep.first_name} {rep.last_name}</p>
                        <p className="text-sm text-muted-foreground">{rep.job_title}</p>
                        <p className="text-sm text-muted-foreground">{rep.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{rep.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="accreditations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accréditations de l&apos;entité</CardTitle>
              <CardDescription>
                Historique des demandes d&apos;accréditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAccreditations.map((acc) => (
                  <div key={acc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{acc.type_accreditation}</p>
                        <p className="text-sm text-muted-foreground">
                          Soumise le {new Date(acc.submission_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`${accreditationStatusConfig[acc.status as keyof typeof accreditationStatusConfig].color} text-white border-0`}
                      >
                        {accreditationStatusConfig[acc.status as keyof typeof accreditationStatusConfig].label}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents de l&apos;entité</CardTitle>
              <CardDescription>
                Pièces justificatives et documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_type} • Émis le {new Date(doc.issued_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>
                Chronologie des événements pour cette entité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityHistory.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {item.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {item.status === "in_progress" && <Clock className="h-5 w-5 text-blue-500" />}
                      {item.status === "pending" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.action}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Par {item.user}
                      </p>
                      {item.comment && (
                        <p className="text-sm mt-1">{item.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
                } catch (e: any) {
                  const message = e?.response?.data?.detail || e?.response?.data?.message || e?.message || "Erreur inconnue";
                  toast.error(`Échec de la mise à jour du statut: ${message}`);
                } finally {
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
