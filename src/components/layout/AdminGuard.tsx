"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // L'authentification est déjà vérifiée par DashboardGuard
    // On vérifie uniquement les permissions admin ici
    if (status === "authenticated") {
      const isStaff = Boolean((data as Session)?.user?.is_staff);
      // If user is not staff and tries to access admin pages, redirect to user dashboard
      if (!isStaff && pathname?.startsWith("/dashboard/admin")) {
        router.replace("/dashboard/user");
      }
    }
  }, [status, data, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // Vérifier que l'utilisateur est staff
  const isStaff = Boolean((data as Session)?.user?.is_staff);
  if (!isStaff) {
    return null;
  }

  return <>{children}</>;
}


