import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const usPosts = await prisma.post.findMany({
      where: { country: "US" },
      select: {
        category: true,
        score: true,
        title: true,
        body: true,
      },
    });

    const usKeywords = await prisma.keyword.findMany({
      orderBy: { frequency: "desc" },
      take: 10,
    });

    const usCategoryCounts = new Map<string, number>();
    for (const post of usPosts) {
      usCategoryCounts.set(
        post.category,
        (usCategoryCounts.get(post.category) ?? 0) + 1
      );
    }

    const usTopActivities = Array.from(usCategoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const koreaData = {
      code: "KR",
      name: "한국 걸스카우트",
      topActivities: [
        "야영/캠핑",
        "봉사활동",
        "배지 취득",
        "리더십 교육",
        "국제 교류",
      ],
      topTopics: [
        "회원 모집",
        "청소년 참여",
        "디지털 전환",
        "지역 사회 연계",
        "환경 보호",
      ],
      interests: [
        "사회적 가치 실현",
        "글로벌 리더십",
        "STEM 교육",
        "문화 교류",
        "자연 친화 활동",
      ],
      problems: [
        "회원 감소",
        "지도자 부족",
        "디지털 네이티브 세대 참여 저조",
        "프로그램 인지도 부족",
        "지역별 활동 격차",
      ],
      postCount: 0,
      avgScore: 0,
    };

    const usData = {
      code: "US",
      name: "미국 걸스카우트 (r/girlscouts)",
      topActivities: usTopActivities,
      topTopics: usKeywords.slice(0, 5).map((k) => k.keyword),
      interests: usKeywords.slice(5, 10).map((k) => k.keyword),
      problems: extractProblems(usPosts),
      postCount: usPosts.length,
      avgScore:
        usPosts.length > 0
          ? Math.round(
              usPosts.reduce((sum, p) => sum + p.score, 0) / usPosts.length
            )
          : 0,
    };

    return NextResponse.json({ countries: [usData, koreaData] });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison data" },
      { status: 500 }
    );
  }
}

function extractProblems(
  posts: { title: string; body: string }[]
): string[] {
  const problemKeywords = [
    "problem",
    "issue",
    "struggle",
    "difficult",
    "frustrat",
    "help",
    "advice",
    "concern",
    "worry",
  ];

  const problemPosts = posts.filter((p) => {
    const text = `${p.title} ${p.body}`.toLowerCase();
    return problemKeywords.some((kw) => text.includes(kw));
  });

  return problemPosts
    .slice(0, 5)
    .map((p) => p.title.slice(0, 80));
}
