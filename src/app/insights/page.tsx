"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import type { AnalysisResult } from "@/types";

const sections: { key: keyof AnalysisResult; title: string }[] = [
  { key: "topTopics", title: "가장 많이 논의되는 주제" },
  { key: "memberProblems", title: "대원들이 자주 겪는 문제" },
  { key: "leaderProblems", title: "지도자들이 자주 겪는 문제" },
  { key: "popularActivities", title: "가장 인기 있는 활동" },
  { key: "recentTrends", title: "최근 트렌드 변화" },
  { key: "communityMood", title: "커뮤니티 분위기 분석" },
  { key: "activationIdeas", title: "걸스카우트 활성화 아이디어" },
];

export default function InsightsPage() {
  const { data: session } = useSession();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analysis");
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch {
      console.error("Failed to load analysis");
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
      const res = await fetch("/api/analysis", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
      }
    } catch {
      console.error("Failed to generate analysis");
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
              <Brain className="h-6 w-6 text-emerald-600" />
              AI 인사이트
            </h1>
            <p className="text-sm text-slate-500">
              OpenAI 기반 커뮤니티 분석 결과
            </p>
          </div>
          {session && (
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              분석 생성
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : analysis ? (
          <div className="grid gap-4 md:grid-cols-2">
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
                ? '데이터를 수집한 후 "분석 생성" 버튼을 클릭하세요.'
                : "분석 결과를 보려면 로그인하세요."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
