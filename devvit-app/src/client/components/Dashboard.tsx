import type { DashboardData } from '../../shared/api';
import { filterGirlScoutKeywords } from '../../shared/domain-terms';
import { PostCard } from './PostDetail';

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

function BarChart({
  data,
  valueKey,
  label,
  color,
}: {
  data: { month: string; [key: string]: string | number }[];
  valueKey: string;
  label: string;
  color: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1);
  const chartHeight = 160;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
      <div className="flex items-end gap-1" style={{ height: chartHeight }}>
        {data.map((item) => {
          const value = Number(item[valueKey]);
          const barHeight =
            value > 0 ? Math.max(Math.round((value / max) * (chartHeight - 24)), 6) : 0;

          return (
            <div
              key={item.month}
              className="flex flex-1 flex-col items-center justify-end gap-1"
              style={{ height: chartHeight }}
            >
              <span className="text-[9px] font-medium text-gray-500">{value}</span>
              <div
                className="w-full rounded-t transition-all"
                style={{ height: barHeight, backgroundColor: color }}
                title={`${item.month}: ${value}`}
              />
              <span className="text-[9px] text-gray-400 truncate w-full text-center">
                {item.month.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export function Dashboard({
  data,
  onPostClick,
}: {
  data: DashboardData;
  onPostClick: (postId: string) => void;
}) {
  const domainKeywords =
    data.domainKeywords?.length
      ? data.domainKeywords
      : filterGirlScoutKeywords(data.topKeywords, 50);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard title="Total Posts" value={formatNumber(data.totalPosts)} color="#059669" />
        <KpiCard title="Avg Upvotes" value={formatNumber(data.avgScore)} color="#2563eb" />
        <KpiCard title="Avg Comments" value={formatNumber(data.avgComments)} color="#7c3aed" />
        <KpiCard title="Most Active Month" value={data.mostActiveMonth} color="#ea580c" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart data={data.monthlyPosts} valueKey="count" label="Posts per Month" color="#059669" />
        <BarChart
          data={data.monthlyAvgScore}
          valueKey="avgScore"
          label="Avg Upvotes per Month"
          color="#2563eb"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Top Keywords
          </h3>
          <p className="mb-3 text-xs text-gray-400">걸스카우트 관련 키워드만 표시</p>
          {domainKeywords.length > 0 ? (
            <div className="space-y-2">
              {domainKeywords.slice(0, 15).map((kw) => (
                <div key={kw.keyword} className="flex items-center gap-2">
                  <span className="w-24 truncate text-xs text-gray-600 dark:text-gray-300">
                    {kw.keyword}
                  </span>
                  <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${(kw.frequency / (domainKeywords[0]?.frequency ?? 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-400">{kw.frequency}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-400">관련 키워드가 없습니다.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Topic Distribution
          </h3>
          <div className="space-y-2">
            {data.topicDistribution.map((topic) => {
              const pct = data.totalPosts > 0 ? Math.round((topic.count / data.totalPosts) * 100) : 0;
              return (
                <div key={topic.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{topic.name}</span>
                  <span className="font-medium text-emerald-600">
                    {topic.count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Word Cloud
        </h3>
        <p className="mb-3 text-xs text-gray-400">걸스카우트 관련 키워드만 표시</p>
        {domainKeywords.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2 p-2">
            {domainKeywords.slice(0, 30).map((kw, i) => {
              const maxFreq = domainKeywords[0]?.frequency ?? 1;
              const size = Math.max(12, Math.round((kw.frequency / maxFreq) * 36));
              const colors = ['#059669', '#2563eb', '#7c3aed', '#db2777', '#ea580c'];
              return (
                <span
                  key={kw.keyword}
                  style={{ fontSize: `${size}px`, color: colors[i % colors.length] }}
                  className="font-semibold"
                  title={`${kw.keyword}: ${kw.frequency}`}
                >
                  {kw.keyword}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-gray-400">
            관련 키워드가 없습니다. 데이터를 새로고침해 주세요.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Top Posts (r/{data.subreddit})
        </h3>
        <div className="space-y-3">
          {data.recentPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={onPostClick} compact />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}
