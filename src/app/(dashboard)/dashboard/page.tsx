import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Bienvenue sur votre tableau de bord, {session.user?.name}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          C'est ici que vous gérerez votre structure et vos demandes d'accréditation.
        </p>
        <p className="mt-4 text-sm">
          Votre email: {session.user?.email}
        </p>
        {/* We will add a sign out button later */}
      </div>
    </div>
  );
}