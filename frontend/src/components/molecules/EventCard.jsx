import React from 'react';
import { Calendar, MapPin, Clock, Building } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ evento, onClick }) => {
  const formatarDataHora = (dataIso) => {
    if (!dataIso) return { data: 'Sem data', hora: '--:--' };
    const dateObj = new Date(dataIso);
    return {
      data: dateObj.toLocaleDateString('pt-PT'),
      hora: dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { data, hora } = formatarDataHora(evento.dia_hora);

  return (
    <div
      className={`event-card-container ${onClick ? 'is-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Imagem à Esquerda */}
      <div className="event-image-side">
        {evento.Image ? (
          <img src={evento.Image} alt={evento.Nome} />
        ) : (
          <div className="event-image-placeholder">
            <Building size={40} color="#105666" />
          </div>
        )}
      </div>

      {/* Conteúdo à Direita */}
      <div className="event-details-side">
        <h3 className="event-card-title">{evento.Nome || 'Evento sem nome'}</h3>
        
        <div className="event-card-info">
          <div className="info-row">
            <Calendar size={16} className="icon-teal" />
            <span className="text-small">{data}</span>
            <Clock size={16} className="icon-teal spacing-left" />
            <span className="text-small">{hora}</span>
          </div>

          <div className="info-row">
            <MapPin size={16} className="icon-teal" />
            <span className="text-small">
              {evento.Endereco ? `${evento.Endereco}, ` : ''}
              {/* Aceder aos dados da tabela Localidade via Join do backend */}
              {evento.Localidade?.Freguesia || 'Freguesia'} - {evento.Localidade?.Cidade || 'Cidade'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;