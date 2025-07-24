import React from 'react';
import { theme } from '../styles/theme';
import { ImageIcon, IconSizes } from '../components/common/Icons';

// 🎓 学習ポイント: 画像管理ページコンポーネント
const Media: React.FC = () => {
  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>画像管理</h1>
        <p style={subtitleStyles}>アップロードした画像を管理できます</p>
      </div>
      
      <div style={contentStyles}>
        <div style={comingSoonStyles}>
          <span style={comingSoonIconStyles}><ImageIcon size={IconSizes.xl} /></span>
          <h3 style={comingSoonTitleStyles}>画像管理機能</h3>
          <p style={comingSoonTextStyles}>
            この機能は開発中です。<br />
            Phase 4で実装予定です。
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

export default Media;