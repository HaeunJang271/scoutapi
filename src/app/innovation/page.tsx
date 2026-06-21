"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import type { InnovationResult } from "@/types";

const sections: { key: keyof InnovationResult; title: string }[] = [
  { key: "membershipDecline", title: "회원 감소 원인 분석" },
  { key: "popularPrograms", title: "인기 프로그램 분석" },
  { key: "newBadgeIdeas", title: "신규 배지 아이디어" },
  { key: "teenPreferences", title: "청소년 선호 활동 분석" },
  { key: "koreaRevivalStrategy", title: "한국 걸스카우트 부흥 전략 제안" },
];

export default function InnovationPage() {
  const { data: session } = useSession();
  const [analysis, setAnalysis] = useState<InnovationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analysis/innovation");
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch {
      console.error("Failed to load innovation analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleGenerate = async () => {
    if (!session) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/analysis/innovation", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
      }
    } catch {
      console.error("Failed to generate innovation analysis");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              걸스카우트 혁신 연구 모드
            </h1>
            <p className="text-sm text-slate-500">
              AI 기반 전략적 인사이트 및 혁신 아이디어
            </p>
          </div>
          {session && (
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              혁신 분석 생성
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : analysis ? (
          <div className="grid gap-4">
            {sections.map((section) => (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {analysis[section.key]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">
              {session
                ? '데이터를 수집한 후 "혁신 분석 생성" 버튼을 클릭하세요.'
                : "혁신 분석을 생성하려면 로그인하세요."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
