import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'auth' | 'posts'>('auth')

  return (
    <AuthProvider>
      <div style={{ padding: '20px' }}>
        <h1>CMS Front - 動作確認</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('auth')}
            style={{ 
              marginRight: '10px', 
              padding: '10px 20px',
              backgroundColor: activeTab === 'auth' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'auth' ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            認証テスト
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            style={{ 
              padding: '10px 20px',
              backgroundColor: activeTab === 'posts' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'posts' ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            投稿テスト
          </button>
        </div>

        {activeTab === 'auth' && <AuthTestComponent />}
        {activeTab === 'posts' && <PostsTestComponent />}
      </div>
    </AuthProvider>
  )
}

function AuthTestComponent() {
  const { state, login, register, logout, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      if (isRegisterMode) {
        await register(name, email, password)
        alert('ユーザー登録が完了しました')
        setIsRegisterMode(false)
      } else {
        await login(email, password)
        alert('ログインが完了しました')
      }
      
      setEmail('')
      setPassword('')
      setName('')
    } catch (error) {
      console.error('認証エラー:', error)
    }
  }

  return (
    <div>
      <h2>認証機能テスト</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>認証状態</h3>
        <p><strong>ログイン状態:</strong> {state.isAuthenticated ? 'ログイン済み' : '未ログイン'}</p>
        <p><strong>ユーザー名:</strong> {state.user?.name || '未設定'}</p>
        <p><strong>メールアドレス:</strong> {state.user?.email || '未設定'}</p>
        <p><strong>ローディング:</strong> {state.isLoading ? 'はい' : 'いいえ'}</p>
        {state.error && <p style={{ color: 'red' }}><strong>エラー:</strong> {state.error}</p>}
      </div>

      {state.isAuthenticated ? (
        <div>
          <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ログアウト
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => setIsRegisterMode(false)}
              style={{ 
                marginRight: '10px', 
                padding: '10px 20px',
                backgroundColor: !isRegisterMode ? '#007bff' : '#f8f9fa',
                color: !isRegisterMode ? 'white' : 'black',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ログイン
            </button>
            <button 
              onClick={() => setIsRegisterMode(true)}
              style={{ 
                padding: '10px 20px',
                backgroundColor: isRegisterMode ? '#007bff' : '#f8f9fa',
                color: isRegisterMode ? 'white' : 'black',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
            {isRegisterMode && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>名前:</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>メールアドレス:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>パスワード:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={state.isLoading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: state.isLoading ? '#6c757d' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: state.isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {state.isLoading ? '処理中...' : (isRegisterMode ? '登録' : 'ログイン')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function PostsTestComponent() {
  const { state: authState } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft' as 'draft' | 'published'
  })

  const [updateForm, setUpdateForm] = useState({
    title: '',
    content: '',
    tags: ''
  })

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { createPost } = await import('./services/posts.api')
      const newPost = await createPost({
        title: createForm.title,
        content: createForm.content,
        tags: createForm.tags ? createForm.tags.split(',').map(tag => tag.trim()) : [],
        status: createForm.status
      })
      
      setPosts(prev => [...prev, newPost])
      setCreateForm({ title: '', content: '', tags: '', status: 'draft' })
      alert('投稿が作成されました')
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetPost = async (postId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { getPost } = await import('./services/posts.api')
      const post = await getPost(postId)
      setSelectedPost(post)
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost) return
    
    setIsLoading(true)
    setError(null)

    try {
      const { updatePost } = await import('./services/posts.api')
      const updatedPost = await updatePost(selectedPost.id, {
        title: updateForm.title,
        content: updateForm.content,
        tags: updateForm.tags ? updateForm.tags.split(',').map(tag => tag.trim()) : []
      })
      
      setSelectedPost(updatedPost)
      setPosts(prev => prev.map(post => post.id === selectedPost.id ? updatedPost : post))
      alert('投稿が更新されました')
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatchStatus = async (postId: string, newStatus: 'draft' | 'published' | 'private' | 'deleted') => {
    setIsLoading(true)
    setError(null)

    try {
      const { patchPost } = await import('./services/posts.api')
      const updatedPost = await patchPost(postId, { status: newStatus })
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatedPost)
      }
      setPosts(prev => prev.map(post => post.id === postId ? updatedPost : post))
      alert(`投稿ステータスが${newStatus}に変更されました`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ステータスの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div>
        <h2>投稿機能テスト</h2>
        <p style={{ color: 'orange' }}>投稿機能を使用するには、まず認証タブでログインしてください。</p>
      </div>
    )
  }

  return (
    <div>
      <h2>投稿機能テスト</h2>
      
      {error && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          <strong>エラー:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3>投稿作成</h3>
        <form onSubmit={handleCreatePost} style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>タイトル:</label>
            <input 
              type="text" 
              value={createForm.title}
              onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>内容:</label>
            <textarea 
              value={createForm.content}
              onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={4}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>タグ（カンマ区切り）:</label>
            <input 
              type="text" 
              value={createForm.tags}
              onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="例: 技術, React, TypeScript"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>ステータス:</label>
            <select 
              value={createForm.status}
              onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="draft">下書き</option>
              <option value="published">公開</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: isLoading ? '#6c757d' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '作成中...' : '投稿作成'}
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>作成した投稿一覧</h3>
        {posts.length === 0 ? (
          <p>まだ投稿がありません。</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4>{post.title}</h4>
                <p><strong>ID:</strong> {post.id}</p>
                <p><strong>タグ:</strong> {post.tags?.join(', ') || 'なし'}</p>
                <button 
                  onClick={() => handleGetPost(post.id)}
                  style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  詳細取得
                </button>
                <button 
                  onClick={() => handlePatchStatus(post.id, 'published')}
                  style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  公開
                </button>
                <button 
                  onClick={() => handlePatchStatus(post.id, 'private')}
                  style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  非公開
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <div style={{ marginBottom: '30px' }}>
          <h3>投稿詳細</h3>
          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
            <h4>{selectedPost.title}</h4>
            <p><strong>ID:</strong> {selectedPost.id}</p>
            <p><strong>ステータス:</strong> {selectedPost.status}</p>
            <p><strong>タグ:</strong> {selectedPost.tags?.join(', ') || 'なし'}</p>
            <p><strong>内容:</strong></p>
            <p>{selectedPost.content}</p>
            <p><strong>初回公開日:</strong> {selectedPost.first_published_at || '未公開'}</p>
            <p><strong>最終更新日:</strong> {selectedPost.content_updated_at || '未更新'}</p>
          </div>
          
          <h4>投稿更新</h4>
          <form onSubmit={handleUpdatePost} style={{ maxWidth: '500px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>タイトル:</label>
              <input 
                type="text" 
                value={updateForm.title}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder={selectedPost.title}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>内容:</label>
              <textarea 
                value={updateForm.content}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder={selectedPost.content}
                rows={4}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>タグ（カンマ区切り）:</label>
              <input 
                type="text" 
                value={updateForm.tags}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder={selectedPost.tags?.join(', ') || 'タグなし'}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: isLoading ? '#6c757d' : '#fd7e14', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '更新中...' : '投稿更新'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
