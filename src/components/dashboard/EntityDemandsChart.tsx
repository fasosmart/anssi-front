"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface EntityChartPoint {
  label: string;
  demandes: number;
  structures: number;
}

interface EntityDemandsChartProps {
  data: EntityChartPoint[];
}

const monthShort = (month: number) => {
  const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
  return labels[Math.max(0, Math.min(11, month - 1))] ?? String(month);
};

export function EntityDemandsChart({ data }: EntityDemandsChartProps) {
  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Évolution des demandes & structures
            </CardTitle>
            <CardDescription className="mt-1">
              Tendances mensuelles des demandes d&apos;accréditation et des structures liées à cette entité.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md text-sm space-y-1">
                      <p className="font-medium mb-1">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">{entry.name}</span>
                          <span className="font-semibold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
            {hasData && (
              <>
                <Line
                  type="monotone"
                  dataKey="demandes"
                  name="Demandes d'accréditation"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={700}
                />
                <Line
                  type="monotone"
                  dataKey="structures"
                  name="Structures"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={700}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
        {!hasData && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Aucune donnée de tendance disponible pour le moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}


