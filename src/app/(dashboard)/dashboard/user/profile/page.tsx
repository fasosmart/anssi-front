import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez les informations de votre compte.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Ces informations sont utilisées pour identifier votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Nom complet</p>
            <p className="text-muted-foreground">{session.user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Adresse e-mail</p>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>Modifier les informations</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Gérez les paramètres de sécurité de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* We will add password change logic here later */}
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled>Changer le mot de passe</Button>
        </CardFooter>
      </Card>
    </div>
  );
}