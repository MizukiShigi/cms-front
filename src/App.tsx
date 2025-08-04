import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth0Provider } from '@auth0/auth0-react'
import { queryClient } from './lib/queryClient'


import { FavoritesProvider } from './contexts/FavoritesContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import PostDetail from './pages/PostDetail'
import Media from './pages/Media'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import './App.css'

// 🎓 学習ポイント: React Router対応のAppコンポーネント




function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Auth0設定の確認
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID

  // 🎓 学習ポイント: 状態管理とイベントハンドラー
  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Auth0設定がない場合の警告表示
  if (!auth0Domain || !auth0ClientId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2>Auth0設定が必要です</h2>
        <p>以下の環境変数を.env.localファイルに設定してください：</p>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          VITE_AUTH0_DOMAIN=your-domain.auth0.com{'\n'}
          VITE_AUTH0_CLIENT_ID=your-client-id
        </pre>
      </div>
    )
  }


  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
        useRefreshTokensFallback={true}
        cacheLocation="memory"
      >
        <BrowserRouter>
          <FavoritesProvider>
              <Layout 
              title="CMS Dashboard" 
              subtitle="コンテンツ管理システム"
              showMobileMenu={showMobileMenu}
              onMenuToggle={handleMenuToggle}
              isDarkMode={isDarkMode}
              onThemeToggle={handleThemeToggle}
              >
                {/* 🎓 学習ポイント: ProtectedRoute適用後のRoutes */}
                <Routes>
                  {/* 🌐 パブリックルート（認証不要） */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* 🔐 プロテクトルート（認証必要） */}
                  <Route 
                    path="/posts" 
                    element={
                      <ProtectedRoute>
                        <Posts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/posts/create" 
                    element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/posts/:id/edit" 
                    element={
                      <ProtectedRoute>
                        <EditPost />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/posts/:id" 
                    element={
                      <ProtectedRoute>
                        <PostDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/media" 
                    element={
                      <ProtectedRoute>
                        <Media />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 🚫 404ページ（ワイルドカードルート） */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
          </FavoritesProvider>
        </BrowserRouter>
      </Auth0Provider>
      {/* 🎓 学習ポイント: 開発時のみReact Query DevToolsを表示 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
