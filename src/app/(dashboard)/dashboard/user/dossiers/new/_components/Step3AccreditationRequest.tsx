"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DossierFormData } from "@/types/api";

type AccreditationKeys = keyof NonNullable<DossierFormData['accreditationTypes']>;

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

  return (
    <div className="space-y-8">
      {/* Section 1: Préciser l'accréditation sollicitée */}
      <div>
        <h3 className="text-lg font-medium mb-4">Préciser l&apos;accréditation sollicitée (plusieurs peuvent être sollicitées)</h3>
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
    </div>
  );
};