"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Home, Building, FileText, Users, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEntity } from "@/contexts/EntityContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  {
    href: "/dashboard/user",
    icon: Home,
    label: "Accueil",
    // alwaysVisible: true,
    requiresValidated: true,
    disabledMessage: "Disponible après validation de votre structure",
  },
  {
    href: "/dashboard/user/structure",
    icon: Building,
    label: "Ma Structure",
    alwaysVisible: true,
  },
  {
    href: "/dashboard/user/representatives",
    icon: Users,
    label: "Mes Représentants",
    requiresValidated: true,
    disabledMessage: "Disponible après validation de votre structure",
  },
  {
    href: "/dashboard/user/dossiers",
    icon: FileText,
    label: "Mes Demandes",
    requiresValidated: true,
    disabledMessage: "Disponible après validation de votre structure",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { canManageRepresentatives, canCreateDemands } = useEntity();

  return (
    <Sidebar className="hidden border-r md:block">
      <SidebarHeader className="p-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          ANSSI
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider>
                {menuItems.map((item) => {
                  const isDisabled = item.requiresValidated && !canManageRepresentatives();
                  const isActive = pathname === item.href;
                  
                  const menuButton = (
                    <SidebarMenuButton
                      asChild={!isDisabled}
                      isActive={isActive}
                      variant="default"
                      size="lg"
                      className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {isDisabled ? (
                        <div className="flex items-center gap-2 w-full">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                          <Lock className="h-4 w-4 ml-auto" />
                        </div>
                      ) : (
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  );

                  if (isDisabled) {
                    return (
                      <SidebarMenuItem key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {menuButton}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.disabledMessage}</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.href}>
                      {menuButton}
                    </SidebarMenuItem>
                  );
                })}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Can be used for additional info or actions */}
      </SidebarFooter>
    </Sidebar>
  );
}