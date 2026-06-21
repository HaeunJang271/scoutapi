import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context, redis } from '@devvit/web/server';
import { createPost } from '../core/post';
import {
  buildDashboard,
  CACHE_KEY,
  CACHE_TTL_SECONDS,
  fetchGirlScoutPosts,
} from '../services/analyzer';
import { reddit } from '@devvit/web/server';

export const menu = new Hono();

menu.post('/post-create', async (c) => {
  try {
    const post = await createPost();

    return c.json<UiResponse>(
      {
        navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
      },
      200
    );
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    return c.json<UiResponse>({ showToast: 'Failed to create dashboard post' }, 400);
  }
});

menu.post('/refresh-data', async (c) => {
  try {
    const posts = await fetchGirlScoutPosts(reddit);
    const data = buildDashboard(posts);
    await redis.set(CACHE_KEY, JSON.stringify(data), {
      expiration: new Date(Date.now() + CACHE_TTL_SECONDS * 1000),
    });

    return c.json<UiResponse>(
      {
        showToast: `Data refreshed: ${data.totalPosts} posts analyzed`,
      },
      200
    );
  } catch (error) {
    console.error(`Error refreshing data: ${error}`);
    return c.json<UiResponse>({ showToast: 'Failed to refresh data' }, 400);
  }
});
