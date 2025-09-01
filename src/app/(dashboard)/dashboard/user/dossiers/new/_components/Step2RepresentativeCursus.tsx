"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define a more specific type instead of any
interface FormData {
  [key: string]: any;
}

// Temporary prop definition. Will be replaced by the one from page.tsx
interface StepProps {
  data: Partial<FormData>;
  updateData: (fields: Partial<FormData>) => void;
}

const initialDiploma = { degree: "", institution: "", specialty: "", year: "", reference: "" };
const initialCertification = { certification: "", institution: "", year: "", reference: "" };
const initialExperience = { organization: "", recruitmentType: "", position: "", duration: "", reference: "" };

export const Step2RepresentativeCursus: React.FC<StepProps> = ({ data, updateData }) => {
  
  const handleListChange = (listName: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = [...(data[listName] || [])];
    newList[index] = { ...newList[index], [e.target.name]: e.target.value };
    updateData({ [listName]: newList });
  };

  const addToList = (listName: string, initialItem: object) => {
    const newList = [...(data[listName] || []), initialItem];
    updateData({ [listName]: newList });
  };

  const removeFromList = (listName: string, index: number) => {
    const newList = [...(data[listName] || [])];
    newList.splice(index, 1);
    updateData({ [listName]: newList });
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Diplômes du Représentant Juridique */}
      <div>
        <h3 className="text-lg font-medium mb-4">Diplômes du Représentant Juridique</h3>
        <div className="space-y-4">
          {(data.representativeDiplomas || []).map((diploma: object, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6 grid gap-4 md:grid-cols-2 relative">
                 <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                    <Input name="degree" value={(diploma as any).degree} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Diplôme" />
                    <Input name="institution" value={(diploma as any).institution} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Institution" />
                    <Input name="specialty" value={(diploma as any).specialty} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Spécialité / Année" />
                 </div>
                 <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                    <Input name="year" value={(diploma as any).year} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Année" />
                    <Input name="reference" value={(diploma as any).reference} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Références de la pièce justificative*" className="md:col-span-2" />
                 </div>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeFromList('representativeDiplomas', index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => addToList('representativeDiplomas', initialDiploma)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un diplôme
        </Button>
      </div>

      <Separator />

      {/* Section 2: Cycles de formations du Représentant Juridique */}
       <div>
        <h3 className="text-lg font-medium mb-4">Cycles de formations du Représentant Juridique</h3>
        <div className="space-y-4">
           {(data.representativeCertifications || []).map((cert: object, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6 grid gap-4 relative">
                <div className="grid md:grid-cols-3 gap-4">
                    <Input name="certification" value={(cert as any).certification} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Formation / Certification" />
                    <Input name="institution" value={(cert as any).institution} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Institut / Organisme" />
                    <Input name="year" value={(cert as any).year} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Promotion / Année" />
                </div>
                <Input name="reference" value={(cert as any).reference} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Références de la pièce justificative*" />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeFromList('representativeCertifications', index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => addToList('representativeCertifications', initialCertification)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une formation
        </Button>
      </div>

      <Separator />

      {/* Section 3: Cursus professionnel du Représentant Juridique */}
       <div>
        <h3 className="text-lg font-medium mb-4">Cursus professionnel du Représentant Juridique</h3>
        <div className="space-y-4">
           {(data.representativeExperience || []).map((exp: object, index: number) => (
             <Card key={index}>
                <CardContent className="pt-6 grid gap-4 relative">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input name="organization" value={(exp as any).organization} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Organisme" />
                        <Input name="recruitmentType" value={(exp as any).recruitmentType} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Forme de recrutement" />
                        <Input name="position" value={(exp as any).position} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Fonctions exercées" />
                    </div>
                     <div className="grid md:grid-cols-3 gap-4">
                        <Input name="duration" value={(exp as any).duration} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Durée" />
                        <Input name="reference" value={(exp as any).reference} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Numéro de la pièce justificative*" className="md:col-span-2" />
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeFromList('representativeExperience', index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardContent>
             </Card>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => addToList('representativeExperience', initialExperience)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une expérience
        </Button>
      </div>

    </div>
  );
};