import type { AnalyzedPost, DashboardData } from '../../shared/api';
import { categorizePost } from '../../shared/categorizer';
import { extractKeywords, getTopKeywords } from '../../shared/keywords';
import { filterGirlScoutKeywords } from '../../shared/domain-terms';
import { fillLast12Months, formatMonth, parsePostDate } from '../../shared/dates';

const SUBREDDIT = 'girlscouts';
const CACHE_KEY = 'analysis:girlscouts';
const CACHE_TTL_SECONDS = 60 * 60 * 6; // 6 hours

export function buildDashboard(posts: AnalyzedPost[]): DashboardData {
  const totalPosts = posts.length;
  const avgScore =
    totalPosts > 0
      ? Math.round(posts.reduce((sum, p) => sum + p.score, 0) / totalPosts)
      : 0;
  const avgComments =
    totalPosts > 0
      ? Math.round((posts.reduce((sum, p) => sum + p.comments, 0) / totalPosts) * 10) / 10
      : 0;

  const monthlyMap = new Map<
    string,
    { count: number; totalScore: number; totalComments: number }
  >();

  for (const post of posts) {
    const month = formatMonth(parsePostDate(post.createdAt));
    if (month === 'unknown') continue;
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

  const monthlyPosts = fillLast12Months(
    Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, count: data.count }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    'count',
    0
  );

  const monthlyAvgScore = fillLast12Months(
    Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        avgScore: Math.round(data.totalScore / data.count),
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    'avgScore',
    0
  );

  const monthlyAvgComments = fillLast12Months(
    Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        avgComments: Math.round((data.totalComments / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    'avgComments',
    0
  );

  const mostActiveMonth =
    monthlyMap.size > 0
      ? Array.from(monthlyMap.entries()).reduce((max, curr) =>
          curr[1].count > max[1].count ? curr : max
        )[0]
      : '-';

  const keywordMap = extractKeywords(posts.map((p) => `${p.title} ${p.body}`));
  const topKeywords = getTopKeywords(keywordMap, 50);
  const domainKeywords = filterGirlScoutKeywords(topKeywords, 50);

  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
  }

  const topicDistribution = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const recentPosts = posts
    .filter((p) => parsePostDate(p.createdAt).getTime() >= oneYearAgo)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return {
    totalPosts,
    avgScore,
    avgComments,
    mostActiveMonth,
    monthlyPosts,
    monthlyAvgScore,
    monthlyAvgComments,
    topKeywords,
    domainKeywords,
    topicDistribution,
    recentPosts,
    lastUpdated: new Date().toISOString(),
    subreddit: SUBREDDIT,
  };
}

export async function fetchGirlScoutPosts(
  reddit: {
    getHotPosts: (opts: object) => { all: () => Promise<unknown[]> };
    getNewPosts: (opts: object) => { all: () => Promise<unknown[]> };
    getTopPosts: (opts: object) => { all: () => Promise<unknown[]> };
  }
): Promise<AnalyzedPost[]> {
  const fetchOptions = {
    subredditName: SUBREDDIT,
    limit: 200,
    pageSize: 100,
  };

  const [hotRaw, newRaw, topRaw] = await Promise.all([
    reddit.getHotPosts(fetchOptions).all(),
    reddit.getNewPosts(fetchOptions).all(),
    reddit.getTopPosts({ ...fetchOptions, timeframe: 'year' }).all(),
  ]);

  const postMap = new Map<string, AnalyzedPost>();

  for (const raw of [...hotRaw, ...newRaw, ...topRaw]) {
    const post = raw as {
      id: string;
      title?: string;
      body?: string;
      score?: number;
      numberOfComments?: number;
      authorName?: string;
      createdAt?: Date | string | number;
      permalink?: string;
      flair?: { text?: string } | null;
      linkFlairText?: string | null;
    };

    if (!post.id || !post.title) continue;

    const flairText =
      post.linkFlairText ??
      (typeof post.flair === 'object' && post.flair?.text ? post.flair.text : null);

    postMap.set(post.id, {
      id: post.id,
      title: post.title,
      body: post.body ?? '',
      score: post.score ?? 0,
      comments: post.numberOfComments ?? 0,
      author: post.authorName ?? 'unknown',
      createdAt: parsePostDate(post.createdAt).toISOString(),
      permalink: post.permalink
        ? post.permalink.startsWith('http')
          ? post.permalink
          : `https://www.reddit.com${post.permalink}`
        : `https://www.reddit.com/r/${SUBREDDIT}/comments/${post.id}`,
      flair: flairText,
      category: categorizePost(post.title, post.body ?? ''),
    });
  }

  return Array.from(postMap.values());
}

export { CACHE_KEY, CACHE_TTL_SECONDS, SUBREDDIT };
