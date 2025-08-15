"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function StructurePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    address: "",
    phoneNumber: "",
    activityDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Ici, vous ajouteriez la logique pour envoyer les données à votre API
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Ma Structure</h1>
          <p className="text-muted-foreground">
            Gérez les informations de votre entreprise ou organisation.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations sur l'entreprise</CardTitle>
          <CardDescription>
            Assurez-vous que ces informations sont exactes et à jour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Ex: FasoSmart"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registrationNumber">
                  Numéro d'immatriculation
                </Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="RCCM..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Rue de l'Innovation, Conakry"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+224 XX XX XX XX"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activityDescription">
                Description de l'activité
              </Label>
              <Textarea
                id="activityDescription"
                name="activityDescription"
                value={formData.activityDescription}
                onChange={handleChange}
                placeholder="Décrivez brièvement les activités principales de votre entreprise."
                className="min-h-[100px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSubmit}>Enregistrer les modifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
}