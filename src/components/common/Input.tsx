import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { ShieldIcon, IconSizes } from './Icons';

// 🎓 学習ポイント1: Inputのサイズとvariantを定義
type InputSize = 'small' | 'medium' | 'large';
type InputVariant = 'outline' | 'filled' | 'flushed';

// 🎓 学習ポイント2: Inputコンポーネントのプロパティ型定義
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: string;                    // エラーメッセージ
  helperText?: string;              // ヘルプテキスト
  label?: string;                   // ラベル
  leftIcon?: React.ReactNode;       // 左側アイコン
  rightIcon?: React.ReactNode;      // 右側アイコン
  fullWidth?: boolean;              // 幅いっぱいに広げるか
  onChange?: (value: string) => void; // 値変更イベント
  onBlur?: () => void;              // フォーカスアウトイベント
  onFocus?: () => void;             // フォーカスイベント
}

// 🎓 学習ポイント3: メインのInputコンポーネント
const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  placeholder,
  size = 'medium',
  variant = 'outline',
  disabled = false,
  required = false,
  readOnly = false,
  error,
  helperText,
  label,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onChange,
  onBlur,
  onFocus,
}) => {
  // 🎓 学習ポイント4: フォーカス状態の管理
  const [isFocused, setIsFocused] = useState(false);

  // 🎓 学習ポイント5: 内部イベントハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // 🎓 学習ポイント6: 状態に応じたスタイル計算
  const inputStyles = getInputStyles({
    size,
    variant,
    disabled,
    error: !!error,
    isFocused,
    fullWidth,
    hasLeftIcon: !!leftIcon,
    hasRightIcon: !!rightIcon,
  });

  // 🎓 学習ポイント7: ユニークなIDの生成（ラベルとの関連付け用）
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={getContainerStyles(fullWidth)}>
      {/* 🎨 ラベル */}
      {label && (
        <label htmlFor={inputId} style={getLabelStyles(disabled, required)}>
          {label}
          {required && <span style={requiredMarkerStyles}>*</span>}
        </label>
      )}

      {/* 🎨 Input Wrapper */}
      <div style={getInputWrapperStyles()}>
        {/* 左側アイコン */}
        {leftIcon && (
          <div style={getIconStyles('left', disabled)}>
            {leftIcon}
          </div>
        )}

        {/* メインのInput要素 */}
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          style={inputStyles}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* 右側アイコン */}
        {rightIcon && (
          <div style={getIconStyles('right', disabled)}>
            {rightIcon}
          </div>
        )}
      </div>

      {/* 🎨 エラーメッセージ・ヘルプテキスト */}
      {(error || helperText) && (
        <div style={getMessageStyles()}>
          {error && (
            <span style={errorMessageStyles}>
              <ShieldIcon size={IconSizes.sm} /> {error}
            </span>
          )}
          {!error && helperText && (
            <span style={helperTextStyles}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// 🎓 学習ポイント8: スタイル計算関数
interface InputStyleProps {
  size: InputSize;
  variant: InputVariant;
  disabled: boolean;
  error: boolean;
  isFocused: boolean;
  fullWidth: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
}

const getInputStyles = ({
  size,
  variant,
  disabled,
  error,
  isFocused,
  fullWidth,
  hasLeftIcon,
  hasRightIcon,
}: InputStyleProps): React.CSSProperties => {
  // ベーススタイル
  const baseStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : '300px',
    fontFamily: 'inherit',
    fontSize: getSizeStyles(size).fontSize,
    padding: getSizeStyles(size).padding,
    paddingLeft: hasLeftIcon ? '2.5rem' : getSizeStyles(size).padding.split(' ')[1],
    paddingRight: hasRightIcon ? '2.5rem' : getSizeStyles(size).padding.split(' ')[1],
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.6 : 1,
  };

  // バリアント別スタイル
  const variantStyles = getVariantStyles(variant, error, isFocused);

  return {
    ...baseStyles,
    ...variantStyles,
  };
};

// 🎨 サイズ別スタイル
const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'small':
      return {
        fontSize: '0.875rem',
        padding: '0.5rem 0.75rem',
        height: '36px',
      };
    case 'large':
      return {
        fontSize: '1.125rem',
        padding: '1rem 1rem',
        height: '48px',
      };
    case 'medium':
    default:
      return {
        fontSize: '1rem',
        padding: '0.75rem 1rem',
        height: '42px',
      };
  }
};

// 🎨 バリアント別スタイル
const getVariantStyles = (variant: InputVariant, error: boolean, isFocused: boolean): React.CSSProperties => {
  const borderColor = error 
    ? '#ef4444' 
    : isFocused 
      ? '#0ea5e9' 
      : '#e2e8f0';

  switch (variant) {
    case 'filled':
      return {
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        border: `2px solid ${isFocused ? borderColor : 'transparent'}`,
      };
    case 'flushed':
      return {
        backgroundColor: 'transparent',
        borderRadius: '0',
        borderBottom: `2px solid ${borderColor}`,
        paddingLeft: '0',
        paddingRight: '0',
      };
    case 'outline':
    default:
      return {
        backgroundColor: 'white',
        borderRadius: '8px',
        border: `2px solid ${borderColor}`,
        boxShadow: isFocused ? `0 0 0 3px ${borderColor}20` : 'none',
      };
  }
};

// 🎨 レイアウトスタイル
const getContainerStyles = (fullWidth: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: fullWidth ? '100%' : 'auto',
});

const getInputWrapperStyles = (): React.CSSProperties => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const getLabelStyles = (disabled: boolean, required: boolean): React.CSSProperties => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: disabled ? '#94a3b8' : '#374151',
  marginBottom: '0.25rem',
});

const requiredMarkerStyles: React.CSSProperties = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const getIconStyles = (position: 'left' | 'right', disabled: boolean): React.CSSProperties => ({
  position: 'absolute',
  [position]: '0.75rem',
  color: disabled ? '#94a3b8' : '#64748b',
  pointerEvents: 'none',
  zIndex: 1,
});

const getMessageStyles = (): React.CSSProperties => ({
  marginTop: '0.25rem',
});

const errorMessageStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#ef4444',
  fontWeight: 500,
};

const helperTextStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#64748b',
};

export default Input;