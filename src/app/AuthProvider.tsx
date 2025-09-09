"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { setAuthToken } from "@/lib/apiClient";

function SessionTokenHandler({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
    } else {
      setAuthToken(null);
    }
  }, [session]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionTokenHandler>{children}</SessionTokenHandler>
    </SessionProvider>
  );
}