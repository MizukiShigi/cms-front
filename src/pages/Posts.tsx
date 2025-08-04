import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostSummary } from '../types/Post';
import { usePostsPaginated } from '../hooks/usePosts';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useFavorites } from '../contexts/FavoritesContext';
import { 
  HeartIcon, 
  CalendarIcon, 
  TagIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  SearchIcon,
  GlobeIcon,
  DocumentIcon,
  ArchiveIcon,
  IconColors,
  IconSizes
} from '../components/common/Icons';

// 🎓 学習ポイント1: TanStack Queryを使った投稿管理ページ
const Posts: React.FC = () => {
  // 🎓 学習ポイント2: React Router navigation
  const navigate = useNavigate();
  
  // 🎓 学習ポイント3: ローカル状態管理（UI状態のみ）
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [statusFilter, setStatusFilter] = useState<ListPostsParams['status']>();

  // 🎓 学習ポイント4: お気に入りコンテキストの利用
  const { favoriteCount } = useFavorites();

  // 🔑 重要: TanStack Queryを使ったデータ取得
  const { 
    data,
    isLoading,
    isError,
    error,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = usePostsPaginated(currentPage, 20, {
    // 🔧 デバッグ: まずは全ての投稿を取得してみる
    // status: statusFilter,
    sort: 'created_at_desc'
  });

  // 🎓 学習ポイント5: 検索機能（将来の実装用）
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 検索時は1ページ目に戻る
    // TODO: 実際の検索APIが実装されたらここで呼び出し
  };

  // 🎓 学習ポイント6: ページング機能
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 🎓 学習ポイント7: TanStack Query状態に基づくレンダリング
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={loadingStyles}>
          <div style={loadingIconStyles}>
            <DocumentIcon size={IconSizes.xl} color={IconColors.secondary} />
          </div>
          <p>投稿を読み込み中...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div style={errorStyles}>
          <div style={errorIconStyles}>
            <ArchiveIcon size={IconSizes.xl} color={IconColors.danger} />
          </div>
          <h3>エラーが発生しました</h3>
          <p>{error?.message || '予期しないエラーが発生しました'}</p>
          <p style={errorSubTextStyles}>サーバーとの通信でエラーが発生しました</p>
        </div>
      );
    }

    if (!data?.posts || data.posts.length === 0) {
      return (
        <div style={emptyStateStyles}>
          <div style={emptyIconStyles}>
            <DocumentIcon size={'4rem'} color={IconColors.muted} />
          </div>
          <h3 style={emptyTitleStyles}>投稿がありません</h3>
          <p style={emptyTextStyles}>
            まずは新しい投稿を作成してみましょう
          </p>
        </div>
      );
    }

    return (
      <div style={postsGridStyles}>
        {data.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>投稿管理</h1>
        <p style={subtitleStyles}>作成した投稿を管理できます</p>
        
        {/* 🔧 デバッグ情報の表示 */}
        {data?.meta && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#1e40af'
          }}>
            <strong>デバッグ情報:</strong><br />
            総件数: {data.meta.total} | 
            取得件数: {data.meta.limit} | 
            開始位置: {data.meta.offset} | 
            次ページ: {data.meta.has_next ? 'あり' : 'なし'}
          </div>
        )}
        
        {/* 🎓 学習ポイント: お気に入り数の表示 */}
        {favoriteCount > 0 && (
          <div style={favoritesCountStyles}>
            <HeartIcon 
              size={IconSizes.sm} 
              color={IconColors.heart} 
              filled={true}
              style={{ marginRight: '0.5rem' }}
            />
            お気に入り: {favoriteCount}件
          </div>
        )}
      </div>
      
      {/* 🎓 学習ポイント10: 検索バーと新規作成ボタン */}
      <div style={toolbarStyles}>
        <div style={searchSectionStyles}>
          <Input
            placeholder="投稿を検索..."
            value={searchQuery}
            onChange={handleSearch}
            leftIcon={<SearchIcon size={IconSizes.sm} color={IconColors.secondary} />}
            fullWidth
          />
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/posts/create')}
        >
          <PlusIcon size={IconSizes.sm} style={{ marginRight: '0.5rem' }} />
          新規投稿
        </Button>
      </div>

      {/* 🎓 学習ポイント11: メインコンテンツ */}
      <div style={contentStyles}>
        {renderContent()}
      </div>

      {/* 🎓 学習ポイント8: TanStack Queryによるページネーション */}
      {data?.posts && data.posts.length > 0 && totalPages > 1 && (
        <div style={paginationStyles}>
          <Button 
            variant="secondary" 
            disabled={!hasPreviousPage || isLoading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            前へ
          </Button>
          <span style={pageInfoStyles}>
            {currentPage} / {totalPages}
          </span>
          <Button 
            variant="secondary" 
            disabled={!hasNextPage || isLoading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
};

// 🎓 学習ポイント9: PostCard子コンポーネント（PostSummary対応）
const PostCard: React.FC<{ post: PostSummary }> = ({ post }) => {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未設定';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getStatusBadge = (status: PostSummary['status']) => {
    const statusConfig = {
      published: { 
        text: '公開', 
        color: IconColors.success,
        icon: <GlobeIcon size={IconSizes.xs} />
      },
      draft: { 
        text: '下書き', 
        color: IconColors.warning,
        icon: <DocumentIcon size={IconSizes.xs} />
      },
      private: { 
        text: '非公開', 
        color: IconColors.secondary,
        icon: <ArchiveIcon size={IconSizes.xs} />
      },
      deleted: { 
        text: '削除済み', 
        color: IconColors.danger,
        icon: <TrashIcon size={IconSizes.xs} />
      }
    };
    
    const config = statusConfig[status];
    return (
      <span style={{
        ...statusBadgeStyles,
        backgroundColor: config.color + '20',
        color: config.color,
        border: `1px solid ${config.color}40`
      }}>
        <span style={{ marginRight: '0.25rem' }}>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  return (
    <div 
      style={{
        ...postCardStyles,
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div style={postHeaderStyles}>
        <div style={titleWithFavoriteStyles}>
          <h3 style={postTitleStyles}>{post.title}</h3>
          {/* 🎓 学習ポイント: お気に入りマーク */}
          {isFavorite(post.id) && (
            <HeartIcon 
              size={IconSizes.sm} 
              color={IconColors.heart} 
              filled={true}
              style={favoriteMarkStyles}
            />
          )}
        </div>
        {getStatusBadge(post.status)}
      </div>
      
      {/* 🎓 学習ポイント: PostSummaryには excerpt がないため、タイトルの代わりに表示 */}
      <p style={postExcerptStyles}>投稿の詳細を確認するにはクリックしてください</p>
      
      <div style={postTagsStyles}>
        {post.tags.map(tag => (
          <span key={tag} style={tagStyles}>
            <TagIcon size={IconSizes.xs} style={{ marginRight: '0.25rem' }} />
            {tag}
          </span>
        ))}
      </div>
      
      <div style={postFooterStyles}>
        <div style={postMetaStyles}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CalendarIcon size={IconSizes.xs} color={IconColors.secondary} />
            公開: {formatDate(post.first_published_at)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CalendarIcon size={IconSizes.xs} color={IconColors.secondary} />
            更新: {formatDate(post.content_updated_at)}
          </span>
        </div>
        
        <div style={postActionsStyles}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
              e?.stopPropagation();
              navigate(`/posts/${post.id}/edit`);
            }}
          >
            <PencilIcon size={IconSizes.xs} style={{ marginRight: '0.25rem' }} />
            編集
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
              e?.stopPropagation();
              // TODO: 削除機能実装
              console.log('削除:', post.id);
            }}
          >
            <TrashIcon size={IconSizes.xs} style={{ marginRight: '0.25rem' }} />
            削除
          </Button>
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

const emptyStateStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  maxWidth: '400px',
};

const emptyIconStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
};

const emptyTitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: '#334155',
};

const emptyTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#64748b',
  lineHeight: 1.5,
  margin: 0,
};

// 🎨 新しいスタイル定義
const toolbarStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
};

