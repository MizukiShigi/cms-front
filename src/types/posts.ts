// 投稿関連のTypeScript型定義

// ===== 列挙型 =====
export type PostStatus = 'draft' | 'published' | 'private' | 'deleted';

// ===== 基本エンティティ =====
export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  tags: string[];
  first_published_at?: string;
  content_updated_at?: string;
}

// ===== リクエスト型 =====
export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: string[];
  status: PostStatus;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface PatchPostRequest {
  title?: string;
  content?: string;
  tags?: string[];
  status?: PostStatus;
}

// ===== レスポンス型 =====
export interface CreatePostResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface GetPostResponse {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  tags: string[];
  first_published_at?: string;
  content_updated_at?: string;
}

export interface UpdatePostResponse extends GetPostResponse {}

export interface PatchPostResponse extends GetPostResponse {}