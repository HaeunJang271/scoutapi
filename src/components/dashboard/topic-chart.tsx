"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicChartProps {
  data: { name: string; count: number }[];
}

const COLORS = [
  "#059669", "#2563eb", "#7c3aed", "#db2777", "#ea580c",
  "#ca8a04", "#0891b2", "#4f46e5", "#be185d", "#65a30d", "#6b7280",
];

export function TopicChart({ data }: TopicChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주제 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={140}
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
