import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import './AdicionarMembro.css';

const AdicionarMembro = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('supabase_token') || JSON.parse(localStorage.getItem('supabase_session'))?.access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/membros/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao adicionar membro');
      alert(data.message || `Convite enviado para: ${email}`);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="add-membro-page">
        <button className="back-arrow-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={35} color="#105666" />
        </button>

        <div className="add-membro-card">
          <h2 className="add-membro-title">Adicionar á Instituição</h2>
          
          <form onSubmit={handleAdd}>
            <div className="add-membro-input-group">
              <div className="add-membro-icon"><Mail size={22} /></div>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="add-membro-submit">
              Adicionar
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdicionarMembro;