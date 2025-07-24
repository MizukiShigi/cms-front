// 🎨 モダンデザインシステムのテーマ定義

// 🎓 学習ポイント1: TypeScriptでのテーマシステム設計
// constアサーションを使用してリテラル型を保持
export const colors = {
  // プライマリーカラー（美しいグラデーション）
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // セカンダリーカラー（紫のグラデーション）
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // グレースケール
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // ステータスカラー
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// 🎓 学習ポイント2: グラデーション定義
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
} as const;

// 🎓 学習ポイント3: シャドウシステム
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// 🎓 学習ポイント4: フォントシステム
export const fonts = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
} as const;

// 🎓 学習ポイント5: スペーシングシステム
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;

// 🎓 学習ポイント6: レスポンシブブレークポイント
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 🎓 学習ポイント7: アニメーション設定
export const animations = {
  transition: {
    fast: '0.15s ease-out',
    normal: '0.3s ease-out',
    slow: '0.5s ease-out',
  },
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// 🎓 学習ポイント8: テーマ型定義
export type Theme = {
  colors: typeof colors;
  gradients: typeof gradients;
  shadows: typeof shadows;
  fonts: typeof fonts;
  spacing: typeof spacing;
  breakpoints: typeof breakpoints;
  animations: typeof animations;
};

// 🎓 学習ポイント9: デフォルトテーマのエクスポート
export const theme: Theme = {
  colors,
  gradients,
  shadows,
  fonts,
  spacing,
  breakpoints,
  animations,
};