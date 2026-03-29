// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BemVindo from './pages/BemVindo'
import Dashboard from './pages/Dashboard'
import DashboardVazio from './pages/DashboardVazio'
import RegistoAnalise from './pages/RegistoAnalise'
import EventosListagem from './pages/EventosListagem'
import CalendarioPagina from './pages/CalendarioPagina'
import CriarEvento from './pages/CriarEvento'
import EditarEvento from './pages/EditarEvento'
import EventoDetalhe from './pages/EventoDetalhe'
import AdicionarMembro from './pages/AdicionarMembro'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BemVindo />} />
        <Route path="/bem-vindo" element={<DashboardVazio />} />
        <Route path="/registo-analise" element={<RegistoAnalise />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/eventos" element={<EventosListagem />} />
        <Route path="/dashboard/calendario" element={<CalendarioPagina />} />
        <Route path="/dashboard/criar-evento" element={<CriarEvento />} />
        <Route path="/dashboard/adicionar-membro" element={<AdicionarMembro />} />
        <Route path="/dashboard/editar-evento/:id" element={<EditarEvento />} />
        <Route path="/dashboard/evento/:id" element={<EventoDetalhe />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)