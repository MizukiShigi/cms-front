// 🎓 学習ポイント: 実際のAPIを使用したTanStack Query実装

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/apiClient';
import { useAuth } from './useAuth0';
import type { 
  ListPostsParams,
  ListPostsResponse,
} from '@/types/Post';

// 🎓 学習ポイント1: Query Key の定義（実際のAPI対応）
export const POSTS_QUERY_KEY = ['posts'] as const;

// 🔑 重要: パラメータを含むQuery Keyの生成
export const getPostsQueryKey = (params: ListPostsParams = {}) => {
  return ['posts', 'list', params] as const;
};

// 🔑 重要: 単一投稿用のQuery Key
export const getPostQueryKey = (id: string) => {
  return ['posts', 'detail', id] as const;
};


// 🎓 学習ポイント4: 投稿一覧取得フック（実際のAPI対応）
export const usePosts = (params: ListPostsParams = {}) => {
  const { getToken, isAuthenticated } = useAuth();
  
  return useQuery({
    // 🔑 重要: パラメータ全体をQuery Keyに含める
    queryKey: getPostsQueryKey(params),
    
    // 🔑 重要: 実際のAPIフェッチ関数を使用
    queryFn: async (): Promise<ListPostsResponse> => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.list(getToken, params);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    // 🔑 重要: 認証されている場合のみクエリを実行
    enabled: isAuthenticated,
    
    // 🎓 キャッシュ設定
    staleTime: 3 * 60 * 1000,     // 3分間データを新鮮とみなす
    gcTime: 5 * 60 * 1000,        // 5分後にキャッシュから削除
  });
};

// 🎓 学習ポイント5: より使いやすいフック（ページネーション対応）
export const usePostsPaginated = (
  page: number = 1, 
  limit: number = 20, 
  filters: Pick<ListPostsParams, 'status' | 'sort'> = {}
) => {
  // 🔑 重要: offset計算
  const offset = (page - 1) * limit;
  
  const params: ListPostsParams = {
    limit,
    offset,
    ...filters
  };
  
  const query = usePosts(params);
  
  // 🎓 学習ポイント: 便利なプロパティを追加
  return {
    ...query,
    // ページネーション情報を使いやすい形で提供
    currentPage: page,
    totalPages: query.data?.meta ? Math.ceil(query.data.meta.total / limit) : 0,
    hasNextPage: query.data?.meta?.has_next || false,
    hasPreviousPage: page > 1,
  };
};

// 🎓 学習ポイント6: 単一投稿取得フック（UUID対応）
export const usePost = (id?: string) => {
  const { getToken, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: getPostQueryKey(id!),
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.get(getToken, id!);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    // 🔑 重要: idが存在し、認証されている場合のみクエリを実行
    enabled: !!id && isAuthenticated,
    
    // 🎓 単一投稿は長時間キャッシュしても良い
    staleTime: 10 * 60 * 1000,    // 10分間新鮮
    gcTime: 30 * 60 * 1000,       // 30分間キャッシュ保持
  });
};

// 🎓 まとめ：実際のAPIとTanStack Queryの利点
/*
1. 型安全性: OpenAPI仕様と完全に同期
2. 自動キャッシュ: 同じパラメータのリクエストは再利用
3. エラーハンドリング: 統一されたエラー処理
4. 認証対応: JWT認証が自動的に適用
5. ローディング状態: UI状態管理の簡素化
6. 自動再取得: ネットワーク復旧時やウィンドウフォーカス時
7. ページネーション: 効率的な大量データの処理
*/