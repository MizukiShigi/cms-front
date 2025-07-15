// 投稿関連のAPI呼び出し関数

import { apiClient } from './api';
import type {
  CreatePostRequest,
  UpdatePostRequest,
  PatchPostRequest,
  CreatePostResponse,
  GetPostResponse,
  UpdatePostResponse,
  PatchPostResponse,
} from '@/types/posts';

// ===== 投稿API関数 =====

/**
 * 投稿作成
 * POST /posts
 */
export const createPost = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
  const response = await apiClient.post<CreatePostResponse>('/posts', data);
  return response.data;
};

/**
 * 投稿取得
 * GET /posts/{id}
 */
export const getPost = async (id: string): Promise<GetPostResponse> => {
  const response = await apiClient.get<GetPostResponse>(`/posts/${id}`);
  return response.data;
};

/**
 * 投稿完全更新
 * PUT /posts/{id}
 */
export const updatePost = async (
  id: string,
  data: UpdatePostRequest
): Promise<UpdatePostResponse> => {
  const response = await apiClient.put<UpdatePostResponse>(`/posts/${id}`, data);
  return response.data;
};

/**
 * 投稿部分更新
 * PATCH /posts/{id}
 */
export const patchPost = async (
  id: string,
  data: PatchPostRequest
): Promise<PatchPostResponse> => {
  const response = await apiClient.patch<PatchPostResponse>(`/posts/${id}`, data);
  return response.data;
};

/**
 * 投稿削除（将来的に追加予定）
 * DELETE /posts/{id}
 */
export const deletePost = async (id: string): Promise<void> => {
  // まだバックエンドにエンドポイントがないため、コメントアウト
  // await apiClient.delete(`/posts/${id}`);
  
  // 暫定的にエラーを投げる
  throw new Error('deletePost endpoint is not implemented yet');
};

/**
 * 投稿一覧取得（将来的に追加予定）
 * GET /posts
 */
export const getPosts = async (): Promise<GetPostResponse[]> => {
  // まだバックエンドにエンドポイントがないため、コメントアウト
  // const response = await apiClient.get<GetPostResponse[]>('/posts');
  // return response.data;
  
  // 暫定的にエラーを投げる
  throw new Error('getPosts endpoint is not implemented yet');
};