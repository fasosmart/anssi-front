"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { useEntity } from "@/contexts/EntityContext";

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
  
  // Slug de l'entité créée à l'étape 1 — permet de lier les documents à l'étape 2
  const [createdEntitySlug, setCreatedEntitySlug] = useState<string | null>(null);

  const router = useRouter();
  const { data: session } = useSession();
  const { refreshEntities } = useEntity();

  const updateEntityData = (fields: Partial<Entity>) => {
    setEntityData((prev) => ({ ...prev, ...fields }));
  };
  
  const updateDocumentsData = useCallback((documents: DocumentWithType[]) => {
    setDocumentsData(documents);
  }, []);

  // Pré-remplissage des données utilisateur depuis la session
  useEffect(() => {
    if (!session?.user) return;

    const names = session.user.name?.split(" ").filter(Boolean) ?? [];
    const firstName = session.user.first_name || names[0];
    const lastName =
      session.user.last_name || (names.length > 1 ? names[names.length - 1] : undefined);
    const email = session.user.email;

    setEntityData((prev) => {
      const updates: Partial<Entity> = {};

      if (firstName && !prev.first_name) {
        updates.first_name = firstName;
      }
      if (lastName && !prev.last_name) {
        updates.last_name = lastName;
      }
      if (email && !prev.email) {
        updates.email = email;
      }

      if (!Object.keys(updates).length) {
        return prev;
      }

      return { ...prev, ...updates };
    });
  }, [session?.user?.first_name, session?.user?.last_name, session?.user?.name, session?.user?.email]);

  /**
   * Étape 1 → 2 : Création de l'entité en base
   * Pour les personnes physiques, c'est la seule étape (soumission directe)
   */
  const handleSubmitStep1 = async () => {
    if (!session) {
      toast.error("Authentification requise.");
      return;
    }

    if (!entityData.entity_type) {
      toast.error("Veuillez sélectionner un type de structure.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Création de la structure en cours...");

    try {
      const isPersonalEntity = entityData.entity_type === "personal";
      let entityResponse;

      if (isPersonalEntity) {
        // Personne physique : FormData avec fichier d'identité
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
          "country",
        ];

        fieldNames.forEach((field) => {
          const value = (entityData as Record<string, unknown>)[field];
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

        // Pour les personnes physiques, on termine directement
        toast.success("Structure personne physique créée avec succès.", { id: toastId });
        refreshEntities();
        router.push("/dashboard/user/entities");
        return;

      } else {
        // Entreprise ou ONG : payload JSON standard
        const entityPayload = { ...entityData };
        entityResponse = await apiClient.post(API.entities.create(), entityPayload);
      }

      const newEntity = entityResponse.data;
      setCreatedEntitySlug(newEntity.slug);
      
      toast.success("Structure créée. Passons aux documents.", { id: toastId });
      setCurrentStep(2);

    } catch {
      toast.error("Erreur lors de la création de la structure.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Étape 2 → 3 : Upload des documents liés à l'entité
   */
  const handleSubmitStep2 = async () => {
    if (!createdEntitySlug) {
      toast.error("Aucune structure trouvée. Veuillez recommencer.");
      return;
    }

    // Si aucun document n'a été ajouté, on passe directement à l'étape 3
    if (documentsData.length === 0) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Ajout des documents en cours...");

    try {
      const documentPromises = documentsData.map((doc) => {
        const formData = new FormData();
        formData.append("name", doc.documentType.name);
        formData.append("document_type", doc.documentType.slug);
        formData.append("file", doc.file);
        formData.append("issued_at", new Date().toISOString().split("T")[0]);
        return apiClient.post(API.documents.create(createdEntitySlug), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      await Promise.all(documentPromises);
      toast.success("Documents ajoutés avec succès.", { id: toastId });
      setCurrentStep(3);

    } catch {
      toast.error("Erreur lors de l'ajout des documents.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Étape 3 : Finalisation — refresh du contexte et redirection
   */
  const handleFinalize = () => {
    refreshEntities();
    toast.success("Structure créée avec succès !");
    router.push("/dashboard/user/entities");
  };

  /**
   * Gestion du bouton "Suivant" selon l'étape courante
   */
  const handleNext = async () => {
    if (currentStep === 1) {
      await handleSubmitStep1();
    } else if (currentStep === 2) {
      await handleSubmitStep2();
    } else if (currentStep === 3) {
      handleFinalize();
    }
  };

  /**
   * Retour à l'étape précédente
   * Note : Une fois l'entité créée, on ne peut pas revenir à l'étape 1
   */
  const handleBack = () => {
    if (currentStep === 2 && createdEntitySlug) {
      // L'entité est déjà créée, on ne peut pas revenir en arrière
      toast.info("La structure a déjà été créée. Vous pouvez continuer ou annuler.");
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    // On ne peut revenir qu'aux étapes déjà complétées
    // Et on ne peut pas revenir à l'étape 1 si l'entité est créée
    if (stepId < currentStep) {
      if (stepId === 1 && createdEntitySlug) {
        toast.info("La structure a déjà été créée. Vous ne pouvez pas modifier les informations de base.");
        return;
      }
      setCurrentStep(stepId);
    }
  };

  const isPersonalEntity = entityData.entity_type === "personal";

  // Configuration des étapes selon le type d'entité
  const defaultSteps = [
    { 
      id: 1, 
      title: "Informations", 
      component: <Step1EntityForm data={entityData} updateData={updateEntityData} /> 
    },
    { 
      id: 2, 
      title: "Documents", 
      component: (
        <Step2Documents 
          entitySlug={createdEntitySlug} 
          updateDocuments={updateDocumentsData} 
          initialDocuments={documentsData} 
        />
      ) 
    },
    { 
      id: 3, 
      title: "Confirmation", 
      component: (
        <Step3Review 
          entityData={entityData} 
          documentsData={documentsData} 
        />
      ) 
    },
  ];

  // Pour les personnes physiques, une seule étape
  const personalSteps = [
    { 
      id: 1, 
      title: "Informations", 
      component: <Step1EntityForm data={entityData} updateData={updateEntityData} /> 
    },
  ];

  const steps = isPersonalEntity ? personalSteps : defaultSteps;

  // Synchronisation de l'étape courante avec le nombre d'étapes disponibles
  useEffect(() => {
    if (currentStep > steps.length) {
      setCurrentStep(steps.length);
    }
  }, [currentStep, steps.length]);

  const activeStep = steps.find((step) => step.id === currentStep);

  // Libellé du bouton selon l'étape
  const getNextButtonLabel = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement...
        </>
      );
    }
    
    if (currentStep === 1) {
      return isPersonalEntity ? "Créer la structure" : "Créer et continuer";
    }
    if (currentStep === 2) {
      return documentsData.length > 0 ? "Enregistrer les documents" : "Passer cette étape";
    }
    if (currentStep === 3) {
      return "Terminer";
    }
    return "Suivant";
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/user/entities" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des structures
      </Link>

      <MultiStepTimeline 
        steps={steps.map(s => ({ id: s.id, title: s.title }))}
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
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 1 || isSubmitting || (currentStep === 2 && !!createdEntitySlug)}
          >
            Précédent
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {getNextButtonLabel()}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
