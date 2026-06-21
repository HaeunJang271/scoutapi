import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { frequency: "desc" },
      take: 50,
    });
    return NextResponse.json(keywords);
  } catch (error) {
    console.error("Keywords error:", error);
    return NextResponse.json(
      { error: "Failed to fetch keywords" },
      { status: 500 }
    );
  }
}
