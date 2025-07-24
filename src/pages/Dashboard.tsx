import React from 'react';
import { theme } from '../styles/theme';
import {
  PaletteIcon,
  ShieldIcon,
  DocumentIcon,
  ImageIcon,
  IconSizes,
  IconColors
} from '../components/common/Icons';

// 🎓 学習ポイント: ページコンポーネントの基本構造
const Dashboard: React.FC = () => {
  return (
    <div style={containerStyles}>
      <div style={welcomeContainerStyles}>
        <h1 style={welcomeTitleStyles}>
          ようこそ、CMSダッシュボードへ！
        </h1>
        <p style={welcomeTextStyles}>
          このアプリケーションは、React TypeScriptを使用して構築されたコンテンツ管理システムです。
        </p>
        
        <div style={featureListStyles}>
          <div style={featureItemStyles}>
            <div style={featureIconStyles}>
              <PaletteIcon size={IconSizes.xl} color={IconColors.palette} />
            </div>
            <div>
              <h3 style={featureNameStyles}>モダンなデザイン</h3>
              <p style={featureDescStyles}>グラスモーフィズム、ダークモード、アニメーション</p>
            </div>
          </div>
          <div style={featureItemStyles}>
            <div style={featureIconStyles}>
              <ShieldIcon size={IconSizes.xl} color={IconColors.shield} />
            </div>
            <div>
              <h3 style={featureNameStyles}>認証システム</h3>
              <p style={featureDescStyles}>JWT認証、ログイン・登録機能</p>
            </div>
          </div>
          <div style={featureItemStyles}>
            <div style={featureIconStyles}>
              <DocumentIcon size={IconSizes.xl} color={IconColors.primary} />
            </div>
            <div>
              <h3 style={featureNameStyles}>投稿管理</h3>
              <p style={featureDescStyles}>投稿作成、編集、公開機能</p>
            </div>
          </div>
          <div style={featureItemStyles}>
            <div style={featureIconStyles}>
              <ImageIcon size={IconSizes.xl} color={IconColors.warning} />
            </div>
            <div>
              <h3 style={featureNameStyles}>画像管理</h3>
              <p style={featureDescStyles}>画像アップロード、管理機能</p>
            </div>
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

const welcomeContainerStyles: React.CSSProperties = {
  textAlign: 'center',
  animation: 'fadeIn 0.6s ease-out',
};

const welcomeTitleStyles: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 800,
  marginBottom: '1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const welcomeTextStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#64748b',
  marginBottom: '3rem',
  maxWidth: '600px',
  margin: '0 auto 3rem auto',
  lineHeight: 1.6,
};

const featureListStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
  marginTop: '2rem',
};

const featureItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const featureIconStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
};

const featureNameStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: '0 0 0.5rem 0',
  color: '#334155',
};

const featureDescStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#64748b',
  margin: 0,
  lineHeight: 1.5,
};

export default Dashboard;