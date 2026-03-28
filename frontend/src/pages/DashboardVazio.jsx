import React, { useState } from 'react';
import Header from '../components/organisms/Header';
import RegistarInstituicaoModal from '../components/organisms/RegistarInstituicaoModal'; // Importa o modal
import './DashboardVazio.css';

const DashboardVazio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar nome do utilizador do backend
  const [nome, setNome] = useState('Utilizador');
  React.useEffect(() => {
    const fetchNome = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('supabase_session'));
        const token = session?.access_token;
        if (!token) return;
        const response = await fetch('http://localhost:3000/membros/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return;
        const data = await response.json();
        setNome(data.Nome || 'Utilizador');
      } catch {}
    };
    fetchNome();
  }, []);

  return (
    <div className="dashboard-vazio-page">
      {/* Passamos o isVazio para o Header ficar limpo */}
      <Header isVazio={true} />
      
      <main className="vazio-content">
        <h1 className="welcome-name">Bem-vindo(a), {nome}!</h1>
        <div className="vazio-card">
          <p>Parece que ainda não tem nenhuma instituição associada à sua conta.</p>
          <button 
            className="registar-inst-btn" 
            onClick={() => setIsModalOpen(true)}
          >
            Registar Instituição
          </button>
        </div>
      </main>

      <RegistarInstituicaoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <footer className="welcome-footer">
        Copyright Cozy Hearts 2026
      </footer>
    </div>
  );
};

export default DashboardVazio;