import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { LoginIcon, UserIcon, RocketIcon, SearchIcon, IconSizes } from '../components/common/Icons';

// 🎓 学習ポイント: リダイレクト機能付きログインページ
const Login: React.FC = () => {
  // 🎓 学習ポイント1: React Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🎓 学習ポイント2: 認証コンテキスト
  const { login } = useAuth();
  
  // 🎓 学習ポイント3: ローディング状態管理
  const [isLoading, setIsLoading] = useState(false);
  
  // 🎓 学習ポイント4: フォーム状態管理
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 🎓 学習ポイント4: リダイレクト先の判定
  const from = location.state?.from?.pathname || '/';  // デフォルトはホーム

  // 🎓 学習ポイント5: フォームログイン処理
  const handleFormLogin = async () => {
    // バリデーション
    setEmailError('');
    setPasswordError('');
    
    if (!email.includes('@')) {
      setEmailError('有効なメールアドレスを入力してください');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('ログインエラー:', error);
      setEmailError('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎓 学習ポイント6: 簡易ログイン処理
  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      // テスト用のダミーユーザーでログイン
      await login('test@example.com', 'password123');
      
      // 🎯 ログイン成功後に元のページにリダイレクト
      navigate(from, { replace: true });
    } catch (error) {
      console.error('ログインエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>ログイン</h1>
        <p style={subtitleStyles}>アカウントにログインしてください</p>
      </div>
      
      <div style={contentStyles}>
        {/* 🎓 学習ポイント6: リダイレクト情報の表示 */}
        {from !== '/' && (
          <div style={redirectInfoStyles}>
            <span style={redirectIconStyles}><SearchIcon size={IconSizes.md} /></span>
            <p style={redirectTextStyles}>
              ログイン後、<strong>{from}</strong> に戻ります
            </p>
          </div>
        )}

        <div style={loginCardStyles}>
          <span style={loginIconStyles}><LoginIcon size={IconSizes.xl} /></span>
          <h3 style={loginTitleStyles}>ログイン</h3>
          
          {/* 🎯 Inputコンポーネントのテスト */}
          <div style={formStyles}>
            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={setEmail}
              error={emailError}
              leftIcon={<UserIcon size={IconSizes.sm} />}
              fullWidth
              required
            />
            
            <Input
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={setPassword}
              error={passwordError}
              leftIcon={<LoginIcon size={IconSizes.sm} />}
              helperText="6文字以上で入力してください"
              fullWidth
              required
            />
            
            <Button
              variant="primary"
              size="large"
              loading={isLoading}
              onClick={handleFormLogin}
              fullWidth
            >
              ログイン
            </Button>
          </div>
          
          <div style={dividerStyles}>
            <span>または</span>
          </div>
          
          {/* 🎯 簡易ログインボタン */}
          <Button
            variant="secondary"
            size="medium"
            loading={isLoading}
            onClick={handleQuickLogin}
            leftIcon={<RocketIcon size={IconSizes.sm} />}
            fullWidth
          >
            簡易ログイン
          </Button>
          
          {/* 🎓 学習ポイント7: リダイレクト先の表示 */}
          <div style={debugInfoStyles}>
            <h4 style={debugTitleStyles}><SearchIcon size={IconSizes.sm} /> デバッグ情報</h4>
            <p style={debugItemStyles}>
              <strong>現在のページ:</strong> {location.pathname}
            </p>
            <p style={debugItemStyles}>
              <strong>リダイレクト先:</strong> {from}
            </p>
            <p style={debugItemStyles}>
              <strong>元ページ情報:</strong> {location.state?.from ? 'あり' : 'なし'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 スタイル定義
const containerStyles: React.CSSProperties = {
  padding: '2rem 0',
};

const headerStyles: React.CSSProperties = {
  marginBottom: '2rem',
  textAlign: 'center',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#64748b',
  margin: 0,
};

const contentStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
};

// 🎨 リダイレクト情報スタイル
const redirectInfoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '2rem',
  padding: '1rem',
  backgroundColor: 'rgba(14, 165, 233, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(14, 165, 233, 0.2)',
};

const redirectIconStyles: React.CSSProperties = {
  fontSize: '1.5rem',
};

const redirectTextStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#334155',
  margin: 0,
};

// 🎨 ログインカードスタイル
const loginCardStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  maxWidth: '500px',
};

const loginIconStyles: React.CSSProperties = {
  fontSize: '4rem',
  display: 'block',
  marginBottom: '1rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
};

const loginTitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: '#334155',
};

// const loginDescStyles: React.CSSProperties = {
//   fontSize: '1rem',
//   color: '#64748b',
//   lineHeight: 1.5,
//   marginBottom: '2rem',
// };

// 🎨 フォームスタイル
const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginBottom: '2rem',
};

// 🎨 区切り線スタイル
const dividerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  margin: '1.5rem 0',
  color: '#64748b',
  fontSize: '0.9rem',
  fontWeight: 500,
};


// 🎨 デバッグ情報スタイル
const debugInfoStyles: React.CSSProperties = {
  textAlign: 'left',
  padding: '1.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: '1rem',
};

const debugTitleStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
  color: '#334155',
};

const debugItemStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#64748b',
  margin: '0.25rem 0',
  fontFamily: 'monospace',
};

export default Login;