"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DossierFormData, Representative } from "@/types/api";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/lib/apiClient";
import { API } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="text-sm">
      <p className="font-medium text-muted-foreground">{label}</p>
      <p>{value || "N/A"}</p>
    </div>
);

export const Step1EntityInfo: React.FC<StepProps> = ({ data, updateData }) => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  
  useEffect(() => {
    const fetchRepresentatives = async () => {
        if(data.companyInfo?.slug) {
            try {
                const response = await apiClient.get(API.representatives.list(data.companyInfo.slug));
                setRepresentatives(response.data.results || []);
            } catch (error) {
                console.error("Failed to fetch representatives for selection", error);
            }
        }
    }
    fetchRepresentatives();
  }, [data.companyInfo]);

  const handleRepresentativeSelect = (repSlug: string) => {
    const selectedRep = representatives.find(r => r.slug === repSlug);
    if(selectedRep) {
        updateData({ legalRepresentative: selectedRep });
    }
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
          {/* Read-only company info fields remain here */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom / Raison Sociale</Label>
            <Input id="name" value={data.companyInfo?.name || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Identifiant fiscal N°</Label>
            <Input id="tax_id" value={data.companyInfo?.tax_id || ''} readOnly />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Sélection du représentant juridique */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sélection du représentant juridique</h3>
        <div className="grid gap-6">
            <div className="space-y-2">
                <Label htmlFor="representative">Choisissez un représentant</Label>
                 <Select onValueChange={handleRepresentativeSelect} value={data.legalRepresentative?.slug}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une personne..." />
                    </SelectTrigger>
                    <SelectContent>
                        {representatives.length > 0 ? (
                            representatives.map(rep => (
                                <SelectItem key={rep.slug} value={rep.slug}>
                                    {rep.first_name} {rep.last_name} ({rep.job_title})
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-center text-muted-foreground">
                                Aucun représentant trouvé.
                                <Link href="/dashboard/user/representatives">
                                    <Button variant="link" className="p-1 h-auto">En ajouter un</Button>
                                </Link>
                            </div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {data.legalRepresentative && (
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-5 w-5"/>
                            Profil du représentant sélectionné
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                        <InfoField label="Nom complet" value={`${data.legalRepresentative.first_name} ${data.legalRepresentative.last_name}`} />
                        <InfoField label="Fonction" value={data.legalRepresentative.job_title} />
                        <InfoField label="Email" value={data.legalRepresentative.email} />
                        <InfoField label="Téléphone" value={data.legalRepresentative.mobile || data.legalRepresentative.phone} />
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
};