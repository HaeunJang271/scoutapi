import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DashboardData,
  ErrorResponse,
  InitResponse,
  PostDetailResponse,
  RefreshResponse,
} from '../../shared/api';
import {
  buildDashboard,
  CACHE_KEY,
  CACHE_TTL_SECONDS,
  fetchGirlScoutPosts,
} from '../services/analyzer';
import { fetchPostDetail } from '../services/post-detail';

export const api = new Hono();

async function getCachedData(): Promise<DashboardData | null> {
  const cached = await redis.get(CACHE_KEY);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as DashboardData;
  } catch {
    return null;
  }
}

async function saveCache(data: DashboardData): Promise<void> {
  await redis.set(CACHE_KEY, JSON.stringify(data), {
    expiration: new Date(Date.now() + CACHE_TTL_SECONDS * 1000),
  });
}

async function checkModerator(): Promise<boolean> {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username || !context.subredditName) return false;
    const mods = await reddit
      .getModerators({ subredditName: context.subredditName, limit: 100 })
      .all();
    return mods.some(
      (mod) => (mod as { username?: string }).username === username
    );
  } catch {
    return false;
  }
}

api.get('/init', async (c) => {
  try {
    const [username, data, isModerator] = await Promise.all([
      reddit.getCurrentUsername(),
      getCachedData(),
      checkModerator(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      username: username ?? 'anonymous',
      data,
      isModerator,
    });
  } catch (error) {
    console.error('Init error:', error);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to initialize dashboard' },
      500
    );
  }
});

api.post('/refresh', async (c) => {
  const isModerator = await checkModerator();
  if (!isModerator) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Only moderators can refresh data' },
      403
    );
  }

  try {
    const posts = await fetchGirlScoutPosts(reddit);
    const data = buildDashboard(posts);
    await saveCache(data);

    return c.json<RefreshResponse>({
      type: 'refresh',
      data,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch Reddit data';
    return c.json<ErrorResponse>({ status: 'error', message }, 500);
  }
});

api.get('/posts/:postId', async (c) => {
  const postId = c.req.param('postId');
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'Post ID is required' }, 400);
  }

  try {
    const post = await fetchPostDetail(postId);
    return c.json<PostDetailResponse>({ type: 'postDetail', post });
  } catch (error) {
    console.error('Post detail error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to load post details';
    return c.json<ErrorResponse>({ status: 'error', message }, 500);
  }
});