const searchSectionStyles: React.CSSProperties = {
  flex: 1,
  maxWidth: '400px',
};

const loadingStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
};

const loadingIconStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const errorStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
};

const errorIconStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const errorSubTextStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#64748b',
  fontStyle: 'italic',
};

const postsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1.5rem',
};

const paginationStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '2rem',
};

const pageInfoStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 500,
  color: '#64748b',
};

// 🎨 PostCard用スタイル
const postCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  padding: '1.5rem',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
};

const postHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
  gap: '1rem',
};

const postTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: 0,
  color: '#334155',
  lineHeight: 1.4,
};

const statusBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'flex',
  alignItems: 'center',
};

const postExcerptStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#64748b',
  lineHeight: 1.6,
  marginBottom: '1rem',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const postTagsStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1rem',
};

const tagStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#0ea5e9',
  backgroundColor: 'rgba(14, 165, 233, 0.1)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid rgba(14, 165, 233, 0.2)',
};

const postFooterStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
};

const postMetaStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  fontSize: '0.85rem',
  color: '#64748b',
};

const postActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

// 🎨 お気に入り関連のスタイル
const favoritesCountStyles: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#ec4899',
  textAlign: 'center',
  display: 'inline-block',
};

const titleWithFavoriteStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flex: 1,
};

const favoriteMarkStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))',
};

export default Posts;