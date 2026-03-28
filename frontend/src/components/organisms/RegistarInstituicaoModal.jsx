import React, { useState, useRef } from 'react';
import { User, MapPin, Globe, FileText, X, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RegistarInstituicaoModal.css';

const RegistarInstituicaoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // ESTADO PARA O NOME DO FICHEIRO E DADOS DO FORM
  const [fileName, setFileName] = useState("Comprovativo de Instituição (PDF)");
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    localidade: '',
    cidade: ''
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  // FUNÇÃO PARA CAPTURAR A MUDANÇA NO INPUT
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Por favor selecione o comprovativo em PDF.');
    const formData = new FormData();
    formData.append('nome', form.nome);
    formData.append('endereco', form.endereco);
    formData.append('localidade', form.localidade);
    formData.append('cidade', form.cidade);
    formData.append('comprovativo', file);

    try {
      const response = await fetch('http://localhost:3000/instituicao/register', {
        method: 'POST',
        body: formData
      });
      const text = await response.text();
      console.log('Resposta do servidor:', text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        // Mostra o erro e o texto recebido
        alert('Erro inesperado: resposta não é JSON.\n' + text);
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registar instituição');
      }
      // Associar o membro autenticado ao id da instituição criada
      const idInstituicao = data.instituicao?.id;
      if (idInstituicao) {
        const token = localStorage.getItem('supabase_token') || JSON.parse(localStorage.getItem('supabase_session'))?.access_token;
        await fetch('http://localhost:3000/membros/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id_Instituicao: idInstituicao })
        });
      }
      alert('Instituição registada com sucesso!');
      localStorage.setItem('nomeInstituicaoRegistada', form.nome);
      navigate('/registo-analise', { state: { nomeInstituicao: form.nome } });
      onClose();
      // Limpar formulário
      setForm({ nome: '', endereco: '', localidade: '', cidade: '' });
      setFileName('Comprovativo de Instituição (PDF)');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert(err.message);
    }
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
            <input
              type="text"
              placeholder="Identificador"
              name="nome"
              value={form.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><MapPin size={20} /></div>
            <input
              type="text"
              placeholder="Morada"
              name="endereco"
              value={form.endereco}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><Building2 size={20} /></div>
            <input
              type="text"
              placeholder="Localidade"
              name="localidade"
              value={form.localidade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="inst-input-group">
            <div className="inst-icon"><Globe size={20} /></div>
            <input
              type="text"
              placeholder="Cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* INPUT DE FICHEIRO ATUALIZADO */}
          <div className={`inst-input-group file-input ${fileName !== "Comprovativo de Instituição (PDF)" ? 'file-selected' : ''}`}>
            <div className="inst-icon">
              {fileName !== "Comprovativo de Instituição (PDF)" ? <Check size={20} color="#839958" /> : <FileText size={20} />}
            </div>
            <label htmlFor="pdf-upload" className="file-label">
              {fileName}
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              className="hidden-input"
              onChange={handleFileChange}
              ref={fileInputRef}
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