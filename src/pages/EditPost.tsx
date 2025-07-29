import React, { useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from '../types/Post';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { usePost } from '../hooks/usePosts';
import { useUpdatePost, usePatchPost } from '../hooks/usePostMutations';
import { 
  DocumentIcon, 
  GlobeIcon, 
  CalendarIcon, 
  TagIcon, 
  ShieldIcon, 
  PencilIcon, 
  SearchIcon, 
  ArrowLeftIcon,
  IconSizes 
} from '../components/common/Icons';

// 🎓 学習ポイント1: useReducer用の状態型定義
interface FormState {
  // フォームデータ
  formData: {
    title: string;
    content: string;
    tags: string[];
    status: Post['status'];
  };
  // バリデーションエラー
  validation: {
    titleError: string | null;
    contentError: string | null;
  };
  // UI状態
  ui: {
    isSubmitting: boolean;
    showPreview: boolean;
    activeTab: 'edit' | 'preview';
    isInitialized: boolean;
  };
}

// 🎓 学習ポイント2: Action型の定義（Union Types）
type FormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_STATUS'; payload: Post['status'] }
  | { type: 'SET_VALIDATION_ERROR'; field: keyof FormState['validation']; error: string | null }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_ACTIVE_TAB'; payload: FormState['ui']['activeTab'] }
  | { type: 'INITIALIZE_FORM'; payload: Post }
  | { type: 'RESET_FORM' };

// 🎓 学習ポイント3: 初期状態の定義
const initialState: FormState = {
  formData: {
    title: '',
    content: '',
    tags: [],
    status: 'draft',
  },
  validation: {
    titleError: null,
    contentError: null,
  },
  ui: {
    isSubmitting: false,
    showPreview: false,
    activeTab: 'edit',
    isInitialized: false,
  },
};

// 🎓 学習ポイント4: Reducer関数の実装
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    // フォームデータの更新
    case 'SET_TITLE':
      return {
        ...state,
        formData: { ...state.formData, title: action.payload },
        // タイトル変更時に関連エラーをクリア
        validation: { ...state.validation, titleError: null },
      };
    
    case 'SET_CONTENT':
      return {
        ...state,
        formData: { ...state.formData, content: action.payload },
        validation: { ...state.validation, contentError: null },
      };
    
    case 'SET_TAGS':
      return {
        ...state,
        formData: { ...state.formData, tags: action.payload },
      };
    
    case 'SET_STATUS':
      return {
        ...state,
        formData: { ...state.formData, status: action.payload },
      };
    
    // バリデーションエラーの管理
    case 'SET_VALIDATION_ERROR':
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.field]: action.error,
        },
      };
    
    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validation: {
          titleError: null,
          contentError: null,
        },
      };
    
    // UI状態の管理
    case 'SET_SUBMITTING':
      return {
        ...state,
        ui: { ...state.ui, isSubmitting: action.payload },
      };
    
    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        ui: { 
          ...state.ui, 
          showPreview: !state.ui.showPreview,
          activeTab: state.ui.showPreview ? 'edit' : 'preview',
        },
      };
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { 
          ...state.ui, 
          activeTab: action.payload,
          showPreview: action.payload === 'preview',
        },
      };
    
    case 'INITIALIZE_FORM':
      return {
        ...state,
        formData: {
          title: action.payload.title,
          content: action.payload.content,
          tags: action.payload.tags,
          status: action.payload.status,
        },
        ui: { ...state.ui, isInitialized: true },
      };
    
    case 'RESET_FORM':
      return { ...initialState, ui: { ...initialState.ui, isInitialized: state.ui.isInitialized } };
    
    default:
      return state;
  }
};

