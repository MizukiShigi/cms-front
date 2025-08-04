// Auth0を使用した認証フック

import { useAuth0 as useAuth0Original } from '@auth0/auth0-react';

// Auth0のフックをラップして、既存のAuthContextと同じインターフェースを提供
export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    error,
    getAccessTokenSilently,
  } = useAuth0Original();

  const login = async () => {
    // Auth0のUniversal Loginを使用（email/passwordは使用しない）
    await loginWithRedirect();
  };

  const register = async () => {
    // Auth0のUniversal Loginで登録画面を表示
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin + '/login',
      },
    });
  };

  const clearError = () => {
    // Auth0のエラーは自動的に管理されるため、実装不要
  };

  // Auth0トークンを取得（APIクライアントで使用）
  const getToken = async (): Promise<string | null> => {
    try {
      if (!isAuthenticated) {
        return null;
      }
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    user: user ? {
      id: user.sub || '',
      name: user.name || '',
      email: user.email || '',
    } : null,
    isLoading,
    error: error?.message || null,
    login,
    register,
    logout,
    clearError,
    getToken, // 追加: APIクライアント用のトークン取得関数
  };
};

// Auth0の元のフックも公開（必要に応じて直接使用）
export { useAuth0Original as useAuth0 };