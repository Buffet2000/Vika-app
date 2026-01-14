import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import AboutPage from './pages/About/AboutPage.jsx'
import ConsultationsPage from './pages/Consultations/ConsultationsPage.jsx'
import ArticlePage from './pages/Article/ArticlePage.jsx'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/articles" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}