// 🎓 学習ポイント5: メインコンポーネント
const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 🔑 重要: TanStack Query を使った既存データの取得
  const { 
    data: post, 
    isLoading, 
    isError, 
    error 
  } = usePost(id);
  
  // 🔑 重要: 投稿更新用のmutation hook
  const updatePost = useUpdatePost();
  const patchPost = usePatchPost();
  
  // 🎯 useReducer の使用
  const [state, dispatch] = useReducer(formReducer, initialState);

  // 🎓 学習ポイント6: 既存データでフォームを初期化
  useEffect(() => {
    if (post && !state.ui.isInitialized) {
      dispatch({ type: 'INITIALIZE_FORM', payload: post });
    }
  }, [post, state.ui.isInitialized]);

  // 🎓 学習ポイント7: バリデーション関数
  const validateForm = (): boolean => {
    let isValid = true;

    // タイトルバリデーション
    if (!state.formData.title.trim()) {
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'titleError', error: 'タイトルは必須です' });
      isValid = false;
    } else if (state.formData.title.length < 3) {
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'titleError', error: 'タイトルは3文字以上で入力してください' });
      isValid = false;
    }

    // 内容バリデーション
    if (!state.formData.content.trim()) {
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'contentError', error: '内容は必須です' });
      isValid = false;
    } else if (state.formData.content.length < 10) {
      dispatch({ type: 'SET_VALIDATION_ERROR', field: 'contentError', error: '内容は10文字以上で入力してください' });
      isValid = false;
    }

    return isValid;
  };

  // 🎓 学習ポイント8: タグ処理関数
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    dispatch({ type: 'SET_TAGS', payload: tags });
  };

  // 🎓 学習ポイント9: フォーム送信処理（実際のAPI呼び出し）
  const handleSubmit = async () => {
    if (!id) return;
    
    dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
    
    if (!validateForm()) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });
    
    // 🔑 重要: TanStack Query mutation を使用した実際のAPI呼び出し
    updatePost.mutate(
      {
        id,
        data: {
          title: state.formData.title,
          content: state.formData.content,
          tags: state.formData.tags,
        }
      },
      {
        // 成功時の処理
        onSuccess: (updatedPost) => {
          console.log('✅ 投稿が正常に更新されました:', updatedPost);
          
          // ステータスが変更された場合は部分更新も実行
          if (state.formData.status !== post?.status) {
            patchPost.mutate({
              id,
              data: { status: state.formData.status }
            }, {
              onSuccess: () => {
                console.log('✅ ステータスが正常に更新されました:', state.formData.status);
              },
              onError: (statusError: any) => {
                console.error('❌ ステータス更新でエラーが発生しました:', statusError);
                alert(`ステータス更新エラー: ${statusError.message}`);
              }
            });
          }
          
          dispatch({ type: 'SET_SUBMITTING', payload: false });
          navigate(`/posts/${id}`);
        },
        
        // エラー時の処理
        onError: (error: any) => {
          console.error('❌ 投稿更新でエラーが発生しました:', error);
          dispatch({ type: 'SET_SUBMITTING', payload: false });
          
          // エラーメッセージを表示
          const errorMessage = error.message || '投稿の更新に失敗しました';
          alert(`エラー: ${errorMessage}`);
        }
      }
    );
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <DocumentIcon size={IconSizes.xl} />
        <p>投稿を読み込み中...</p>
      </div>
    );
  }

  // エラー状態
  if (isError) {
    return (
      <div style={errorStyles}>
        <ShieldIcon size={IconSizes.xl} />
        <h2>エラーが発生しました</h2>
        <p>{error?.message || '投稿の読み込みに失敗しました'}</p>
        <Button variant="primary" onClick={() => navigate('/posts')}>
          投稿一覧に戻る
        </Button>
      </div>
    );
  }

  // 投稿が見つからない場合
  if (!post) {
    return (
      <div style={errorStyles}>
        <DocumentIcon size={IconSizes.xl} />
        <h2>投稿が見つかりません</h2>
        <p>指定された投稿は存在しないか、削除された可能性があります。</p>
        <Button variant="primary" onClick={() => navigate('/posts')}>
          投稿一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={headerContentStyles}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/posts/${id}`)}
          >
            <ArrowLeftIcon size={IconSizes.sm} />
            戻る
          </Button>
          <div>
            <h1 style={titleStyles}>投稿を編集</h1>
            <p style={subtitleStyles}>「{post.title}」を編集しています</p>
          </div>
        </div>
      </div>

      {/* 🎓 学習ポイント10: タブ切り替え */}
      <div style={tabsStyles}>
        <button
          style={{
            ...tabButtonStyles,
            ...(state.ui.activeTab === 'edit' ? activeTabStyles : {}),
          }}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'edit' })}
        >
          <PencilIcon size={IconSizes.sm} /> 編集
        </button>
        <button
          style={{
            ...tabButtonStyles,
            ...(state.ui.activeTab === 'preview' ? activeTabStyles : {}),
          }}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'preview' })}
        >
          <SearchIcon size={IconSizes.sm} /> プレビュー
        </button>
      </div>

      <div style={contentStyles}>
        {state.ui.activeTab === 'edit' ? (
          // 編集フォーム
          <div style={formStyles}>
            {/* タイトル */}
            <Input
              label="タイトル"
              placeholder="投稿のタイトルを入力..."
              value={state.formData.title}
              onChange={(value) => dispatch({ type: 'SET_TITLE', payload: value })}
              error={state.validation.titleError || undefined}
              fullWidth
              required
            />

            {/* 内容 */}
            <div style={fieldStyles}>
              <label style={labelStyles}>
                内容 <span style={requiredStyles}>*</span>
              </label>
              <textarea
                style={{
                  ...textareaStyles,
                  borderColor: state.validation.contentError ? '#ef4444' : '#e2e8f0',
                }}
                placeholder="投稿の内容を入力..."
                value={state.formData.content}
                onChange={(e) => dispatch({ type: 'SET_CONTENT', payload: e.target.value })}
                rows={15}
              />
              {state.validation.contentError && (
                <div style={errorTextStyles}>
                  <ShieldIcon size={IconSizes.sm} /> {state.validation.contentError}
                </div>
              )}
            </div>

            {/* タグ */}
            <Input
              label="タグ"
              placeholder="タグをカンマ区切りで入力（例: React, TypeScript, 学習）"
              value={state.formData.tags.join(', ')}
              onChange={handleTagsChange}
              helperText="記事に関連するタグを追加してください"
              fullWidth
            />

            {/* ステータス */}
            <div style={fieldStyles}>
              <label style={labelStyles}>公開状態</label>
              <div style={radioGroupStyles}>
                {(['draft', 'published', 'private'] as const).map(status => (
                  <label key={status} style={radioLabelStyles}>
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={state.formData.status === status}
                      onChange={(e) => dispatch({ 
                        type: 'SET_STATUS', 
                        payload: e.target.value as Post['status'] 
                      })}
                      style={radioInputStyles}
                    />
                    {status === 'draft' && <><DocumentIcon size={IconSizes.sm} /> 下書き</>}
                    {status === 'published' && <><GlobeIcon size={IconSizes.sm} /> 公開</>}
                    {status === 'private' && <><ShieldIcon size={IconSizes.sm} /> 非公開</>}
                  </label>
                ))}
              </div>
            </div>

            {/* 投稿情報 */}
            <div style={postInfoStyles}>
              <div style={postInfoItemStyles}>
                <CalendarIcon size={IconSizes.sm} />
                <span>公開日: {post.first_published_at ? new Date(post.first_published_at).toLocaleDateString('ja-JP') : '未公開'}</span>
              </div>
              <div style={postInfoItemStyles}>
                <CalendarIcon size={IconSizes.sm} />
                <span>更新日: {post.content_updated_at ? new Date(post.content_updated_at).toLocaleDateString('ja-JP') : '未更新'}</span>
              </div>
            </div>

            {/* エラー表示 */}
            {updatePost.isError && (
              <div style={apiErrorStyles}>
                <ShieldIcon size={IconSizes.sm} />
                <span>更新エラー: {updatePost.error?.message || '不明なエラーが発生しました'}</span>
              </div>
            )}

            {/* アクションボタン */}
            <div style={actionsStyles}>
              <Button
                variant="secondary"
                onClick={() => navigate(`/posts/${id}`)}
                disabled={state.ui.isSubmitting || updatePost.isPending}
              >
                キャンセル
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={state.ui.isSubmitting || updatePost.isPending}
                disabled={updatePost.isPending}
              >
                更新を保存
              </Button>
            </div>
          </div>
        ) : (
          // プレビュー
          <div style={previewStyles}>
            <div style={previewHeaderStyles}>
              <h1 style={previewTitleStyles}>
                {state.formData.title || 'タイトル未入力'}
              </h1>
              <div style={previewMetaStyles}>
                <span><CalendarIcon size={IconSizes.sm} /> {new Date().toLocaleDateString('ja-JP')}</span>
                <span><TagIcon size={IconSizes.sm} /> {state.formData.tags.length > 0 ? state.formData.tags.join(', ') : 'タグなし'}</span>
              </div>
            </div>
            
            <div style={previewContentStyles}>
              {state.formData.content || '内容が入力されていません'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎨 スタイル定義
const containerStyles: React.CSSProperties = {
  padding: '2rem 0',
  maxWidth: '800px',
  margin: '0 auto',
};

const headerStyles: React.CSSProperties = {
  marginBottom: '2rem',
};

const headerContentStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#64748b',
  margin: 0,
};

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
  gap: '1rem',
};

const errorStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
  gap: '1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  padding: '3rem',
};

const tabsStyles: React.CSSProperties = {
  display: 'flex',
  marginBottom: '2rem',
  borderBottom: '1px solid #e2e8f0',
};

const tabButtonStyles: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#64748b',
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const activeTabStyles: React.CSSProperties = {
  color: '#f59e0b',
  borderBottomColor: '#f59e0b',
};

const contentStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  padding: '2rem',
};

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
};

const requiredStyles: React.CSSProperties = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const textareaStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const errorTextStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#ef4444',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
};

const radioGroupStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
};

const radioLabelStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#374151',
};

const radioInputStyles: React.CSSProperties = {
  marginRight: '0.25rem',
};

const postInfoStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
};

const postInfoItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '#1e40af',
};

const apiErrorStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  fontSize: '0.9rem',
  color: '#dc2626',
  fontWeight: 500,
};

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  paddingTop: '1rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
};

const previewStyles: React.CSSProperties = {
  minHeight: '400px',
};

const previewHeaderStyles: React.CSSProperties = {
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
};

const previewTitleStyles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '1rem',
  color: '#334155',
  lineHeight: 1.3,
};

const previewMetaStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  fontSize: '0.9rem',
  color: '#64748b',
  flexWrap: 'wrap',
};

const previewContentStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#374151',
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
};

export default EditPost;