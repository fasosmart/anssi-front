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
import { Home, Building, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Accueil",
  },
  {
    href: "/dashboard/structure",
    icon: Building,
    label: "Ma Structure",
  },
  {
    href: "/dashboard/dossiers",
    icon: FileText,
    label: "Mes Dossiers",
  },
  {
    href: "/dashboard/profile",
    icon: User,
    label: "Mon Profil",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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