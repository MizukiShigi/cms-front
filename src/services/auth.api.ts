// 認証関連のAPI呼び出し関数

import { apiClient, setAuthToken, removeAuthToken } from './api';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '@/types/auth';

// ===== 認証API関数 =====

/**
 * ユーザー登録
 * POST /auth/register
 */
export const registerUser = async (data: RegisterRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/auth/register', data);
  return response.data;
};

/**
 * ユーザーログイン
 * POST /auth/login
 */
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  
  // ログイン成功時、トークンを自動設定
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

/**
 * ログアウト（クライアント側のみ）
 * トークンの削除とローカルストレージのクリア
 */
export const logoutUser = (): void => {
  removeAuthToken();
  // 必要に応じて他のローカルデータもクリア
  // localStorage.removeItem('user_preferences');
};

/**
 * 現在のユーザー情報取得（将来的に追加予定）
 * GET /auth/me
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  // まだバックエンドにエンドポイントがないため、コメントアウト
  // const response = await apiClient.get<UserResponse>('/auth/me');
  // return response.data;
  
  // 暫定的にエラーを投げる
  throw new Error('getCurrentUser endpoint is not implemented yet');
};

// ===== 認証状態チェック用ヘルパー関数 =====

/**
 * ログイン状態かどうかをチェック
 */
export const isLoggedIn = (): boolean => {
  return localStorage.getItem('auth_token') !== null;
};

/**
 * 保存されたトークンを取得
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};