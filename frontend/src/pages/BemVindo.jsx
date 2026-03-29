import React, { useState } from 'react';
import Header from '../components/organisms/Header'; 
import LoginModal from '../components/organisms/LoginModal';
import RegistarModel from '../components/organisms/RegistarModel';
import './BemVindo.css';
import evento1 from '../assets/evento1.png';
import evento2 from '../assets/evento2.png';

const BemVindo = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistarOpen, setIsRegistarOpen] = useState(false);

  // Função para fechar login e abrir registo (opcional mas recomendado)
  const handleSwitchToRegistar = () => {
    setIsLoginOpen(false);
    setIsRegistarOpen(true);
  };

  return (
    <div className="landing-page">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegistarClick={() => setIsRegistarOpen(true)} 
      />

      <main className="welcome-main">
        <section className="welcome-hero">
          <h1>Dê voz aos eventos da sua Instituição</h1>
          <p>A plataforma mais simples para criar, gerir e promover os eventos da sua comunidade</p>
        </section>

        <div className="welcome-grid">
          <div className="info-column">
            <div className="info-card">
              <h2>Como Funciona?</h2>
              <ol>
                <li>Registe a sua instituição</li>
                <li>Crie e gira os seus eventos</li>
                <li>Alcance a comunidade</li>
              </ol>
            </div>

            <div className="info-card">
              <h2>Vantagens</h2>
              <ul>
                <li>Totalmente Gratuito</li>
                <li>Maior Visibilidade na Região</li>
                <li>Controlo de Lotação</li>
              </ul>
            </div>
          </div>

          <div className="image-column">
            <div className="image-frame">
              <img src={evento1} alt="Evento Comunidade" />
              <img src={evento2} alt="Evento Xadrez" />
            </div>
          </div>
        </div>
      </main>

      {}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToRegistar={handleSwitchToRegistar} 
      />

      <RegistarModel 
        isOpen={isRegistarOpen} 
        onClose={() => setIsRegistarOpen(false)} 
      />

      <footer className="welcome-footer">
        © - 2026 Cozy Hearts - All rights reserved
      </footer>
    </div>
  );
};

export default BemVindo;