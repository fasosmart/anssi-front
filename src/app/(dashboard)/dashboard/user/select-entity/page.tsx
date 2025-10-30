"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, CheckCircle, Building, Clock, AlertCircle, XCircle, Ban } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEntity } from "@/contexts/EntityContext";
import { Badge } from "@/components/ui/badge";

const entityTypeLabels: { [key: string]: string } = {
  business: "Entreprise / Société",
  ngo: "ONG / Association",
  personal: "Particulier",
};

export default function SelectEntityPage() {
  const router = useRouter();
  
  const { 
    entities, 
    isLoading, 
    error, 
    setActiveEntity,
    getEntityStatusLabel,
    getEntityStatusColor
  } = useEntity();

  const handleCreateNew = () => {
    // Note: Assurez-vous que ce chemin est aussi exclu du full layout dans DashboardLayout
    router.push("/dashboard/user/entities/new");
  };

  const handleSelectEntity = (entity: typeof entities[0]) => {
    setActiveEntity(entity);
    router.push("/dashboard/user");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <AlertCircle className="h-4 w-4" />;
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4" />;
      case 'blocked':
        return <Ban className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // --- RENDU CONDITIONNEL CENTRÉ ---

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col gap-8 max-w-xl w-full"> {/* Utiliser w-full pour prendre l'espace dans max-w-xl */}
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-10 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col gap-8 max-w-lg w-full">
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Mode: Create (no entities)
  if (entities.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col gap-8 max-w-xl w-full">
          <div className="text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Bienvenue sur la plateforme ANSSI
            </h1>
            <p className="text-lg text-muted-foreground">
              Pour commencer, vous devez créer votre première structure.
            </p>
          </div>

          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Créer votre première structure
              </CardTitle>
              <CardDescription>
                Ajoutez les informations de votre entreprise, association ou structure personnelle.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleCreateNew} size="lg">
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une structure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mode: Select (multiple entities)
  if (entities.length > 1) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col gap-8 max-w-4xl w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Sélectionnez votre structure
            </h1>
            <p className="text-lg text-muted-foreground">
              Choisissez la structure sur laquelle vous souhaitez travailler.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => (
              <Card 
                key={entity.slug} 
                className="flex flex-col transition-all hover:shadow-lg cursor-pointer"
                onClick={() => handleSelectEntity(entity)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {entity.name}
                      </CardTitle>
                      <CardDescription>
                        {entityTypeLabels[entity.entity_type] || entity.entity_type}
                      </CardDescription>
                    </div>
                    {entity.status && (
                      <Badge 
                        variant="secondary" 
                        className={`${getEntityStatusColor(entity.status)} text-primary flex items-center gap-1`}
                      >
                        {getStatusIcon(entity.status)}
                        {getEntityStatusLabel(entity.status)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    Secteur: {entity.business_sector || 'Non spécifié'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Sigle: {entity.acronym || "N/A"}
                  </p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full">
                    Sélectionner cette structure
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Cas: Une seule entité (redirection automatique vers dashboard)
  if (entities.length === 1) {
    // Auto-sélection et redirection
    const handleAutoSelect = () => {
      setActiveEntity(entities[0]);
      router.push("/dashboard/user");
    };

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col gap-8 max-w-lg w-full text-center">
          <Building className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Redirection en cours...
          </h1>
          <p className="text-lg text-muted-foreground">
            Vous avez une seule structure. Redirection vers votre espace personnel.
          </p>
          <div className="mt-4">
            <Button onClick={handleAutoSelect} variant="outline">
              Continuer maintenant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col gap-8 max-w-lg w-full">
        <Alert>
          <AlertTitle>État inattendu</AlertTitle>
          <AlertDescription>
            Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la page.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
