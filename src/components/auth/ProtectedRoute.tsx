import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth0';

// 🎓 学習ポイント1: ProtectedRouteのProps型定義
interface ProtectedRouteProps {
  children: React.ReactNode;  // 保護したいコンポーネント
}

// 🎓 学習ポイント2: Higher-Order Component パターン
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 🎓 学習ポイント3: Auth0の認証状態の取得
  const { isAuthenticated, isLoading } = useAuth();
  
  // 🎓 学習ポイント4: 現在のURLを取得（リダイレクト後に戻るため）
  const location = useLocation();

  // Auth0のローディング中は何も表示しない
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        認証中...
      </div>
    );
  }

  // 🎓 学習ポイント5: 認証チェックとリダイレクト
  if (!isAuthenticated) {
    // 未ログインの場合、ログインページにリダイレクト
    // state で現在のページ情報を保存（ログイン後に戻るため）
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }}  // 元いたページの情報を保存
        replace  // 履歴を置換（戻るボタンで無限ループを防ぐ）
      />
    );
  }

  // 🎓 学習ポイント6: 認証済みの場合は元のコンポーネントを表示
  return <>{children}</>;
};

export default ProtectedRoute;