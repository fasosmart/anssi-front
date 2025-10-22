"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserNav } from "@/components/layout/UserNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { EntityProvider } from "@/contexts/EntityContext";
import { EntityRedirectHandler } from "@/components/layout/EntityRedirectHandler";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // La sidebar est affichée uniquement si on n'est PAS sur ces chemins.
  const showSidebar = 
    !pathname.includes('/select-entity') && 
    !pathname.includes('/entities/new') &&
    !pathname.includes('/profile');
    
  // La classe de grille change en fonction de la présence de la sidebar
  const gridLayoutClass = showSidebar 
    ? "md:grid-cols-[auto_1fr]" // Grille avec sidebar
    : "md:grid-cols-1";          // Grille sans sidebar (une seule colonne principale)
    
  return (
    <EntityProvider>
      <EntityRedirectHandler>
        {/* Le SidebarProvider est toujours nécessaire car les boutons du header peuvent l'utiliser */}
        <SidebarProvider>
          <div className={`grid min-h-screen w-full ${gridLayoutClass}`}>
            
            {/* 1. SIDEBAR (Conditionnelle) */}
            {showSidebar && <AppSidebar />}

            <div className="flex flex-col">
              
              {/* 2. HEADER (Toujours présent) */}
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                {/* Le SidebarTrigger pour mobile est gardé si showSidebar est false, il affichera juste la sidebar vide/globale */}
                <SidebarTrigger className="sm:hidden" /> 
                <div className="relative ml-auto flex items-center gap-2 md:grow-0">
                  <ThemeToggle />
                  <UserNav />
                </div>
              </header>
              
              {/* 3. MAIN CONTENT (Toujours présent) */}
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                
                {/* Le Breadcrumb n'est pas utile sur les pages de sélection, on le rend conditionnel */}
                {showSidebar && <AppBreadcrumb />}
                
                {children}
              </main>
            </div>
            <Toaster />
          </div>
        </SidebarProvider>
      </EntityRedirectHandler>
    </EntityProvider>
  );
}
