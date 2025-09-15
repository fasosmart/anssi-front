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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { Entity, Document } from "@/types/api";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DocumentManager } from "./_components/DocumentManager";
import { useEntity } from "@/contexts/EntityContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StructurePage() {
  const { activeEntity, isLoading: isEntityLoading, error: entityError } = useEntity();
  const router = useRouter();

  const [entityDetails, setEntityDetails] = useState<Partial<Entity> | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDetailsAndDocuments = async (slug: string) => {
    setIsLoading(true);
    try {
      const detailsResponse = await apiClient.get(API.entities.details(slug));
      setEntityDetails(detailsResponse.data);

      const documentsResponse = await apiClient.get(API.documents.list(slug));
      setDocuments(documentsResponse.data.results || []);
    } catch {
      toast.error("Erreur lors de la récupération des détails de la structure.");
      setEntityDetails(null);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEntityLoading) {
      if (activeEntity?.slug) {
        fetchDetailsAndDocuments(activeEntity.slug);
      } else {
        setIsLoading(false); // No active entity, stop loading
      }
    }
  }, [activeEntity, isEntityLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntityDetails((prev) => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityDetails?.slug) return;

    setIsSubmitting(true);
    const url = API.entities.update(entityDetails.slug);
    
    try {
      const response = await apiClient.put(url, entityDetails);
      setEntityDetails(response.data);
      toast.success(`Structure mise à jour avec succès !`);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error(`Erreur: ${axiosError.response?.data?.detail || axiosError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isEntityLoading) {
    return <div>Chargement de la structure...</div>;
  }

  if (!activeEntity) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucune structure sélectionnée</CardTitle>
                <CardDescription>
                    Veuillez sélectionner une structure à gérer depuis la page &quot;Mes Structures&quot;.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={() => router.push('/dashboard/user/entities')}>
                    Choisir une structure
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Link href="/dashboard/user/entities" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des structures
      </Link>
      <div className="flex items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{entityDetails?.name || "Ma Structure"}</h1>
          <p className="text-muted-foreground">
            Gérez les informations de votre entreprise ou organisation.
          </p>
        </div>
      </div>
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Informations Générales</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informations sur l&apos;entreprise</CardTitle>
                <CardDescription>
                  Assurez-vous que ces informations sont exactes et à jour.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                    <Input
                      id="name"
                      name="name"
                      value={entityDetails?.name || ""}
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
                      value={entityDetails?.acronym || ""}
                      onChange={handleChange}
                      placeholder="Ex: FS"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business_sector">Secteur d&apos;activité</Label>
                  <Input
                    id="business_sector"
                    name="business_sector"
                    value={entityDetails?.business_sector || ""}
                    onChange={handleChange}
                    placeholder="Ex: Technologies de l'Information et de la Communication"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="tax_id">Identifiant fiscal (IFU)</Label>
                    <Input
                      id="tax_id"
                      name="tax_id"
                      value={entityDetails?.tax_id || ""}
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
                      value={entityDetails?.commercial_register || ""}
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
                      value={entityDetails?.total_staff || ""}
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
                      value={entityDetails?.cybersecurity_experts || ""}
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
                      value={entityDetails?.address || ""}
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
                      value={entityDetails?.phone || ""}
                      onChange={handleChange}
                      placeholder="+224 XX XX XX XX"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mobile">Téléphone mobile</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={entityDetails?.mobile || ""}
                      onChange={handleChange}
                      placeholder="+224 XX XX XX XX"
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
                      value={entityDetails?.email || ""}
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
                      value={entityDetails?.website || ""}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents de l&apos;entreprise</CardTitle>
              <CardDescription>
                Gérez les documents administratifs et légaux de votre structure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entityDetails?.slug ? (
                <DocumentManager 
                  entity={entityDetails as Entity}
                  initialDocuments={documents}
                  onDocumentsUpdate={() => fetchDetailsAndDocuments(entityDetails.slug!)}
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Veuillez d&apos;abord enregistrer les informations générales de la structure pour gérer les documents.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}