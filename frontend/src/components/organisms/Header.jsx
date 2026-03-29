import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CircleUser, UserPlus } from 'lucide-react';
import PerfilModal from './PerfilModal';
import './Header.css';

const Header = ({ onLoginClick, onRegistarClick, isVazio }) => {
  const location = useLocation();
  const isPublicPage = location.pathname === "/";
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [instituicaoNome, setInstituicaoNome] = useState('');

  useEffect(() => {
    // Em vez de fetch, lê o que o login guardou
    const savedData = JSON.parse(localStorage.getItem('user_data'));
    
    if (savedData) {
      const nomeInst = savedData.Instituicao?.Nome || savedData.instituicao?.nome;
      setInstituicaoNome(nomeInst || 'Sem Instituição');
    } else if (!isPublicPage) {
      setInstituicaoNome('Erro de ligação');
    }
  }, [location.pathname, isPublicPage]);

  return (
    <>
      <header className="main-header">
        {/* LOGO - Agora clicável e flexível */}
        <Link to={isPublicPage ? "/" : "/dashboard"} className="logo-link">
          <img src="/src/assets/Cozy_Hearts.png" alt="Logo" className="header-logo-img" />
        </Link>
        
        <div className="nav-links">
          {/* ESTADO 2 & 3: Dashboard (Esconde links se isVazio for true) */}
          {!isPublicPage && !isVazio && (
            <>
              <Link to="/dashboard/criar-evento" className={`nav-item ${location.pathname.includes('criar') ? 'active' : ''}`}>Criar Evento</Link>
              <Link to="/dashboard/calendario" className={`nav-item ${location.pathname.includes('calendario') ? 'active' : ''}`}>Calendário</Link>
              <Link to="/dashboard/eventos" className={`nav-item ${location.pathname.includes('eventos') ? 'active' : ''}`}>Eventos</Link>
            </>
          )}

          {/* ESTADO 1: Landing Page */}
          {isPublicPage && (
            <>
              <button onClick={onRegistarClick} className="nav-item">Registar</button>
              <button onClick={onLoginClick} className="nav-item active">Iniciar Sessão</button>
            </>
          )}
        </div>

        {/* LADO DIREITO: Perfil e Add Member */}
        {!isPublicPage && (
          <div className="header-right">
            {!isVazio && (
              <Link to="/dashboard/adicionar-membro" className="icon-link">
                <UserPlus size={26} color="#839958" />
              </Link>
            )}

            <div className="user-profile-trigger" onClick={() => setIsPerfilOpen(true)}>
              {!isVazio && <span className="inst-name">{instituicaoNome || 'Carregando...'}</span>}
              {isVazio && <span className="inst-name">Sem Instituição</span>}
              <CircleUser size={28} color="#839958" />
            </div>
          </div>
        )}
      </header>

      <PerfilModal 
        isOpen={isPerfilOpen} 
        onClose={() => setIsPerfilOpen(false)} 
        instituicaoNome={isVazio ? "Sem Instituição" : instituicaoNome}
      />
    </>
  );
};

export default Header;