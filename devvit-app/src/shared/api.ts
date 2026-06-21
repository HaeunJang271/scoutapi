export const CATEGORIES = [
  '쿠키 판매',
  '배지 활동',
  '캠핑/야외활동',
  '리더십',
  'Gold Award',
  'Silver Award',
  '부대(Troop) 운영',
  'STEM',
  '봉사활동',
  '국제교류',
  '기타',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface AnalyzedPost {
  id: string;
  title: string;
  body: string;
  score: number;
  comments: number;
  author: string;
  createdAt: string;
  permalink: string;
  flair: string | null;
  category: Category;
}

export interface DashboardData {
  totalPosts: number;
  avgScore: number;
  avgComments: number;
  mostActiveMonth: string;
  monthlyPosts: { month: string; count: number }[];
  monthlyAvgScore: { month: string; avgScore: number }[];
  monthlyAvgComments: { month: string; avgComments: number }[];
  topKeywords: { keyword: string; frequency: number }[];
  domainKeywords: { keyword: string; frequency: number }[];
  topicDistribution: { name: string; count: number }[];
  recentPosts: AnalyzedPost[];
  lastUpdated: string;
  subreddit: string;
}

export type InitResponse = {
  type: 'init';
  username: string;
  data: DashboardData | null;
  isModerator: boolean;
};

export type RefreshResponse = {
  type: 'refresh';
  data: DashboardData;
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};

export interface PostComment {
  id: string;
  author: string;
  body: string;
  score: number;
  createdAt: string;
}

export interface PostDetail {
  id: string;
  title: string;
  body: string;
  score: number;
  comments: number;
  author: string;
  createdAt: string;
  permalink: string;
  flair: string | null;
  category: Category;
  commentList: PostComment[];
}

export type PostDetailResponse = {
  type: 'postDetail';
  post: PostDetail;
};
