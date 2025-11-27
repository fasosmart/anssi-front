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
import { MultiStepTimeline } from "@/app/(dashboard)/dashboard/user/dossiers/new/_components/MultiStepTimeline";
import { Entity } from "@/types/api";
import { Step1EntityForm } from "./_components/Step1EntityForm";
import { Step2Documents } from "./_components/Step2Documents";
import { Step3Review } from "./_components/Step3Review";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface DocumentWithType {
  file: File;
  documentType: {
    slug: string;
    name: string;
    description?: string | null;
    status: 'ON' | 'OFF';
  };
  id: string;
}

export default function NewEntityPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityData, setEntityData] = useState<Partial<Entity>>({});
  const [documentsData, setDocumentsData] = useState<DocumentWithType[]>([]);
  const [createdEntitySlug, setCreatedEntitySlug] = useState<string | null>(null);

  const router = useRouter();
  const { data: session } = useSession();

  const updateEntityData = (fields: Partial<Entity>) => {
    setEntityData((prev) => ({ ...prev, ...fields }));
  };
  
  const updateDocumentsData = (documents: DocumentWithType[]) => {
    setDocumentsData(documents);
  };

  useEffect(() => {
    if (!session?.user) return;
    const names = session.user.name?.split(" ").filter(Boolean) ?? [];
    const firstName = session.user.first_name || names[0];
    const lastName =
      session.user.last_name || (names.length > 1 ? names[names.length - 1] : undefined);

    setEntityData((prev) => {
      const updates: Partial<Entity> = {};
      if (firstName && !prev.first_name) {
        updates.first_name = firstName;
      }
      if (lastName && !prev.last_name) {
        updates.last_name = lastName;
      }
      if (!Object.keys(updates).length) {
        return prev;
      }
      return { ...prev, ...updates };
    });
  }, [session?.user?.first_name, session?.user?.last_name, session?.user?.name]);

  const handleSubmit = async () => {
    if (!session) {
      toast.error("Authentication required.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Création de la structure en cours...");

    try {
      if (!entityData.entity_type) {
        toast.error("Veuillez sélectionner un type de structure.");
        setIsSubmitting(false);
        return;
      }

      const isPersonalEntity = entityData.entity_type === "personal";
      let entityResponse;

      if (isPersonalEntity) {
        const formData = new FormData();
        const fieldNames = [
          "first_name",
          "last_name",
          "job_title",
          "phone",
          "mobile",
          "email",
          "address",
          "website",
          "idcard_number",
          "idcard_issued_at",
          "idcard_expires_at",
        ];

        fieldNames.forEach((field) => {
          const value = (entityData as Record<string, null>)[field];
          if (value) {
            formData.append(field, String(value));
          }
        });

        formData.append("entity_type", "personal");

        const fileField = entityData.idcard_file;
        if (fileField instanceof File) {
          formData.append("idcard_file", fileField);
        } else if (typeof fileField === "string") {
          formData.append("idcard_file", fileField);
        }

        entityResponse = await apiClient.post(API.entities.personalEntity(), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const entityPayload = { ...entityData };
        entityResponse = await apiClient.post(API.entities.create(), entityPayload);
      }

      const newEntity = entityResponse.data;
      setCreatedEntitySlug(newEntity.slug);

      if (isPersonalEntity) {
        toast.success("Structure personne physique créée et représentante liée (backend).", { id: toastId });
      } else {
        toast.success("Structure créée avec succès. Ajout des documents...", { id: toastId });

        if (documentsData.length > 0) {
          const documentPromises = documentsData.map((doc) => {
            const formData = new FormData();
            formData.append("name", doc.documentType.name);
            formData.append("document_type", doc.documentType.slug);
            formData.append("file", doc.file);
            formData.append("issued_at", new Date().toISOString().split("T")[0]);
            return apiClient.post(API.documents.create(newEntity.slug), formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          });
          await Promise.all(documentPromises);
          toast.success("Documents ajoutés avec succès !", { id: toastId });
        }
      }

      router.push("/dashboard/user/entities");
    } catch {
      toast.error("Erreur lors de la création de la structure.", { id: toastId });
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

  const isPersonalEntity = entityData.entity_type === "personal";

  const defaultSteps = [
    { id: 1, title: "Informations", component: <Step1EntityForm data={entityData} updateData={updateEntityData} /> },
    { id: 2, title: "Documents", component: <Step2Documents entitySlug={createdEntitySlug} updateDocuments={updateDocumentsData} initialDocuments={documentsData} /> },
    { id: 3, title: "Vérification", component: <Step3Review entityData={entityData} documentsData={documentsData} /> },
  ];

  const personalSteps = [
    { id: 1, title: "Informations", component: <Step1EntityForm data={entityData} updateData={updateEntityData} /> },
  ];

  const steps = isPersonalEntity ? personalSteps : defaultSteps;

  useEffect(() => {
    if (currentStep > steps.length) {
      setCurrentStep(steps.length);
    }
  }, [currentStep, steps.length]);

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