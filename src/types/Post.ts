// 🎓 学習ポイント: Post型の定義
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  excerpt?: string;  // 抜粋（オプショナル）
}

// 🎓 学習ポイント: API レスポンス用の型
export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

// 🎓 学習ポイント: 投稿作成・更新用の型
export interface CreatePostRequest {
  title: string;
  content: string;
  status: Post['status'];
  tags: string[];
  excerpt?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}