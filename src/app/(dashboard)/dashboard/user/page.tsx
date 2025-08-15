import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenue, {session.user.name ?? "Utilisateur"} !
        </h1>
        <p className="text-muted-foreground">
          Vous êtes prêt à commencer. Prochaine étape : enregistrer votre structure.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/user/structure">Enregistrer ma structure</Link>
        </Button>
      </div>
    </div>
  );
}