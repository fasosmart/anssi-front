"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/reset_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        setError("Impossible de traiter la demande. L'adresse e-mail n'existe peut-être pas.");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("Une erreur de réseau est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-lg">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Entrez votre e-mail pour recevoir un lien de réinitialisation.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive-foreground">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="mb-4 rounded-md border border-green-500 bg-green-500/10 p-3 text-center text-sm text-green-700">
              Demande envoyée ! Si un compte existe avec cet e-mail, vous recevrez des instructions pour réinitialiser votre mot de passe.
            </div>
          )}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              placeholder="bano.barry@exemple.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSuccess}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground disabled:opacity-50"
            type="submit"
            disabled={isLoading || isSuccess}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien →"}
          </button>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};