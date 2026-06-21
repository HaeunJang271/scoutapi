export const CATEGORIES = [
  "쿠키 판매",
  "배지 활동",
  "캠핑/야외활동",
  "리더십",
  "Gold Award",
  "Silver Award",
  "부대(Troop) 운영",
  "STEM",
  "봉사활동",
  "국제교류",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface RedditPost {
  id: string;
  title: string;
  body: string;
  score: number;
  comments: number;
  author: string;
  createdAt: Date;
  permalink: string;
  flair: string | null;
}

export interface DashboardStats {
  totalPosts: number;
  avgScore: number;
  avgComments: number;
  mostActiveMonth: string;
  monthlyPosts: { month: string; count: number }[];
  monthlyAvgScore: { month: string; avgScore: number }[];
  monthlyAvgComments: { month: string; avgComments: number }[];
  topKeywords: { keyword: string; frequency: number }[];
  topicDistribution: { name: string; count: number }[];
}

export interface SearchFilters {
  keyword?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AnalysisResult {
  topTopics: string;
  memberProblems: string;
  leaderProblems: string;
  popularActivities: string;
  recentTrends: string;
  communityMood: string;
  activationIdeas: string;
}

export interface InnovationResult {
  membershipDecline: string;
  popularPrograms: string;
  newBadgeIdeas: string;
  teenPreferences: string;
  koreaRevivalStrategy: string;
}

export interface CountryComparison {
  countries: {
    code: string;
    name: string;
    topActivities: string[];
    topTopics: string[];
    interests: string[];
    problems: string[];
    postCount: number;
    avgScore: number;
  }[];
}
