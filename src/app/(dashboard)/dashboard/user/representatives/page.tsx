"use client";

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
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import apiClient from "@/lib/apiClient";
import { Representative, Entity } from "@/types/api";
import { AddEditRepresentativeDialog } from "./_components/AddEditRepresentativeDialog";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "./_components/DeleteConfirmationDialog";

export default function RepresentativesPage() {
  const { data: session } = useSession();
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [userEntity, setUserEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState<Representative | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const fetchRepresentatives = async (entitySlug: string) => {
     if (!session?.accessToken) return;
     try {
        const response = await apiClient.get(API.representatives.list(entitySlug));
        setRepresentatives(response.data.results || []);
     } catch (error) {
        // console.error("Error fetching representatives:", error);
        toast.error("Erreur lors de la récupération des représentants.");
     }
  }

  useEffect(() => {
    const fetchPrerequisites = async () => {
      if (session?.accessToken) {
        setIsLoading(true);
        try {
          const entityResponse = await apiClient.get(API.entities.list());
          
          if (entityResponse.data.results && entityResponse.data.results.length > 0) {
            const entity = entityResponse.data.results[0];
            setUserEntity(entity);
            await fetchRepresentatives(entity.slug);
          }
        } catch (error) {
          // console.error("Error fetching data:", error);
          // Handle error (e.g., show toast)
          toast.error("Erreur lors de la récupération des représentants.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (session) {
      fetchPrerequisites();
    }
  }, [session]);

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
    if (!userEntity?.slug || !selectedRepresentative?.slug) return;

    try {
        await apiClient.delete(API.representatives.delete(userEntity.slug, selectedRepresentative.slug));
        toast.success("Le représentant a été supprimé avec succès.");
        fetchRepresentatives(userEntity.slug);
    } catch (error) {
        toast.error("Erreur lors de la suppression du représentant.");
    } finally {
        setIsDeleteAlertOpen(false);
        setSelectedRepresentative(null);
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedRepresentative(null);
    if(userEntity?.slug) {
        fetchRepresentatives(userEntity.slug);
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>; // Replace with a skeleton loader
  }
  
  if (!userEntity) {
     return (
      <div className="space-y-6 text-center">
         <Card>
            <CardHeader>
                <CardTitle>Veuillez d'abord créer votre structure</CardTitle>
                <CardDescription>
                Vous devez enregistrer votre entreprise avant de pouvoir y ajouter des représentants.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Link href="/dashboard/user/structure">
                    <Button>Aller à la page Ma Structure</Button>
                </Link>
            </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Mes Représentants</h1>
          <p className="text-muted-foreground">
            Gérez les représentants légaux de votre organisation.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un représentant
        </Button>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Liste des représentants</CardTitle>
            <CardDescription>
                Voici la liste des personnes habilitées à représenter votre structure.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
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
                        representatives.map((rep) => (
                            <TableRow key={rep.slug}>
                                <TableCell className="font-medium">{rep.first_name} {rep.last_name}</TableCell>
                                <TableCell>{rep.job_title}</TableCell>
                                <TableCell>{rep.email}</TableCell>
                                <TableCell>{rep.mobile || rep.phone}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(rep)}>Modifier</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(rep)} className="text-red-600">
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Aucun représentant trouvé.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <AddEditRepresentativeDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSuccess}
        entity={userEntity}
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
