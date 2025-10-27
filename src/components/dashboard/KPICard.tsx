"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description,
  className 
}: KPICardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs">
            <span 
              className={cn(
                "font-medium",
                change.type === "positive" && "text-green-600",
                change.type === "negative" && "text-red-600",
                change.type === "neutral" && "text-muted-foreground"
              )}
            >
              {change.value}
            </span>
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
