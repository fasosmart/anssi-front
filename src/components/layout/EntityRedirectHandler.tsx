"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEntity } from "@/contexts/EntityContext";
import { toast } from "sonner";

interface EntityRedirectHandlerProps {
  children: React.ReactNode;
}

export function EntityRedirectHandler({ children }: EntityRedirectHandlerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeEntity, isLoading } = useEntity();

  useEffect(() => {
    // Ne pas rediriger pendant le chargement ou si pas d'entité active
    if (isLoading || !activeEntity) return;

    // Pages qui ne nécessitent pas de redirection
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
  }, [activeEntity, pathname, router, isLoading]);

  return <>{children}</>;
}
