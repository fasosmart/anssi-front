"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Step2RepresentativeCursus } from "./_components/Step2RepresentativeCursus";
import { Step3AccreditationRequest } from "./_components/Step3AccreditationRequest";
import { Step4ReviewSubmit } from "./_components/Step4ReviewSubmit";
import { MultiStepTimeline } from "./_components/MultiStepTimeline";
import { API } from "@/lib/api";
import { Entity, Representative, Degree, Training, Experience, DossierFormData } from "@/types/api";
import apiClient, { setAuthToken } from "@/lib/apiClient";
import { toast } from "sonner";

export default function NewDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DossierFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityLoading, setEntityLoading] = useState(true);
  const [userEntity, setUserEntity] = useState<Entity | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserEntity = async () => {
      if (session?.accessToken) {
        setAuthToken(session.accessToken);
        try {
          // Étape 1 : Récupérer la liste pour obtenir le slug de la structure
          const listResponse = await apiClient.get(API.entities.list());

          if (listResponse.data.results && listResponse.data.results.length > 0) {
            const entitySlug = listResponse.data.results[0].slug;

            // Étape 2 : Utiliser le slug pour récupérer les infos complètes de la structure
            const detailsResponse = await apiClient.get(API.entities.details(entitySlug));
            
            const detailedEntity = detailsResponse.data;

            setUserEntity(detailedEntity);
            // Pré-remplir le formulaire avec les infos complètes de la structure
            updateFormData({ companyInfo: detailedEntity });
          }
        } catch (error) {
          // console.error("Error fetching user entity:", error);
          toast.error("Erreur lors de la récupération des informations de votre structure.");
        } finally {
          setEntityLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchUserEntity();
    }
  }, [status, session]);

  const updateFormData = (fields: Partial<DossierFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Add toast notifications for user feedback
    
    if (!session?.accessToken) {
        // Handle not authenticated error
        // console.error("User is not authenticated");
        toast.error("Vous devez être connecté pour soumettre un dossier.");
        setIsSubmitting(false);
        return;
    }
    
    setAuthToken(session.accessToken);
    
    if (!userEntity?.slug) {
        // console.error("User entity is not available for submission.");
        toast.error("Impossible de soumettre : les informations de la structure sont manquantes.");
        setIsSubmitting(false);
        return;
    }

    try {
        const entitySlug = userEntity.slug;

        // Step 1 is now skipped, as the entity already exists.
        
        // Step 2: Create the Representative
        const representativePayload: Representative = { ...formData.legalRepresentative, first_name: formData.legalRepresentative?.first_name || "", last_name: formData.legalRepresentative?.last_name || "", job_title: formData.legalRepresentative?.job_title || "" };

        const repResponse = await apiClient.post(API.representatives.create(entitySlug), representativePayload);
        
        const newRep = repResponse.data;
        const repSlug = newRep.slug;
        
        // Helper function to append fields to FormData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appendToFd = (fd: globalThis. FormData, obj: Record<string, any>) => {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined) {
                    const value = obj[key];
                    if (value instanceof File) {
                        fd.append(key, value);
                    } else {
                        fd.append(key, String(value));
                    }
                }
            }
        };

        // Step 3: Create Degrees, Trainings, Experiences with files
        const cursusPromises = [];

        // Degrees
        if (formData.representativeDiplomas) {
            for (const diploma of formData.representativeDiplomas) {
                const fd = new FormData();
                const { file, ...diplomaData } = diploma;
                appendToFd(fd, diplomaData);
                if (file) {
                    fd.append('file', file);
                }
                
                cursusPromises.push(
                    apiClient.post(API.degrees.create(entitySlug, repSlug), fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                );
            }
        }
        
        // Trainings
        if (formData.representativeCertifications) {
            for (const certification of formData.representativeCertifications) {
                 const fd = new FormData();
                 const { file, ...certData } = certification;
                 appendToFd(fd, certData);
                 if (file) {
                    fd.append('file', file);
                 }

                cursusPromises.push(
                    apiClient.post(API.trainings.create(entitySlug, repSlug), fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                );
            }
        }

        // Experiences
        if (formData.representativeExperience) {
            for (const experience of formData.representativeExperience) {
                const fd = new FormData();
                const { file, ...expData } = experience;
                appendToFd(fd, expData);
                if (file) {
                    fd.append('file', file);
                }

                cursusPromises.push(
                    apiClient.post(API.experiences.create(entitySlug, repSlug), fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                );
            }
        }

        await Promise.all(cursusPromises);

        // On success
        toast.success("Votre dossier a été soumis avec succès !");
        router.push("/dashboard/user/dossiers");

    } catch (error) {
        // console.error("Failed to submit dossier:", error);
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

  if (entityLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des informations de votre structure...</p>
      </div>
    );
  }

  if (!userEntity) {
    return (
      <div className="space-y-6 text-center">
         <Card>
            <CardHeader>
                <CardTitle>Aucune structure trouvée</CardTitle>
                <CardDescription>
                Vous devez d&apos;abord enregistrer les informations de votre structure avant de pouvoir créer un dossier d&apos;accréditation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Cliquez sur le bouton ci-dessous pour accéder à la page de gestion de votre structure.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href="/dashboard/user/structure">
                    <Button>Gérer ma structure</Button>
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