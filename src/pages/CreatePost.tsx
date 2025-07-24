import React, { useReducer } from 'react';
import type { Post } from '../types/Post';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { DocumentIcon, GlobeIcon, UserIcon, CalendarIcon, TagIcon, ShieldIcon, PencilIcon, SearchIcon, IconSizes } from '../components/common/Icons';

// 🎓 学習ポイント1: useReducer用の状態型定義
interface FormState {
  // フォームデータ
  formData: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    status: Post['status'];
  };
  // バリデーションエラー
  validation: {
    titleError: string | null;
    contentError: string | null;
    excerptError: string | null;
  };
  // UI状態
  ui: {
    isSubmitting: boolean;
    showPreview: boolean;
    activeTab: 'edit' | 'preview';
  };
}

// 🎓 学習ポイント2: Action型の定義（Union Types）
type FormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_EXCERPT'; payload: string }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_STATUS'; payload: Post['status'] }
  | { type: 'SET_VALIDATION_ERROR'; field: keyof FormState['validation']; error: string | null }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_ACTIVE_TAB'; payload: FormState['ui']['activeTab'] }
  | { type: 'RESET_FORM' };

// 🎓 学習ポイント3: 初期状態の定義
const initialState: FormState = {
  formData: {
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    status: 'draft',
  },
  validation: {
    titleError: null,
    contentError: null,
    excerptError: null,
  },
  ui: {
    isSubmitting: false,
    showPreview: false,
    activeTab: 'edit',
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
    
    case 'SET_EXCERPT':
      return {
        ...state,
        formData: { ...state.formData, excerpt: action.payload },
        validation: { ...state.validation, excerptError: null },
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
          excerptError: null,
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
    
    case 'RESET_FORM':
      return initialState;
    
    default:
      return state;
  }
};

// 🎓 学習ポイント5: メインコンポーネント
const CreatePost: React.FC = () => {
  // 🎯 useReducer の使用
  const [state, dispatch] = useReducer(formReducer, initialState);

  // 🎓 学習ポイント6: バリデーション関数
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

  // 🎓 学習ポイント7: タグ処理関数
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    dispatch({ type: 'SET_TAGS', payload: tags });
  };

  // 🎓 学習ポイント8: フォーム送信処理
  const handleSubmit = async () => {
    dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
    
    if (!validateForm()) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });
    
    try {
      // TODO: 実際のAPI呼び出し
      console.log('投稿データ:', state.formData);
      
      // ダミー送信処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 成功時の処理
      alert('投稿が作成されました！');
      dispatch({ type: 'RESET_FORM' });
      
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      alert('投稿の作成に失敗しました');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>新規投稿作成</h1>
        <p style={subtitleStyles}>記事を作成して公開しましょう</p>
      </div>

      {/* 🎓 学習ポイント9: タブ切り替え */}
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

            {/* 抜粋 */}
            <Input
              label="抜粋"
              placeholder="投稿の概要を入力..."
              value={state.formData.excerpt}
              onChange={(value) => dispatch({ type: 'SET_EXCERPT', payload: value })}
              error={state.validation.excerptError || undefined}
              helperText="記事の概要を簡潔に記述してください（オプション）"
              fullWidth
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
                rows={10}
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
                {(['draft', 'published'] as const).map(status => (
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
                    {status === 'draft' ? <><DocumentIcon size={IconSizes.sm} /> 下書き</> : <><GlobeIcon size={IconSizes.sm} /> 公開</>}
                  </label>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div style={actionsStyles}>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: 'RESET_FORM' })}
                disabled={state.ui.isSubmitting}
              >
                リセット
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={state.ui.isSubmitting}
              >
                {state.formData.status === 'published' ? '投稿を公開' : '下書き保存'}
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
                <span><UserIcon size={IconSizes.sm} /> 開発者</span>
                <span><CalendarIcon size={IconSizes.sm} /> {new Date().toLocaleDateString('ja-JP')}</span>
                <span><TagIcon size={IconSizes.sm} /> {state.formData.tags.length > 0 ? state.formData.tags.join(', ') : 'タグなし'}</span>
              </div>
            </div>
            
            {state.formData.excerpt && (
              <div style={previewExcerptStyles}>
                <strong>概要:</strong> {state.formData.excerpt}
              </div>
            )}
            
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
  textAlign: 'center',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#64748b',
  margin: 0,
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
};

const activeTabStyles: React.CSSProperties = {
  color: '#10b981',
  borderBottomColor: '#10b981',
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

const previewExcerptStyles: React.CSSProperties = {
  padding: '1rem',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  marginBottom: '2rem',
  fontSize: '1rem',
  color: '#374151',
  lineHeight: 1.6,
};

const previewContentStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#374151',
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
};

export default CreatePost;