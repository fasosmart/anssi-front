"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);


  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.first_name || "");
      setLastName(session.user.last_name || "");
    }
  }, [session]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        throw new Error("La mise à jour a échoué. Veuillez réessayer.");
      }
      
      // Update the session with new user data
      await update({ 
        user: { 
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}` 
        } 
      });
      
      setSuccess("Profil mis à jour avec succès !");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setSecurityError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/set_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("La modification du mot de passe a échoué. Vérifiez votre mot de passe actuel.");
      }
      
      setSecuritySuccess("Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err: any) {
      setSecurityError(err.message);
    } finally {
      setIsSecurityLoading(false);
    }
  };

  if (!session) {
    return <div>Chargement...</div>; // Or a proper loader
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez les informations de votre compte.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Modifiez votre nom et prénom ici.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Adresse e-mail (non modifiable)</p>
              <p className="text-muted-foreground">{session.user?.email}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Modifiez votre mot de passe ici.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSecuritySubmit}>
          <CardContent className="space-y-4">
            {securityError && <p className="text-sm text-destructive">{securityError}</p>}
            {securitySuccess && <p className="text-sm text-green-600">{securitySuccess}</p>}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input 
                id="newPassword" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
              <Input 
                id="confirmNewPassword" 
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" type="submit" disabled={isSecurityLoading}>
              {isSecurityLoading ? "Modification..." : "Changer le mot de passe"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}