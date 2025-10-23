"use client";

import React from "react";
import { Entity } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { File as FileIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DocumentWithType {
  file: File;
  documentType: {
    slug: string;
    name: string;
    description?: string | null;
    status: 'ON' | 'OFF';
  };
  id: string;
}

interface Step3Props {
  entityData: Partial<Entity>;
  documentsData: DocumentWithType[];
}

const ReviewItem = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div>
        <p className="font-medium text-sm text-muted-foreground">{label}</p>
        <p className="text-base">{value || "Non spécifié"}</p>
    </div>
);

export const Step3Review: React.FC<Step3Props> = ({ entityData, documentsData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations sur la structure</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
            <ReviewItem label="Nom / Raison Sociale" value={entityData.name} />
            <ReviewItem label="Sigle" value={entityData.acronym} />
            <ReviewItem label="Secteur d'activité" value={entityData.business_sector} />
            <ReviewItem label="Identifiant fiscal (IFU)" value={entityData.tax_id} />
            <ReviewItem label="Registre de Commerce (RCCM)" value={entityData.commercial_register} />
            <ReviewItem label="Effectif Total" value={entityData.total_staff} />
            <ReviewItem label="Experts en cybersécurité" value={entityData.cybersecurity_experts} />
            <ReviewItem label="Email" value={entityData.email} />
            <ReviewItem label="Téléphone" value={entityData.phone} />
            <ReviewItem label="Site Web" value={entityData.website} />
            <ReviewItem label="Adresse" value={entityData.address} />
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Documents à soumettre</CardTitle>
        </CardHeader>
        <CardContent>
          {documentsData.length > 0 ? (
            <ul className="space-y-2">
              {documentsData.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 p-2 rounded-md border">
                  <FileIcon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{doc.documentType.name}</span>
                    <span className="text-xs text-muted-foreground block">{doc.file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({(doc.file.size / 1024).toFixed(2)} KB)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">Aucun document n&apos;a été ajouté.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
