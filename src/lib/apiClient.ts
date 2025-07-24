// 🎓 学習ポイント: APIクライアントの設定とTanStack Queryとの連携

import axios from 'axios';

// 🔑 重要: APIのベースURL設定
const API_BASE_URL = 'http://localhost:8080/cms/v1';

// 🎓 学習ポイント1: axiosインスタンスの作成
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // タイムアウト設定（30秒）
  timeout: 30000,
});

// 🎓 学習ポイント2: リクエストインターセプター（JWT認証対応）
apiClient.interceptors.request.use(
  (config) => {
    // LocalStorageからJWTトークンを取得
    const token = localStorage.getItem('auth_token');

    if (token) {
      // 🔑 重要: Bearer認証ヘッダーの設定
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🎓 デバッグ用: 開発中はリクエスト内容をログ出力
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🎓 学習ポイント3: レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => {
    // 🎓 デバッグ用: 開発中はレスポンス内容をログ出力
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // 🔑 重要: エラーハンドリングの統一化
    if (error.response) {
      // サーバーからエラーレスポンスが返された場合
      const { status, data } = error.response;

      // 401エラー（認証失敗）の場合、トークンを削除してログイン画面へ
      if (status === 401) {
        localStorage.removeItem('auth_token');
        // 必要に応じてログイン画面にリダイレクト
        // window.location.href = '/login';
      }

      // 🎓 学習ポイント: OpenAPIに基づくエラー形式
      // { "error": "エラーメッセージ（日本語）" }
      const errorMessage = data?.error || `HTTP ${status} エラーが発生しました`;

      // TanStack Queryで使いやすい形にエラーを再構成
      const customError = new Error(errorMessage) as Error & {
        status?: number;
        response?: any;
      };
      customError.status = status;
      customError.response = error.response;

      return Promise.reject(customError);
    } else if (error.request) {
      // ネットワークエラーの場合
      const networkError = new Error('ネットワークエラーが発生しました') as Error & {
        type?: string;
      };
      networkError.type = 'network';
      return Promise.reject(networkError);
    } else {
      // その他のエラー
      return Promise.reject(error);
    }
  }
);

// 🎓 学習ポイント4: 型安全なAPIクライアント関数

// 認証API
export const authApi = {
  // ユーザー登録
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  // ログイン
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
};

// 投稿API
export const postsApi = {
  // 投稿一覧取得
  list: (params: {
    limit?: number;
    offset?: number;
    status?: 'draft' | 'published' | 'private' | 'deleted';
    sort?: 'created_at_desc' | 'created_at_asc' | 'updated_at_desc' | 'updated_at_asc';
  } = {}) => apiClient.get('/posts', { params }),

  // 投稿詳細取得
  get: (id: string) => apiClient.get(`/posts/${id}`),

  // 投稿作成
  create: (data: {
    title: string;
    content: string;
    tags?: string[];
    status: 'draft' | 'published';
  }) => apiClient.post('/posts', data),

  // 投稿更新（完全更新）
  update: (id: string, data: {
    title: string;
    content: string;
    tags?: string[];
  }) => apiClient.put(`/posts/${id}`, data),

  // 投稿部分更新
  patch: (id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'private' | 'deleted';
  }) => apiClient.patch(`/posts/${id}`, data),
};

// 🎓 まとめ: APIクライアントの利点
/*
1. 統一されたエラーハンドリング
2. JWT認証の自動化
3. 開発時のデバッグ機能
4. 型安全なAPI呼び出し
5. TanStack Queryとの完璧な連携
*/