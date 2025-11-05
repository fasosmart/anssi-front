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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  Mail, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Save,
  Key,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { UserAPI } from "@/lib/api";

export default function AdminProfilePage() {
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

  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.first_name || "");
      setLastName(session.user.last_name || "");
    }
  }, [session]);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoadingPermissions(true);
      try {
        const data = await UserAPI.getPermissions();
        // L'API retourne soit un tableau, soit un objet avec une propriété permissions
        setPermissions(Array.isArray(data) ? data : (data?.permissions || []));
      } catch (e) {
        console.error("Erreur lors du chargement des permissions:", e);
        toast.error("Impossible de charger les permissions");
        setPermissions([]);
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    fetchPermissions();
  }, []);
  
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
      
      await update({ 
        user: { 
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}` 
        } 
      });
      
      setSuccess("Profil mis à jour avec succès !");
      toast.success("Profil mis à jour avec succès");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setSecurityError("Les nouveaux mots de passe ne correspondent pas.");
      toast.error("Les nouveaux mots de passe ne correspondent pas");
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
      toast.success("Mot de passe mis à jour avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setSecurityError(err.message);
        toast.error(err.message);
      } else {
        setSecurityError("Une erreur inattendue est survenue.");
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setIsSecurityLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil Administrateur</h1>
        <p className="text-muted-foreground">
          Gérez les informations de votre compte administrateur et consultez vos permissions
        </p>
      </div>

      {/* Informations personnelles */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Informations personnelles</CardTitle>
            </div>
            <CardDescription>
              Modifiez votre nom et prénom ici. Votre adresse e-mail n&apos;est pas modifiable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Adresse e-mail</span>
                </Label>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {session.user?.email}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Statut administrateur</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    {session.user?.is_staff ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Utilisateur standard
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* {session.user?.is_superuser && (
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Super utilisateur</span>
                    </Label>
                    <Badge variant="default" className="bg-purple-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Super administrateur
                    </Badge>
                  </div>
                )} */}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <CardTitle>Permissions</CardTitle>
          </div>
          <CardDescription>
            Liste des permissions associées à votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPermissions ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : permissions.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {permissions.map((permission, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-3 bg-muted rounded-md border"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{permission}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune permission spécifique n&apos;a été trouvée pour votre compte.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Sécurité</CardTitle>
          </div>
          <CardDescription>
            Modifiez votre mot de passe pour renforcer la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSecuritySubmit}>
          <CardContent className="space-y-4">
            {securityError && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{securityError}</p>
              </div>
            )}
            {securitySuccess && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">{securitySuccess}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
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
                placeholder="Entrez votre nouveau mot de passe"
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
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" type="submit" disabled={isSecurityLoading}>
              <Key className="h-4 w-4 mr-2" />
              {isSecurityLoading ? "Modification..." : "Changer le mot de passe"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

