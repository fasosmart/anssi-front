"use client";

import React, { useState } from "react";
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
import { Entity, Representative, Degree, Training, Experience } from "@/types/api";

interface FormData {
  companyInfo?: {
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
  legalRepresentative?: {
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
  representativeDiplomas?: {
    degree: string;
    institution: string;
    specialty: string;
    year: string;
    reference: string;
  }[];
  representativeCertifications?: {
    certification: string;
    institution: string;
    year: string;
    reference: string;
  }[];
  representativeExperience?: {
    organization: string;
    recruitmentType: string;
    position: string;
    duration: string;
    reference: string;
  }[];
  accreditationTypes?: {
    apacs: boolean;
    apassi: boolean;
    apdis: boolean;
    apris: boolean;
    apin: boolean;
  };
  uploadedDocuments?: {
    idCopy: File | null;
    taxIdCopy: File | null;
    tradeRegisterCopy: File | null;
  };
  declaration?: boolean;
}


export default function NewDossierPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Add toast notifications for user feedback
    
    if (!session?.accessToken) {
        // Handle not authenticated error
        console.error("User is not authenticated");
        setIsSubmitting(false);
        return;
    }

    try {
        // Step 1: Create the Entity
        const entityPayload: Entity = {
            name: formData.companyInfo?.name || "",
            acronym: formData.companyInfo?.acronym,
            business_sector: formData.companyInfo?.sector,
            tax_id: formData.companyInfo?.taxId,
            commercial_register: formData.companyInfo?.tradeRegister,
            total_staff: Number(formData.companyInfo?.personnelCount) || 0,
            address: formData.companyInfo?.address,
            phone: formData.companyInfo?.phone,
            email: formData.companyInfo?.email,
            website: formData.companyInfo?.website,
            entity_type: 'business',
        };
        
        const entityResponse = await fetch(API.entities.create(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(entityPayload)
        });

        if (!entityResponse.ok) {
            throw new Error(`Failed to create entity: ${entityResponse.statusText}`);
        }
        
        const newEntity = await entityResponse.json();
        const entitySlug = newEntity.slug;

        // Step 2: Create the Representative
        const representativePayload: Representative = {
            first_name: formData.legalRepresentative?.firstName || "",
            last_name: formData.legalRepresentative?.lastName || "",
            job_title: formData.legalRepresentative?.position || "",
            nationality: formData.legalRepresentative?.nationality,
            idcard_number: formData.legalRepresentative?.idNumber,
            idcard_issued_at: formData.legalRepresentative?.idDeliveryDate,
            idcard_expires_at: formData.legalRepresentative?.idExpirationDate,
            address: formData.legalRepresentative?.address,
            phone: formData.legalRepresentative?.phone,
            email: formData.legalRepresentative?.email,
        };

        const repResponse = await fetch(API.representatives.create(entitySlug), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(representativePayload)
        });
        
        if (!repResponse.ok) {
            throw new Error(`Failed to create representative: ${repResponse.statusText}`);
        }

        const newRep = await repResponse.json();
        const repSlug = newRep.slug;
        
        // Step 3: Create Degrees, Trainings, Experiences
        const cursusPromises = [];

        // Degrees
        if (formData.representativeDiplomas) {
            for (const diploma of formData.representativeDiplomas) {
                const diplomaPayload: Degree = {
                    degree_name: diploma.degree,
                    institution: diploma.institution,
                    specialty: diploma.specialty, // Note: This field is not in the Degree type from api.ts
                    year_obtained: Number(diploma.year)
                };
                cursusPromises.push(
                    fetch(API.degrees.create(entitySlug, repSlug), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}`},
                        body: JSON.stringify(diplomaPayload)
                    })
                );
            }
        }
        
        // Trainings
        if (formData.representativeCertifications) {
            for (const certification of formData.representativeCertifications) {
                const trainingPayload: Training = {
                    training_name: certification.certification,
                    institution: certification.institution,
                    year_obtained: Number(certification.year)
                };
                cursusPromises.push(
                    fetch(API.trainings.create(entitySlug, repSlug), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}`},
                        body: JSON.stringify(trainingPayload)
                    })
                );
            }
        }

        // Experiences
        if (formData.representativeExperience) {
            for (const experience of formData.representativeExperience) {
                const experiencePayload: Experience = {
                    organization: experience.organization,
                    recruitment_type: experience.recruitmentType,
                    position: experience.position,
                    duration: experience.duration,
                    reference: experience.reference
                };
                cursusPromises.push(
                    fetch(API.experiences.create(entitySlug, repSlug), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}`},
                        body: JSON.stringify(experiencePayload)
                    })
                );
            }
        }

        await Promise.all(cursusPromises);


        // On success
        router.push("/dashboard/user/dossiers");

    } catch (error) {
        console.error("Failed to submit dossier:", error);
        // Handle submission error
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