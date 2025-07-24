// TanStack Query の QueryClient 設定

import { QueryClient } from '@tanstack/react-query';

// 🎓 学習ポイント: QueryClient の設定オプション
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🔄 データの再取得タイミング設定
      staleTime: 5 * 60 * 1000, // 5分間データを新鮮とみなす
      gcTime: 10 * 60 * 1000,   // 10分後にキャッシュから削除
      
      // 🔄 自動再取得の設定
      refetchOnWindowFocus: true,  // ウィンドウフォーカス時に再取得
      refetchOnReconnect: true,    // ネット再接続時に再取得
      
      // 🔄 リトライ設定
      retry: (failureCount, error) => {
        // 3回まで再試行（ただし401/403エラーは除く）
        if (failureCount < 3 && !([401, 403].includes((error as any)?.response?.status))) {
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
    },
    mutations: {
      // 🔄 ミューテーション（データ変更）のリトライ設定
      retry: 1, // 1回のみ再試行
    },
  },
});

// 🎓 学習ポイント: 設定の意味
/*
staleTime: データがどのくらいの期間「新鮮」とみなされるか
gcTime (旧cacheTime): データがキャッシュにどのくらいの期間保持されるか
refetchOnWindowFocus: ウィンドウにフォーカスが戻ったときに自動再取得
refetchOnReconnect: インターネット接続が復活したときに自動再取得
retry: 失敗時の再試行回数や条件
*/