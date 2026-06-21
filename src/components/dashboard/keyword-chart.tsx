"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeywordChartProps {
  data: { keyword: string; frequency: number }[];
}

export function KeywordChart({ data }: KeywordChartProps) {
  const chartData = data.slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle>인기 키워드 (상위 15)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="keyword"
              type="category"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar dataKey="frequency" fill="#059669" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
