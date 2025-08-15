"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <header className="flex items-center justify-end md:justify-between mb-4">
            {/* Can add breadcrumbs or page title here */}
            <SidebarTrigger className="hidden md:flex" />
             {/* We can add the UserNav here again for consistency */}
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}