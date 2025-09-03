"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DossierFormData } from "@/types/api";

type AccreditationKeys = keyof NonNullable<DossierFormData['accreditationTypes']>;
type DocumentKeys = keyof NonNullable<DossierFormData['uploadedDocuments']>;

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

const accreditationOptions: {id: AccreditationKeys, label: string}[] = [
  { id: "apacs", label: "APACS - Accompagnement et Conseil en sécurité" },
  { id: "apassi", label: "APASSI - Audit de la Sécurité des Systèmes d’Information" },
  { id: "apdis", label: "APDIS - Détection d’Incidents de Sécurité" },
  { id: "apris", label: "APRIS - Réponse aux Incidents de Sécurité" },
  { id: "apin", label: "APIN - Investigation Numérique" },
];

export const Step3AccreditationRequest: React.FC<StepProps> = ({ data, updateData }) => {
  const handleAccreditationChange = (checked: boolean, id: AccreditationKeys) => {
    const currentTypes = data.accreditationTypes || { apacs: false, apassi: false, apdis: false, apris: false, apin: false };
    updateData({
      accreditationTypes: { ...currentTypes, [id]: checked }
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = e.target.id as DocumentKeys;
    if (file) {
      const currentDocs = data.uploadedDocuments || { idCopy: null, taxIdCopy: null, tradeRegisterCopy: null };
      updateData({
        uploadedDocuments: { ...currentDocs, [id]: file }
      });
    }
  };

  const removeFile = (id: DocumentKeys) => {
     const currentDocs = data.uploadedDocuments || { idCopy: null, taxIdCopy: null, tradeRegisterCopy: null };
     updateData({
        uploadedDocuments: { ...currentDocs, [id]: null }
      });
  };

  const renderFileUpload = (id: DocumentKeys, label: string, description: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {data.uploadedDocuments?.[id] ? (
        <div className="flex items-center justify-between p-2 text-sm border rounded-md">
            <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span>{data.uploadedDocuments[id]?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeFile(id)}>
                <X className="h-4 w-4" />
            </Button>
        </div>
      ) : (
        <div className="relative">
          <label htmlFor={id} className="cursor-pointer">
            <div className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg hover:bg-muted/50">
              <div className="text-center">
                <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </label>
          <Input id={id} type="file" className="hidden" onChange={handleFileChange} />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Préciser l'accréditation sollicitée */}
      <div>
        <h3 className="text-lg font-medium mb-4">Préciser l'accréditation sollicitée (plusieurs peuvent être sollicitées)</h3>
        <div className="space-y-3">
          {accreditationOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={!!data.accreditationTypes?.[option.id]}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  handleAccreditationChange(Boolean(checked), option.id)
                }
              />
              <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      {/* Section 2: Documents Justificatifs */}
      <div>
        <h3 className="text-lg font-medium mb-4">Documents Justificatifs</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Veuillez joindre une copie de la Pièce d’Identité, le bulletin N°3 datant de moins de 3 mois, une copie de l’extrait du registre national des entreprises, le statut accompagné d’un justificatif de sa publication au journal officiel, les justificatifs de propriété ou de location du siège, le règlement intérieur, le manuel des procédures, un certificat de non faillite, l’attestation d’affiliation à la CNSS, la dernière déclaration des salaires et des salariés.
        </p>
        <div className="grid gap-6">
          {renderFileUpload("idCopy", "Pièce d’Identité du représentant", "Cliquez pour téléverser")}
          {renderFileUpload("taxIdCopy", "Carte d'Identification Fiscale", "Cliquez pour téléverser")}
          {renderFileUpload("tradeRegisterCopy", "Extrait du Registre de Commerce (RCCM)", "Cliquez pour téléverser")}
          {/* Ajoutez d'autres champs d'upload ici si nécessaire */}
        </div>
      </div>
    </div>
  );
};