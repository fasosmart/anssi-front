"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ActivationPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      const uid = params.uid as string;
      const token = params.token as string;

      if (!uid || !token) {
        setStatus("error");
        setErrorMessage("Le lien d'activation est invalide.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/activation/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, token }),
          }
        );

        if (response.ok) {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 5000); // Redirect to login after 5 seconds
        } else {
          const errorData = await response.json();
          // Try to get a meaningful error message
          const message = errorData.detail || "Le lien d'activation est invalide ou a expiré.";
          setErrorMessage(message);
          setStatus("error");
        }
      } catch {
        setErrorMessage("Une erreur de réseau est survenue. Veuillez réessayer.");
        setStatus("error");
      }
    };

    activateAccount();
  }, [params, router]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-bold">Activation en cours...</h2>
            <p className="text-muted-foreground">
              Veuillez patienter pendant que nous vérifions votre compte.
            </p>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-bold">Compte activé avec succès !</h2>
            <p className="text-muted-foreground">
              Vous pouvez maintenant vous connecter. Vous allez être redirigé...
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">Aller à la page de connexion</Link>
            </Button>
          </>
        );
      case "error":
        return (
          <>
            <XCircle className="h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-xl font-bold">Échec de l&apos;activation</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <Button asChild className="mt-6">
               <Link href="/register">Retourner à l&apos;inscription</Link>
            </Button>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}