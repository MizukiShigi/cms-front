// API関数のエクスポート用index.ts

// 基本API設定
export { apiClient, setAuthToken, removeAuthToken, isApiError } from './api';

// 認証API
export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isLoggedIn,
  getStoredToken,
} from './auth.api';

// 投稿API
export {
  createPost,
  getPost,
  updatePost,
  patchPost,
  deletePost,
  getPosts,
} from './posts.api';

// 画像API
export {
  uploadImage,
  deleteImage,
  getImagesByPost,
  validateFileSize,
  validateFileType,
  validateImageFile,
} from './images.api';