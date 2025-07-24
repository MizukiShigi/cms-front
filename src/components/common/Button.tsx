import React from 'react';
import { theme } from '../../styles/theme';

// 🎓 学習ポイント1: Buttonのvariant（見た目のパターン）を定義
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

// 🎓 学習ポイント2: Buttonのsize（サイズ）を定義
type ButtonSize = 'small' | 'medium' | 'large';

// 🎓 学習ポイント3: Buttonコンポーネントのプロパティ型定義
interface ButtonProps {
  children: React.ReactNode;           // ボタンの中身（テキストやアイコン）
  variant?: ButtonVariant;             // デザインパターン
  size?: ButtonSize;                   // サイズ
  disabled?: boolean;                  // 無効状態
  loading?: boolean;                   // ローディング状態
  fullWidth?: boolean;                 // 幅いっぱいに広げるか
  leftIcon?: React.ReactNode;          // 左側アイコン
  rightIcon?: React.ReactNode;         // 右側アイコン
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // クリックイベント
  type?: 'button' | 'submit' | 'reset'; // HTMLボタンのtype属性
}

// 🎓 学習ポイント4: メインのButtonコンポーネント
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
}) => {
  // 🎓 学習ポイント5: 状態に応じたスタイル取得
  const buttonStyles = getButtonStyles({
    variant,
    size,
    disabled: disabled || loading, // loadingの時も無効状態
    fullWidth,
  });

  // 🎓 学習ポイント6: クリックハンドラー（無効状態では実行しない）
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      style={buttonStyles}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {/* 🎓 学習ポイント7: アイコンとテキストのレイアウト */}
      <div style={contentStyles}>
        {/* 左側アイコン */}
        {leftIcon && !loading && (
          <span style={iconStyles}>{leftIcon}</span>
        )}
        
        {/* ローディングアイコン */}
        {loading && (
          <span style={loadingIconStyles}>🔄</span>
        )}
        
        {/* メインコンテンツ */}
        <span>{children}</span>
        
        {/* 右側アイコン */}
        {rightIcon && !loading && (
          <span style={iconStyles}>{rightIcon}</span>
        )}
      </div>
    </button>
  );
};

// 🎓 学習ポイント8: スタイル計算関数
interface ButtonStyleProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  fullWidth: boolean;
}

const getButtonStyles = ({ variant, size, disabled, fullWidth }: ButtonStyleProps): React.CSSProperties => {
  // ベーススタイル
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    transform: disabled ? 'none' : 'translateY(0)',
  };

  // サイズ別スタイル
  const sizeStyles = getSizeStyles(size);
  
  // バリアント別スタイル
  const variantStyles = getVariantStyles(variant, disabled);

  return {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
  };
};

// 🎨 サイズ別スタイル
const getSizeStyles = (size: ButtonSize): React.CSSProperties => {
  switch (size) {
    case 'small':
      return {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        minHeight: '36px',
      };
    case 'large':
      return {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        minHeight: '48px',
      };
    case 'medium':
    default:
      return {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        minHeight: '42px',
      };
  }
};

// 🎨 バリアント別スタイル
const getVariantStyles = (variant: ButtonVariant, disabled: boolean): React.CSSProperties => {
  if (disabled) {
    // 無効状態は全バリアント共通
    return {
      backgroundColor: '#e2e8f0',
      color: '#94a3b8',
    };
  }

  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#0ea5e9',
        color: 'white',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
      };
    case 'secondary':
      return {
        backgroundColor: '#f1f5f9',
        color: '#334155',
        border: '1px solid #e2e8f0',
      };
    case 'danger':
      return {
        backgroundColor: '#ef4444',
        color: 'white',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: '#64748b',
        border: '1px solid transparent',
      };
    default:
      return {};
  }
};

// 🎨 内部レイアウトスタイル
const contentStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const iconStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const loadingIconStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  animation: 'spin 1s linear infinite',
};

export default Button;