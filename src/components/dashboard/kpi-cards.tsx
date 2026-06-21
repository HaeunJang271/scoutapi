"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { FileText, ThumbsUp, MessageCircle, Calendar } from "lucide-react";

interface KpiCardsProps {
  totalPosts: number;
  avgScore: number;
  avgComments: number;
  mostActiveMonth: string;
}

export function KpiCards({
  totalPosts,
  avgScore,
  avgComments,
  mostActiveMonth,
}: KpiCardsProps) {
  const cards = [
    {
      title: "전체 게시글 수",
      value: formatNumber(totalPosts),
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "평균 업보트 수",
      value: formatNumber(avgScore),
      icon: ThumbsUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "평균 댓글 수",
      value: formatNumber(avgComments),
      icon: MessageCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "가장 활발한 월",
      value: mostActiveMonth,
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
