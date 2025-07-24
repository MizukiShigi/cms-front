// 🎓 学習ポイント: OpenAPI仕様に基づく型定義

// 🔑 重要: OpenAPIのPostSummary型（投稿一覧用）
export interface PostSummary {
  id: string;                    // UUIDに変更
  title: string;
  status: 'draft' | 'published' | 'private' | 'deleted';  // OpenAPI準拠
  tags: string[];
  first_published_at: string | null;    // 初回公開日時
  content_updated_at: string | null;    // コンテンツ更新日時
}

// 🔑 重要: 投稿詳細用の型（GetPostResponse）
export interface Post {
  id: string;                    // UUIDに変更
  title: string;
  content: string;               // 詳細ページでのみ取得
  status: 'draft' | 'published' | 'private' | 'deleted';
  tags: string[];
  first_published_at: string | null;
  content_updated_at: string | null;
}

// 🎓 学習ポイント: OpenAPIのPaginationMeta型
export interface PaginationMeta {
  total: number;          // 総件数
  limit: number;          // 取得件数
  offset: number;         // 取得開始位置
  has_next: boolean;      // 次のページがあるかどうか
}

// 🎓 学習ポイント: 投稿一覧レスポンス型（ListPostsResponse）
export interface ListPostsResponse {
  posts: PostSummary[];
  meta: PaginationMeta;
}

// 🎓 学習ポイント: 投稿作成リクエスト型（CreatePostRequest）
export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: string[];                          // オプショナル
  status: 'draft' | 'published';           // 作成時は2択のみ
}

// 🎓 学習ポイント: 投稿作成レスポンス型（CreatePostResponse）
export interface CreatePostResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

// 🎓 学習ポイント: 投稿更新リクエスト型（UpdatePostRequest）
export interface UpdatePostRequest {
  title: string;
  content: string;
  tags?: string[];                          // オプショナル
}

// 🎓 学習ポイント: 投稿部分更新リクエスト型（PatchPostRequest）
export interface PatchPostRequest {
  title?: string;
  content?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'private' | 'deleted';
}

// 🎓 学習ポイント: 投稿一覧取得のクエリパラメータ型
export interface ListPostsParams {
  limit?: number;          // 取得件数（最大100件）
  offset?: number;         // 取得開始位置
  status?: 'draft' | 'published' | 'private' | 'deleted';
  sort?: 'created_at_desc' | 'created_at_asc' | 'updated_at_desc' | 'updated_at_asc';
}