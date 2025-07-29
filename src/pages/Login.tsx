import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth0';
import Button from '../components/common/Button';
import { LoginIcon, UserIcon, RocketIcon, IconSizes } from '../components/common/Icons';

// 🎓 学習ポイント: Auth0を使用したログインページ
const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // 🎓 学習ポイント: Auth0フック
  const { isAuthenticated, isLoading, login, register } = useAuth();

  // 認証済みの場合は自動でリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Auth0のログイン処理
  const handleLogin = () => {
    login();
  };

  // Auth0の登録処理
  const handleRegister = () => {
    register();
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={loadingSpinnerStyles}>🔄</div>
        <p>認証中...</p>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>ログイン</h1>
        <p style={subtitleStyles}>CMSダッシュボードへようこそ</p>
      </div>

      <div style={cardStyles}>
        <div style={welcomeStyles}>
          <div style={iconContainerStyles}>
            <RocketIcon size="4rem" />
          </div>
          <h2 style={welcomeTitleStyles}>始めましょう</h2>
          <p style={welcomeTextStyles}>
            Auth0の安全な認証でアカウントにアクセスしてください
          </p>
        </div>

        <div style={actionsStyles}>
          <Button
            variant="primary"
            onClick={handleLogin}
            disabled={isLoading}
            fullWidth
          >
            <LoginIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
            ログイン
          </Button>

          <Button
            variant="secondary"
            onClick={handleRegister}
            disabled={isLoading}
            fullWidth
          >
            <UserIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
            新規登録
          </Button>
        </div>

        <div style={featuresStyles}>
          <div style={featureStyles}>
            <h3 style={featureTitleStyles}>✨ 特徴</h3>
            <ul style={featureListStyles}>
              <li>🔒 安全なAuth0認証</li>
              <li>📝 投稿管理機能</li>
              <li>📊 ダッシュボード</li>
              <li>🎨 美しいUI/UX</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 スタイル定義
const containerStyles: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const loadingStyles: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
};

const loadingSpinnerStyles: React.CSSProperties = {
  fontSize: '3rem',
  animation: 'spin 1s linear infinite',
};

const headerStyles: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const titleStyles: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 700,
  color: 'white',
  marginBottom: '0.5rem',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  color: 'rgba(255, 255, 255, 0.9)',
  margin: 0,
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '20px',
  padding: '3rem',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  maxWidth: '500px',
  width: '100%',
};

const welcomeStyles: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const iconContainerStyles: React.CSSProperties = {
  marginBottom: '1rem',
  color: '#667eea',
};

const welcomeTitleStyles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '1rem',
};

const welcomeTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#64748b',
  lineHeight: 1.6,
  marginBottom: '2rem',
};

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem',
};


const featuresStyles: React.CSSProperties = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: '2rem',
};

const featureStyles: React.CSSProperties = {
  textAlign: 'center',
};

const featureTitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '1rem',
};

const featureListStyles: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  fontSize: '0.95rem',
  color: '#64748b',
};

export default Login;