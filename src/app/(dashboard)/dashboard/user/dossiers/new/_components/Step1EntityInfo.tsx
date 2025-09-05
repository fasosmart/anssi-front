"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DossierFormData } from "@/types/api";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

export const Step1EntityInfo: React.FC<StepProps> = ({ data, updateData }) => {
  // Company info is now read-only, so we only need the representative change handler
  const handleRepresentativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({
      legalRepresentative: { ...data.legalRepresentative, [e.target.id]: e.target.value }
    });
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Identité de la société */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Identité de la société</h3>
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informations pré-remplies</AlertTitle>
            <AlertDescription>
                Les informations de votre structure sont chargées automatiquement. Pour les modifier, veuillez vous rendre sur la page 
                <Link href="/dashboard/user/structure" className="font-semibold text-primary hover:underline ml-1">
                    Gérer ma structure
                </Link>.
            </AlertDescription>
        </Alert>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom / Raison Sociale</Label>
            <Input id="name" value={data.companyInfo?.name || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acronym">Sigle</Label>
            <Input id="acronym" value={data.companyInfo?.acronym || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_sector">Secteur d’activité</Label>
            <Input id="business_sector" value={data.companyInfo?.business_sector || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Identifiant fiscal N°</Label>
            <Input id="tax_id" value={data.companyInfo?.tax_id || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commercial_register">Registre du commerce N°</Label>
            <Input id="commercial_register" value={data.companyInfo?.commercial_register || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_staff">Nombre du personnel</Label>
            <Input id="total_staff" type="number" value={data.companyInfo?.total_staff || ''} readOnly />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Identité du représentant juridique */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Identité du représentant juridique</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input id="last_name" placeholder="Nom de famille" onChange={handleRepresentativeChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input id="first_name" placeholder="Prénom" onChange={handleRepresentativeChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job_title">Fonction</Label>
            <Input id="job_title" placeholder="Ex: Directeur Général" onChange={handleRepresentativeChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="representant@entreprise.com" onChange={handleRepresentativeChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" placeholder="+224 XX XX XX XX" onChange={handleRepresentativeChange} />
          </div>
          <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idcard_number">N° de la pièce d&apos;identité</Label>
              <Input id="idcard_number" placeholder="Numéro de la pièce" onChange={handleRepresentativeChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idcard_issued_at">Délivrée le</Label>
              <Input id="idcard_issued_at" type="date" onChange={handleRepresentativeChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="idcard_expires_at">Expire le</Label>
              <Input id="idcard_expires_at" type="date" onChange={handleRepresentativeChange} />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />

      {/* Section 3: Coordonnées de la société */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Coordonnées de la société</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" value={data.companyInfo?.address || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" value={data.companyInfo?.phone || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={data.companyInfo?.email || ''} readOnly />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="website">Site Web</Label>
            <Input id="website" value={data.companyInfo?.website || ''} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};