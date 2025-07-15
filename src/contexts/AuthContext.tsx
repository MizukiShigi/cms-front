// 認証状態管理用のReact Context

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User } from '@/types/auth';
import { loginUser, registerUser, logoutUser, isLoggedIn } from '@/services';

// ===== 認証状態の型定義 =====
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// ===== Actionの型定義 =====
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// ===== Context値の型定義 =====
interface AuthContextType {
  // 状態
  state: AuthState;
  
  // アクション関数
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ===== 初期状態 =====
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

// ===== Reducer関数 =====
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// ===== Context作成 =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== Provider Component =====
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===== アプリ起動時の認証状態チェック =====
  useEffect(() => {
    const checkAuthStatus = () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // ローカルストレージから認証状態をチェック
        if (isLoggedIn()) {
          // TODO: 実際には保存されたユーザー情報を復元
          // 現在はAPIにユーザー情報取得エンドポイントがないため、
          // 仮のユーザー情報を設定
          const savedUser: User = {
            id: 'temp-id',
            name: 'Logged In User',
            email: 'user@example.com',
          };
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: savedUser });
        }
      } catch (error) {
        console.error('認証状態チェックエラー:', error);
        // エラーの場合はログアウト状態にする
        logoutUser();
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // ===== ログイン関数 =====
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await loginUser({ email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error; // 呼び出し元でエラーハンドリングできるように再スロー
    }
  };

  // ===== 登録関数 =====
  const register = async (name: string, email: string, password: string): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const user = await registerUser({ name, email, password });
      // 登録後は自動でログイン状態にしない（要件による）
      // ここでは登録成功メッセージを表示するだけ
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ユーザー登録に失敗しました';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // ===== ログアウト関数 =====
  const logout = (): void => {
    logoutUser(); // サービス層のログアウト処理（トークン削除など）
    dispatch({ type: 'LOGOUT' });
  };

  // ===== エラークリア関数 =====
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // ===== Context値 =====
  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== Custom Hook =====
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};