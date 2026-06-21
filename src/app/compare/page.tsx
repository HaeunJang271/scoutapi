"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from "lucide-react";
import type { CountryComparison } from "@/types";

export default function ComparePage() {
  const [data, setData] = useState<CountryComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/compare");
        const json = await res.json();
        setData(json);
      } catch {
        console.error("Failed to load comparison data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = data?.countries.map((c) => ({
    name: c.name,
    게시글수: c.postCount,
    평균업보트: c.avgScore,
    인기활동수: c.topActivities.length,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Globe className="h-6 w-6 text-emerald-600" />
            국가별 비교
          </h1>
          <p className="text-sm text-slate-500">
            미국 vs 한국 걸스카우트 커뮤니티 비교 (확장 가능 설계)
          </p>
        </div>

        {loading ? (
          <Skeleton className="h-96" />
        ) : data ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>비교 차트</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="게시글수" fill="#059669" />
                    <Bar dataKey="평균업보트" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {data.countries.map((country) => (
                <Card key={country.code}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge>{country.code}</Badge>
                      {country.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-700">
                        인기 활동
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.topActivities.map((a) => (
                          <Badge key={a} variant="secondary">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-700">
                        자주 언급되는 주제
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.topTopics.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-700">
                        관심사
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.interests.map((i) => (
                          <Badge key={i} variant="secondary">
                            {i}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-700">
                        문제점
                      </h4>
                      <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                        {country.problems.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
