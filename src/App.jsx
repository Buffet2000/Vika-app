import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import AboutPage from './pages/About/AboutPage.jsx'
import ConsultationsPage from './pages/Consultations/ConsultationsPage.jsx'
import ArticlePage from './pages/Article/ArticlePage.jsx'
import Layout from './components/Layout/Layout.jsx'

import ArticleEditorPage from './pages/ArticleEditor/ArticleEditorPage.jsx'
import LoginPage from './pages/Login/LoginPage.jsx'

import RequireAuth from './components/Auth/RequireAuth.jsx'
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminHomePage from './pages/Admin/AdminHomePage.jsx'
import AdminArticlesPage from './pages/AdminArticles/AdminArticlesPage.jsx'
import AdminAboutPage from './pages/Admin/AboutPage/AdminAboutPage.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/articles" element={<ArticlePage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="about" element={<AdminAboutPage />} />

          {/* создать */}
          <Route path="editor" element={<ArticleEditorPage />} />
          {/* редактировать */}
          <Route path="editor/:id" element={<ArticleEditorPage />} />
        </Route>

        {/* <Route path="*" element={<div style={{ padding: 24 }}>Страница не найдена</div>} /> */}
      </Routes>
    </Layout>
  )
}
