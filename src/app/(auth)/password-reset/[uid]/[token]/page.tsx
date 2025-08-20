"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== reNewPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    const uid = params.uid as string;
    const token = params.token as string;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/reset_password_confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, token, new_password: newPassword }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError("Le lien de réinitialisation est invalide ou a expiré.");
      }
    } catch (err) {
      setError("Une erreur de réseau est survenue.");
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
        <h2 className="text-xl font-bold">Choisissez un nouveau mot de passe</h2>
        <form className="my-8" onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-center text-sm text-destructive">{error}</p>}
          {isSuccess && (
            <p className="mb-4 text-center text-sm text-green-500">
              Mot de passe réinitialisé avec succès ! Redirection...
            </p>
          )}
          <div className="mb-4 space-y-4">
            <div>
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isSuccess}
              />
            </div>
            <div>
              <Label htmlFor="re-new-password">Confirmer le mot de passe</Label>
              <Input
                id="re-new-password"
                type="password"
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
                required
                disabled={isSuccess}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
            {isLoading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
}