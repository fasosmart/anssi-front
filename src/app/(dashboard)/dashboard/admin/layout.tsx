"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import { AdminGuard } from "@/components/layout/AdminGuard";
import { EntityProvider } from "@/contexts/EntityContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserNav } from "@/components/layout/UserNav";
import { PermissionsProvider } from "@/contexts/PermissionsContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      {/* Le PermissionsProvider charge une fois les permissions staff et les met en cache pour tout l'espace admin */}
      <PermissionsProvider>
        <EntityProvider>
          <SidebarProvider>
            <div className="grid min-h-[calc(100vh-56px)] w-full grid-cols-1 gap-0 md:grid-cols-[240px_1fr]">
              <aside className="hidden md:block border-r bg-background">
                <AppSidebar />
              </aside>
              <main className="flex flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                  <SidebarTrigger className="sm:hidden" />
                  <div className="relative ml-auto flex items-center gap-2 md:grow-0">
                    <ThemeToggle />
                    <UserNav />
                  </div>
                </header>
                <div className="p-4 md:p-6">
                  <AppBreadcrumb />
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </EntityProvider>
      </PermissionsProvider>
    </AdminGuard>
  );
}


