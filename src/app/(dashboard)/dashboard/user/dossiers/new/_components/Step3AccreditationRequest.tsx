"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DossierFormData, TypeAccreditation } from "@/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

type AccreditationKeys = keyof NonNullable<DossierFormData['accreditationTypes']>;

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
  accreditationOptions: TypeAccreditation[];
}

export const Step3AccreditationRequest: React.FC<StepProps> = ({ data, updateData, accreditationOptions }) => {
  const handleAccreditationChange = (checked: boolean, id: string) => {
    const currentTypes = data.accreditationTypes || {};
    updateData({
      accreditationTypes: { ...currentTypes, [id]: checked }
    });
  };

  const selectedCount = Object.values(data.accreditationTypes || {}).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Section 1: Préciser l'accréditation sollicitée */}
      <div>
        <h3 className="text-lg font-medium mb-4">Préciser l&apos;accréditation sollicitée (plusieurs peuvent être sollicitées)</h3>
        
        {selectedCount > 0 && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Vous avez sélectionné {selectedCount} type{selectedCount > 1 ? 's' : ''} d&apos;accréditation. 
              Cela créera {selectedCount} demande{selectedCount > 1 ? 's' : ''} distincte{selectedCount > 1 ? 's' : ''} lors de la soumission.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          {accreditationOptions.map((option) => (
            <div key={option.slug} className="flex items-center space-x-2">
              <Checkbox
                id={option.slug}
                checked={!!data.accreditationTypes?.[option.slug]}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  handleAccreditationChange(Boolean(checked), option.slug)
                }
              />
              <Label htmlFor={option.slug} className="font-normal">{option.name}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};