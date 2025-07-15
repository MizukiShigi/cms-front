// 画像関連のAPI呼び出し関数

import { apiClient } from './api';
import type { CreateImageResponse } from '@/types/images';

// ===== 画像API関数 =====

/**
 * 画像アップロード
 * POST /images
 * multipart/form-data形式でファイルをアップロード
 */
export const uploadImage = async (
  imageFile: File,
  postId: string,
  sortOrder?: number
): Promise<CreateImageResponse> => {
  // FormDataオブジェクトを作成
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('post_id', postId);
  
  if (sortOrder !== undefined) {
    formData.append('sort_order', sortOrder.toString());
  }
  
  // Content-Typeを指定しない（ブラウザが自動設定）
  const response = await apiClient.post<CreateImageResponse>('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * 画像削除（将来的に追加予定）
 * DELETE /images/{id}
 */
export const deleteImage = async (id: string): Promise<void> => {
  // まだバックエンドにエンドポイントがないため、コメントアウト
  // await apiClient.delete(`/images/${id}`);
  
  // 暫定的にエラーを投げる
  throw new Error('deleteImage endpoint is not implemented yet');
};

/**
 * 投稿に関連する画像一覧取得（将来的に追加予定）
 * GET /posts/{postId}/images
 */
export const getImagesByPost = async (postId: string): Promise<CreateImageResponse[]> => {
  // まだバックエンドにエンドポイントがないため、コメントアウト
  // const response = await apiClient.get<CreateImageResponse[]>(`/posts/${postId}/images`);
  // return response.data;
  
  // 暫定的にエラーを投げる
  throw new Error('getImagesByPost endpoint is not implemented yet');
};

// ===== ファイル関連のヘルパー関数 =====

/**
 * ファイルサイズチェック（10MB制限）
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * ファイル形式チェック（画像のみ）
 */
export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

/**
 * ファイルバリデーション（サイズ + 形式）
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return {
      isValid: false,
      error: 'サポートされていないファイル形式です。JPEG、PNG、GIF、WebPのみアップロード可能です。',
    };
  }
  
  if (!validateFileSize(file)) {
    return {
      isValid: false,
      error: 'ファイルサイズが大きすぎます。10MB以下のファイルをアップロードしてください。',
    };
  }
  
  return { isValid: true };
};