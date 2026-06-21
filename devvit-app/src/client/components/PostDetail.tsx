import { navigateTo } from '@devvit/web/client';
import type { AnalyzedPost, PostDetail } from '../../shared/api';

interface PostCardProps {
  post: AnalyzedPost;
  onClick: (postId: string) => void;
  compact?: boolean;
}

export function PostCard({ post, onClick, compact = false }: PostCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(post.id)}
      className={`w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20 ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          {post.category}
        </span>
        {post.flair && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {post.flair}
          </span>
        )}
        <span className="text-xs text-gray-400">
          ↑{post.score} · 💬{post.comments}
        </span>
      </div>
      <h3
        className={`text-wrap-safe mt-2 font-medium text-gray-900 dark:text-white ${
          compact ? 'text-sm' : 'text-base'
        }`}
      >
        {post.title}
      </h3>
      {post.body && (
        <p
          className={`text-wrap-safe mt-1 text-gray-500 ${
            compact ? 'line-clamp-2 text-xs' : 'line-clamp-3 text-sm'
          }`}
        >
          {post.body}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
        <span>u/{post.author}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="text-emerald-600">탭하여 본문 + 댓글 보기</span>
      </div>
    </button>
  );
}

interface PostDetailModalProps {
  post: PostDetail | null;
  loading: boolean;
  error: string;
  onClose: () => void;
}

export function PostDetailModal({ post, loading, error, onClose }: PostDetailModalProps) {
  if (!post && !loading && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 p-4 sm:items-center">
      <div className="flex max-h-[90vh] w-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">게시글 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            닫기
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4">
          {loading && (
            <p className="py-12 text-center text-sm text-gray-500">불러오는 중...</p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          {post && !loading && (
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  {post.category}
                </span>
                {post.flair && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {post.flair}
                  </span>
                )}
              </div>

              <h3 className="text-wrap-safe text-lg font-bold text-gray-900 dark:text-white">
                {post.title}
              </h3>

              {post.body ? (
                <p className="text-wrap-safe whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                  {post.body}
                </p>
              ) : (
                <p className="text-sm italic text-gray-400">본문 없음 (링크 게시글일 수 있음)</p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span>u/{post.author}</span>
                <span>↑{post.score}</span>
                <span>💬{post.comments}</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={() => navigateTo(post.permalink)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Reddit에서 열기 →
              </button>

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  댓글 ({post.commentList.length})
                </h4>

                {post.commentList.length === 0 ? (
                  <p className="text-sm text-gray-400">댓글이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {post.commentList.map((comment) => (
                      <div
                        key={comment.id}
                        className="min-w-0 overflow-hidden rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="mb-1 flex flex-wrap gap-2 text-xs text-gray-400">
                          <span>u/{comment.author}</span>
                          <span>↑{comment.score}</span>
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-wrap-safe whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
