// 共通で使用するTypeScript型定義

// ===== エラーレスポンス型 =====
export interface ErrorResponse {
  error: string;
}

// ===== API呼び出し用の共通型 =====
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ===== HTTP Method型 =====
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ===== API設定型 =====
export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// ===== 認証状態型 =====
export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
}