import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
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

  // 🎓 学習ポイント: 状態管理とイベントハンドラー
  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
