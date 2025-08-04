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

// 🎓 学習ポイント2: シンプルなリクエストインターセプター（ログ用）
apiClient.interceptors.request.use(
  (config) => {
    // 🎓 デバッグ用: 開発中はリクエスト内容をログ出力
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
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

      // 401エラー（認証失敗）の場合の処理
      if (status === 401) {
        console.warn('Authentication failed. Please log in again.');
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

// 🎓 学習ポイント: 手動トークン付きAPI関数
export const postsApi = {
  // 投稿一覧取得（手動トークン）
  list: async (getToken: () => Promise<string | null>, params: {
    limit?: number;
    offset?: number;
    status?: 'draft' | 'published' | 'private' | 'deleted';
    sort?: 'created_at_desc' | 'created_at_asc' | 'updated_at_desc' | 'updated_at_asc';
  } = {}) => {
    const token = await getToken();
    return fetch(`${API_BASE_URL}/posts?${new URLSearchParams(params as any)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 投稿詳細取得（手動トークン）
  get: async (getToken: () => Promise<string | null>, id: string) => {
    const token = await getToken();
    return fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 投稿作成（手動トークン）
  create: async (getToken: () => Promise<string | null>, data: {
    title: string;
    content: string;
    tags?: string[];
    status: 'draft' | 'published';
  }) => {
    const token = await getToken();
    return fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
  },

  // 投稿更新（手動トークン）
  update: async (getToken: () => Promise<string | null>, id: string, data: {
    title: string;
    content: string;
    tags?: string[];
  }) => {
    const token = await getToken();
    return fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
  },

  // 投稿部分更新（手動トークン）
  patch: async (getToken: () => Promise<string | null>, id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'private' | 'deleted';
  }) => {
    const token = await getToken();
    return fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
  },
};
// 🎓 使用例: 手動トークン方式
/*
// コンポーネント内での使用例
import { useAuth } from '../hooks/useAuth0';
import { postsApi } from '../lib/apiClient';

function Posts() {
  const { getToken, isAuthenticated } = useAuth();
  
  const fetchPosts = async () => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await postsApi.list(getToken, { limit: 10 });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('投稿取得エラー:', error);
      throw error;
    }
  };
  
  const createPost = async (postData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await postsApi.create(getToken, postData);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('投稿作成エラー:', error);
      throw error;
    }
  };
}
*/


