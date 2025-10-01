"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DossierFormData, TypeAccreditation } from "@/types/api";

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

  return (
    <div className="space-y-8">
      {/* Section 1: Préciser l'accréditation sollicitée */}
      <div>
        <h3 className="text-lg font-medium mb-4">Préciser l&apos;accréditation sollicitée (plusieurs peuvent être sollicitées)</h3>
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