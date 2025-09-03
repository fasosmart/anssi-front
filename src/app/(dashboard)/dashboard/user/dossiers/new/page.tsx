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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Step1EntityInfo } from "./_components/Step1EntityInfo";
import { Step2RepresentativeCursus } from "./_components/Step2RepresentativeCursus";
import { Step3AccreditationRequest } from "./_components/Step3AccreditationRequest";
import { Step4ReviewSubmit } from "./_components/Step4ReviewSubmit";
import { MultiStepTimeline } from "./_components/MultiStepTimeline";

interface FormData {
  // Step 1
  companyInfo: {
    name: string;
    acronym: string;
    sector: string;
    taxId: string;
    tradeRegister: string;
    personnelCount: number | string;
    website?: string;
    email: string;
    phone: string;
    address: string;
  };
  legalRepresentative: {
    firstName: string;
    lastName: string;
    nationality: string;
    position: string;
    idType: string;
    idNumber: string;
    idDeliveryDate: string;
    idExpirationDate: string;
    address: string;
    phone: string;
    email: string;
  };

  // Step 2
  representativeDiplomas: {
    degree: string;
    institution: string;
    specialty: string;
    year: string;
    reference: string;
  }[];
  representativeCertifications: {
    certification: string;
    institution: string;
    year: string;
    reference: string;
  }[];
  representativeExperience: {
    organization: string;
    recruitmentType: string;
    position: string;
    duration: string;
    reference: string;
  }[];

  // Step 3
  accreditationTypes: {
    apacs: boolean;
    apassi: boolean;
    apdis: boolean;
    apris: boolean;
    apin: boolean;
  };
  
  uploadedDocuments: {
    idCopy: File | null;
    taxIdCopy: File | null;
    tradeRegisterCopy: File | null;
  };

  // Step 4
  declaration: boolean;
}


export default function NewDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation only to previous steps
    if (stepId < currentStep) {
        setCurrentStep(stepId);
    }
  };

  const steps = [
    { id: 1, title: "Renseignements", component: <Step1EntityInfo data={formData} updateData={updateFormData} /> },
    { id: 2, title: "Cursus", component: <Step2RepresentativeCursus data={formData} updateData={updateFormData} /> },
    { id: 3, title: "Accréditation", component: <Step3AccreditationRequest data={formData} updateData={updateFormData} /> },
    { id: 4, title: "Soumission", component: <Step4ReviewSubmit data={formData} updateData={updateFormData} /> },
  ];

  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
       <Link href="/dashboard/user/dossiers" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des dossiers
      </Link>

      <MultiStepTimeline 
        steps={steps.map(s => ({id: s.id, title: s.title}))}
        currentStep={currentStep}
        setCurrentStep={handleStepClick}
      />

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande d&apos;accréditation - Personne Morale</CardTitle>
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
            <Button disabled={!formData.declaration}>Soumettre le dossier</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}