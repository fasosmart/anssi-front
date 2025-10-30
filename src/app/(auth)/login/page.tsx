"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Session, User } from "next-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Les identifiants sont incorrects ou le compte n'est pas activé. Veuillez réessayer.");
        console.error(result?.error);
      } else {
        const session = await getSession();
        const isStaff = Boolean((session as Session)?.user?.is_staff);
        router.push(isStaff ? "/dashboard/admin" : "/dashboard/user");
        }
    } catch {
        setError("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
        setIsLoading(false);
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
            Retour à l&apos;accueil
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">Connexion</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Accédez à votre espace pour gérer vos dossiers.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive p-3 text-center text-black text-sm text-destructive-foreground">
              {error}
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
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <div className="flex justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
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
            className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter →"}
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              S&apos;inscrire
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