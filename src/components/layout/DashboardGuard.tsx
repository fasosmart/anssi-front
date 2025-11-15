"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardGuardProps {
  children: ReactNode;
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié et tente d'accéder à une route dashboard
    if (status === "unauthenticated" && pathname?.startsWith("/dashboard")) {
      router.replace("/login");
      return;
    }
  }, [status, pathname, router]);

  // Afficher un skeleton pendant le chargement de la session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (la redirection est en cours)
  if (status === "unauthenticated") {
    return null;
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>;
}

