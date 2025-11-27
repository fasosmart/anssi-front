"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import apiClient from "@/lib/apiClient";
import { Entity, Representative } from "@/types/api";
import { AddEditRepresentativeDialog } from "./_components/AddEditRepresentativeDialog";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "./_components/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEntity } from "@/contexts/EntityContext";

export default function RepresentativesPage() {
  const { activeEntity, isLoading: isEntityLoading } = useEntity();
  const isPersonalEntity = activeEntity?.entity_type === "personal";
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchRepresentatives = async (entitySlug: string) => {
     setIsLoading(true);
     try {
        const response = await apiClient.get(API.representatives.list(entitySlug));
        setRepresentatives(response.data.results || []);
     } catch {
        toast.error("Erreur lors de la récupération des représentants.");
     } finally {
        setIsLoading(false);
     }
  }

  useEffect(() => {
    if (!isEntityLoading) {
      if (activeEntity?.slug) {
        fetchRepresentatives(activeEntity.slug);
      } else {
        setIsLoading(false);
      }
    }
  }, [activeEntity, isEntityLoading]);

  const handleAdd = () => {
    setSelectedRepresentative(null);
    setIsDialogOpen(true);
  }

  const handleEdit = (representative: Representative) => {
    setSelectedRepresentative(representative);
    setIsDialogOpen(true);
  }

  const handleDelete = (representative: Representative) => {
    setSelectedRepresentative(representative);
    setIsDeleteAlertOpen(true);
  }

  const confirmDelete = async () => {
    if (!activeEntity?.slug || !selectedRepresentative?.slug) return;

    try {
        await apiClient.delete(API.representatives.delete(activeEntity.slug, selectedRepresentative.slug));
        toast.success("Le représentant a été supprimé avec succès.");
        fetchRepresentatives(activeEntity.slug);
    } catch {
        toast.error("Erreur lors de la suppression du représentant.");
    } finally {
        setIsDeleteAlertOpen(false);
        setSelectedRepresentative(null);
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedRepresentative(null);
    if(activeEntity?.slug) {
        fetchRepresentatives(activeEntity.slug);
    }
  }

  const handleRowClick = (rep: Representative) => {
    router.push(`/dashboard/user/representatives/${rep.slug}`);
  }

  if (isLoading || isEntityLoading) {
    return <div>Chargement des représentants...</div>; // Replace with a skeleton loader
  }
  
  if (!activeEntity) {
     return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucune structure sélectionnée</CardTitle>
                <CardDescription>
                    Veuillez sélectionner une structure pour voir ses représentants.
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

  const RepresentativeRow = ({rep, index}: {rep: Representative, index: number}) => (
    <TableRow key={rep.slug} onClick={() => handleRowClick(rep)} className="cursor-pointer">
        {!isPersonalEntity && (
          <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox aria-label={`Select row ${index + 1}`} />
          </TableCell>
        )}
        <TableCell>{index + 1}</TableCell>
        <TableCell className="font-medium">{rep.first_name} {rep.last_name}</TableCell>
        <TableCell>{rep.job_title}</TableCell>
        <TableCell>{rep.email}</TableCell>
        <TableCell>{rep.mobile || rep.phone}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(rep)}>Modifier les informations</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/user/representatives/${rep.slug}`}>
                                Gérer le cursus
                            </Link>
                        </DropdownMenuItem>
                        {!isPersonalEntity && (
                          <DropdownMenuItem onClick={() => handleDelete(rep)} className="text-red-600">
                              Supprimer
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
  );

  const RepresentativeCard = ({rep, index}: {rep: Representative, index: number}) => (
    <Card key={rep.slug} className="mb-4">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="font-bold text-lg">{rep.first_name} {rep.last_name}</div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleRowClick(rep)}>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleEdit(rep)}>Modifier</DropdownMenuItem>
                        {!isPersonalEntity && (
                          <DropdownMenuItem onClick={() => handleDelete(rep)} className="text-red-600">
                              Supprimer
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <CardDescription>{rep.job_title}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2" onClick={() => handleRowClick(rep)}>
            <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Email:</span>
                <span>{rep.email}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Téléphone:</span>
                <span>{rep.mobile || rep.phone}</span>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Mes Représentants</h1>
            <p className="text-muted-foreground">
              Gérez les représentants pour la structure : <span className="font-semibold text-primary">{activeEntity.name}</span>
            </p>
          </div>
          {!isPersonalEntity ? (
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un représentant
            </Button>
          ) : (
            <div className="rounded-lg border border-muted-foreground/60 px-4 py-2 text-sm text-muted-foreground">
              Vous êtes votre propre représentant ; seules les modifications de votre profil sont possibles.
            </div>
          )}
        </div>
        {isPersonalEntity && (
          <Alert variant="default">
            <AlertTitle>Auto-représentation</AlertTitle>
            <AlertDescription>
              Il n&apos;est pas possible d&apos;ajouter ou de supprimer d&apos;autres représentants. Utilisez les actions
              “Modifier les informations” et “Gérer le cursus”.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Liste des représentants</CardTitle>
            <CardDescription>
                Voici la liste des personnes habilitées à représenter votre structure.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isMobile ? (
                 <div className="space-y-4">
                    {representatives.length > 0 ? (
                        representatives.map((rep, index) => (
                           <RepresentativeCard key={rep.slug} rep={rep} index={index} />
                        ))
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            Aucun représentant trouvé.
                        </div>
                    )}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        {!isPersonalEntity && (
                            <TableHead className="w-[40px]">
                                <Checkbox aria-label="Select all" />
                            </TableHead>
                        )}
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Nom complet</TableHead>
                            <TableHead>Fonction</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {representatives.length > 0 ? (
                            representatives.map((rep, index) => (
                                <RepresentativeRow key={rep.slug} rep={rep} index={index} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Aucun représentant trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>

      <AddEditRepresentativeDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSuccess}
        entity={activeEntity as Entity}
        representative={selectedRepresentative}
      />

      <DeleteConfirmationDialog 
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={confirmDelete}
        itemName={`${selectedRepresentative?.first_name} ${selectedRepresentative?.last_name}`}
      />
    </div>
  );
}
