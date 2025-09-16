"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/apiClient";

const SessionManager = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  
  // Effect to watch for session expiry error
  useEffect(() => {
    if (status === "authenticated" && session?.error === "RefreshAccessTokenError") {
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
      signOut({ callbackUrl: "/login" });
    }
  }, [session, status]);

  // Effect to set the auth token for the API client
  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
    } else {
      setAuthToken(null);
    }
  }, [session]);


  return <>{children}</>;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SessionManager>
        {children}
      </SessionManager>
    </SessionProvider>
  );
};