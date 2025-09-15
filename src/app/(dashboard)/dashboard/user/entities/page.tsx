"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/apiClient";
import { Entity } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type EntityList = Omit<Entity, "entity_type"> & { entity_type: string; is_active: boolean };

export default function EntitiesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [entities, setEntities] = useState<EntityList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      if (!session) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<{ results: EntityList[] }>("/api/entities/");
        setEntities(response.data.results);
      } catch (err) {
        setError("Impossible de charger la liste des structures. Veuillez réessayer.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, [session]);

  const handleCreateNew = () => {
    router.push("/dashboard/user/entities/new");
  };

  const handleSelectEntity = (slug: string | undefined) => {
    if (slug) {
        // TODO: Set active entity in context
        console.log("Selected entity:", slug)
        router.push(`/dashboard/user/structure`);
    }
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
            <Card key={entity.slug} className="flex flex-col">
              <CardHeader>
                <CardTitle>{entity.name}</CardTitle>
                <CardDescription>{entity.acronym || "Pas d'acronyme"}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                    Secteur: {entity.business_sector || 'Non spécifié'}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSelectEntity(entity.slug)}
                >
                    Gérer la structure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
