"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEntity } from "@/contexts/EntityContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Session } from "next-auth";

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

    // Si l'utilisateur est staff, interdire les routes user et rediriger vers l'espace admin
    const isStaff = Boolean((session as Session)?.user?.is_staff);
    if (isStaff && pathname?.startsWith('/dashboard/user')) {
      router.replace('/dashboard/admin');
      return;
    }

    // Ignorer totalement pour l'espace admin
    if (pathname?.startsWith('/dashboard/admin')) {
      return;
    }

    // Ignore la logique de redirection si on se trouve déjà sur la page de sélection/création d'entité ou sur les pages d'auth
    if (pathname?.includes('/select-entity') || pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/profile')) {
      return;
    }

    const entityCount = entities.length;

    // Logique de sélection d'entité
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

    // Logique de gestion des statuts (si une entité est active)
    if (activeEntity) {
      // Pages qui ne nécessitent pas de redirection selon le statut
      const allowedPaths = [
        "/dashboard/user/structure",
        "/dashboard/user/entities",
        "/dashboard/user/select-entity",
        "/dashboard/user/profile"
      ];

      // Si on est sur une page autorisée, pas de redirection
      if (allowedPaths.some(path => pathname.startsWith(path))) {
        return;
      }

      // Si l'entité n'est pas validée, interdire l'accès au tableau de bord principal
      if (activeEntity.status !== 'validated' && pathname === '/dashboard/user') {
        router.push('/dashboard/user/structure');
        return;
      }

      // Redirections selon le statut
      switch (activeEntity.status) {
        case "new":
          // Si l'entité est nouvelle et qu'on essaie d'accéder aux représentants ou demandes
          if (pathname.includes("/representatives") || pathname.includes("/dossiers")) {
            toast.warning("Veuillez d'abord soumettre votre structure pour validation");
            router.push("/dashboard/user/structure");
            return;
          }
          break;

        case "submitted":
        case "under_review":
          // Si l'entité est en cours de validation et qu'on essaie d'accéder aux représentants ou demandes
          if (pathname.includes("/representatives") || pathname.includes("/dossiers")) {
            toast.info("Votre structure est en cours de validation. Cette section sera disponible après validation.");
            router.push("/dashboard/user/structure");
            return;
          }
          break;

        case "blocked":
          // Si l'entité est bloquée, rediriger vers la structure avec un message
          if (!pathname.includes("/structure")) {
            toast.error("Votre structure est temporairement bloquée. Contactez le support pour plus d'informations.");
            router.push("/dashboard/user/structure");
            return;
          }
          break;

        case "declined":
          // Si l'entité est refusée, rediriger vers la structure pour modification
          if (!pathname.includes("/structure") && !pathname.includes("/entities")) {
            toast.warning("Votre structure a été refusée. Veuillez la modifier et la soumettre à nouveau.");
            router.push("/dashboard/user/structure");
            return;
          }
          break;

        case "validated":
          // Entité validée, accès libre à toutes les sections
          break;

        default:
          // Statut inconnu, rediriger vers la structure
          if (!pathname.includes("/structure")) {
            toast.warning("Statut de structure non reconnu. Veuillez vérifier votre structure.");
            router.push("/dashboard/user/structure");
            return;
          }
      }
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
