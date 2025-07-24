import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, PostsResponse } from '../types/Post';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useFavorites } from '../contexts/FavoritesContext';
import { 
  HeartIcon, 
  UserIcon, 
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

// 🎓 学習ポイント1: 投稿管理ページコンポーネント（API連携版）
const Posts: React.FC = () => {
  // 🎓 学習ポイント2: React Router navigation
  const navigate = useNavigate();
  
  // 🎓 学習ポイント3: useState による状態管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 🎓 学習ポイント4: お気に入りコンテキストの利用
  const { favoriteCount } = useFavorites();

  // 🎓 学習ポイント3: API呼び出し関数（開発用ダミーデータ版）
  const fetchPosts = async (page: number = 1, query: string = '') => {
    setLoading(true);
    setError(null);
    
    // 🎓 学習ポイント: 開発中は実際のAPIがないのでダミーデータを使用
    await new Promise(resolve => setTimeout(resolve, 1000)); // 読み込み時間をシミュレート
    
    try {
      const dummyPosts = getDummyPosts();
      
      // 🎓 学習ポイント4: 検索機能のシミュレート
      const filteredPosts = query 
        ? dummyPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          )
        : dummyPosts;
      
      setPosts(filteredPosts);
      setTotalPages(1); // ダミーデータなので1ページのみ
      setCurrentPage(1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 🎓 学習ポイント5: useEffect でコンポーネント初期化時にデータ取得
  useEffect(() => {
    fetchPosts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // 🎓 学習ポイント6: 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 検索時は1ページ目に戻る
  };

  // 🎓 学習ポイント7: ページング機能
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 🎓 学習ポイント8: 開発用ダミーデータ
  const getDummyPosts = (): Post[] => [
    {
      id: 1,
      title: "React TypeScriptの学習方法",
      content: "React TypeScriptを効率的に学習するためのポイントを解説します...",
      author: "開発者",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
      status: "published",
      tags: ["React", "TypeScript", "学習"],
      excerpt: "React TypeScriptを効率的に学習するためのポイント"
    },
    {
      id: 2,
      title: "useReducerとuseStateの使い分け",
      content: "状態管理でuseReducerとuseStateをどう使い分けるかを解説...",
      author: "開発者",
      createdAt: "2024-01-19T15:30:00Z",
      updatedAt: "2024-01-19T15:30:00Z",
      status: "published",
      tags: ["React", "状態管理", "hooks"],
      excerpt: "状態管理の選択基準について"
    },
    {
      id: 3,
      title: "API連携のベストプラクティス",
      content: "ReactアプリケーションでのAPI連携パターンを紹介...",
      author: "開発者",
      createdAt: "2024-01-18T09:15:00Z",
      updatedAt: "2024-01-18T09:15:00Z",
      status: "draft",
      tags: ["API", "React", "ベストプラクティス"],
      excerpt: "API連携のパターンとエラーハンドリング"
    }
  ];
  // 🎓 学習ポイント9: 条件付きレンダリング
  const renderContent = () => {
    if (loading) {
      return (
        <div style={loadingStyles}>
          <div style={loadingIconStyles}>
            <DocumentIcon size={IconSizes.xl} color={IconColors.secondary} />
          </div>
          <p>投稿を読み込み中...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={errorStyles}>
          <div style={errorIconStyles}>
            <ArchiveIcon size={IconSizes.xl} color={IconColors.danger} />
          </div>
          <h3>エラーが発生しました</h3>
          <p>{error}</p>
          <p style={errorSubTextStyles}>開発用ダミーデータを表示しています</p>
        </div>
      );
    }

    if (posts.length === 0) {
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
        {posts.map(post => (
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

      {/* 🎓 学習ポイント12: ページネーション */}
      {posts.length > 0 && totalPages > 1 && (
        <div style={paginationStyles}>
          <Button 
            variant="secondary" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            前へ
          </Button>
          <span style={pageInfoStyles}>
            {currentPage} / {totalPages}
          </span>
          <Button 
            variant="secondary" 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
};

// 🎓 学習ポイント13: PostCard子コンポーネント
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getStatusBadge = (status: Post['status']) => {
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
      archived: { 
        text: 'アーカイブ', 
        color: IconColors.muted,
        icon: <ArchiveIcon size={IconSizes.xs} />
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
      
      <p style={postExcerptStyles}>{post.excerpt}</p>
      
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
            <UserIcon size={IconSizes.xs} color={IconColors.secondary} />
            {post.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CalendarIcon size={IconSizes.xs} color={IconColors.secondary} />
            {formatDate(post.createdAt)}
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