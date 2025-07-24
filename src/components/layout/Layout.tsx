import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { theme } from '../../styles/theme';

// 🎓 学習ポイント1: React Router対応のLayoutProps
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showMobileMenu?: boolean;
  onMenuToggle?: () => void;
  isDarkMode?: boolean;  // ダークモード状態
  onThemeToggle?: () => void;  // テーマ切り替え
}

// 🎓 学習ポイント2: React Router対応のLayoutコンポーネント
const Layout: React.FC<LayoutProps> = ({
  children,
  title = "CMS Dashboard",
  subtitle = "コンテンツ管理システム",
  showMobileMenu = false,
  onMenuToggle,
  isDarkMode = false,
  onThemeToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div style={getLayoutStyles(isDarkMode)}>
      {/* 🎨 美しいアニメーション背景 */}
      <div style={getAnimatedBackgroundStyles(isDarkMode)} />

      {/* 🎨 ナビゲーションメニュー */}
      <Navigation
        isOpen={showMobileMenu}
        onClose={onMenuToggle || (() => {})}
        isDarkMode={isDarkMode}
      />

      {/* 🎨 モダンなヘッダー */}
      <Header
        title={title}
        subtitle={subtitle}
        onMenuClick={onMenuToggle}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />

      {/* 🎨 メインコンテンツエリア */}
      <main style={getMainStyles(showMobileMenu, isDarkMode)}>
        {/* 🎨 コンテンツカード */}
        <div style={getContentCardStyles(isDarkMode)}>
          {children}
        </div>
      </main>

      {/* 🎨 モバイルメニューオーバーレイ */}
      {showMobileMenu && (
        <div
          style={getOverlayStyles(isDarkMode)}
          onClick={onMenuToggle}
          aria-label="メニューを閉じる"
        />
      )}

      {/* 🎨 ローディング状態 */}
      {isLoading && (
        <div style={getLoadingOverlayStyles(isDarkMode)}>
          <div style={loadingSpinnerStyles}>
            <div style={spinnerStyles} />
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 モダンなスタイル定義
const getLayoutStyles = (isDarkMode: boolean): React.CSSProperties => ({
  minHeight: '100vh',
  background: isDarkMode
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  overflow: 'hidden',
});

const getAnimatedBackgroundStyles = (isDarkMode: boolean): React.CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: isDarkMode
    ? `radial-gradient(circle at 20% 50%, ${theme.colors.primary[900]} 0%, transparent 50%), 
       radial-gradient(circle at 80% 20%, ${theme.colors.secondary[900]} 0%, transparent 50%),
       radial-gradient(circle at 40% 80%, ${theme.colors.primary[800]} 0%, transparent 50%)`
    : `radial-gradient(circle at 20% 50%, ${theme.colors.primary[100]} 0%, transparent 50%), 
       radial-gradient(circle at 80% 20%, ${theme.colors.secondary[100]} 0%, transparent 50%),
       radial-gradient(circle at 40% 80%, ${theme.colors.primary[50]} 0%, transparent 50%)`,
  opacity: 0.3,
  animation: 'backgroundPulse 20s ease-in-out infinite',
  zIndex: -1,
});

const getMainStyles = (showMobileMenu: boolean, isDarkMode: boolean): React.CSSProperties => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '32px 24px',
  transition: theme.animations.transition.normal,
  transform: showMobileMenu ? 'translateX(280px)' : 'translateX(0)',
  position: 'relative',
  zIndex: 1,
});

const getContentCardStyles = (isDarkMode: boolean): React.CSSProperties => ({
  background: isDarkMode
    ? 'rgba(30, 41, 59, 0.4)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px',
  boxShadow: theme.shadows.glass,
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  minHeight: '600px',
  transition: theme.animations.transition.normal,
});

const getOverlayStyles = (isDarkMode: boolean): React.CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: isDarkMode
    ? 'rgba(0, 0, 0, 0.8)'
    : 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 999,
  cursor: 'pointer',
  transition: theme.animations.transition.normal,
});

const getLoadingOverlayStyles = (isDarkMode: boolean): React.CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: isDarkMode
    ? 'rgba(15, 23, 42, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
});

const loadingSpinnerStyles: React.CSSProperties = {
  padding: '20px',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
};

const spinnerStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: `4px solid ${theme.colors.primary[500]}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default Layout;