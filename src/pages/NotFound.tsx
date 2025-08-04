import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import {
  HomeIcon,
  ArrowLeftIcon,
  DashboardIcon,
  LoginIcon,
  UserIcon,
  IconSizes
} from '../components/common/Icons';

// 🎓 学習ポイント1: 404ページコンポーネント
const NotFound: React.FC = () => {
  // 🎓 学習ポイント2: 現在のURLを取得
  const location = useLocation();

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        {/* 🎨 404エラー表示 */}
        <div style={errorCodeStyles}>404</div>
        
        <h1 style={titleStyles}>
          ページが見つかりません
        </h1>
        
        <p style={messageStyles}>
          申し訳ございませんが、お探しのページは存在しないか、移動または削除された可能性があります。
        </p>
        
        {/* 🎓 学習ポイント3: アクセスしようとしたURLを表示 */}
        <div style={urlInfoStyles}>
          <span style={urlLabelStyles}>アクセスしたURL:</span>
          <code style={urlValueStyles}>{location.pathname}</code>
        </div>
        
        {/* 🎓 学習ポイント4: ナビゲーションリンク（Buttonコンポーネント使用） */}
        <div style={actionsStyles}>
          <Link to="/" style={linkWrapperStyles}>
            <Button variant="primary" leftIcon={<HomeIcon size={IconSizes.sm} />} fullWidth>
              ホームに戻る
            </Button>
          </Link>
          
          <Button 
            variant="secondary"
            leftIcon={<ArrowLeftIcon size={IconSizes.sm} />}
            fullWidth
            onClick={() => window.history.back()}
          >
            前のページに戻る
          </Button>
        </div>
        
        {/* 🎨 推奨ページリンク */}
        <div style={suggestionsStyles}>
          <h3 style={suggestionsTitleStyles}>おすすめのページ</h3>
          <div style={suggestionsListStyles}>
            <Link to="/" style={suggestionLinkStyles}>
              <DashboardIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
              ダッシュボード
            </Link>
            <Link to="/login" style={suggestionLinkStyles}>
              <LoginIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
              ログイン
            </Link>
            <Link to="/register" style={suggestionLinkStyles}>
              <UserIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 スタイル定義
const containerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  padding: '2rem',
};

const contentStyles: React.CSSProperties = {
  textAlign: 'center',
  maxWidth: '600px',
  width: '100%',
  padding: '3rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
};

const errorCodeStyles: React.CSSProperties = {
  fontSize: '6rem',
  fontWeight: 900,
  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '1rem',
  lineHeight: 1,
};

const titleStyles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '1rem',
  color: '#334155',
};

const messageStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#64748b',
  lineHeight: 1.6,
  marginBottom: '2rem',
};

const urlInfoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginBottom: '2rem',
  padding: '1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
};

const urlLabelStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#64748b',
  fontWeight: 500,
};

const urlValueStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#ef4444',
  fontWeight: 600,
  fontFamily: 'monospace',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
};

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '3rem',
};

// 🎨 LinkコンポーネントのWrapper用スタイル
const linkWrapperStyles: React.CSSProperties = {
  textDecoration: 'none',
};

const suggestionsStyles: React.CSSProperties = {
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  paddingTop: '2rem',
};

const suggestionsTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: '#334155',
};

const suggestionsListStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const suggestionLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#64748b',
  textDecoration: 'none',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export default NotFound;