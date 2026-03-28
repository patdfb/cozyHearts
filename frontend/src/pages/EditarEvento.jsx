import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import MainLayout from '../components/template/MainLayout';
import { ArrowLeft, ClipboardList, Calendar, MapPin, Upload, Check, AlignLeft, Clock, Star, Plus } from 'lucide-react';
import './CriarEvento.css';

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    id_interesse: '',
    novo_interesse: '',
    imagemFile: null,
    imagemUrl: ''
  });
  const [fileName, setFileName] = useState('Alterar Imagem (PNG, JPG)');

  // Buscar lista de interesses ao carregar a página
  useEffect(() => {
    const fetchInteresses = async () => {
      try {
        const response = await fetch('http://localhost:3000/interesses');
        if (!response.ok) {
          throw new Error('Falha ao buscar interesses do servidor');
        }
        const data = await response.json();
        setInteressesExistentes(data);
      } catch (err) {
        console.error('Erro no frontend ao carregar interesses:', err);
        setInteressesExistentes([]);
      }
    };
    
    fetchInteresses();
  }, []);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const token = localStorage.getItem('supabase_token');
        if (!token) throw new Error('Utilizador não autenticado');
        const evento = await eventService.getEventos();
        const ev = Array.isArray(evento) ? evento.find(e => String(e.id) === String(id)) : evento;
        if (!ev) throw new Error('Evento não encontrado');
        let dataDisplay = '', horaDisplay = '';
        if (ev.dia_hora) {
          const dateObj = new Date(ev.dia_hora);
          if (!isNaN(dateObj.getTime())) {
            dataDisplay = dateObj.toLocaleDateString('pt-PT');
            horaDisplay = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
        }
        setFormData({
          titulo: ev.Nome || ev.titulo || '',
          dataDisplay,
          horaDisplay,
          morada: ev.Endereco || ev.morada || '',
          freguesia: (ev.Localidade && (ev.Localidade.Freguesia || ev.Localidade.freguesia)) || ev.freguesia || '',
          cidade: (ev.Localidade && (ev.Localidade.Cidade || ev.Localidade.cidade)) || ev.cidade || '',
          descricao: ev.Descricao || ev.descricao || '',
          id_interesse: ev.id_interesse || '',
          novo_interesse: '',
          imagemFile: null,
          imagemUrl: ev.Image || ev.imagem || ''
        });
        setFileName(ev.Image || ev.imagem ? 'Imagem já carregada' : 'Alterar Imagem (PNG, JPG)');
        setLoading(false);
      } catch (err) {
        alert('Erro ao carregar evento: ' + err.message);
        navigate('/dashboard/eventos');
      }
    };
    fetchEvento();
  }, [id, navigate]);

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
      await eventService.editarEvento(id, data);
      alert('Evento editado com sucesso!');
      navigate('/dashboard/eventos');
    } catch (err) {
      alert('Erro ao editar evento: ' + err.message);
    }
  };

  if (loading) return <MainLayout><div>Carregando...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="criar-evento-page">
        <button className="back-btn-float" onClick={() => navigate(-1)}>
          <ArrowLeft size={35} />
        </button>
        <div className="form-container-verde">
          <h2 className="form-title">Editar Evento</h2>
          <hr className="form-divider" />
          <form onSubmit={handleSubmit}>
            <div className="form-input-group">
              <div className="icon-box"><ClipboardList size={22} /></div>
              <input
                type="text"
                placeholder="Nome do Evento"
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
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
                  placeholder="Data (DD/MM/AAAA)"
                  value={formData.dataDisplay}
                  onChange={e => setFormData({ ...formData, dataDisplay: e.target.value })}
                  pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
                  title="Formato: DD/MM/AAAA"
                  required
                />
              </div>
              <div className="form-input-group">
                <div className="icon-box"><Clock size={22} /></div>
                <input
                  type="text"
                  placeholder="Hora (HH:mm)"
                  value={formData.horaDisplay}
                  onChange={e => setFormData({ ...formData, horaDisplay: e.target.value })}
                  pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                  title="Formato: HH:mm"
                  required
                />
              </div>
            </div>
            <div className="form-input-group">
              <div className="icon-box"><MapPin size={22} /></div>
              <input
                type="text"
                placeholder="Morada"
                value={formData.morada}
                onChange={e => setFormData({ ...formData, morada: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-input-group">
                <div className="icon-box"><MapPin size={22} /></div>
                <input
                  type="text"
                  placeholder="Freguesia"
                  value={formData.freguesia}
                  onChange={e => setFormData({ ...formData, freguesia: e.target.value })}
                  required
                />
              </div>
              <div className="form-input-group">
                <div className="icon-box"><MapPin size={22} /></div>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={e => setFormData({ ...formData, cidade: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-input-group desc-group">
              <div className="icon-box"><AlignLeft size={22} /></div>
              <textarea
                placeholder="Descrição do evento..."
                value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                className="form-textarea"
                required
              />
            </div>
            <div className={`form-input-group file-upload-group ${formData.imagemFile || formData.imagemUrl ? 'has-file' : ''}`}>
              <div className="icon-box">
                {formData.imagemFile || formData.imagemUrl ? <Check size={22} color="#839958" /> : <Upload size={22} />}
              </div>
              <label htmlFor="edit-event-image" className="file-upload-label">
                {fileName}
              </label>
              <input
                id="edit-event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              {/* Preview removido conforme pedido */}
            </div>
            <button type="submit" className="btn-submit-evento">
              Guardar Alterações
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditarEvento;
