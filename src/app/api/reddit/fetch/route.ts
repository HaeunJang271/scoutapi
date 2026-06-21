import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchGirlScoutPosts } from "@/lib/reddit";
import { categorizePost } from "@/lib/categorizer";
import { extractKeywords, getTopKeywords } from "@/lib/keywords";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redditPosts = await fetchGirlScoutPosts();
    let created = 0;
    let updated = 0;

    for (const post of redditPosts) {
      const category = categorizePost(post.title, post.body);
      const existing = await prisma.post.findUnique({
        where: { redditId: post.id },
      });

      if (existing) {
        await prisma.post.update({
          where: { redditId: post.id },
          data: {
            title: post.title,
            body: post.body,
            score: post.score,
            comments: post.comments,
            author: post.author,
            createdAt: post.createdAt,
            permalink: post.permalink,
            flair: post.flair,
            category,
            topic: category,
          },
        });
        updated++;
      } else {
        await prisma.post.create({
          data: {
            redditId: post.id,
            title: post.title,
            body: post.body,
            score: post.score,
            comments: post.comments,
            author: post.author,
            createdAt: post.createdAt,
            permalink: post.permalink,
            flair: post.flair,
            category,
            topic: category,
            country: "US",
          },
        });
        created++;
      }
    }

    const allPosts = await prisma.post.findMany({
      select: { title: true, body: true, category: true },
    });

    const keywordMap = extractKeywords(
      allPosts.map((p) => `${p.title} ${p.body}`)
    );
    const topKeywords = getTopKeywords(keywordMap, 50);

    await prisma.$transaction([
      prisma.keyword.deleteMany(),
      ...topKeywords.map((k) =>
        prisma.keyword.upsert({
          where: { keyword: k.keyword },
          create: { keyword: k.keyword, frequency: k.frequency },
          update: { frequency: k.frequency },
        })
      ),
    ]);

    const categoryCounts = new Map<string, number>();
    for (const post of allPosts) {
      categoryCounts.set(
        post.category,
        (categoryCounts.get(post.category) ?? 0) + 1
      );
    }

    await prisma.$transaction([
      prisma.topic.deleteMany(),
      ...Array.from(categoryCounts.entries()).map(([name, count]) =>
        prisma.topic.create({ data: { name, count } })
      ),
    ]);

    return NextResponse.json({
      success: true,
      total: redditPosts.length,
      created,
      updated,
      keywords: topKeywords.length,
    });
  } catch (error) {
    console.error("Reddit fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch data" },
      { status: 500 }
    );
  }
}
