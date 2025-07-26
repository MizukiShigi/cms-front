// 🎓 学習ポイント: 実際のAPIを使用したTanStack Query実装

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/apiClient';
import type { 
  ListPostsResponse, 
  ListPostsParams, 
  Post, 
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

// 🎓 学習ポイント2: 実際のAPIデータフェッチ関数
const fetchPosts = async (params: ListPostsParams = {}): Promise<ListPostsResponse> => {
  try {
    // 🔑 重要: 実際のAPIクライアントを使用
    const response = await postsApi.list(params);
    
    // 🎓 学習ポイント: レスポンスの data プロパティを返す
    return response.data;
  } catch (error) {
    // 🎓 学習ポイント: エラーハンドリング
    // APIクライアントで統一的にエラー処理済みなので、そのまま再スロー
    throw error;
  }
};

// 🎓 学習ポイント3: 単一投稿のデータフェッチ関数
const fetchPost = async (id: string): Promise<Post> => {
  try {
    const response = await postsApi.get(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🎓 学習ポイント4: 投稿一覧取得フック（実際のAPI対応）
export const usePosts = (params: ListPostsParams = {}) => {
  return useQuery({
    // 🔑 重要: パラメータ全体をQuery Keyに含める
    queryKey: getPostsQueryKey(params),
    
    // 🔑 重要: 実際のAPIフェッチ関数を使用
    queryFn: () => fetchPosts(params),
    
    // 🎓 キャッシュ設定
    staleTime: 3 * 60 * 1000,     // 3分間データを新鮮とみなす
    gcTime: 5 * 60 * 1000,        // 5分後にキャッシュから削除
    
    // 🎓 学習ポイント: プレースホルダーデータ（OpenAPI形式）
    placeholderData: {
      posts: [],
      meta: {
        total: 0,
        limit: params.limit || 20,
        offset: params.offset || 0,
        has_next: false
      }
    },
    
    // 🎓 学習ポイント: エラー時のリトライ（QueryClientから継承）
    // 401/403エラーは再試行しない設定済み
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
  return useQuery({
    queryKey: getPostQueryKey(id!),
    queryFn: () => fetchPost(id!),
    
    // 🔑 重要: idが存在する場合のみクエリを実行
    enabled: !!id,
    
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