// 基本API設定とaxiosインスタンス

import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { ErrorResponse } from '@/types';

// API設定定数
export const API_CONFIG = {
  baseURL: 'http://localhost:8080/cms/v1',
  timeout: 10000,
} as const;

// axiosインスタンスの作成
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（送信前の処理）
apiClient.interceptors.request.use(
  (config) => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // リクエストログ（開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（受信後の処理）
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 成功レスポンスのログ（開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // エラーレスポンスの処理
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.error || error.message,
    });

    // 401エラー（認証エラー）の場合、トークンを削除してログイン画面へ
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // ここで後でルーティングを追加
      window.location.href = '/login';
    }

    // エラーオブジェクトを統一形式で返す
    const errorMessage = error.response?.data?.error || '予期しないエラーが発生しました';
    return Promise.reject(new Error(errorMessage));
  }
);

// 認証トークンの設定/削除用ヘルパー関数
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  delete apiClient.defaults.headers.common['Authorization'];
};

// APIエラーかどうかを判定するヘルパー関数
export const isApiError = (error: unknown): error is Error => {
  return error instanceof Error;
};