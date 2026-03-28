import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Phone, Calendar, ArrowLeft, Camera } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import { authService } from '../../services/api'; // Importação direta
import './EditarPerfil.css';

const EditarPerfil = () => {
  const navigate = useNavigate();
  
  // 1. Iniciar o estado com dados vazios ou do localStorage
  const [userData, setUserData] = useState({
    nome: '',
    instituicao: '',
    email: '',
    telefone: '',
    nascimento: '',
    foto: null,
    id: null
  });

  // 2. Carregar dados reais ao montar a página
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user_data'));
    if (storedUser) {
      setUserData({
        id: storedUser.id,
        nome: storedUser.Nome || '',
        instituicao: storedUser.Instituicao?.Nome || '',
        email: storedUser.Email || '',
        telefone: storedUser.Telemovel || '',
        nascimento: storedUser.Data_de_Nascimento || '',
        foto: storedUser.Image || null
      });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Atualiza SIMULTANEAMENTE foto (para preview) e fotoFile (para upload)
        setUserData(prev => ({ 
          ...prev, 
          foto: reader.result,  // Base64 para preview
          fotoFile: file        // Ficheiro real para upload
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validação: certifica-se que tem pelo menos um campo para atualizar
      const temAlteracoes = userData.nome || userData.telefone || userData.nascimento || userData.fotoFile;
      
      if (!temAlteracoes) {
        alert('Por favor, faça alguma alteração antes de guardar.');
        return;
      }

      const formData = new FormData();

      // CRUCIAL: Envia APENAS valores que não estão vazios
      if (userData.nome?.trim()) {
        formData.append('nome', userData.nome.trim());
      }
      if (userData.telefone?.trim()) {
        formData.append('telefone', userData.telefone.trim());
      }
      if (userData.nascimento?.trim()) {
        formData.append('nascimento', userData.nascimento.trim());
      }
      if (userData.fotoFile) {
        formData.append('image', userData.fotoFile);
      }

      console.log('Enviando FormData com:', { 
        nome: userData.nome, 
        telefone: userData.telefone, 
        nascimento: userData.nascimento, 
        temFoto: !!userData.fotoFile 
      });

      // Envia para o serviço
      const updatedUser = await authService.updatePerfil(formData);
      
      console.log('Resposta do servidor:', updatedUser);
      
      // Valida resposta
      if (!updatedUser || !updatedUser.id) {
        throw new Error('Resposta do servidor inválida');
      }
      
      // Atualiza o localStorage com o membro completo retornado
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      // Atualiza o estado local também para mostrar na página
      setUserData({
        id: updatedUser.id,
        nome: updatedUser.Nome || '',
        instituicao: updatedUser.Instituicao?.Nome || '',
        email: updatedUser.Email || '',
        telefone: updatedUser.Telemovel || '',
        nascimento: updatedUser.Data_de_Nascimento || '',
        foto: updatedUser.Image || null,
        fotoFile: null
      });
      
      alert("Perfil atualizado com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao atualizar: ' + error.message);
    }
  };
  return (
    <MainLayout>
      <div className="edit-profile-page">
        <button className="back-btn-float" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} />
        </button>

        <div className="edit-profile-container">
          <h2 className="edit-profile-title">Editar Perfil</h2>
          
          <form onSubmit={handleSave} className="edit-profile-form">
            
            {/* ZONA DA FOTO DE PERFIL */}
            <div className="avatar-upload-section">
              <div className="avatar-preview">
                {userData.foto ? (
                  <img src={userData.foto} alt="Perfil" />
                ) : (
                  <div className="avatar-placeholder"><User size={80} /></div>
                )}
                <label htmlFor="avatar-input" className="camera-icon-label">
                  <Camera size={20} />
                </label>
                <input 
                  id="avatar-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  hidden 
                />
              </div>
              <p className="upload-hint">Clique na câmara para alterar a foto</p>
            </div>

            {/* CAMPOS DE TEXTO */}
            <div className="edit-fields-grid">
              <div className="edit-input-group">
                <div className="edit-icon-box"><User size={20} /></div>
                <input 
                  type="text" 
                  value={userData.nome}
                  onChange={(e) => setUserData({...userData, nome: e.target.value})}
                  placeholder="Nome Completo"
                />
              </div>

              <div className="edit-input-group">
                <div className="edit-icon-box"><Building2 size={20} /></div>
                <input 
                  type="text" 
                  value={userData.instituicao}
                  onChange={(e) => setUserData({...userData, instituicao: e.target.value})}
                  placeholder="Instituição"
                />
              </div>

              <div className="edit-input-group">
                <div className="edit-icon-box"><Mail size={20} /></div>
                <input 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  placeholder="Email"
                />
              </div>

              <div className="edit-input-group">
                <div className="edit-icon-box"><Phone size={20} /></div>
                <input 
                  type="text" 
                  value={userData.telefone}
                  onChange={(e) => setUserData({...userData, telefone: e.target.value})}
                  placeholder="Telefone"
                />
              </div>

              <div className="edit-input-group">
                <div className="edit-icon-box"><Calendar size={20} /></div>
                <input 
                  type="date" 
                  value={userData.nascimento}
                  onChange={(e) => setUserData({...userData, nascimento: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="save-profile-btn">
              Guardar Alterações
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditarPerfil;