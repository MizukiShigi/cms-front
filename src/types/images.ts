// 画像関連のTypeScript型定義

// ===== 基本エンティティ =====
export interface Image {
  id: string;
  image_url: string;
  user_id: string;
  post_id: string;
  original_filename: string;
  stored_filename: string;
  sort_order: number;
}

// ===== リクエスト型 =====
export interface CreateImageRequest {
  image: File;
  post_id: string;
  sort_order?: number;
}

// ===== レスポンス型 =====
export interface CreateImageResponse {
  id: string;
  image_url: string;
  user_id: string;
  post_id: string;
  original_filename: string;
  stored_filename: string;
  sort_order: number;
}