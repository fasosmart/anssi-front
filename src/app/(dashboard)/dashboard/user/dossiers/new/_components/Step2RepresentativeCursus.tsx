"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, UploadCloud, File as FileIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DossierFormData, Degree, Training, Experience } from "@/types/api";

type ListKey = keyof Pick<DossierFormData, 'representativeDiplomas' | 'representativeCertifications' | 'representativeExperience'>;

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

const initialDiploma = { degree_name: "", institution: "", year_obtained: "", file: null };
const initialCertification = { training_name: "", institution: "", year_obtained: "", file: null };
const initialExperience = { company: "", job_title: "", start_date: "", end_date: "", file: null };

const FileUpload: React.FC<{ file: File | null, onFileChange: (file: File | null) => void, id: string }> = ({ file, onFileChange, id }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(event.target.files ? event.target.files[0] : null);
    };
    
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>Pièce justificative</Label>
            {file ? (
                <div className="flex items-center justify-between p-2 text-sm border rounded-md">
                    <div className="flex items-center gap-2 truncate">
                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onFileChange(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                        <div className="flex items-center justify-center w-full p-2 border-2 border-dashed rounded-lg hover:bg-muted/50 text-sm">
                           <UploadCloud className="w-4 h-4 mr-2 text-muted-foreground" />
                           Téléverser un fichier
                        </div>
                    </button>
                    <Input ref={fileInputRef} id={id} type="file" className="hidden" onChange={handleFileSelect} />
                </div>
            )}
        </div>
    );
};


export const Step2RepresentativeCursus: React.FC<StepProps> = ({ data, updateData }) => {
  
  const handleListChange = (listName: ListKey, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = [...(data[listName] || [])];
    const fieldName = e.target.name;
    const value = e.target.type === 'file' ? (e.target.files ? e.target.files[0] : null) : e.target.value;
    newList[index] = { ...newList[index], [fieldName]: value };
    updateData({ [listName]: newList });
  };
  
  const handleFileInListChange = (listName: ListKey, index: number, file: File | null) => {
    const newList = [...(data[listName] || [])];
    newList[index] = { ...newList[index], file: file };
    updateData({ [listName]: newList });
  };

  const addToList = (listName: ListKey, initialItem: object) => {
    const newList = [...(data[listName] || []), initialItem];
    updateData({ [listName]: newList });
  };

  const removeFromList = (listName: ListKey, index: number) => {
    const newList = [...(data[listName] || [])];
    newList.splice(index, 1);
    updateData({ [listName]: newList });
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Diplômes */}
      <div>
        <h3 className="text-lg font-medium mb-4">Diplômes du Représentant Juridique</h3>
        <div className="space-y-4">
          {(data.representativeDiplomas || []).map((diploma: Partial<Degree>, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6 grid gap-4 relative">
                 <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                    <Input name="degree_name" value={diploma.degree_name || ''} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Diplôme" />
                    <Input name="institution" value={diploma.institution || ''} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Institution" />
                 </div>
                 <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                    <Input name="year_obtained" value={diploma.year_obtained || ''} onChange={(e) => handleListChange('representativeDiplomas', index, e)} placeholder="Année" />
                    <FileUpload 
                        id={`diploma-file-${index}`}
                        file={typeof diploma.file === 'string' ? null : diploma.file || null} 
                        onFileChange={(file) => handleFileInListChange('representativeDiplomas', index, file)} 
                    />
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

      {/* Section 2: Formations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Cycles de formations du Représentant Juridique</h3>
        <div className="space-y-4">
           {(data.representativeCertifications || []).map((cert: Partial<Training>, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6 grid gap-4 relative">
                <div className="grid md:grid-cols-3 gap-4">
                    <Input name="training_name" value={cert.training_name || ''} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Formation / Certification" />
                    <Input name="institution" value={cert.institution || ''} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Institut / Organisme" />
                    <Input name="year_obtained" value={cert.year_obtained || ''} onChange={(e) => handleListChange('representativeCertifications', index, e)} placeholder="Promotion / Année" />
                </div>
                <div className="md:col-span-3">
                    <FileUpload 
                        id={`cert-file-${index}`}
                        file={typeof cert.file === 'string' ? null : cert.file || null}
                        onFileChange={(file) => handleFileInListChange('representativeCertifications', index, file)} 
                    />
                </div>
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

      {/* Section 3: Expériences */}
       <div>
        <h3 className="text-lg font-medium mb-4">Cursus professionnel du Représentant Juridique</h3>
        <div className="space-y-4">
           {(data.representativeExperience || []).map((exp: Partial<Experience>, index: number) => (
             <Card key={index}>
                <CardContent className="pt-6 grid gap-4 relative">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input name="company" value={exp.company || ''} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Organisme" />
                        <Input name="job_title" value={exp.job_title || ''} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Fonctions exercées" />
                        <Input name="start_date" value={exp.start_date || ''} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Date de début (YYYY-MM-DD)" />
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <Input name="end_date" value={exp.end_date || ''} onChange={(e) => handleListChange('representativeExperience', index, e)} placeholder="Date de fin (YYYY-MM-DD)" />
                        <div className="md:col-span-2">
                            <FileUpload 
                                id={`exp-file-${index}`}
                                file={typeof exp.file === 'string' ? null : exp.file || null}
                                onFileChange={(file) => handleFileInListChange('representativeExperience', index, file)} 
                            />
                        </div>
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