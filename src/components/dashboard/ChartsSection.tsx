"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartsSectionProps {
  demandsByStatus?: ChartData[];
  demandsTrend?: ChartData[];
  className?: string;
}

export function ChartsSection({ 
  demandsByStatus = [], 
  demandsTrend = [],
  className 
}: ChartsSectionProps) {
  // Données mockées pour l'instant - seront remplacées par les vraies données
  const mockDemandsByStatus = [
    { name: "En attente", value: 3, color: "#f59e0b" },
    { name: "Approuvées", value: 7, color: "#10b981" },
    { name: "Rejetées", value: 2, color: "#ef4444" },
    { name: "En examen", value: 1, color: "#3b82f6" },
  ];

  const mockDemandsTrend = [
    { name: "Jan", value: 2 },
    { name: "Fév", value: 4 },
    { name: "Mar", value: 3 },
    { name: "Avr", value: 5 },
    { name: "Mai", value: 7 },
    { name: "Juin", value: 6 },
  ];

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {/* Graphique en barres - Demandes par statut */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Demandes par statut
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockDemandsByStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique de tendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Évolution des demandes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockDemandsTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(item.value / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-6">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
