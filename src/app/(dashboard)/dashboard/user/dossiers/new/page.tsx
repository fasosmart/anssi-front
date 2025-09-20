"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Step3AccreditationRequest } from "./_components/Step3AccreditationRequest";
import { Step4ReviewSubmit } from "./_components/Step4ReviewSubmit";
import { MultiStepTimeline } from "./_components/MultiStepTimeline";
// import { API } from "@/lib/api";
import { DossierFormData, Entity } from "@/types/api";
// import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useEntity } from "@/contexts/EntityContext";

export default function NewDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DossierFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { activeEntity, isLoading: isEntityLoading } = useEntity();
  const router = useRouter();

  useEffect(() => {
    if (activeEntity) {
      // Pre-fill form with active entity info
      updateFormData({ companyInfo: activeEntity as unknown as Partial<Entity> });
    }
  }, [activeEntity]);

  const updateFormData = (fields: Partial<DossierFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (!activeEntity?.slug) {
        toast.error("Impossible de soumettre : aucune structure n'est sélectionnée.");
        setIsSubmitting(false);
        return;
    }
    if (!formData.legalRepresentative?.slug) {
        toast.error("Impossible de soumettre : aucun représentant n'est sélectionné.");
        setIsSubmitting(false);
        return;
    }

    try {
        const entitySlug = activeEntity.slug;
        const repSlug = formData.legalRepresentative.slug;

        // TODO: Implement the actual dossier submission logic here.
        // This will likely involve a new API endpoint to create a dossier
        // associated with the entity and the selected representative.
        // The payload should include accreditation types and uploaded documents.
        
        console.log("Submitting dossier for:", {
            entitySlug,
            repSlug,
            accreditationTypes: formData.accreditationTypes,
            uploadedDocuments: formData.uploadedDocuments,
        });

        // The following is a placeholder for the actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));


        // On success
        toast.success("Votre dossier a été soumis avec succès !");
        router.push("/dashboard/user/dossiers");

    } catch {
        toast.error("Une erreur est survenue lors de la soumission de votre dossier.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
        setCurrentStep(stepId);
    }
  };

  const steps = [
    { id: 1, title: "Renseignements", component: <Step1EntityInfo data={formData} updateData={updateFormData} /> },
    { id: 2, title: "Accréditation", component: <Step3AccreditationRequest data={formData} updateData={updateFormData} /> },
    { id: 3, title: "Soumission", component: <Step4ReviewSubmit data={formData} updateData={updateFormData} /> },
  ];

  const activeStep = steps.find((step) => step.id === currentStep);

  if (isEntityLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des informations...</p>
      </div>
    );
  }

  if (!activeEntity) {
    return (
      <div className="space-y-6 text-center">
         <Card>
            <CardHeader>
                <CardTitle>Aucune structure sélectionnée</CardTitle>
                <CardDescription>
                Pour créer une nouvelle demande, veuillez d&apos;abord sélectionner la structure concernée.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Link href="/dashboard/user/entities">
                    <Button>Choisir une structure</Button>
                </Link>
            </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <Link href="/dashboard/user/dossiers" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des demandes
      </Link>

      <MultiStepTimeline 
        steps={steps.map(s => ({id: s.id, title: s.title}))}
        currentStep={currentStep}
        setCurrentStep={handleStepClick}
      />

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle demande d&apos;accréditation pour {activeEntity.name}</CardTitle>
          <CardDescription>
            Étape {currentStep} sur {steps.length}: {activeStep?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeStep?.component}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
            Précédent
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={isSubmitting}>Suivant</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!formData.declaration || isSubmitting}>
              {isSubmitting ? "Soumission en cours..." : "Soumettre le dossier"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}