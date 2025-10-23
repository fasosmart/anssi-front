"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, Settings, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Entity } from "@/types/api";

interface ActiveEntityCardProps {
  entity?: Entity | null;
  className?: string;
}

const entityTypeLabels: { [key: string]: string } = {
  business: "Entreprise",
  ngo: "ONG",
  personal: "Particulier",
};

export function ActiveEntityCard({ entity, className }: ActiveEntityCardProps) {
  if (!entity) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Structure active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Aucune structure sélectionnée
            </p>
            <Button asChild>
              <Link href="/dashboard/user/entities">
                Choisir une structure
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Structure active
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations de la structure */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{entity.name}</h3>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {entityTypeLabels[entity.entity_type] || entity.entity_type}
            </Badge>
          </div>
          {entity.acronym && (
            <p className="text-sm text-muted-foreground">{entity.acronym}</p>
          )}
          {entity.business_sector && (
            <p className="text-sm text-muted-foreground">{entity.business_sector}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/dashboard/user/structure">
              <Settings className="h-4 w-4 mr-2" />
              Gérer
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/dashboard/user/entities">
              <RotateCcw className="h-4 w-4 mr-2" />
              Changer
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
