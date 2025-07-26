// 🎓 学習ポイント: 認証関連のTanStack Query実装

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/apiClient';
import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  UserResponse 
} from '@/types/auth';

// 🎓 学習ポイント1: ログインミューテーション
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // 🔑 重要: authApiの型安全な関数を使用
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await authApi.login(data);
      return response.data;
    },
    
    // 🎓 学習ポイント: 成功時の処理
    onSuccess: (response) => {
      // 🔑 重要: トークンをlocalStorageに保存
      localStorage.setItem('auth_token', response.token);
      
      // 🔑 重要: ユーザー情報をキャッシュに保存
      queryClient.setQueryData(['auth', 'user'], response.user);
      
      console.log('✅ ログイン成功:', response.user.name);
    },
    
    onError: (error) => {
      console.error('❌ ログインエラー:', error.message);
    }
  });
};

// 🎓 学習ポイント2: ユーザー登録ミューテーション
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<UserResponse> => {
      const response = await authApi.register(data);
      return response.data;
    },
    
    onSuccess: (user) => {
      // 🎓 学習ポイント: 登録後は自動ログインしない設計
      // 必要に応じてログイン画面にリダイレクト
      console.log('✅ ユーザー登録成功:', user.name);
    },
    
    onError: (error) => {
      console.error('❌ ユーザー登録エラー:', error.message);
    }
  });
};

// 🎓 学習ポイント3: ログアウト機能
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return {
    logout: () => {
      // 🔑 重要: トークンとキャッシュをクリア
      localStorage.removeItem('auth_token');
      
      // 🔑 重要: 全てのクエリキャッシュをクリア
      queryClient.clear();
      
      console.log('✅ ログアウト完了');
    }
  };
};

// 🎓 学習ポイント4: 認証状態チェック用ヘルパー
export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('auth_token');
  const user = queryClient.getQueryData(['auth', 'user']);
  
  return {
    isLoggedIn: !!token,
    user: user || null,
    token
  };
};