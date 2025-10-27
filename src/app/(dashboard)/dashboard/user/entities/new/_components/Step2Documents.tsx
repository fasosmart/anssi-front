"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { UploadCloud, File as FileIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { DocumentType } from "@/types/api";

interface DocumentWithType {
  file: File;
  documentType: DocumentType;
  id: string;
}

interface Step2Props {
  entitySlug: string | null;
  updateDocuments: (documents: DocumentWithType[]) => void;
  initialDocuments?: DocumentWithType[];
}

export const Step2Documents: React.FC<Step2Props> = ({ entitySlug, updateDocuments, initialDocuments = [] }) => {
  const [documents, setDocuments] = useState<DocumentWithType[]>(initialDocuments);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { documentTypes, isLoading: isLoadingTypes, error: typesError } = useDocumentTypes();

  // Restaurer les documents existants quand le composant se monte
  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCurrentFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const addDocument = () => {
    if (currentFile && selectedDocumentType) {
      const documentType = documentTypes.find(dt => dt.slug === selectedDocumentType);
      if (documentType) {
        const newDocument: DocumentWithType = {
          file: currentFile,
          documentType,
          id: Math.random().toString(36).substr(2, 9)
        };
        const newDocuments = [...documents, newDocument];
        setDocuments(newDocuments);
        updateDocuments(newDocuments);
        setCurrentFile(null);
        setSelectedDocumentType("");
      }
    }
  };

  const removeDocument = (documentId: string) => {
    const newDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(newDocuments);
    updateDocuments(newDocuments);
  };
  
  if (entitySlug) {
      return (
        <Alert>
          <AlertTitle>Documents déjà soumis</AlertTitle>
          <AlertDescription>
            Les documents pour cette structure ont déjà été soumis. Vous pouvez les gérer depuis la page de la structure.
          </AlertDescription>
        </Alert>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents de l&apos;entreprise</CardTitle>
        <CardDescription>
          Ajoutez les documents administratifs et légaux requis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection du type de document */}
        <div className="space-y-2">
          <Label htmlFor="document-type">Type de document</Label>
          {isLoadingTypes ? (
            <div className="text-sm text-muted-foreground">Chargement des types de documents...</div>
          ) : typesError ? (
            <div className="text-sm text-destructive">{typesError}</div>
          ) : (
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de document" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes
                  .filter(dt => dt.status === 'ON')
                  .map((docType) => (
                    <SelectItem key={docType.slug} value={docType.slug}>
                      {docType.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Upload de fichier */}
        <div className="space-y-2">
          <Label>Fichier</Label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="h-10 w-10" />
              {isDragActive ? (
                <p>Déposez le fichier ici...</p>
              ) : (
                <p>Glissez-déposez un fichier ici, ou cliquez pour sélectionner</p>
              )}
              <p className="text-xs">PDF, PNG, JPG</p>
            </div>
          </div>
          {currentFile && (
            <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{currentFile.name}</span>
                <span className="text-xs text-muted-foreground">({(currentFile.size / 1024).toFixed(2)} KB)</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCurrentFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bouton d'ajout */}
        <Button 
          onClick={addDocument} 
          disabled={!currentFile || !selectedDocumentType}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter le document
        </Button>

        {/* Liste des documents ajoutés */}
        {documents.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Documents ajoutés :</h4>
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-sm font-medium">{doc.documentType.name}</span>
                      <span className="text-xs text-muted-foreground block">{doc.file.name}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDocument(doc.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
