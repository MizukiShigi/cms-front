import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';
import {
  DashboardIcon,
  DocumentIcon,
  PencilIcon,
  ImageIcon,
  SettingsIcon,
  LoginIcon,
  UserIcon,
  LogoutIcon,
  RocketIcon,
  XIcon,
  IconSizes
} from '../common/Icons';

// 🎓 学習ポイント1: ナビゲーションメニューの型定義
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  requireAuth: boolean; // 認証が必要かどうか
}

// 🎓 学習ポイント2: Navigationコンポーネントのprops型定義
interface NavigationProps {
  isOpen: boolean;           // モバイルメニューの開閉状態
  onClose: () => void;      // メニューを閉じる関数
  isDarkMode: boolean;      // ダークモード状態
}

// 🎓 学習ポイント3: ナビゲーションメニューの定義
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: <DashboardIcon size={IconSizes.sm} />,
    path: '/',
    requireAuth: false,
  },
  {
    id: 'posts',
    label: '投稿管理',
    icon: <DocumentIcon size={IconSizes.sm} />,
    path: '/posts',
    requireAuth: true,
  },
  {
    id: 'create-post',
    label: '新規投稿',
    icon: <PencilIcon size={IconSizes.sm} />,
    path: '/posts/create',
    requireAuth: true,
  },
  {
    id: 'media',
    label: '画像管理',
    icon: <ImageIcon size={IconSizes.sm} />,
    path: '/media',
    requireAuth: true,
  },
  {
    id: 'settings',
    label: '設定',
    icon: <SettingsIcon size={IconSizes.sm} />,
    path: '/settings',
    requireAuth: true,
  },
];

const publicItems: NavigationItem[] = [
  {
    id: 'login',
    label: 'ログイン',
    icon: <LoginIcon size={IconSizes.sm} />,
    path: '/login',
    requireAuth: false,
  },
  {
    id: 'register',
    label: '新規登録',
    icon: <UserIcon size={IconSizes.sm} />,
    path: '/register',
    requireAuth: false,
  },
];

