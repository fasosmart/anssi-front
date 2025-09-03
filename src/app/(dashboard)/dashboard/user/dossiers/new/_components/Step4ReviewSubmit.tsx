"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DossierFormData } from "@/types/api";

interface StepProps {
  data: Partial<DossierFormData>;
  updateData?: (fields: Partial<DossierFormData>) => void; // updateData is optional for the review step
}

const accreditationLabels: { [key: string]: string } = {
  apacs: "APACS - Accompagnement et Conseil en sécurité",
  apassi: "APASSI - Audit de la Sécurité des Systèmes d’Information",
  apdis: "APDIS - Détection d’Incidents de Sécurité",
  apris: "APRIS - Réponse aux Incidents de Sécurité",
  apin: "APIN - Investigation Numérique",
};


const ReviewSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-md font-semibold mb-2">{title}</h4>
    <div className="space-y-1 rounded-md border p-4 text-sm">{children}</div>
  </div>
);

const ReviewItem: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-right font-medium">{value || "Non renseigné"}</span>
  </div>
);

export const Step4ReviewSubmit: React.FC<StepProps> = ({ data, updateData }) => {
  const { companyInfo, legalRepresentative, accreditationTypes, declaration } = data;

  const handleDeclarationChange = (checked: boolean) => {
    if (updateData) {
      updateData({ declaration: checked });
    }
  };
  
  return (
    <div className="space-y-8">
       {/* Section Récapitulatif */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Récapitulatif de votre demande</h3>
          <p className="text-sm text-muted-foreground">
            Veuillez vérifier que toutes les informations sont correctes avant de soumettre.
          </p>
        </div>

        {companyInfo && (
          <ReviewSection title="Identité de la société">
            <ReviewItem label="Raison Sociale" value={companyInfo.name} />
            <ReviewItem label="Secteur d’activité" value={companyInfo.business_sector} />
            <ReviewItem label="Identifiant fiscal" value={companyInfo.tax_id} />
            <ReviewItem label="Registre du commerce" value={companyInfo.commercial_register} />
            <ReviewItem label="Adresse" value={companyInfo.address} />
            <ReviewItem label="Email" value={companyInfo.email} />
            <ReviewItem label="Téléphone" value={companyInfo.phone} />
          </ReviewSection>
        )}
        
        {legalRepresentative && (
            <ReviewSection title="Représentant Légal">
                <ReviewItem label="Nom et Prénom" value={`${legalRepresentative.first_name} ${legalRepresentative.last_name}`} />
                <ReviewItem label="Fonction" value={legalRepresentative.job_title} />
                <ReviewItem label="Email" value={legalRepresentative.email} />
                <ReviewItem label="Téléphone" value={legalRepresentative.phone} />
            </ReviewSection>
        )}

        {accreditationTypes && (
            <ReviewSection title="Accréditations Sollicitées">
                <ul className="list-disc pl-5">
                    {Object.entries(accreditationTypes)
                        .filter(([, checked]) => checked)
                        .map(([key]) => (
                            <li key={key}>{accreditationLabels[key]}</li>
                        ))}
                </ul>
            </ReviewSection>
        )}

      </div>

      <Separator />

      {/* Section Engagement */}
      <div>
        <h3 className="text-lg font-medium">Engagement et déclaration sur l'honneur</h3>
        <div className="mt-4 space-y-4 rounded-md border p-4">
          <p className="text-sm">
            Je soussigné(e), m’engage à respecter les dispositions du cahier des charges, et j’assume mes responsabilités face à toute infraction.
            J’autorise mon consentement éclairé et univoque à l’ANSSI Guinée pour traiter mes données à caractère.
            Je déclare sur l’honneur l’exactitude des renseignements contenus dans la présente fiche.
            Je m’engage à informer l’ANSSI Guinée de chaque modification qui survient sur les données déclarées.
          </p>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
                id="declaration" 
                checked={declaration || false}
                onCheckedChange={handleDeclarationChange}
            />
            <Label htmlFor="declaration" className="font-bold">Je confirme avoir lu et accepté les conditions</Label>
          </div>
        </div>
      </div>
    </div>
  );
};