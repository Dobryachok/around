import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import SiteLayout from './components/layout/SiteLayout';
import BlogPage from './pages/BlogPage';
import CategoryPage from './pages/CategoryPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PortfolioPage from './pages/PortfolioPage';
import PostPage from './pages/PostPage';
import StaticPage from './pages/StaticPage';
import TextsPage from './pages/TextsPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminPostEditorPage from './pages/admin/AdminPostEditorPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminTagsPage from './pages/admin/AdminTagsPage';

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPostsPage />} />
            <Route path="tags" element={<AdminTagsPage />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="posts/:id" element={<AdminPostEditorPage />} />
          </Route>

          <Route path="/" element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="texts" element={<TextsPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="post/:slug" element={<PostPage />} />
            <Route path="page/:slug" element={<StaticPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
