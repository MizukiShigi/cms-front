import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { SunIcon, MoonIcon, IconSizes, IconColors } from '../common/Icons';

// 🎓 学習ポイント1: Propsの型定義（拡張版）
interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  isDarkMode?: boolean;  // ダークモード状態
  onThemeToggle?: () => void;  // テーマ切り替え
}

// 🎓 学習ポイント2: 状態管理とイベントハンドリング
const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onMenuClick,
  isDarkMode = false,
  onThemeToggle
}) => {
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isThemeHovered, setIsThemeHovered] = useState(false);

  return (
    <header style={getHeaderStyles(isDarkMode)}>
      {/* 🎨 グラスモーフィズム背景 */}
      <div style={glassBackgroundStyles} />

      <div style={containerStyles}>
        {/* 🎨 モダンなメニューボタン */}
        {onMenuClick && (
          <button
            style={getMenuButtonStyles(isDarkMode, isMenuHovered)}
            onClick={onMenuClick}
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
            aria-label="メニューを開く"
          >
            <div style={hamburgerStyles}>
              <span style={getHamburgerLineStyles(isDarkMode, isMenuHovered)} />
              <span style={getHamburgerLineStyles(isDarkMode, isMenuHovered)} />
              <span style={getHamburgerLineStyles(isDarkMode, isMenuHovered)} />
            </div>
          </button>
        )}

        {/* 🎨 美しいタイトルセクション */}
        <div style={titleSectionStyles}>
          <h1 style={getTitleStyles(isDarkMode)}>
            {/* 🎨 グラデーションテキスト */}
            <span style={gradientTextStyles}>{title}</span>
          </h1>
          {subtitle && (
            <p style={getSubtitleStyles(isDarkMode)}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 🎨 アクションセクション */}
        <div style={actionSectionStyles}>
          {/* 🎨 テーマ切り替えボタン */}
          {onThemeToggle && (
            <button
              style={getThemeToggleStyles(isDarkMode, isThemeHovered)}
              onClick={onThemeToggle}
              onMouseEnter={() => setIsThemeHovered(true)}
              onMouseLeave={() => setIsThemeHovered(false)}
              aria-label="テーマを切り替える"
            >
              {isDarkMode ? (
                <SunIcon size={IconSizes.sm} color={IconColors.sun} />
              ) : (
                <MoonIcon size={IconSizes.sm} color={IconColors.moon} />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// 🎨 モダンなスタイル定義
const getHeaderStyles = (isDarkMode: boolean): React.CSSProperties => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  height: '80px',
  background: isDarkMode
    ? 'rgba(15, 23, 42, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  boxShadow: theme.shadows.glass,
  transition: theme.animations.transition.normal,
});

const glassBackgroundStyles: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.gradients.glass,
  opacity: 0.5,
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  position: 'relative',
  zIndex: 1,
};

const getMenuButtonStyles = (isDarkMode: boolean, isHovered: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '12px',
  borderRadius: '12px',
  transition: theme.animations.transition.normal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isHovered 
    ? (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')
    : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
});

const hamburgerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  width: '18px',
  height: '14px',
};

const getHamburgerLineStyles = (isDarkMode: boolean, isHovered: boolean): React.CSSProperties => ({
  width: '100%',
  height: '2px',
  backgroundColor: isDarkMode ? theme.colors.gray[200] : theme.colors.gray[700],
  borderRadius: '1px',
  transition: theme.animations.transition.fast,
  transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
});

const titleSectionStyles: React.CSSProperties = {
  flex: 1,
  marginLeft: '20px',
};

const getTitleStyles = (isDarkMode: boolean): React.CSSProperties => ({
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  fontFamily: theme.fonts.sans.join(', '),
  color: isDarkMode ? theme.colors.gray[100] : theme.colors.gray[900],
});

const gradientTextStyles: React.CSSProperties = {
  background: theme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const getSubtitleStyles = (isDarkMode: boolean): React.CSSProperties => ({
  margin: '4px 0 0 0',
  fontSize: '14px',
  color: isDarkMode ? theme.colors.gray[400] : theme.colors.gray[600],
  fontFamily: theme.fonts.sans.join(', '),
  opacity: 0.8,
});

const actionSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const getThemeToggleStyles = (isDarkMode: boolean, isHovered: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '50%',
  fontSize: '20px',
  transition: theme.animations.transition.normal,
  backgroundColor: isHovered 
    ? (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')
    : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
  transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
});

export default Header;