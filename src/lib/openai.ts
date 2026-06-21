import OpenAI from "openai";
import type { AnalysisResult, InnovationResult } from "@/types";

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

function buildPostSummary(
  posts: { title: string; body: string; score: number; comments: number; category: string }[]
): string {
  const sample = posts
    .sort((a, b) => b.score - a.score)
    .slice(0, 80)
    .map(
      (p, i) =>
        `[${i + 1}] (${p.category}) Score:${p.score} Comments:${p.comments}\nTitle: ${p.title}\n${p.body.slice(0, 300)}`
    )
    .join("\n\n");

  return sample.slice(0, 12000);
}

export async function generateGeneralAnalysis(
  posts: { title: string; body: string; score: number; comments: number; category: string }[],
  keywords: { keyword: string; frequency: number }[]
): Promise<AnalysisResult> {
  const client = getClient();
  const postSummary = buildPostSummary(posts);
  const keywordSummary = keywords
    .slice(0, 30)
    .map((k) => `${k.keyword}: ${k.frequency}`)
    .join(", ");

  const prompt = `You are an expert analyst of the Girl Scouts community on Reddit (r/girlscouts).
Analyze the following data and provide insights in Korean.

Top keywords: ${keywordSummary}

Sample posts:
${postSummary}

Respond in JSON format with these exact keys:
{
  "topTopics": "가장 많이 논의되는 주제 (상세 분석)",
  "memberProblems": "대원들이 자주 겪는 문제",
  "leaderProblems": "지도자들이 자주 겪는 문제",
  "popularActivities": "가장 인기 있는 활동",
  "recentTrends": "최근 트렌드 변화",
  "communityMood": "커뮤니티 분위기 분석",
  "activationIdeas": "걸스카우트 활성화 아이디어"
}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");

  return JSON.parse(content) as AnalysisResult;
}

export async function generateInnovationAnalysis(
  posts: { title: string; body: string; score: number; comments: number; category: string }[],
  keywords: { keyword: string; frequency: number }[]
): Promise<InnovationResult> {
  const client = getClient();
  const postSummary = buildPostSummary(posts);
  const keywordSummary = keywords
    .slice(0, 30)
    .map((k) => `${k.keyword}: ${k.frequency}`)
    .join(", ");

  const prompt = `You are a Girl Scouts innovation researcher. Analyze r/girlscouts data for strategic insights.
Compare with global Girl Scout/Girl Guide movements including Korea.

Top keywords: ${keywordSummary}

Sample posts:
${postSummary}

Respond in JSON format with these exact keys (all in Korean):
{
  "membershipDecline": "회원 감소 원인 분석",
  "popularPrograms": "인기 프로그램 분석",
  "newBadgeIdeas": "신규 배지 아이디어 제안",
  "teenPreferences": "청소년 선호 활동 분석",
  "koreaRevivalStrategy": "한국 걸스카우트 부흥 전략 제안"
}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");

  return JSON.parse(content) as InnovationResult;
}
