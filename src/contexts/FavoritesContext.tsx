import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 🎓 学習ポイント1: お気に入りコンテキストの型定義
interface FavoritesContextType {
  favoriteIds: number[];                           // お気に入り投稿のID配列
  favoriteCount: number;                           // お気に入り数
  isFavorite: (postId: number) => boolean;        // 指定投稿がお気に入りか判定
  toggleFavorite: (postId: number) => void;       // お気に入り追加/削除
  clearAllFavorites: () => void;                  // 全削除（開発用）
}

// 🎓 学習ポイント2: コンテキストの作成
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// 🎓 学習ポイント3: Provider コンポーネントの Props
interface FavoritesProviderProps {
  children: ReactNode;
}

// 🎓 学習ポイント4: お気に入り Provider コンポーネント
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // 🎓 学習ポイント5: 状態管理
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // 🎓 学習ポイント6: ローカルストレージからの初期読み込み
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('cms-favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // 配列かどうかの安全性チェック
        if (Array.isArray(parsedFavorites)) {
          setFavoriteIds(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('お気に入り情報の読み込みに失敗しました:', error);
      // エラー時は空配列で初期化
      setFavoriteIds([]);
    }
  }, []);

  // 🎓 学習ポイント7: 状態変更時のローカルストレージ保存
  useEffect(() => {
    try {
      localStorage.setItem('cms-favorites', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('お気に入り情報の保存に失敗しました:', error);
    }
  }, [favoriteIds]);

  // 🎓 学習ポイント8: お気に入り判定関数
  const isFavorite = (postId: number): boolean => {
    return favoriteIds.includes(postId);
  };

  // 🎓 学習ポイント9: お気に入り切り替え関数
  const toggleFavorite = (postId: number): void => {
    setFavoriteIds(prev => {
      if (prev.includes(postId)) {
        // 既にお気に入りの場合は削除
        const newFavorites = prev.filter(id => id !== postId);
        
        // 🎓 学習ポイント10: ユーザーフィードバック
        console.log(`投稿 ${postId} をお気に入りから削除しました`);
        
        return newFavorites;
      } else {
        // お気に入りでない場合は追加
        const newFavorites = [...prev, postId];
        
        console.log(`投稿 ${postId} をお気に入りに追加しました`);
        
        return newFavorites;
      }
    });
  };

  // 🎓 学習ポイント11: 全削除関数（開発・テスト用）
  const clearAllFavorites = (): void => {
    setFavoriteIds([]);
    console.log('すべてのお気に入りを削除しました');
  };

  // 🎓 学習ポイント12: お気に入り数の計算
  const favoriteCount = favoriteIds.length;

  // 🎓 学習ポイント13: コンテキスト値の定義
  const contextValue: FavoritesContextType = {
    favoriteIds,
    favoriteCount,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
  };

  // 🎓 学習ポイント14: Provider でコンテキスト値を提供
  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// 🎓 学習ポイント15: カスタムフック（Context利用を簡単にする）
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  
  // 🎓 学習ポイント16: Provider外での利用をエラーにする
  if (context === undefined) {
    throw new Error('useFavorites は FavoritesProvider 内で使用してください');
  }
  
  return context;
};

