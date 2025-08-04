// 🎓 学習ポイント: TanStack Query のミューテーション（データ更新）実装

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/apiClient';
import { getPostQueryKey } from './usePosts';
import { useAuth } from './useAuth0';
import type { 
  CreatePostRequest, 
  CreatePostResponse, 
  UpdatePostRequest, 
  PatchPostRequest,
  Post,
  ListPostsResponse 
} from '@/types/Post';

// 🎓 学習ポイント1: 投稿作成ミューテーション
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { getToken, isAuthenticated } = useAuth();
  
  return useMutation({
    // 🔑 重要: ミューテーション関数（データ更新処理）
    mutationFn: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.create(getToken, data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    // 🎓 学習ポイント: 成功時の処理（キャッシュ更新）
    onSuccess: (newPost) => {
      // 🔑 重要: 投稿一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({
        queryKey: ['posts', 'list']
      });
      
      console.log('✅ 投稿が正常に作成されました:', newPost.title);
    },
    
    // 🎓 学習ポイント: エラー時の処理
    onError: (error) => {
      console.error('❌ 投稿作成でエラーが発生しました:', error.message);
      // 必要に応じてトースト通知やエラー表示を実装
    }
  });
};;

// 🎓 学習ポイント2: 投稿更新ミューテーション（完全更新）
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { getToken, isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostRequest }): Promise<Post> => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.update(getToken, id, data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    onSuccess: (updatedPost) => {
      // 🔑 重要: 複数のキャッシュを更新
      
      // 1. 投稿一覧のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: ['posts', 'list']
      });
      
      // 2. 該当投稿の詳細キャッシュを直接更新
      queryClient.setQueryData(
        getPostQueryKey(updatedPost.id),
        updatedPost
      );
      
      console.log('✅ 投稿が正常に更新されました:', updatedPost.title);
    },
    
    onError: (error) => {
      console.error('❌ 投稿更新でエラーが発生しました:', error.message);
    }
  });
};

// 🎓 学習ポイント3: 投稿部分更新ミューテーション（PATCH）
export const usePatchPost = () => {
  const queryClient = useQueryClient();
  const { getToken, isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PatchPostRequest }): Promise<Post> => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.patch(getToken, id, data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    onSuccess: (updatedPost) => {
      // 一覧と詳細両方のキャッシュを更新
      queryClient.invalidateQueries({
        queryKey: ['posts', 'list']
      });
      
      queryClient.setQueryData(
        getPostQueryKey(updatedPost.id),
        updatedPost
      );
      
      console.log('✅ 投稿が正常に部分更新されました:', updatedPost.title);
    },
    
    onError: (error) => {
      console.error('❌ 投稿部分更新でエラーが発生しました:', error.message);
    }
  });
};

// 🎓 学習ポイント4: よく使用される操作のためのカスタムフック

// ステータス変更専用フック（公開/下書き切り替えなど）
export const useTogglePostStatus = () => {
  const patchMutation = usePatchPost();
  
  return {
    ...patchMutation,
    // 🔑 重要: より使いやすいインターフェースを提供
    toggleStatus: (id: string, currentStatus: Post['status']) => {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      return patchMutation.mutate({ id, data: { status: newStatus } });
    }
  };
};

// 🎓 学習ポイント5: 楽観的更新の例（高度なテクニック）
export const useCreatePostWithOptimisticUpdate = () => {
  const queryClient = useQueryClient();
  const { getToken, isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await postsApi.create(getToken, data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    
    // 🔑 重要: ミューテーション実行前の楽観的更新
    onMutate: async (variables) => {
      // 進行中のクエリをキャンセル（競合を避ける）
      await queryClient.cancelQueries({
        queryKey: ['posts', 'list']
      });
      
      // 現在のデータを保存（ロールバック用）
      const previousData = queryClient.getQueriesData({
        queryKey: ['posts', 'list']
      });
      
      // 🎓 学習ポイント: 楽観的にUIを更新
      // 一時的なIDで新しい投稿を追加
      const optimisticPost = {
        id: `temp-${Date.now()}`,
        title: variables.title,
        status: variables.status,
        tags: variables.tags || [],
        first_published_at: variables.status === 'published' ? new Date().toISOString() : null,
        content_updated_at: new Date().toISOString(),
      };
      
      queryClient.setQueriesData<ListPostsResponse>(
        { queryKey: ['posts', 'list'] },
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            posts: [optimisticPost, ...oldData.posts],
            meta: {
              ...oldData.meta,
              total: oldData.meta.total + 1
            }
          };
        }
      );
      
      // ロールバック用にデータを返す
      return { previousData };
    },
    
    onError: (error, _variables, context) => {
      // エラー時は元のデータに戻す
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('❌ 楽観的更新の投稿作成でエラーが発生しました:', error.message);
    },
    
    onSettled: () => {
      // 成功・失敗に関わらず、最終的にサーバーデータで同期
      queryClient.invalidateQueries({
        queryKey: ['posts', 'list']
      });
    }
  });
};

// 🎓 学習ポイント6: ミューテーション使用例（コンポーネント内での使い方）
/*
// コンポーネント内での使用例
function CreatePostForm() {
  const createPost = useCreatePost();
  
  const handleSubmit = (formData: CreatePostRequest) => {
    createPost.mutate(formData, {
      onSuccess: (newPost) => {
        console.log('作成完了:', newPost);
        // フォームをリセットや画面遷移など
      },
      onError: (error) => {
        alert(`エラー: ${error.message}`);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {createPost.isPending && <div>作成中...</div>}
      {createPost.isError && <div>エラー: {createPost.error.message}</div>}
      <button disabled={createPost.isPending}>投稿作成</button>
    </form>
  );
}
*/

// 🎓 まとめ：ミューテーションの利点
/*
1. 自動的なキャッシュ無効化・更新
2. 楽観的更新によるUX向上
3. エラー時の自動ロールバック
4. ローディング状態の自動管理
5. 複数クエリの同期更新
6. 再利用可能なミューテーションロジック
*/