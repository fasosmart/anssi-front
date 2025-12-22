"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UploadCloud, File as FileIcon, X, Plus, CheckCircle2 } from "lucide-react";
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

export const Step2Documents: React.FC<Step2Props> = ({ 
  entitySlug, 
  updateDocuments, 
  initialDocuments = [] 
}) => {
  const [documents, setDocuments] = useState<DocumentWithType[]>(initialDocuments);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { documentTypes, isLoading: isLoadingTypes, error: typesError } = useDocumentTypes();

  // Synchroniser les documents initiaux quand le composant se monte ou quand ils changent
  useEffect(() => {
    if (initialDocuments.length > 0 && documents.length === 0) {
      setDocuments(initialDocuments);
    }
  }, [initialDocuments, documents.length]);

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

  // Message informatif si l'entité n'est pas encore créée
  if (!entitySlug) {
    return (
      <Alert>
        <AlertTitle>Structure non créée</AlertTitle>
        <AlertDescription>
          Veuillez d&apos;abord compléter et valider les informations de la structure à l&apos;étape précédente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicateur de structure créée */}
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-700">Structure créée avec succès</AlertTitle>
        <AlertDescription className="text-green-600">
          Vous pouvez maintenant ajouter les documents administratifs et légaux requis.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Documents de la structure</CardTitle>
          <CardDescription>
            Ajoutez les documents administratifs et légaux requis pour votre structure.
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
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/50"}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="h-10 w-10" />
                {isDragActive ? (
                  <p>Déposez le fichier ici...</p>
                ) : (
                  <p>Glissez-déposez un fichier ici, ou cliquez pour sélectionner</p>
                )}
                <p className="text-xs">PDF, PNG, JPG (max 10 Mo)</p>
              </div>
            </div>
            {currentFile && (
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-primary" />
                  <div>
                    <span className="text-sm font-medium">{currentFile.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({(currentFile.size / 1024).toFixed(2)} Ko)
                    </span>
                  </div>
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
            variant="secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter à la liste
          </Button>

          {/* Liste des documents ajoutés */}
          {documents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Documents à soumettre ({documents.length})
              </h4>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{doc.documentType.name}</span>
                        <span className="text-xs text-muted-foreground">{doc.file.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {(doc.file.size / 1024).toFixed(0)} Ko
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeDocument(doc.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Message si aucun document */}
          {documents.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucun document ajouté. Vous pouvez passer cette étape si vous n&apos;avez pas de documents à fournir pour le moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
