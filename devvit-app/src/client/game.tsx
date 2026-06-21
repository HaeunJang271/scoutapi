import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import { PostCard, PostDetailModal } from './components/PostDetail';
import { useAnalyzer } from './hooks/useAnalyzer';
import { usePostDetail } from './hooks/usePostDetail';
import { filterGirlScoutKeywords } from '../shared/domain-terms';

type Tab = 'overview' | 'keywords' | 'posts';

export const App = () => {
  const { data, username, isModerator, loading, refreshing, error, refresh } = useAnalyzer();
  const { post, loading: postLoading, error: postError, openPost, closePost } = usePostDetail();
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌲</span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                Girl Scout Analyzer
              </h1>
              <p className="text-xs text-gray-500">r/girlscouts</p>
            </div>
          </div>
          {isModerator && (
            <button
              onClick={refresh}
              disabled={refreshing}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          )}
        </div>
        <div className="mx-auto flex max-w-4xl gap-1 px-4 pb-2">
          {(['overview', 'keywords', 'posts'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize ${
                tab === t
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-4xl overflow-x-hidden px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !data && !error && (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-300">
              No data yet. {isModerator ? 'Click "Refresh Data" to fetch r/girlscouts posts.' : 'Ask a moderator to refresh the data.'}
            </p>
          </div>
        )}

        {data && tab === 'overview' && <Dashboard data={data} onPostClick={openPost} />}

        {data && tab === 'keywords' && (() => {
          const domainKeywords = data.domainKeywords?.length
            ? data.domainKeywords
            : filterGirlScoutKeywords(data.topKeywords, 50);
          return (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-1 text-lg font-semibold">Top Keywords</h2>
            <p className="mb-4 text-sm text-gray-400">걸스카우트 관련 키워드만 표시</p>
            {domainKeywords.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {domainKeywords.map((kw, i) => (
                <div
                  key={kw.keyword}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {i + 1}. {kw.keyword}
                  </span>
                  <span className="text-xs font-medium text-emerald-600">{kw.frequency}</span>
                </div>
              ))}
            </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">관련 키워드가 없습니다.</p>
            )}
          </div>
          );
        })()}

        {data && tab === 'posts' && (
          <div className="space-y-3">
            {data.recentPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={openPost} />
            ))}
          </div>
        )}

        <PostDetailModal
          post={post}
          loading={postLoading}
          error={postError}
          onClose={closePost}
        />

        {username && (
          <p className="mt-8 text-center text-xs text-gray-400">
            Logged in as u/{username}
            {isModerator ? ' · Moderator' : ''}
          </p>
        )}
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
