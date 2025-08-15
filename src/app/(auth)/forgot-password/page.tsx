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
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-background p-4 md:rounded-2xl md:p-8">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary hover:underline transition-colors"
            aria-label="Retour à la page de connexion"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la connexion
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Pas de souci. Entrez votre e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" placeholder="bano.barry@exemple.com" type="email" />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-primary/80 font-medium text-primary-foreground shadow-[0px_1px_0px_0px_var(--zinc-100)_inset,0px_-1px_0px_0px_var(--zinc-100)_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Envoyer le lien &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

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