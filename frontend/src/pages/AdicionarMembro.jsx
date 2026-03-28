import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import './AdicionarMembro.css';

const AdicionarMembro = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    alert(`Convite enviado para: ${email}`);
    navigate('/dashboard');
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