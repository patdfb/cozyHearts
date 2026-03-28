
import React from 'react';
import Header from '../components/organisms/Header';
import { Hourglass } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './RegistoAnalise.css';


const RegistoAnalise = () => {
  const location = useLocation();
  let nomeInstituicao = location.state?.nomeInstituicao;
  if (!nomeInstituicao) {
    nomeInstituicao = localStorage.getItem('nomeInstituicaoRegistada') || 'a sua instituição';
  }
  return (
    <div className="analise-page">
      {/* Mantemos o header limpo como na página anterior */}
      <Header isVazio={true} />
      <main className="analise-content">
        <h1 className="analise-title">Registo em Análise</h1>
        <div className="analise-card">
          <p>
            A sua instituição '{nomeInstituicao}' foi registada com sucesso, 
            mas necessita de ser validada pela nossa equipa.
          </p>
          <div className="status-icon">
            <Hourglass size={120} color="#105666" />
          </div>
        </div>
      </main>
      <footer className="welcome-footer">
        Copyright Cozy Hearts 2026
      </footer>
    </div>
  );
};

export default RegistoAnalise;