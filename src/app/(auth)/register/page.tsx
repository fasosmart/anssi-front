"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
       const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        firstName,
        lastName,
        callbackUrl: "/dashboard/user",
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-lg">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">Créer votre compte</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Rejoignez la plateforme pour votre accréditation.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive-foreground">
              {error}
            </div>
          )}
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <LabelInputContainer>
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                placeholder="John"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                placeholder="Doe"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              placeholder="john.doe@exemple.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground"
            type="submit"
          >
            S'inscrire &rarr;
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="text-center text-sm text-muted-foreground">
            Déjà un compte?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </div>
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