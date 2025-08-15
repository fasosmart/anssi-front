import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

// Mock data, this will come from an API later
const dossiers = [
  {
    id: "DOS-001",
    type: "Accréditation de service",
    submittedAt: "2024-07-15",
    status: "En attente",
  },
  {
    id: "DOS-002",
    type: "Homologation de site web",
    submittedAt: "2024-06-28",
    status: "Approuvé",
  },
  {
    id: "DOS-003",
    type: "Accréditation de compétence",
    submittedAt: "2024-05-10",
    status: "Rejeté",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  "Approuvé": "default",
  "En attente": "secondary",
  "Rejeté": "destructive",
};


export default function DossiersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Dossiers</h1>
          <p className="text-muted-foreground">
            Suivez l&apos;état de vos demandes d&apos;accréditation.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/user/dossiers/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Nouveau dossier
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
              {dossiers.map((dossier) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}