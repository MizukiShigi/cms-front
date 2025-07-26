// 認証状態管理用のReact Context

import React, { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@/types/auth';
import { useLogin, useRegister, useLogout, useAuthStatus } from '@/hooks/useAuth';

// ===== Context値の型定義 =====
interface AuthContextType {
  // 状態
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // アクション関数
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ===== Context作成 =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== Provider Component =====
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 🎓 学習ポイント: TanStack Query hooksを活用
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { logout: performLogout } = useLogout();
  const authStatus = useAuthStatus();

  // ===== ログイン関数 =====
  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };

  // ===== 登録関数 =====
  const register = async (name: string, email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      registerMutation.mutate(
        { name, email, password },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };

  // ===== ログアウト関数 =====
  const logout = (): void => {
    performLogout();
  };

  // ===== エラークリア関数 =====
  const clearError = (): void => {
    loginMutation.reset();
    registerMutation.reset();
  };

  // ===== Context値 =====
  const contextValue: AuthContextType = {
    // 🔑 重要: TanStack Queryの状態を統合
    isAuthenticated: authStatus.isLoggedIn,
    user: authStatus.user as User | null,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error?.message || registerMutation.error?.message || null,
    
    // アクション関数
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
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};