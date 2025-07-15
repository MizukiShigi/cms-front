// 認証関連のTypeScript型定義

// ===== 基本エンティティ =====
export interface User {
  id: string;
  name: string;
  email: string;
}

// ===== リクエスト型 =====
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ===== レスポンス型 =====
export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}