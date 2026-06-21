import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl text-white shadow-lg">
        🌲
      </div>
      <div className="flex flex-col items-center gap-2 px-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Girl Scout Analyzer
        </h1>
        <p className="text-base text-center text-gray-600 dark:text-gray-300">
          r/girlscouts 커뮤니티 인사이트 대시보드
        </p>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Hey {context.username ?? 'Scout'} 👋
        </p>
      </div>
      <div className="flex items-center justify-center mt-3">
        <button
          className="flex items-center justify-center bg-emerald-600 text-white h-11 rounded-full cursor-pointer transition-colors px-6 hover:bg-emerald-700 font-medium"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Launch Dashboard
        </button>
      </div>
      <p className="text-xs text-gray-400 px-8 text-center">
        인기 주제 · 활동 트렌드 · 키워드 · 카테고리 분석
      </p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
