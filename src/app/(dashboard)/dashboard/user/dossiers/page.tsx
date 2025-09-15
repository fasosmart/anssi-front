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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { useEntity } from "@/contexts/EntityContext";
import { useState, useEffect } from "react";
import { Dossier } from "@/types/api";
// Mock data, this will come from an API later
const dossiers: Dossier[] = [
  // {
  //   id: "DOS-001",
  //   type: "Accréditation de service",
  //   submittedAt: "2024-07-15",
  //   status: "En attente",
  // },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Approuvé": "default",
  "En attente": "secondary",
  "Rejeté": "destructive",
};


export default function DossiersPage() {
    const { activeEntity, isLoading: isEntityLoading } = useEntity();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isEntityLoading) {
            if (activeEntity) {
                // TODO: Fetch dossiers for the active entity
                console.log("Fetching dossiers for", activeEntity.slug);
            }
            setIsLoading(false);
        }
    }, [activeEntity, isEntityLoading]);

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
                <TableHead>Numéro de dossier</TableHead>
                <TableHead>Type de demande</TableHead>
                <TableHead>Date de soumission</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.length > 0 ? dossiers.map((dossier) => (
                <TableRow key={dossier.id}>
                  <TableCell className="font-medium">{dossier.id}</TableCell>
                  <TableCell>{dossier.type}</TableCell>
                  <TableCell>{dossier.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[dossier.status] || "secondary"}>
                      {dossier.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        Aucune demande trouvée pour cette structure.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}