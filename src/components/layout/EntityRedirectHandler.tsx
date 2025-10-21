"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEntity } from "@/contexts/EntityContext";
import { useSession } from "next-auth/react";

interface EntityRedirectHandlerProps {
  children: React.ReactNode;
}

export function EntityRedirectHandler({ children }: EntityRedirectHandlerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { entities, isLoading, activeEntity, setActiveEntity } = useEntity();

  useEffect(() => {
    // Exécute la logique de redirection seulement si l'utilisateur est authentifié et que les entités sont chargées
    if (status !== 'authenticated' || isLoading || !session) return;

    // Ignore la logique de redirection si on se trouve déjà sur la page de sélection/création d'entité ou sur les pages d'auth
    if (pathname?.includes('/select-entity') || pathname?.includes('/login') || pathname?.includes('/register')) {
      return;
    }

    const entityCount = entities.length;

    if (entityCount === 0) {
      // Cas 3 : l'utilisateur n'a aucune entité -> on le redirige vers la création d'une entité
      if (pathname?.includes('/entities/new')) {
        return;
      }
      router.push('/dashboard/user/select-entity');
    } else if (entityCount === 1 && !activeEntity) {
      // Cas 2 : une seule entité -> on la sélectionne automatiquement
      setActiveEntity(entities[0]);
      // Si il est déjà sur /dashboard/user, on rafraîchit simplement la page
      if (pathname === '/dashboard/user') {
        router.refresh();
      }
    } else if (entityCount > 1 && !activeEntity) {
      // Cas 1 : plusieurs entités mais aucune sélectionnée -> on redirige vers la sélection
      router.push('/dashboard/user/select-entity');
    }
  }, [status, isLoading, entities, activeEntity, pathname, router, session, setActiveEntity]);

  // Affiche un état de chargement pendant la vérification des entités
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, et que la logique des entités est gérée, on affiche les enfants
  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // Pour les utilisateurs non-authentifiés, on affiche aussi les enfants (la gestion d'auth est assurée ailleurs)
  return <>{children}</>;
}
