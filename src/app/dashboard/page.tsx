"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PostCountChart } from "@/components/dashboard/post-count-chart";
import { ScoreChart } from "@/components/dashboard/score-chart";
import { CommentsChart } from "@/components/dashboard/comments-chart";
import { KeywordChart } from "@/components/dashboard/keyword-chart";
import { TopicChart } from "@/components/dashboard/topic-chart";
import { WordCloud } from "@/components/dashboard/word-cloud";
import { FetchDataButton } from "@/components/dashboard/fetch-data-button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
            <p className="text-sm text-slate-500">
              r/girlscouts 서브레딧 분석 현황
            </p>
          </div>
          <FetchDataButton onSuccess={fetchStats} />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : stats ? (
          <>
            <KpiCards
              totalPosts={stats.totalPosts}
              avgScore={stats.avgScore}
              avgComments={stats.avgComments}
              mostActiveMonth={stats.mostActiveMonth}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <PostCountChart data={stats.monthlyPosts} />
              <ScoreChart data={stats.monthlyAvgScore} />
            </div>

            <CommentsChart data={stats.monthlyAvgComments} />

            <div className="grid gap-6 lg:grid-cols-2">
              <KeywordChart data={stats.topKeywords} />
              <TopicChart data={stats.topicDistribution} />
            </div>

            <WordCloud data={stats.topKeywords} />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">
              데이터가 없습니다. 로그인 후 &quot;최신 데이터 가져오기&quot;를
              클릭하세요.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
