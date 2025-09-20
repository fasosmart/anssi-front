"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Entity } from "@/types/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step1Props {
  data: Partial<Entity>;
  updateData: (fields: Partial<Entity>) => void;
}

const entityTypeOptions = [
    { value: 'business', label: 'Entreprise / Société' },
    { value: 'ngo', label: 'ONG / Association' },
    { value: 'personal', label: 'Particulier / Personne Physique' },
]

export const Step1EntityForm: React.FC<Step1Props> = ({ data, updateData }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleSelectChange = (value: 'personal' | 'business' | 'ngo') => {
    updateData({ entity_type: value });
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom de l&apos;entreprise</Label>
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
            <Label htmlFor="entity_type">Type de structure</Label>
            <Select onValueChange={handleSelectChange} value={data.entity_type} required>
                <SelectTrigger id="entity_type">
                    <SelectValue placeholder="Sélectionnez un type..." />
                </SelectTrigger>
                <SelectContent>
                    {entityTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        <div className="grid gap-2">
          <Label htmlFor="commercial_register">
            Numéro du Registre de Commerce (RCCM)
          </Label>
          <Input
            id="commercial_register"
            name="commercial_register"
            value={data.commercial_register || ""}
            onChange={handleChange}
            placeholder="RCCM..."
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
  );
};
