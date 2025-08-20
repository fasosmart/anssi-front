"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const ResetPasswordConfirmPage = () => {
  const router = useRouter();
  const params = useParams();
  
  // Extraction des paramètres avec le hook useParams
  const uid = params.uid as string;
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset_password_confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: password }),
      });

      if (!response.ok) {
        setError("Le lien est invalide ou a expiré. Veuillez refaire une demande.");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 4000);
      }
    } catch {
      setError("Une erreur de réseau est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-lg">
        <div className="mb-4">
          <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Réinitialiser votre mot de passe
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Choisissez un nouveau mot de passe sécurisé.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive-foreground">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="mb-4 rounded-md border border-green-500 bg-green-500/10 p-3 text-center text-sm text-green-700">
              Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.
            </div>
          )}
          
          <>
              <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSuccess}
                  />
              </LabelInputContainer>
              <LabelInputContainer className="mb-6">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSuccess}
                  />
              </LabelInputContainer>

              <Button
                  className="w-full"
                  type="submit"
                  disabled={isLoading || isSuccess}
              >
                  {isLoading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
              </Button>
          </>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;

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