"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Entity, Country } from "@/types/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountrySelect } from "@/components/ui/country-select";
import { useCountries } from "@/hooks/use-countries";

interface Step1Props {
  data: Partial<Entity>;
  updateData: (fields: Partial<Entity>) => void;
}

type PersonalEntityFields = {
  first_name?: string;
  last_name?: string;
  job_title?: string;
  idcard_number?: string;
  idcard_issued_at?: string;
  idcard_expires_at?: string;
  idcard_file?: File | string;
};

const entityTypeOptions = [
  { value: "business", label: "Entreprise / Société" },
  { value: "ngo", label: "ONG / Association" },
  { value: "personal", label: "Particulier / Personne Physique" },
];

export const Step1EntityForm: React.FC<Step1Props> = ({ data, updateData }) => {
  const isPersonalEntity = data.entity_type === "personal";
  const personalData = data as Partial<Entity> & PersonalEntityFields;
  const { countries, isLoading: countriesLoading } = useCountries();

  // Normalise le champ country pour obtenir toujours un slug (string) à passer au CountrySelect.
  const getCountrySlug = (country: Entity["country"]): string | undefined => {
    if (!country) return undefined;
    if (typeof country === "string") return country;
    const c = country as Country;
    return c.slug;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        updateData({ [name]: file } as Partial<Entity> & PersonalEntityFields);
      }
      return;
    }

    updateData({ [name]: value } as Partial<Entity> & PersonalEntityFields);
  };

  const handleSelectChange = (value: "personal" | "business" | "ngo") => {
    updateData({ entity_type: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="entity_type">Type de structure</Label>
        <Select onValueChange={handleSelectChange} value={data.entity_type} required>
          <SelectTrigger id="entity_type">
            <SelectValue placeholder="Sélectionnez un type..." />
          </SelectTrigger>
          <SelectContent>
            {entityTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPersonalEntity ? (
        <div className="space-y-4 rounded-lg border border-dashed border-border p-4">
          <Alert variant="default">
            <AlertTitle>Personne physique</AlertTitle>
            <AlertDescription>
              Votre profil fait office de représentant et de structure. Complétez les champs ci-dessous pour fournir toutes les informations nécessaires.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                value={data.first_name || ""}
                onChange={handleChange}
                placeholder="Prénom"
                required
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                value={data.last_name || ""}
                onChange={handleChange}
                placeholder="Nom"
                required
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email || ""}
                onChange={handleChange}
                placeholder="user@example.com"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job_title">Fonction / Titre</Label>
              <Input
                id="job_title"
                name="job_title"
                value={personalData.job_title || ""}
                onChange={handleChange}
                placeholder="Ex: Consultant cybersécurité"
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                name="address"
                value={data.address || ""}
                onChange={handleChange}
                placeholder="Adresse personnelle"
              />
            </div> */}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={data.phone || ""}
                onChange={handleChange}
                placeholder="+224 XX XX XX XX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={data.mobile || ""}
                onChange={handleChange}
                placeholder="+224 XX XX XX XX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                name="address"
                value={data.address || ""}
                onChange={handleChange}
                placeholder="Adresse personnelle"
              />
            </div>
            <div className="grid gap-2">
              <CountrySelect
                countries={countries}
                value={getCountrySlug(data.country)}
                onValueChange={(value) => updateData({ country: value })}
                placeholder="Sélectionnez un pays..."
                disabled={countriesLoading}
                required
                label="Pays"
                id="pays"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={data.website || ""}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="idcard_number">N° de pièce d&apos;identité</Label>
              <Input
                id="idcard_number"
                name="idcard_number"
                value={personalData.idcard_number || ""}
                onChange={handleChange}
                placeholder="Ex: 123456789"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idcard_issued_at">Délivrée le</Label>
              <Input
                id="idcard_issued_at"
                name="idcard_issued_at"
                type="date"
                value={personalData.idcard_issued_at || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idcard_expires_at">Expire le</Label>
              <Input
                id="idcard_expires_at"
                name="idcard_expires_at"
                type="date"
                value={personalData.idcard_expires_at || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="idcard_file">Pièce justificative (scan ou photo)</Label>
            <Input id="idcard_file" name="idcard_file" type="file" onChange={handleChange} />
            <p className="text-sm text-muted-foreground">
              {personalData.idcard_file
                ? personalData.idcard_file instanceof File
                  ? personalData.idcard_file.name
                  : personalData.idcard_file
                : "Aucun fichier sélectionné"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la structure</Label>
              <Input
                id="name"
                name="name"
                value={data.name || ""}
                onChange={handleChange}
                placeholder="Ex: FasoSmart"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acronym">Sigle</Label>
              <Input
                id="acronym"
                name="acronym"
                value={data.acronym || ""}
                onChange={handleChange}
                placeholder="Ex: FS"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="business_sector">Secteur d&apos;activité</Label>
              <Input
                id="business_sector"
                name="business_sector"
                value={data.business_sector || ""}
                onChange={handleChange}
                placeholder="Ex: Technologies de l&apos;Information"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_id">Identifiant fiscal (IFU)</Label>
              <Input
                id="tax_id"
                name="tax_id"
                value={data.tax_id || ""}
                onChange={handleChange}
                placeholder="Numéro IFU"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="commercial_register">Numéro du Registre de Commerce (RCCM)</Label>
              <Input
                id="commercial_register"
                name="commercial_register"
                value={data.commercial_register || ""}
                onChange={handleChange}
                placeholder="RCCM..."
              />
            </div>
            <div className="grid gap-2">
              <CountrySelect
                countries={countries}
                value={getCountrySlug(data.country)}
                onValueChange={(value) => updateData({ country: value })}
                placeholder="Sélectionnez un pays..."
                disabled={countriesLoading}
                required
                label="Pays"
                id="pays"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="total_staff">Effectif Total</Label>
              <Input
                id="total_staff"
                name="total_staff"
                type="number"
                value={data.total_staff || ""}
                onChange={handleChange}
                placeholder="Ex: 10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cybersecurity_experts">Nombre d&apos;experts en cybersécurité</Label>
              <Input
                id="cybersecurity_experts"
                name="cybersecurity_experts"
                type="number"
                value={data.cybersecurity_experts || ""}
                onChange={handleChange}
                placeholder="Ex: 3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                name="address"
                value={data.address || ""}
                onChange={handleChange}
                placeholder="Siège social, ville, pays"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={data.phone || ""}
                onChange={handleChange}
                placeholder="+226 XX XX XX XX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Téléphone mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={data.mobile || ""}
                onChange={handleChange}
                placeholder="+226 XX XX XX XX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email de l&apos;entreprise</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email || ""}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={data.website || ""}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

