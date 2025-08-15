"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// This would typically come from a database or API
// const sectors = [
//   "Technologie de l'information",
//   "Finance",
//   "Santé",
//   "Éducation",
//   "Commerce",
//   "Autre",
// ];

export default function StructurePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Structure data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    // Here you would typically show a success message (e.g., with a toast)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ma Structure</h1>
        <p className="text-muted-foreground">
          Gérez les informations de votre entreprise ou organisation.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations sur l&apos;entreprise</CardTitle>
          <CardDescription>
            Assurez-vous que ces informations sont exactes et à jour.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l&apos;entreprise</Label>
            <Input id="company-name" name="companyName" placeholder="Ex: FasoSmart" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-number">Numéro d&apos;immatriculation</Label>
            <Input id="registration-number" name="registrationNumber" placeholder="RCCM..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" placeholder="123 Rue de l&apos;Innovation, Ouagadougou" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+226 XX XX XX XX" required />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description de l&apos;activité</Label>
            <Textarea 
              id="description"
              name="description"
              placeholder="Décrivez brièvement les activités principales de votre entreprise." 
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}