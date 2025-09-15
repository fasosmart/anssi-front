"use client";

import React, { useState } from "react";
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
import { MultiStepTimeline } from "@/app/(dashboard)/dashboard/user/dossiers/new/_components/MultiStepTimeline";
import { Entity } from "@/types/api";
import { Step1EntityForm } from "./_components/Step1EntityForm";
import { Step2Documents } from "./_components/Step2Documents";
import { Step3Review } from "./_components/Step3Review";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";


export default function NewEntityPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityData, setEntityData] = useState<Partial<Entity>>({});
  const [documentsData, setDocumentsData] = useState<File[]>([]);
  const [createdEntitySlug, setCreatedEntitySlug] = useState<string | null>(null);

  const router = useRouter();
  const { data: session } = useSession();

  const updateEntityData = (fields: Partial<Entity>) => {
    setEntityData((prev) => ({ ...prev, ...fields }));
  };
  
  const updateDocumentsData = (files: File[]) => {
    setDocumentsData(files);
  };


  const handleSubmit = async () => {
    if (!session) {
        toast.error("Authentication required.");
        return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Création de la structure en cours...");

    try {
        // Step 1: Create the entity
        const entityPayload = { ...entityData, entity_type: 'business' }; // Assuming business type for now
        const entityResponse = await apiClient.post(API.entities.create(), entityPayload);
        const newEntity = entityResponse.data;
        setCreatedEntitySlug(newEntity.slug);
        toast.success("Structure créée avec succès. Ajout des documents...", { id: toastId });

        // Step 2: Upload documents for the newly created entity
        if (documentsData.length > 0) {
            const documentPromises = documentsData.map(file => {
                const formData = new FormData();
                formData.append('name', file.name);
                formData.append('file', file);
                // These are placeholders, the form should capture this data
                formData.append('issued_at', new Date().toISOString().split('T')[0]); 
                return apiClient.post(API.documents.create(newEntity.slug), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });
            await Promise.all(documentPromises);
            toast.success("Documents ajoutés avec succès !", { id: toastId });
        }

        router.push("/dashboard/user/entities");

    } catch (error) {
        toast.error("Erreur lors de la création de la structure.", { id: toastId });
        // console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleNext = () => {
    // Add validation logic here before proceeding
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
    { id: 1, title: "Informations", component: <Step1EntityForm data={entityData} updateData={updateEntityData} /> },
    { id: 2, title: "Documents", component: <Step2Documents entitySlug={createdEntitySlug} updateDocuments={updateDocumentsData} /> },
    { id: 3, title: "Vérification", component: <Step3Review entityData={entityData} documentsData={documentsData} /> },
  ];

  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
       <Link href="/dashboard/user/entities" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des structures
      </Link>

      <MultiStepTimeline 
        steps={steps.map(s => ({id: s.id, title: s.title}))}
        currentStep={currentStep}
        setCurrentStep={handleStepClick}
      />

      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle structure</CardTitle>
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer la structure"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
