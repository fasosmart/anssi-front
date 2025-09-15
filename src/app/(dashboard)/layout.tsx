"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserNav } from "@/components/layout/UserNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { EntityProvider } from "@/contexts/EntityContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EntityProvider>
      <SidebarProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
          <AppSidebar />
          <div className="flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
              <SidebarTrigger className="sm:hidden" />
              <div className="relative ml-auto flex items-center gap-2 md:grow-0">
                <ThemeToggle />
                <UserNav />
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              <AppBreadcrumb />
              {children}
            </main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </EntityProvider>
  );
}