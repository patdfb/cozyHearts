import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Key, X } from 'lucide-react';
import { authService } from '../../services/api';
import './RegistarModel.css';

const RegistarModel = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nome: '', email: '', telemovel: '', nascimento: '', password: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.register(formData);
      alert("Conta registada com sucesso! Verifique o seu email se necessário.");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registar-overlay">
      <div className="registar-card">
        <button className="close-modal" onClick={onClose}><X size={20} /></button>
        <h2 className="registar-title">Registar</h2>
        <hr className="registar-divider" />

        {error && <p className="registar-error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="registar-input-group">
            <div className="registar-icon"><User size={20} /></div>
            <input 
              type="text" placeholder="Nome" required 
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="registar-input-group">
            <div className="registar-icon"><Mail size={20} /></div>
            <input 
              type="email" placeholder="Email" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="registar-input-group">
            <div className="registar-icon"><Phone size={20} /></div>
            <input 
              type="text" placeholder="Nº Telemóvel" 
              onChange={(e) => setFormData({...formData, telemovel: e.target.value})}
            />
          </div>

          <div className="registar-input-group">
            <div className="registar-icon"><Calendar size={20} /></div>
            <input 
              type="date" placeholder="Data Nascimento" 
              onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
            />
          </div>

          <div className="registar-input-group">
            <div className="registar-icon"><Key size={20} /></div>
            <input 
              type="password" placeholder="Password" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="registar-submit-btn">REGISTAR</button>
        </form>
      </div>
    </div>
  );
};

export default RegistarModel;