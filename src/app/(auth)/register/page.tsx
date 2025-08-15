"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Here you would typically add logic to register the user in your database
    console.log("Creating user:", { firstName, lastName, email });

    // After successful registration, sign the user in
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Une erreur est survenue lors de la connexion automatique. Veuillez réessayer.");
    } else {
      router.push("/dashboard/user");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-background p-4 md:rounded-2xl md:p-8">
        {/* Lien de retour à l'accueil */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-primary hover:underline 
            transition-colors"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'accueil
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Créer votre compte
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Rejoignez la plateforme pour commencer votre procédure d'accréditation.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
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
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-primary/80 font-medium text-primary-foreground shadow-[0px_1px_0px_0px_var(--zinc-100)_inset,0px_-1px_0px_0px_var(--zinc-100)_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            S'inscrire &rarr;
            <BottomGradient />
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