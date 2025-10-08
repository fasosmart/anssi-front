"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Step1EntityInfo } from "../../new/_components/Step1EntityInfo";
import { Step3AccreditationRequest } from "../../new/_components/Step3AccreditationRequest";
import { Step4ReviewSubmit } from "../../new/_components/Step4ReviewSubmit";
import { MultiStepTimeline } from "../../new/_components/MultiStepTimeline";
import { DossierFormData, Entity, TypeAccreditation } from "@/types/api";
import apiClient, { 
  getAccreditationTypes,
  getDemandDetails,
  updateDemand
} from "@/lib/apiClient";
import { toast } from "sonner";
import { useEntity } from "@/contexts/EntityContext";

export default function EditDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DossierFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accreditationOptions, setAccreditationOptions] = useState<TypeAccreditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { activeEntity, isLoading: isEntityLoading } = useEntity();
  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!activeEntity?.slug || typeof slug !== 'string') return;
      
      setIsLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [typesResponse, demandDetails] = await Promise.all([
          getAccreditationTypes(),
          getDemandDetails(activeEntity.slug, slug)
        ]);
        
        setAccreditationOptions(typesResponse.results);
        
        // Combine data from activeEntity (for company info) and demandDetails (for selections)
        setFormData({
            companyInfo: activeEntity as Entity, // Use active entity for company details
            legalRepresentative: demandDetails.representative, // Use fetched demand for pre-selected representative
            accreditationTypes: {
                [demandDetails.type_accreditation.slug]: true
            }
        });

      } catch (error) {
        toast.error("Impossible de charger les données de la demande.");
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isEntityLoading) {
        fetchInitialData();
    }
  }, [activeEntity, isEntityLoading, slug]);

  const updateFormData = (fields: Partial<DossierFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    if (!activeEntity?.slug || typeof slug !== 'string' || !formData.legalRepresentative?.slug) {
        toast.error("Données manquantes pour la mise à jour.");
        setIsSubmitting(false);
        return;
    }
    
    const selectedAccreditationSlug = Object.keys(formData.accreditationTypes || {}).find(
      (key) => formData.accreditationTypes?.[key]
    );

    if (!selectedAccreditationSlug) {
        toast.error("Veuillez sélectionner un type d'accréditation.");
        setIsSubmitting(false);
        return;
    }

    try {
      const payload = {
        representative: formData.legalRepresentative.slug,
        type_accreditation: selectedAccreditationSlug,
        // notes: formData.notes // Add notes if you add a field for it
      };

      await updateDemand(activeEntity.slug, slug, payload);
      toast.success("Demande mise à jour avec succès !");
      router.push("/dashboard/user/dossiers");

    } catch (error) {
        console.error("Update error:", error);
        toast.error("Une erreur est survenue lors de la mise à jour.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleStepClick = (stepId: number) => { if (stepId < currentStep) setCurrentStep(stepId); };

  const steps = [
    { id: 1, title: "Renseignements", component: <Step1EntityInfo data={formData} updateData={updateFormData} /> },
    { id: 2, title: "Accréditation", component: <Step3AccreditationRequest data={formData} updateData={updateFormData} accreditationOptions={accreditationOptions} /> },
    { id: 3, title: "Révision", component: <Step4ReviewSubmit data={formData} updateData={updateFormData} /> },
  ];

  const activeStep = steps.find((step) => step.id === currentStep);

  if (isEntityLoading || isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Chargement du formulaire...</p></div>;
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
          <CardTitle>Modifier la demande d'accréditation</CardTitle>
          <CardDescription>Étape {currentStep} sur {steps.length}: {activeStep?.title}</CardDescription>
        </CardHeader>
        <CardContent>
          {activeStep?.component}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>Précédent</Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={isSubmitting}>Suivant</Button>
          ) : (
            <Button onClick={handleUpdate} disabled={!formData.declaration || isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
