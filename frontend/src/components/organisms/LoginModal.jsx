import React, { useState } from 'react';
import { User, Key, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api'; // Importa o serviço
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onSwitchToRegistar }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(email, password);
      // Buscar membro e decidir redirecionamento
      const token = data.token || localStorage.getItem('supabase_token') || JSON.parse(localStorage.getItem('supabase_session'))?.access_token;
      if (token) {
        const res = await fetch('http://localhost:3000/membros/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const membro = await res.json();
        if (membro.id_Instituicao) {
          if (membro.Instituicao && membro.Instituicao.Verificacao) {
            navigate('/dashboard');
          } else {
            navigate('/registo-analise');
          }
        } else {
          navigate('/bem-vindo'); // ou a página de registo de instituição
        }
      } else {
        navigate('/bem-vindo');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <button className="close-modal" onClick={onClose}><X size={20} /></button>
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Entre na sua conta</p>
        <hr className="login-divider" />

        {error && <p className="login-error-msg">{error}</p>}

        <form onSubmit={handleLoginSubmit}>
          <div className="login-input-group">
            <div className="login-icon"><User size={20} /></div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="login-input-group">
            <div className="login-icon"><Key size={20} /></div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn">LOGIN</button>
        </form>

        <div className="login-footer">
          <span>Ainda não tem conta? </span>
          <button className="create-account-btn" onClick={onSwitchToRegistar}>Criar Conta</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;