import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const posts = await prisma.post.findMany({
    select: {
      score: true,
      comments: true,
      createdAt: true,
      category: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const totalPosts = posts.length;
  const avgScore =
    totalPosts > 0
      ? Math.round(posts.reduce((sum, p) => sum + p.score, 0) / totalPosts)
      : 0;
  const avgComments =
    totalPosts > 0
      ? Math.round(
          (posts.reduce((sum, p) => sum + p.comments, 0) / totalPosts) * 10
        ) / 10
      : 0;

  const monthlyMap = new Map<
    string,
    { count: number; totalScore: number; totalComments: number }
  >();

  for (const post of posts) {
    const month = format(post.createdAt, "yyyy-MM");
    const existing = monthlyMap.get(month) ?? {
      count: 0,
      totalScore: 0,
      totalComments: 0,
    };
    existing.count += 1;
    existing.totalScore += post.score;
    existing.totalComments += post.comments;
    monthlyMap.set(month, existing);
  }

  const monthlyPosts = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, count: data.count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const monthlyAvgScore = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      avgScore: Math.round(data.totalScore / data.count),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const monthlyAvgComments = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      avgComments: Math.round((data.totalComments / data.count) * 10) / 10,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const mostActiveMonth =
    monthlyPosts.length > 0
      ? monthlyPosts.reduce((max, curr) =>
          curr.count > max.count ? curr : max
        ).month
      : "-";

  const topKeywords = await prisma.keyword.findMany({
    orderBy: { frequency: "desc" },
    take: 50,
    select: { keyword: true, frequency: true },
  });

  const topics = await prisma.topic.findMany({
    orderBy: { count: "desc" },
    select: { name: true, count: true },
  });

  return {
    totalPosts,
    avgScore,
    avgComments,
    mostActiveMonth,
    monthlyPosts,
    monthlyAvgScore,
    monthlyAvgComments,
    topKeywords,
    topicDistribution: topics,
  };
}
