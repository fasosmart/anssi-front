"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DossierFormData } from "@/types/api";

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

export const Step1EntityInfo: React.FC<StepProps> = ({ data, updateData }) => {
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ 
      companyInfo: { ...data.companyInfo, [e.target.id]: e.target.value }
    });
  };

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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom / Raison Sociale</Label>
            <Input id="name" placeholder="Nom complet de votre entreprise" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acronym">Sigle</Label>
            <Input id="acronym" placeholder="Ex: ANSSI" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_sector">Secteur d’activité</Label>
            <Input id="business_sector" placeholder="Ex: Sécurité Informatique" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Identifiant fiscal N°</Label>
            <Input id="tax_id" placeholder="Votre numéro d'identification fiscale" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commercial_register">Registre du commerce N°</Label>
            <Input id="commercial_register" placeholder="Votre numéro de registre du commerce" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_staff">Nombre du personnel</Label>
            <Input id="total_staff" type="number" placeholder="0" onChange={handleCompanyChange} />
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
            <Input id="address" placeholder="Adresse complète du siège social" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" placeholder="+224 XX XX XX XX" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="contact@entreprise.com" onChange={handleCompanyChange} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="website">Site Web</Label>
            <Input id="website" placeholder="https://www.votre-site.com" onChange={handleCompanyChange} />
          </div>
        </div>
      </div>
    </div>
  );
};