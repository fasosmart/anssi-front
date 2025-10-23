"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Building, 
  Users, 
  List,
  Plus
} from "lucide-react";
import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: "default" | "outline";
}

interface QuickActionsProps {
  className?: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Nouvelle demande",
    description: "Créer une demande",
    icon: FileText,
    href: "/dashboard/user/dossiers/new",
    variant: "default"
  },
  {
    title: "Nouvelle structure",
    description: "Ajouter une nouvelle",
    icon: Building,
    href: "/dashboard/user/entities/new",
    variant: "outline"
  },
  {
    title: "Ajouter représentant",
    description: "Gérer les représentants",
    icon: Users,
    href: "/dashboard/user/representatives",
    variant: "outline"
  },
  {
    title: "Mes demandes",
    description: "Voir toutes les demandes",
    icon: List,
    href: "/dashboard/user/dossiers",
    variant: "outline"
  }
];

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {action.description}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
