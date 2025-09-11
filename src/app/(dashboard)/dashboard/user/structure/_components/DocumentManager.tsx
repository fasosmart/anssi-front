"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Document, Entity } from "@/types/api";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
// We will create these components in the next steps
import { AddEditDocumentDialog } from "./AddEditDocumentDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DocumentManagerProps {
  initialDocuments: Document[];
  entity: Entity;
  onDocumentsUpdate: () => void;
}

export function DocumentManager({ initialDocuments, entity, onDocumentsUpdate }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setIsAddEditDialogOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAdd = () => {
    setSelectedDocument(null);
    setIsAddEditDialogOpen(true);
  }

  const handleSuccess = () => {
    setIsAddEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedDocument(null);
    onDocumentsUpdate(); // Re-fetch documents from the parent
  }

  const confirmDelete = async () => {
    if (!selectedDocument || !entity.slug) return;
    try {
      await apiClient.delete(API.documents.delete(entity.slug, selectedDocument.slug!));
      toast.success("Document supprimé avec succès !");
      handleSuccess();
    } catch (error) {
      toast.error("Erreur lors de la suppression du document.");
      setIsDeleteDialogOpen(false);
    }
  };

  const DocumentRow = ({ doc }: { doc: Document }) => (
     <TableRow key={doc.slug}>
        <TableCell className="font-medium">{doc.name}</TableCell>
        <TableCell>{doc.issued_at}</TableCell>
        <TableCell>{doc.expires_at || 'N/A'}</TableCell>
        <TableCell className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => window.open(doc.file as string, '_blank')}>
                Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(doc)}>
                Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-red-600">
                Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
  );

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card key={doc.slug} className="mb-4">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{doc.name}</CardTitle>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuItem onClick={() => window.open(doc.file as string, '_blank')}>
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Délivré le:</span>
                <span>{doc.issued_at}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Expire le:</span>
                <span>{doc.expires_at || 'N/A'}</span>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>Ajouter un document</Button>
      </div>
      {isMobile ? (
        <div className="space-y-4">
            {documents.length > 0 ? (
                documents.map((doc) => <DocumentCard key={doc.slug} doc={doc} />)
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    Aucun document trouvé.
                </div>
            )}
        </div>
      ) : (
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nom du document</TableHead>
                <TableHead>Date de délivrance</TableHead>
                <TableHead>Date d&apos;expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.length > 0 ? (
                documents.map((doc) => (
                    <DocumentRow key={doc.slug} doc={doc} />
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    Aucun document trouvé.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      )}

      {isAddEditDialogOpen && (
        <AddEditDocumentDialog 
            isOpen={isAddEditDialogOpen}
            setIsOpen={setIsAddEditDialogOpen}
            onSuccess={handleSuccess}
            entity={entity}
            document={selectedDocument}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            onConfirm={confirmDelete}
            title="Supprimer le document"
            description="Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible."
        /> 
      )}
    </div>
  );
}
