"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Forgot password form submitted");
    // Here you would add logic to handle the password reset request
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
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" placeholder="bano.barry@exemple.com" type="email" />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground"
            type="submit"
          >
            Envoyer le lien &rarr;
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