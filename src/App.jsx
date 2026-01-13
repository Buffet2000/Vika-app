import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import AboutPage from './pages/About/AboutPage.jsx'
import ConsultationsPage from './pages/Consultations/ConsultationsPage.jsx'

export default function App() {
  return (
    <BrowserRouter basename="/Vika-app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
