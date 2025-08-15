"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UploadCloud, File, X } from "lucide-react";
import Link from "next/link";

interface FormData {
  requestType: string;
  projectTitle: string;
  projectDescription: string;
  files: File[];
}

// --- Étape 1: Informations Générales ---
const Step1Form = ({ data, updateData }: { data: Partial<FormData>, updateData: (fields: Partial<FormData>) => void }) => (
  <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="request-type">Type de demande</Label>
      <Select
        value={data.requestType}
        onValueChange={(value) => updateData({ requestType: value })}
      >
        <SelectTrigger id="request-type">
          <SelectValue placeholder="Sélectionnez un type de demande..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="accreditation-service">Accréditation de service</SelectItem>
          <SelectItem value="homologation-site">Homologation de site web</SelectItem>
          <SelectItem value="accreditation-competence">Accréditation de compétence</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="project-title">Titre du projet ou service</Label>
      <Input
        id="project-title"
        placeholder="Ex: Plateforme de e-commerce sécurisée"
        value={data.projectTitle}
        onChange={(e) => updateData({ projectTitle: e.target.value })}
      />
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="project-description">Description détaillée</Label>
      <Textarea
        id="project-description"
        placeholder="Décrivez les objectifs et les fonctionnalités principales de votre projet..."
        className="min-h-[120px]"
        value={data.projectDescription}
        onChange={(e) => updateData({ projectDescription: e.target.value })}
      />
    </div>
  </div>
);

// --- Étape 2: Documents Requis ---
const Step2Form = ({ data, updateData }: { data: Partial<FormData>, updateData: (fields: Partial<FormData>) => void }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(data.files || []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      updateData({ files: updatedFiles });
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    updateData({ files: updatedFiles });
  };

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Cliquez pour téléverser</span> ou glissez-déposez vos fichiers ici.
          </p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG (max. 10MB par fichier)</p>
        </div>
        <Input 
          ref={fileInputRef}
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Fichiers sélectionnés :</h4>
          <ul className="divide-y rounded-md border">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 text-sm">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span>{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Étape 3: Validation et Soumission ---
const Step3Review = ({ data }: { data: Partial<FormData> }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Récapitulatif</h3>
      <p className="text-sm text-muted-foreground">
        Veuillez vérifier que toutes les informations sont correctes avant de soumettre.
      </p>
    </div>
    <div className="space-y-4 rounded-md border p-4">
      <h4 className="font-medium">Informations Générales</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Type de demande:</span>
        <span>{data.requestType || "Non spécifié"}</span>
        <span className="text-muted-foreground">Titre du projet:</span>
        <span>{data.projectTitle || "Non spécifié"}</span>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">Description:</span>
        <p className="text-sm">{data.projectDescription || "Non spécifié"}</p>
      </div>
    </div>
    <div className="space-y-2">
      <h4 className="font-medium">Documents fournis</h4>
      {data.files && data.files.length > 0 ? (
        <ul className="divide-y rounded-md border">
          {data.files.map((file, index) => (
            <li key={index} className="flex items-center gap-2 p-2 text-sm">
              <File className="h-4 w-4 text-muted-foreground" />
              <span>{file.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun document fourni.</p>
      )}
    </div>
  </div>
);


export default function NewDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    requestType: "",
    projectTitle: "",
    projectDescription: "",
    files: [],
  });

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { id: 1, title: "Informations Générales", component: <Step1Form data={formData} updateData={updateFormData} /> },
    { id: 2, title: "Documents Requis", component: <Step2Form data={formData} updateData={updateFormData} /> },
    { id: 3, title: "Validation et Soumission", component: <Step3Review data={formData} /> },
  ];

  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
       <Link href="/dashboard/user/dossiers" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des dossiers
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande d'accréditation</CardTitle>
          <CardDescription>
            Étape {currentStep} sur {steps.length}: {activeStep?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeStep?.component}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            Précédent
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Suivant</Button>
          ) : (
            <Button>Soumettre le dossier</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}