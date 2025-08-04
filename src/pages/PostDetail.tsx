import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from '../types/Post';
import Button from '../components/common/Button';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePost } from '../hooks/usePosts';
import { 
  HeartIcon, 
  CalendarIcon, 
  TagIcon, 
  ArrowLeftIcon, 
  PencilIcon,
  GlobeIcon,
  DocumentIcon,
  ArchiveIcon,
  ShieldIcon,
  IconColors,
  IconSizes
} from '../components/common/Icons';

// 🎓 学習ポイント1: 投稿詳細ページ（TanStack Query使用）
const PostDetail: React.FC = () => {
  // 🎓 学習ポイント2: URLパラメータの取得
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 🔑 重要: TanStack Queryを使ったデータ取得
  const { 
    data: post, 
    isLoading, 
    isFetching,
    isError, 
    error 
  } = usePost(id);

  // 🎓 学習ポイント4: お気に入りコンテキストの利用
  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();


  // 🎓 学習ポイント7: 日付フォーマット関数
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未設定';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 🎓 学習ポイント8: ステータスバッジ（アイコン付き）
  const getStatusBadge = (status: Post['status']) => {
    const statusConfig = {
      published: { 
        text: '公開', 
        color: IconColors.success, 
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: <GlobeIcon size={IconSizes.sm} />
      },
      draft: { 
        text: '下書き', 
        color: IconColors.warning, 
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: <DocumentIcon size={IconSizes.sm} />
      },
      private: { 
        text: '非公開', 
        color: IconColors.secondary, 
        bgColor: 'rgba(107, 114, 128, 0.1)',
        icon: <ArchiveIcon size={IconSizes.sm} />
      },
      deleted: { 
        text: '削除済み', 
        color: IconColors.danger, 
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: <ArchiveIcon size={IconSizes.sm} />
      }
    };
    
    const config = statusConfig[status];
    return (
      <span style={{
        ...statusBadgeStyles,
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}30`
      }}>
        <span style={{ marginRight: '0.5rem' }}>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  // 🎓 学習ポイント5: 条件付きレンダリング（TanStack Query使用）
  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <div style={loadingStyles}>
          <div style={loadingSpinnerStyles}>⏳</div>
          <p>投稿を読み込み中...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div style={errorStyles}>
          <div style={errorIconStyles}><ShieldIcon size={IconSizes.lg} /></div>
          <h2>エラーが発生しました</h2>
          <p>{error?.message || '予期しないエラーが発生しました'}</p>
          <div style={errorActionsStyles}>
            <Button variant="secondary" onClick={() => navigate('/posts')}>
              投稿一覧に戻る
            </Button>
            <Button variant="primary" onClick={() => window.location.reload()}>
              再読み込み
            </Button>
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <div style={errorStyles}>
          <div style={errorIconStyles}><ArchiveIcon size={IconSizes.lg} /></div>
          <h2>投稿が見つかりません</h2>
          <p>指定された投稿は存在しないか、削除された可能性があります。</p>
          <Button variant="primary" onClick={() => navigate('/posts')}>
            投稿一覧に戻る
          </Button>
        </div>
      );
    }

    return (
      <article style={articleStyles}>
        {/* ヘッダー部分 */}
        <header style={headerStyles}>
          <div style={titleSectionStyles}>
            <h1 style={titleStyles}>{post.title}</h1>
            {getStatusBadge(post.status)}
          </div>
          
          <div style={metaStyles}>
            <div style={dateStyles}>
              <CalendarIcon size={IconSizes.sm} color={IconColors.secondary} />
              <span>公開: {formatDate(post.first_published_at || '未設定')}</span>
              {post.content_updated_at && (
                <span>（更新: {formatDate(post.content_updated_at)}）</span>
              )}
            </div>
          </div>

          <div style={tagsStyles}>
            {post.tags.map((tag: string) => (
              <span key={tag} style={tagStyles}>
                <TagIcon size={IconSizes.xs} style={{ marginRight: '0.25rem' }} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* コンテンツ部分 */}
        <main style={contentStyles}>
          <div style={markdownStyles}>
            {post.content.split('\n').map((line: string, index: number) => {
              // 簡易Markdown風レンダリング
              if (line.startsWith('# ')) {
                return <h1 key={index} style={h1Styles}>{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} style={h2Styles}>{line.slice(3)}</h2>;
              }
              if (line.startsWith('```')) {
                return <div key={index} style={codeBlockStyles}>コードブロック</div>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} style={paragraphStyles}>{line}</p>;
            })}
          </div>
        </main>

        {/* アクション部分 */}
        <footer style={footerStyles}>
          {/* 🎓 学習ポイント15: お気に入り情報表示 */}
          <div style={favoritesInfoStyles}>
            <span style={favoritesLabelStyles}>
              <HeartIcon 
                size={IconSizes.sm} 
                color={IconColors.heart} 
                filled={true}
                style={{ marginRight: '0.5rem' }}
              />
              総お気に入り数: {favoriteCount}件
            </span>
          </div>

          <div style={actionsStyles}>
            <Button variant="secondary" onClick={() => navigate('/posts')}>
              <ArrowLeftIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
              投稿一覧に戻る
            </Button>
            
            {/* 🎓 学習ポイント16: お気に入りボタン */}
            <Button 
              variant={isFavorite(post.id) ? "primary" : "secondary"}
              onClick={() => toggleFavorite(post.id)}
            >
              <HeartIcon 
                size={IconSizes.sm} 
                color={isFavorite(post.id) ? IconColors.heart : IconColors.muted}
                filled={isFavorite(post.id)}
                style={{ marginRight: '0.5rem' }}
              />
              {isFavorite(post.id) ? "お気に入り解除" : "お気に入り追加"}
            </Button>
            
            <Button variant="primary" onClick={() => navigate(`/posts/${post.id}/edit`)}>
              <PencilIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
              編集
            </Button>
          </div>
        </footer>
      </article>
    );
  };

  return (
    <div style={containerStyles}>
      {renderContent()}
    </div>
  );
};

