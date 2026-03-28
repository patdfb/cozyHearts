import React, { useState } from 'react'; // Adicionámos o useState
import { User, MapPin, Globe, FileText, X, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RegistarInstituicaoModal.css';

const RegistarInstituicaoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // ESTADO PARA O NOME DO FICHEIRO
  const [fileName, setFileName] = useState("Comprovativo de Instituição (PDF)");

  if (!isOpen) return null;

  // FUNÇÃO PARA CAPTURAR A MUDANÇA NO INPUT
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Atualiza o estado com o nome do ficheiro escolhido
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Instituição registada com sucesso!");
    navigate('/registo-analise');
    onClose();
  };

  return (
    <div className="inst-overlay">
      <div className="inst-card">
        <button className="close-modal" onClick={onClose}><X size={20} /></button>
        
        <h2 className="inst-title">Registar Instituição</h2>
        <hr className="inst-divider" />

        <form onSubmit={handleSubmit}>
          <div className="inst-input-group">
            <div className="inst-icon"><User size={20} /></div>
            <input type="text" placeholder="Identificador" required />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><MapPin size={20} /></div>
            <input type="text" placeholder="Morada" required />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><Building2 size={20} /></div>
            <input type="text" placeholder="Localidade" required />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><Globe  size={20} /></div>
            <input type="text" placeholder="Cidade" required />
          </div>

          {/* INPUT DE FICHEIRO ATUALIZADO */}
          <div className={`inst-input-group file-input ${fileName !== "Comprovativo de Instituição (PDF)" ? 'file-selected' : ''}`}>
            <div className="inst-icon">
              {fileName !== "Comprovativo de Instituição (PDF)" ? <Check size={20} color="#839958" /> : <FileText size={20} />}
            </div>
            <label htmlFor="pdf-upload" className="file-label">
              {fileName} {/* Mostra o nome do estado aqui */}
            </label>
            <input 
              id="pdf-upload" 
              type="file" 
              accept="application/pdf" 
              className="hidden-input"
              onChange={handleFileChange} // Chama a função quando escolhes o ficheiro
              required 
            />
          </div>

          <button type="submit" className="inst-submit-btn">REGISTAR</button>
        </form>
      </div>
    </div>
  );
};

export default RegistarInstituicaoModal;