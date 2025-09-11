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
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { Entity, Document } from "@/types/api";
import apiClient, { setAuthToken } from "@/lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DocumentManager } from "./_components/DocumentManager";

// Assume you have a toast library for notifications
// e.g., import { toast } from 'sonner';

const DRAFT_STORAGE_KEY = 'anssi-structure-draft';

export default function StructurePage() {
  const { data: session, status } = useSession();
  const [entity, setEntity] = useState<Partial<Entity> | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntityAndDocuments = async () => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      setIsLoading(true);
      try {
        const listResponse = await apiClient.get(API.entities.list());
        
        if (listResponse.data.results && listResponse.data.results.length > 0) {
          const entitySlug = listResponse.data.results[0].slug;
          
          const detailsResponse = await apiClient.get(API.entities.details(entitySlug));
          setEntity(detailsResponse.data);

          const documentsResponse = await apiClient.get(API.documents.list(entitySlug));
          setDocuments(documentsResponse.data.results || []);

        } else {
          setEntity({}); // No entity found, prepare for creation
          setDocuments([]);
        }
      } catch (error) {
        toast.error("Erreur lors de la récupération de votre structure.");
        setEntity({});
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchEntityAndDocuments();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntity((prev) => (prev ? { ...prev, [name]: value } : { [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !entity) return;

    setIsSubmitting(true);
    setAuthToken(session.accessToken); // Ensure token is set for submission
    const isUpdate = !!entity.slug;
    const url = isUpdate ? API.entities.update(entity.slug!) : API.entities.create();
    const method = isUpdate ? "put" : "post";
    const data = { ...entity, entity_type: 'business' };

    try {
      const response = await apiClient({
        url,
        method,
        data,
      });

      setEntity(response.data);
      toast.success(`Structure ${isUpdate ? 'mise à jour' : 'créée'} avec succès !`);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      // console.error("Failed to save entity:", axiosError);
      toast.error(`Erreur: ${axiosError.response?.data?.detail || axiosError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Chargement de votre structure...</div>; // Replace with a proper skeleton loader
  }

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
                      value={entity?.name || ""}
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
                      value={entity?.acronym || ""}
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
                    value={entity?.business_sector || ""}
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
                      value={entity?.tax_id || ""}
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
                      value={entity?.commercial_register || ""}
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
                      value={entity?.total_staff || ""}
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
                      value={entity?.cybersecurity_experts || ""}
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
                      value={entity?.address || ""}
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
                      value={entity?.phone || ""}
                      onChange={handleChange}
                      placeholder="+224 XX XX XX XX"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mobile">Téléphone mobile</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={entity?.mobile || ""}
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
                      value={entity?.email || ""}
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
                      value={entity?.website || ""}
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
              {entity?.slug ? (
                <DocumentManager 
                  entity={entity as Entity}
                  initialDocuments={documents}
                  onDocumentsUpdate={fetchEntityAndDocuments}
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Veuillez d'abord enregistrer les informations générales de la structure pour gérer les documents.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}