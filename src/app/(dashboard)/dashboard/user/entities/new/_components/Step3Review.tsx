"use client";

import React from "react";
import { Entity, Country } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { File as FileIcon, Building2, FileText, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface Step3Props {
  entityData: Partial<Entity>;
  documentsData: DocumentWithType[];
}

const ReviewItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium">{value || <span className="text-muted-foreground italic">Non spécifié</span>}</p>
  </div>
);

// Fonction utilitaire pour extraire le nom du pays
const getCountryName = (country: Entity["country"]): string | undefined => {
  if (!country) return undefined;
  if (typeof country === "string") return country;
  return (country as Country).name;
};

export const Step3Review: React.FC<Step3Props> = ({ entityData, documentsData }) => {
  return (
    <div className="space-y-6">
      {/* Message de confirmation */}
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-700">Prêt à finaliser</AlertTitle>
        <AlertDescription className="text-green-600">
          Vérifiez les informations ci-dessous. En cliquant sur &quot;Terminer&quot;, vous serez redirigé vers la liste de vos structures.
        </AlertDescription>
      </Alert>

      {/* Informations de la structure */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Informations de la structure</CardTitle>
          </div>
          <CardDescription>
            Ces informations ont été enregistrées avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReviewItem label="Nom / Raison Sociale" value={entityData.name} />
            <ReviewItem label="Sigle" value={entityData.acronym} />
            <ReviewItem label="Secteur d&apos;activité" value={entityData.business_sector} />
            <ReviewItem label="Identifiant fiscal (IFU)" value={entityData.tax_id} />
            <ReviewItem label="Registre de Commerce (RCCM)" value={entityData.commercial_register} />
            <ReviewItem label="Pays" value={getCountryName(entityData.country)} />
            <ReviewItem label="Effectif Total" value={entityData.total_staff} />
            <ReviewItem label="Experts en cybersécurité" value={entityData.cybersecurity_experts} />
            <ReviewItem label="Email" value={entityData.email} />
            <ReviewItem label="Téléphone" value={entityData.phone} />
            <ReviewItem label="Mobile" value={entityData.mobile} />
            <ReviewItem label="Site Web" value={entityData.website} />
          </div>
          {entityData.address && (
            <>
              <Separator className="my-4" />
              <ReviewItem label="Adresse" value={entityData.address} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents soumis */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Documents soumis</CardTitle>
          </div>
          <CardDescription>
            {documentsData.length > 0 
              ? `${documentsData.length} document(s) ont été ajoutés à votre structure.`
              : "Aucun document n'a été ajouté pour le moment."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentsData.length > 0 ? (
            <ul className="space-y-2">
              {documentsData.map((doc) => (
                <li 
                  key={doc.id} 
                  className="flex items-center gap-3 p-3 rounded-md border bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{doc.documentType.name}</span>
                    <span className="text-xs text-muted-foreground truncate block">{doc.file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {(doc.file.size / 1024).toFixed(0)} Ko
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun document ajouté</p>
              <p className="text-xs mt-1">Vous pourrez ajouter des documents plus tard depuis la page de gestion de votre structure.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
