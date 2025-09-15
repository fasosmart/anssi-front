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
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Step2Props {
  entitySlug: string | null;
  updateDocuments: (files: File[]) => void;
}

export const Step2Documents: React.FC<Step2Props> = ({ entitySlug, updateDocuments }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    updateDocuments(newFiles);
  }, [files, updateDocuments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    updateDocuments(newFiles);
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
        <CardTitle>Documents de l'entreprise</CardTitle>
        <CardDescription>
          Ajoutez les documents administratifs et légaux requis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-10 w-10" />
            {isDragActive ? (
              <p>Déposez les fichiers ici...</p>
            ) : (
              <p>Glissez-déposez des fichiers ici, ou cliquez pour sélectionner</p>
            )}
            <p className="text-xs">PDF, PNG, JPG</p>
          </div>
        </div>

        {files.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Fichiers en attente :</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
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
