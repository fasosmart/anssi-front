"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartDataPoint {
  month: string;
  "En attente": number;
  "Approuvées": number;
  "Rejetées": number;
}

interface DemandsEvolutionChartProps {
  className?: string;
}

export function DemandsEvolutionChart({ className }: DemandsEvolutionChartProps) {
  // Données mockées pour l'évolution des demandes sur 6 mois
  const mockData: ChartDataPoint[] = [
    { month: "Jan", "En attente": 2, "Approuvées": 1, "Rejetées": 0 },
    { month: "Fév", "En attente": 3, "Approuvées": 2, "Rejetées": 1 },
    { month: "Mar", "En attente": 2, "Approuvées": 3, "Rejetées": 1 },
    { month: "Avr", "En attente": 4, "Approuvées": 4, "Rejetées": 1 },
    { month: "Mai", "En attente": 3, "Approuvées": 6, "Rejetées": 2 },
    { month: "Juin", "En attente": 3, "Approuvées": 7, "Rejetées": 2 },
  ];

  // Configuration des couleurs pour chaque ligne
  const colors = {
    "En attente": "#f59e0b", // orange
    "Approuvées": "#10b981", // vert
    "Rejetées": "#ef4444",   // rouge
  };

  // Format personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <span className="font-semibold">{entry.value} demande{entry.value > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Évolution des demandes
            </CardTitle>
            <CardDescription className="mt-1">
              Répartition des demandes par statut sur les 6 derniers mois
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mockData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="En attente"
              stroke={colors["En attente"]}
              strokeWidth={2}
              dot={{ fill: colors["En attente"], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Approuvées"
              stroke={colors["Approuvées"]}
              strokeWidth={2}
              dot={{ fill: colors["Approuvées"], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Rejetées"
              stroke={colors["Rejetées"]}
              strokeWidth={2}
              dot={{ fill: colors["Rejetées"], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

