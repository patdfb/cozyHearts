import React, { useState, useEffect } from 'react';
import { User, Building2, Mail, Phone, ArrowLeft, Camera, Pencil, CircleUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './PerfilModal.css';

const PerfilModal = ({ isOpen, onClose }) => { // Removemos o instituicaoNome das props pois vamos ler do storage
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    instituicao: '', // Adicionamos este campo ao estado
    foto: null,
    fotoFile: null
  });

  useEffect(() => {
    if (isOpen) {
      const savedData = JSON.parse(localStorage.getItem('user_data'));
      if (savedData) {
        setUserData({
          nome: savedData.Nome || '',
          email: savedData.Email || '',
          telefone: savedData.Telemovel || '', 
          // ACESSO AO NOME DA INSTITUIÇÃO:
          instituicao: savedData.Instituicao?.Nome || "Sem Instituição", 
          foto: savedData.Image || null,
          fotoFile: null
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, foto: reader.result, fotoFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePerfil = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      if (userData.nome?.trim()) formData.append('nome', userData.nome.trim());
      if (userData.telefone?.trim()) formData.append('telefone', userData.telefone.trim());
      if (userData.fotoFile) formData.append('image', userData.fotoFile);

      const updatedUser = await authService.updatePerfil(formData);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      setUserData((prev) => ({
        ...prev,
        nome: updatedUser.Nome || '',
        email: updatedUser.Email || '',
        telefone: updatedUser.Telemovel || '',
        instituicao: updatedUser.Instituicao?.Nome || prev.instituicao,
        foto: updatedUser.Image || prev.foto,
        fotoFile: null
      }));

      setIsEditing(false);
      alert('Perfil guardado com sucesso!');
    } catch (error) {
      alert('Erro ao guardar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('supabase_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('dashboard_inscritos_total');
  navigate('/');
  onClose();
  };

  return (
    <div className="perfil-overlay">
      <div className="perfil-card">
        
        {/* Cabeçalho */}
        <div className="perfil-header-icons">
          <button className="icon-btn" onClick={isEditing ? () => setIsEditing(false) : onClose}>
            <ArrowLeft size={30} color="#105666" />
          </button>
          {!isEditing && (
            <button className="icon-btn" onClick={() => setIsEditing(true)}>
              <Pencil size={24} color="#105666" />
            </button>
          )}
        </div>

        {/* Foto de Perfil */}
        <div className="perfil-avatar-wrapper">
          <div className="avatar-circle">
            {userData.foto ? (
              <img src={userData.foto} alt="Perfil" />
            ) : (
              <CircleUser size={100} color="#105666" />
            )}
            {isEditing && (
              <label htmlFor="upload-avatar" className="camera-badge">
                <Camera size={16} color="white" />
                <input id="upload-avatar" type="file" hidden onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Lista de Campos (Barras Cinzentas) */}
        <div className="perfil-fields-container">
          
          <div className="perfil-bar">
            <User size={20} color="#105666" />
            {isEditing ? (
              <input type="text" value={userData.nome} onChange={(e) => setUserData({...userData, nome: e.target.value})} />
            ) : (
              <span>{userData.nome}</span>
            )}
          </div>

          <div className="perfil-bar">
            <Building2 size={20} color="#105666" />
            <span>{userData.instituicao}</span> {/* Agora usa o dado que veio do storage */}
          </div>

          <div className="perfil-bar">
            <Mail size={20} color="#105666" />
            {isEditing ? (
              <input type="email" value={userData.email} disabled />
            ) : (
              <span>{userData.email}</span>
            )}
          </div>

          <div className="perfil-bar">
            <Phone size={20} color="#105666" />
            {isEditing ? (
              <input type="text" value={userData.telefone} onChange={(e) => setUserData({...userData, telefone: e.target.value})} />
            ) : (
              <span>{userData.telefone}</span>
            )}
          </div>

        </div>

        {/* Botão Inferior */}
        <div className="perfil-footer">
          {isEditing ? (
            <button className="perfil-main-btn" onClick={handleSavePerfil} disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar'}
            </button>
          ) : (
            <button className="perfil-main-btn logout" onClick={handleLogout}>
              Terminar Sessão
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;