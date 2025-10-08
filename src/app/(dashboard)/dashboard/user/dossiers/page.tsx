"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilePlus2, MoreHorizontal } from "lucide-react";
import { useEntity } from "@/contexts/EntityContext";
import { useState, useEffect } from "react";
import { Dossier } from "@/types/api"; // This type might need adjustment
import apiClient, { getDemands, deleteDemand, makeDemandDraft, submitDemand } from "@/lib/apiClient";
import { toast } from "sonner";
import { DeleteDemandDialog } from "./_components/DeleteDemandDialog";

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


export default function DossiersPage() {
    const { activeEntity, isLoading: isEntityLoading } = useEntity();
    const [isLoading, setIsLoading] = useState(true);
    const [dossiers, setDossiers] = useState<any[]>([]); // Using any for now
    const [demandToDelete, setDemandToDelete] = useState<string | null>(null);

    const fetchDossiers = async (entitySlug: string) => {
      if (entitySlug) {
        setIsLoading(true);
        try {
          const response = await getDemands(entitySlug);
          setDossiers(response.results);
        } catch (error) {
          toast.error("Impossible de charger la liste des demandes.");
          console.error("Failed to fetch demands:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    useEffect(() => {
        if (!isEntityLoading) {
            if (activeEntity && typeof activeEntity.slug === "string") { 
              // on s'assure que le slug n'est jamais undefined pour éviter l'erreur de typage
              fetchDossiers(activeEntity.slug);
            } else {
              setIsLoading(false);
            }
        }
    }, [activeEntity, isEntityLoading]);

    const openDeleteDialog = (slug: string) => {
      setDemandToDelete(slug);
    };

    const confirmDelete = async () => {
      if (!activeEntity?.slug || !demandToDelete) return;
      try {
        await deleteDemand(activeEntity.slug, demandToDelete);
        toast.success("Le brouillon a été supprimé avec succès.");
        fetchDossiers(activeEntity.slug);
      } catch (error) {
        toast.error("Impossible de supprimer le brouillon.");
        console.error("Failed to delete demand:", error);
      } finally {
        setDemandToDelete(null);
      }
    };
    
    const handleSubmit = async (slug: string) => {
      if (!activeEntity?.slug) return;
      try {
        await submitDemand(activeEntity.slug, slug);
        toast.success("La demande d'accréditation a été soumise avec succès.");
        fetchDossiers(activeEntity.slug); // Refresh the list
      } catch (error) {
        toast.error("Impossible de soumettre la demande.");
        console.error("Failed to submit demand:", error);
      }
    };

    const handleMakeDraft = async (dossier: any) => {
      if (!activeEntity?.slug) return;
      try {
        await makeDemandDraft(activeEntity.slug, dossier.slug, {
          representative: dossier.representative,
          type_accreditation: dossier.type_accreditation,
        });
        toast.success("La demande est repassée en brouillon.");
        fetchDossiers(activeEntity.slug);
      } catch (e) {
        toast.error("Impossible de remettre en brouillon.");
        console.error(e);
      }
    };

    if (isLoading || isEntityLoading) {
        return <div>Chargement des demandes...</div>
    }

    if (!activeEntity) {
        return (
           <Card className="text-center">
               <CardHeader>
                   <CardTitle>Aucune structure sélectionnée</CardTitle>
                   <CardDescription>
                       Veuillez sélectionner une structure pour voir ses demandes.
                   </CardDescription>
               </CardHeader>
               <CardFooter className="flex justify-center">
                   <Link href="/dashboard/user/entities">
                       <Button>Choisir une structure</Button>
                   </Link>
               </CardFooter>
           </Card>
       )
     }

  return (
    <>
      <DeleteDemandDialog 
        open={!!demandToDelete}
        onOpenChange={(open) => !open && setDemandToDelete(null)}
        onConfirm={confirmDelete}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mes Demandes</h1>
            <p className="text-muted-foreground">
              Suivez l&apos;état des demandes pour <span className="font-semibold text-primary">{activeEntity.name}</span>.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/user/dossiers/new">
              <FilePlus2 className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historique des demandes</CardTitle>
            <CardDescription>
              Voici la liste de toutes vos soumissions passées et actuelles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Représentant</TableHead>
                  <TableHead>Type de demande</TableHead>
                  <TableHead>Date de soumission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dossiers.length > 0 ? dossiers.map((dossier) => (
                  <TableRow key={dossier.slug}>
                    <TableCell className="font-medium">{dossier.representative || "N/A"}</TableCell>
                    <TableCell>{dossier.type_accreditation || "N/A"}</TableCell>
                    <TableCell>{dossier.submission_date ? new Date(dossier.submission_date).toLocaleDateString() : 'En attente'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[dossier.status] || "secondary"}>
                        {statusLabel[dossier.status] || dossier.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/user/dossiers/${dossier.slug}`}>
                              Voir les détails
                            </Link>
                          </DropdownMenuItem>
                          {dossier.status === 'draft' && (
                            <>
                              <DropdownMenuItem onClick={() => handleSubmit(dossier.slug)}>
                                Soumettre
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(dossier.slug)}>
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                          {(dossier.status === 'rejected' || dossier.status === 'submitted') && (
                            <DropdownMenuItem onClick={() => handleMakeDraft(dossier)}>
                              Remettre en brouillon
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                          Aucune demande trouvée pour cette structure.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}