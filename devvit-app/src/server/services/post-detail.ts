import { reddit } from '@devvit/web/server';
import { categorizePost } from '../../shared/categorizer';
import { parsePostDate } from '../../shared/dates';
import type { PostComment, PostDetail } from '../../shared/api';

function normalizePostId(postId: string): `t3_${string}` {
  return (postId.startsWith('t3_') ? postId : `t3_${postId}`) as `t3_${string}`;
}

function mapFlair(flair: unknown): string | null {
  if (typeof flair === 'string') return flair;
  if (flair && typeof flair === 'object' && 'text' in flair) {
    const text = (flair as { text?: string }).text;
    return text ?? null;
  }
  return null;
}

export async function fetchPostDetail(postId: string): Promise<PostDetail> {
  const normalizedId = normalizePostId(postId);
  const rawPost = await reddit.getPostById(normalizedId);

  const rawComments = await reddit
    .getComments({
      postId: normalizedId,
      limit: 100,
      pageSize: 50,
    })
    .all();

  const title = rawPost.title ?? 'Untitled';
  const body = rawPost.body ?? '';

  const commentList: PostComment[] = rawComments
    .filter((raw) => Boolean(raw.id))
    .map((raw) => ({
      id: String(raw.id),
      author: raw.authorName ?? 'unknown',
      body: raw.body?.trim() ? raw.body : '[deleted or empty]',
      score: raw.score ?? 0,
      createdAt: parsePostDate(raw.createdAt).toISOString(),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const permalink = rawPost.permalink
    ? rawPost.permalink.startsWith('http')
      ? rawPost.permalink
      : `https://www.reddit.com${rawPost.permalink}`
    : `https://www.reddit.com/comments/${normalizedId.replace('t3_', '')}`;

  return {
    id: rawPost.id ?? normalizedId,
    title,
    body,
    score: rawPost.score ?? 0,
    comments: rawPost.numberOfComments ?? commentList.length,
    author: rawPost.authorName ?? 'unknown',
    createdAt: parsePostDate(rawPost.createdAt).toISOString(),
    permalink,
    flair: mapFlair(rawPost.flair),
    category: categorizePost(title, body),
    commentList,
  };
}
