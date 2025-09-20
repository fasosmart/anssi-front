"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEntity } from "@/contexts/EntityContext";

const entityTypeLabels: { [key: string]: string } = {
    business: "Entreprise / Société",
    ngo: "ONG / Association",
    personal: "Particulier",
}

export default function EntitiesPage() {
  const router = useRouter();
  const { 
    entities, 
    isLoading, 
    error, 
    activeEntity, 
    setActiveEntity 
  } = useEntity();

  const handleCreateNew = () => {
    router.push("/dashboard/user/entities/new");
  };

  const handleSelectEntity = (entity: typeof entities[0]) => {
    setActiveEntity(entity);
    router.push(`/dashboard/user/structure`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-semibold">Mes Structures</h1>
            <p className="text-muted-foreground">
                Gérez vos différentes entités ou ajoutez-en une nouvelle.
            </p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une structure
        </Button>
      </div>

      {isLoading && (
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
      )}

      {!isLoading && error && (
         <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && entities.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune structure trouvée</h3>
          <p className="mt-1 text-sm text-muted-foreground">Commencez par créer votre première structure.</p>
          <div className="mt-6">
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une structure
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && entities.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Card 
                key={entity.slug} 
                className={`flex flex-col transition-all ${activeEntity?.slug === entity.slug ? 'border-primary shadow-lg' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{entity.name}</CardTitle>
                        <CardDescription>{entityTypeLabels[entity.entity_type] || entity.entity_type}</CardDescription>
                    </div>
                    {activeEntity?.slug === entity.slug && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
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
                <Button 
                    variant={activeEntity?.slug === entity.slug ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleSelectEntity(entity)}
                >
                    {activeEntity?.slug === entity.slug ? 'Structure active' : 'Gérer la structure'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