// 🎨 スタイル定義
const containerStyles: React.CSSProperties = {
  padding: '2rem 0',
  maxWidth: '800px',
  margin: '0 auto',
};

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
};

const loadingSpinnerStyles: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '1rem',
  animation: 'spin 1s linear infinite',
};

const errorStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  padding: '3rem',
};

const errorIconStyles: React.CSSProperties = {
  fontSize: '4rem',
  marginBottom: '1rem',
};

const errorActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
};

const articleStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
};

const headerStyles: React.CSSProperties = {
  padding: '2rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
};

const titleSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  margin: 0,
  color: '#334155',
  lineHeight: 1.2,
  flex: 1,
};

const statusBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
};

const metaStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

const dateStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '#64748b',
};

const tagsStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const tagStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#0ea5e9',
  backgroundColor: 'rgba(14, 165, 233, 0.1)',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  border: '1px solid rgba(14, 165, 233, 0.2)',
  fontWeight: 500,
};

const contentStyles: React.CSSProperties = {
  padding: '2rem',
};

const markdownStyles: React.CSSProperties = {
  lineHeight: 1.7,
  color: '#374151',
};

const h1Styles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '1rem',
  marginTop: '2rem',
  color: '#1f2937',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '0.5rem',
};

const h2Styles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  marginTop: '1.5rem',
  color: '#374151',
};

const paragraphStyles: React.CSSProperties = {
  marginBottom: '1rem',
  fontSize: '1rem',
  lineHeight: 1.7,
};

const codeBlockStyles: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  padding: '1rem',
  fontFamily: 'Monaco, Consolas, monospace',
  fontSize: '0.9rem',
  margin: '1rem 0',
};

const footerStyles: React.CSSProperties = {
  padding: '2rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
};

const favoritesInfoStyles: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  padding: '1rem',
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
};

const favoritesLabelStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#ec4899',
};

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

export default PostDetail;