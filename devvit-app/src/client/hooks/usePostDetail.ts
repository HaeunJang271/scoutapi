import { useCallback, useState } from 'react';
import type { PostDetail } from '../../shared/api';

export function usePostDetail() {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openPost = useCallback(async (postId: string) => {
    setLoading(true);
    setError('');
    setPost(null);

    try {
      const encodedId = encodeURIComponent(postId);
      const res = await fetch(`/api/posts/${encodedId}`);
      const json = await res.json();

      if (!res.ok || json.status === 'error') {
        throw new Error(json.message ?? 'Failed to load post');
      }

      setPost(json.post as PostDetail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, []);

  const closePost = useCallback(() => {
    setPost(null);
    setError('');
  }, []);

  return { post, loading, error, openPost, closePost };
}
