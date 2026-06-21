import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInnovationAnalysis } from "@/lib/openai";

const CACHE_HOURS = 24;

export async function GET() {
  try {
    const cached = await prisma.analysis.findFirst({
      where: { type: "innovation" },
      orderBy: { createdAt: "desc" },
    });

    if (cached) {
      const ageHours =
        (Date.now() - cached.createdAt.getTime()) / (1000 * 60 * 60);
      if (ageHours < CACHE_HOURS) {
        return NextResponse.json(JSON.parse(cached.summary));
      }
    }

    return NextResponse.json(
      { message: "No cached innovation analysis. Run POST to generate." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Innovation GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch innovation analysis" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        body: true,
        score: true,
        comments: true,
        category: true,
      },
    });

    if (posts.length === 0) {
      return NextResponse.json(
        { error: "No posts available. Fetch Reddit data first." },
        { status: 400 }
      );
    }

    const keywords = await prisma.keyword.findMany({
      orderBy: { frequency: "desc" },
      take: 50,
    });

    const result = await generateInnovationAnalysis(posts, keywords);

    await prisma.analysis.create({
      data: {
        summary: JSON.stringify(result),
        type: "innovation",
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Innovation POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Innovation analysis failed" },
      { status: 500 }
    );
  }
}
