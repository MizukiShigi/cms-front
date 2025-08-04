import React from 'react';
import { UserIcon, IconSizes } from '../components/common/Icons';

// 🎓 学習ポイント: 新規登録ページコンポーネント
const Register: React.FC = () => {
  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>新規登録</h1>
        <p style={subtitleStyles}>新しいアカウントを作成してください</p>
      </div>
      
      <div style={contentStyles}>
        <div style={comingSoonStyles}>
          <span style={comingSoonIconStyles}><UserIcon size={IconSizes.xl} /></span>
          <h3 style={comingSoonTitleStyles}>新規登録機能</h3>
          <p style={comingSoonTextStyles}>
            この機能は開発中です。<br />
            Phase 2で実装予定です。
          </p>
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

const comingSoonStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  maxWidth: '400px',
};

const comingSoonIconStyles: React.CSSProperties = {
  fontSize: '4rem',
  display: 'block',
  marginBottom: '1rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
};

const comingSoonTitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: '#334155',
};

const comingSoonTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#64748b',
  lineHeight: 1.5,
  margin: 0,
};

export default Register;