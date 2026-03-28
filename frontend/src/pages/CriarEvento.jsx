import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Calendar, MapPin, Upload, Check, AlignLeft, Clock, Star, Plus } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import './CriarEvento.css';

const CriarEvento = () => {
  const navigate = useNavigate();
  const [interessesExistentes, setInteressesExistentes] = useState([]);
  const [mostrarNovoInteresse, setMostrarNovoInteresse] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    dataDisplay: '',
    horaDisplay: '',
    morada: '',
    freguesia: '',
    cidade: '',
    descricao: '',
    id_interesse: '',      // Para selecionar existente
    novo_interesse: '',    // Para criar novo
    imagemFile: null
  });

  const [fileName, setFileName] = useState('Adicionar Imagem (opcional)');

  // Buscar lista de interesses ao carregar a página
  useEffect(() => {
    const fetchInteresses = async () => {
      try {
        // Chamamos a nova rota do teu backend
        const response = await fetch('http://localhost:3000/interesses');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar interesses do servidor');
        }

        const data = await response.json();
        setInteressesExistentes(data); // Agora a lista terá "Desporto"
      } catch (err) {
        console.error('Erro no frontend ao carregar interesses:', err);
        // Opcional: define um interesse padrão ou vazio em caso de erro grave
        setInteressesExistentes([]); 
      }
    };
    
    fetchInteresses();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, imagemFile: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('supabase_token');
      if (!token) throw new Error('Utilizador não autenticado');

      const data = new FormData();
      data.append('nome', formData.titulo);
      data.append('descricao', formData.descricao);
      data.append('endereco', formData.morada);
      data.append('freguesia', formData.freguesia);
      data.append('cidade', formData.cidade);

      // Lógica de Interesse: Envia ID ou o nome do novo
      if (mostrarNovoInteresse) {
        data.append('interesse_nome', formData.novo_interesse);
      } else {
        data.append('id_interesse', formData.id_interesse);
      }

      // Data ISO
      if (formData.dataDisplay && formData.horaDisplay) {
        const [dia, mes, ano] = formData.dataDisplay.split('/');
        const [hora, minuto] = formData.horaDisplay.split(':');
        const dateObj = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
        if (!isNaN(dateObj.getTime())) {
          data.append('dia_hora', dateObj.toISOString());
        }
      }

      if (formData.imagemFile) {
        data.append('image', formData.imagemFile);
      }

      await eventService.criarEvento(data);
      alert('Evento criado com sucesso!');
      navigate('/dashboard/eventos');
    } catch (err) {
      alert('Erro ao criar evento: ' + err.message);
    }
  };

  return (
    <MainLayout>
      <div className="criar-evento-page">
        <button className="back-btn-float" onClick={() => navigate(-1)}>
          <ArrowLeft size={35} />
        </button>

        <div className="form-container-verde">
          <h2 className="form-title">Criar Evento</h2>
          <hr className="form-divider" />
          <form onSubmit={handleSubmit}>
            
            <div className="form-input-group">
              <div className="icon-box"><ClipboardList size={22} /></div>
              <input
                type="text"
                placeholder="Nome do Evento"
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            {/* SEÇÃO DE INTERESSE */}
            <div className="interesse-container">
              {!mostrarNovoInteresse ? (
                <div className="form-input-group">
                  <div className="icon-box"><Star size={22} /></div>
                  <select
                    className="form-select"
                    value={formData.id_interesse}
                    onChange={(e) => setFormData({ ...formData, id_interesse: e.target.value })}
                    required={!mostrarNovoInteresse}
                  >
                    <option value="">Selecionar Categoria/Interesse</option>
                    {interessesExistentes.map(int => (
                      <option key={int.id} value={int.id}>{int.Nome}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="btn-add-interesse" 
                    onClick={() => setMostrarNovoInteresse(true)}
                    title="Adicionar novo interesse"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <div className="form-input-group novo-interesse-group">
                  <div className="icon-box"><Plus size={22} /></div>
                  <input
                    type="text"
                    placeholder="Nome da Nova Categoria"
                    value={formData.novo_interesse}
                    onChange={(e) => setFormData({ ...formData, novo_interesse: e.target.value })}
                    required={mostrarNovoInteresse}
                  />
                  <button 
                    type="button" 
                    className="btn-cancel-interesse" 
                    onClick={() => {
                        setMostrarNovoInteresse(false);
                        setFormData({...formData, novo_interesse: ''});
                    }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-input-group">
                <div className="icon-box"><Calendar size={22} /></div>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={formData.dataDisplay}
                  onChange={(e) => setFormData({ ...formData, dataDisplay: e.target.value })}
                  pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
                  required
                />
              </div>
              <div className="form-input-group">
                <div className="icon-box"><Clock size={22} /></div>
                <input
                  type="text"
                  placeholder="Hora (HH:mm)"
                  value={formData.horaDisplay}
                  onChange={(e) => setFormData({ ...formData, horaDisplay: e.target.value })}
                  pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                  required
                />
              </div>
            </div>

            <div className="form-input-group">
              <div className="icon-box"><MapPin size={22} /></div>
              <input
                type="text"
                placeholder="Morada"
                onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-input-group">
                <div className="icon-box"><MapPin size={22} /></div>
                <input
                  type="text"
                  placeholder="Freguesia"
                  onChange={(e) => setFormData({ ...formData, freguesia: e.target.value })}
                  required
                />
              </div>
              <div className="form-input-group">
                <div className="icon-box"><MapPin size={22} /></div>
                <input
                  type="text"
                  placeholder="Cidade"
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-input-group desc-group">
              <div className="icon-box"><AlignLeft size={22} /></div>
              <textarea
                placeholder="Descrição do evento..."
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="form-textarea"
                required
              />
            </div>

            <div className={`form-input-group file-upload-group ${formData.imagemFile ? 'has-file' : ''}`}>
              <div className="icon-box">
                {formData.imagemFile ? <Check size={22} color="#839958" /> : <Upload size={22} />}
              </div>
              <label htmlFor="event-image" className="file-upload-label">
                {fileName}
              </label>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
            </div>

            <button type="submit" className="btn-submit-evento">
              Criar Evento
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CriarEvento;