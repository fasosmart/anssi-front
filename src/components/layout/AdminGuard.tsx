"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

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
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  const isStaff = Boolean((data as Session)?.user?.is_staff);
  if (!isStaff) {
    return null;
  }

  return <>{children}</>;
}


