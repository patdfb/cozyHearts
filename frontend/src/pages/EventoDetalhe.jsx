import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Tag, AlignLeft, Image as ImageIcon } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import { eventService } from '../services/api';
import './EventoDetalhe.css';

const EventoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvento = async () => {
      try {
        const eventos = await eventService.getEventos();
        const encontrado = Array.isArray(eventos)
          ? eventos.find((ev) => String(ev.id) === String(id))
          : null;

        if (!encontrado) {
          throw new Error('Evento não encontrado');
        }

        setEvento(encontrado);
      } catch (error) {
        alert('Não foi possível carregar o evento.');
        navigate('/dashboard/eventos');
      } finally {
        setLoading(false);
      }
    };

    loadEvento();
  }, [id, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="evento-detalhe-loading">A carregar evento...</div>
      </MainLayout>
    );
  }

  if (!evento) return null;

  const dataObj = evento.dia_hora ? new Date(evento.dia_hora) : null;
  const dataFmt = dataObj && !isNaN(dataObj.getTime()) ? dataObj.toLocaleDateString('pt-PT') : 'Sem data';
  const horaFmt = dataObj && !isNaN(dataObj.getTime())
    ? dataObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const interesseNome = evento.Interesse?.Nome || '';
  const interesseDescricao = evento.Interesse?.Descricao || evento.Interesse?.descricao || '';
  const interesseCompleto = interesseNome
    ? (interesseDescricao ? `${interesseNome} - ${interesseDescricao}` : interesseNome)
    : 'Sem categoria';
  const morada = evento.Endereco || 'Sem morada';
  const freguesia = evento.Localidade?.Freguesia || 'Sem freguesia';
  const cidade = evento.Localidade?.Cidade || 'Sem cidade';

  return (
    <MainLayout>
      <div className="evento-detalhe-page">
        <div className="evento-detalhe-header">
          <button className="evento-detalhe-back" onClick={() => navigate('/dashboard/eventos')}>
            <ArrowLeft size={24} />
          </button>
          <h1>Detalhes do Evento</h1>
        </div>

        <div className="evento-detalhe-card">
          <div className="evento-detalhe-media">
            {evento.Image ? (
              <img src={evento.Image} alt={evento.Nome || 'Evento'} />
            ) : (
              <div className="evento-detalhe-placeholder">
                <ImageIcon size={42} />
                <span>Sem imagem</span>
              </div>
            )}
          </div>

          <div className="evento-detalhe-content">
            <h2>{evento.Nome || 'Evento sem nome'}</h2>

            <div className="evento-detalhe-grid">
              <div className="evento-campo">
                <Calendar size={18} />
                <div>
                  <small>Data</small>
                  <p>{dataFmt}</p>
                </div>
              </div>

              <div className="evento-campo">
                <Clock size={18} />
                <div>
                  <small>Hora</small>
                  <p>{horaFmt}</p>
                </div>
              </div>

              <div className="evento-campo evento-campo-full">
                <MapPin size={18} />
                <div>
                  <small>Morada</small>
                  <p>{morada}</p>
                  <p className="evento-localidade">{freguesia} - {cidade}</p>
                </div>
              </div>

              <div className="evento-campo evento-campo-full">
                <Tag size={18} />
                <div>
                  <small>Categoria / Interesse</small>
                  <p>{interesseCompleto}</p>
                </div>
              </div>

              <div className="evento-campo evento-campo-full">
                <AlignLeft size={18} />
                <div>
                  <small>Descrição</small>
                  <p>{evento.Descricao || 'Sem descrição'}</p>
                </div>
              </div>
            </div>

            <div className="evento-detalhe-actions">
              <button className="evento-btn evento-btn-primary" onClick={() => navigate(`/dashboard/editar-evento/${evento.id}`)}>
                Editar Evento
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventoDetalhe;