const Navigation: React.FC<NavigationProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  // 🎓 学習ポイント4: React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎓 学習ポイント5: useAuth hookを使った認証状態の取得
  const { state: authState, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 🎓 学習ポイント6: 条件付きレンダリング用の関数
  const getVisibleItems = (): NavigationItem[] => {
    if (authState.isAuthenticated) {
      // ログイン済みの場合は、認証が不要なアイテムと認証が必要なアイテムを表示
      return navigationItems;
    } else {
      // 未ログインの場合は、認証が不要なアイテムとログイン関連アイテムを表示
      return [...navigationItems.filter(item => !item.requireAuth), ...publicItems];
    }
  };

  // 🎓 学習ポイント7: 現在のアクティブ項目を判定する関数
  const getActiveItem = (): string => {
    const activeItem = navigationItems.find(item => item.path === location.pathname);
    if (activeItem) return activeItem.id;
    
    const publicItem = publicItems.find(item => item.path === location.pathname);
    if (publicItem) return publicItem.id;
    
    return 'dashboard'; // デフォルト
  };

  // 🎓 学習ポイント8: ナビゲーション処理
  const handleItemClick = (item: NavigationItem) => {
    navigate(item.path); // React Routerで実際のページ遷移
    onClose(); // モバイルメニューを閉じる
  };

  // 🎓 学習ポイント9: ログアウト処理
  const handleLogout = () => {
    logout();
    navigate('/'); // React Routerで実際のページ遷移
    onClose();
  };

  return (
    <>
      {/* 🎨 サイドナビゲーション */}
      <nav style={getNavigationStyles(isOpen, isDarkMode)}>
        {/* 🎨 ナビゲーションヘッダー */}
        <div style={navHeaderStyles}>
          <div style={logoSectionStyles}>
            <span style={logoIconStyles}><RocketIcon size={IconSizes.lg} /></span>
            <h2 style={getLogoTextStyles(isDarkMode)}>CMS</h2>
          </div>
          <button
            style={getCloseButtonStyles(isDarkMode)}
            onClick={onClose}
            aria-label="メニューを閉じる"
          >
            <XIcon size={IconSizes.sm} />
          </button>
        </div>

        {/* 🎨 ユーザー情報セクション */}
        {authState.isAuthenticated && (
          <div style={getUserSectionStyles(isDarkMode)}>
            <div style={avatarStyles}>
              {authState.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={userInfoStyles}>
              <p style={getUserNameStyles(isDarkMode)}>{authState.user?.name}</p>
              <p style={getUserEmailStyles(isDarkMode)}>{authState.user?.email}</p>
            </div>
          </div>
        )}

        {/* 🎨 ナビゲーションメニュー */}
        <div style={navMenuStyles}>
          {getVisibleItems().map((item) => (
            <button
              key={item.id}
              style={getNavItemStyles(
                isDarkMode, 
                getActiveItem() === item.id, 
                hoveredItem === item.id
              )}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div style={navItemIconStyles}>{item.icon}</div>
              <span style={navItemLabelStyles}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 🎨 ログアウトボタン（認証済みユーザーのみ） */}
        {authState.isAuthenticated && (
          <div style={navFooterStyles}>
            <button
              style={getLogoutButtonStyles(isDarkMode, hoveredItem === 'logout')}
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div style={navItemIconStyles}><LogoutIcon size={IconSizes.sm} /></div>
              <span style={navItemLabelStyles}>ログアウト</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

// 🎨 モダンなスタイル定義
const getNavigationStyles = (isOpen: boolean, isDarkMode: boolean): React.CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '280px',
  background: isDarkMode
    ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  boxShadow: theme.shadows.glass,
  transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
  transition: theme.animations.transition.normal,
  zIndex: 1001,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const navHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const logoSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const logoIconStyles: React.CSSProperties = {
  fontSize: '2rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
};

const getLogoTextStyles = (isDarkMode: boolean): React.CSSProperties => ({
  fontSize: '1.5rem',
  fontWeight: 800,
  margin: 0,
  background: theme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const getCloseButtonStyles = (isDarkMode: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: isDarkMode ? theme.colors.gray[300] : theme.colors.gray[600],
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  transition: theme.animations.transition.fast,
});

const getUserSectionStyles = (isDarkMode: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.5rem',
  borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
});

const avatarStyles: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: theme.gradients.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 600,
  fontSize: '1.2rem',
  flexShrink: 0,
};

const userInfoStyles: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const getUserNameStyles = (isDarkMode: boolean): React.CSSProperties => ({
  margin: '0 0 0.25rem 0',
  fontSize: '1rem',
  fontWeight: 600,
  color: isDarkMode ? theme.colors.gray[100] : theme.colors.gray[900],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const getUserEmailStyles = (isDarkMode: boolean): React.CSSProperties => ({
  margin: 0,
  fontSize: '0.875rem',
  color: isDarkMode ? theme.colors.gray[400] : theme.colors.gray[600],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const navMenuStyles: React.CSSProperties = {
  flex: 1,
  padding: '1rem',
  overflow: 'auto',
};

const getNavItemStyles = (isDarkMode: boolean, isActive: boolean, isHovered: boolean): React.CSSProperties => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.875rem 1rem',
  marginBottom: '0.5rem',
  backgroundColor: isActive
    ? (isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
    : isHovered
    ? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
    : 'transparent',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: theme.animations.transition.fast,
  textAlign: 'left',
  color: isDarkMode ? theme.colors.gray[200] : theme.colors.gray[700],
  transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
  boxShadow: isHovered ? theme.shadows.sm : 'none',
});

const navItemIconStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  flexShrink: 0,
};

const navItemLabelStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 500,
};

const navFooterStyles: React.CSSProperties = {
  padding: '1rem',
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

const getLogoutButtonStyles = (isDarkMode: boolean, isHovered: boolean): React.CSSProperties => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.875rem 1rem',
  backgroundColor: isHovered
    ? 'rgba(239, 68, 68, 0.1)'
    : 'transparent',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: theme.animations.transition.fast,
  textAlign: 'left',
  color: isHovered ? theme.colors.error : (isDarkMode ? theme.colors.gray[200] : theme.colors.gray[700]),
});

export default Navigation;