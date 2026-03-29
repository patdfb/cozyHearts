import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, CalendarOff, History, CalendarDays, Info } from 'lucide-react'; 
import { isBefore, isAfter, startOfDay, parseISO } from 'date-fns';
import MainLayout from '../components/template/MainLayout';
import Button from '../components/atoms/Button';
import './EventosListagem.css';

const EventosListagem = () => {
  const navigate = useNavigate();
  const [mostrarPassados, setMostrarPassados] = useState(false);

    const [listaEventos, setListaEventos] = useState([]);
    useEffect(() => {
      const fetchEventos = async () => {
        try {
          const eventos = await import('../services/api').then(m => m.eventService.getEventos());
          // Mapear eventos do backend para o formato esperado pelo frontend
          const eventosFormatados = eventos.map(ev => {
            let dataIso = '';
            let dataDisplay = '';
            if (ev.dia_hora) {
              let dateObj;
              if (typeof ev.dia_hora === 'string' && ev.dia_hora.includes('T')) {
                // ISO string
                dateObj = new Date(ev.dia_hora);
              } else {
                // timestamp
                dateObj = new Date(Number(ev.dia_hora));
              }
              if (!isNaN(dateObj.getTime())) {
                dataIso = dateObj.toISOString().split('T')[0];
                dataDisplay = dateObj.toLocaleDateString('pt-PT') + ' ' + dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
              }
            }
            return {
              id: ev.id,
              titulo: ev.Nome || ev.titulo || '',
              dataDisplay,
              dataIso,
              morada: ev.Endereco || ev.morada || '',
              imagem: ev.Image || ev.imagem || '',
              freguesia: (ev.Localidade && (ev.Localidade.Freguesia || ev.Localidade.freguesia)) || ev.freguesia || '',
              cidade: (ev.Localidade && (ev.Localidade.Cidade || ev.Localidade.cidade)) || ev.cidade || '',
              ...ev
            };
          });
          setListaEventos(eventosFormatados);
        } catch (e) {
          setListaEventos([]);
        }
      };
      fetchEventos();
    }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Lógica de Filtragem: Compara a data do evento com a data de hoje
  const eventosFiltrados = useMemo(() => {
    const hoje = startOfDay(new Date());

    return listaEventos.filter(evento => {
      const dataEvento = parseISO(evento.dataIso);
      if (mostrarPassados) {
        return isBefore(dataEvento, hoje); // Eventos antes de hoje
      } else {
        return isAfter(dataEvento, hoje) || evento.dataIso === hoje.toISOString().split('T')[0]; // Futuros ou Hoje
      }
    });
  }, [listaEventos, mostrarPassados]);

  const handleEditClick = (evento) => {
    navigate(`/dashboard/editar-evento/${evento.id}`);
  };

  const handleViewClick = (evento) => {
    navigate(`/dashboard/evento/${evento.id}`);
  };

  const handleSaveEvent = async (eventoAtualizado) => {
    try {
      // Montar FormData para envio ao backend (como na criação)
      const formData = new FormData();
      formData.append('nome', eventoAtualizado.nome || eventoAtualizado.titulo || '');
      formData.append('descricao', eventoAtualizado.descricao || '');
      formData.append('endereco', eventoAtualizado.endereco || eventoAtualizado.morada || '');
      formData.append('freguesia', eventoAtualizado.freguesia || '');
      formData.append('cidade', eventoAtualizado.cidade || '');
      formData.append('dia_hora', eventoAtualizado.dia_hora || '');
      if (eventoAtualizado.imagem && eventoAtualizado.imagem instanceof File) {
        formData.append('image', eventoAtualizado.imagem);
      }

      // Chamar editarEvento do eventService
      const { eventService } = await import('../services/api');
      const eventoEditado = await eventService.editarEvento(eventoAtualizado.id, formData);

      // Mapear eventoEditado para o mesmo formato dos eventos carregados inicialmente
      const mapEvento = (ev) => {
        let dataIso = '';
        let dataDisplay = '';
        if (ev.dia_hora) {
          let dateObj;
          if (typeof ev.dia_hora === 'string' && ev.dia_hora.includes('T')) {
            dateObj = new Date(ev.dia_hora);
          } else {
            dateObj = new Date(Number(ev.dia_hora));
          }
          if (!isNaN(dateObj.getTime())) {
            dataIso = dateObj.toISOString().split('T')[0];
            dataDisplay = dateObj.toLocaleDateString('pt-PT') + ' ' + dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
          }
        }
        return {
          id: ev.id,
          titulo: ev.Nome || ev.titulo || '',
          dataDisplay,
          dataIso,
          morada: ev.Endereco || ev.morada || '',
          imagem: ev.Image || ev.imagem || '',
          freguesia: (ev.Localidade && (ev.Localidade.Freguesia || ev.Localidade.freguesia)) || ev.freguesia || '',
          cidade: (ev.Localidade && (ev.Localidade.Cidade || ev.Localidade.cidade)) || ev.cidade || '',
          ...ev
        };
      };

      const novaLista = listaEventos.map(ev =>
        ev.id === eventoEditado.id
          ? mapEvento(eventoEditado)
          : ev
      );
      setListaEventos(novaLista);
      setIsModalOpen(false);
    } catch (error) {
      alert('Erro ao editar evento: ' + (error.message || error));
    }
  };

  const handleDelete = async (id) => {
    const confirmacao = window.confirm("Tem a certeza que deseja eliminar este evento?");
    if (confirmacao) {
      try {
        const { eventService } = await import('../services/api');
        await eventService.deletarEvento(id);
        const listaFiltrada = listaEventos.filter(ev => ev.id !== id);
        setListaEventos(listaFiltrada);
      } catch (error) {
        alert('Erro ao eliminar evento: ' + (error.message || error));
      }
    }
  };

  return (
    <MainLayout>
      <div className="listagem-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')} title="Voltar">
            <ArrowLeft size={28} />
          </button>
          <h1 className="listagem-title">
            {mostrarPassados ? "Eventos Passados" : "Próximos Eventos"}
          </h1>
        </div>

        <div className="header-actions">
          {/* BOTÃO PARA ALTERNAR PASSADOS/FUTUROS */}
          <button 
            className={`filter-toggle-btn ${mostrarPassados ? 'active' : ''}`}
            onClick={() => setMostrarPassados(!mostrarPassados)}
          >
            {mostrarPassados ? <CalendarDays size={20} /> : <History size={20} />}
            {mostrarPassados ? "Ver Próximos" : "Ver Passados"}
          </button>

          <Button variant="primary" onClick={() => navigate('/dashboard/criar-evento')}>
            Criar Evento
          </Button>
        </div>
      </div>

      <div className="listagem-container">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(evento => (
            <div key={evento.id} className="event-list-item">
              <div className="event-info">
                <h3>{evento.titulo}</h3>
                <p>Data : <span>{evento.dataDisplay}</span></p>
                <p>Morada : <span>{evento.morada}</span></p>
              </div>

              {evento.imagem && (
                <div className="event-image-container">
                  <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="event-thumbnail"
                    key={evento.imagem} // força React a recarregar a imagem se o link mudar
                  />
                </div>
              )}
              
              <div className="event-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleViewClick(evento)}
                  title="Ver detalhes"
                >
                  <Info size={20} />
                </button>
                <button 
                  className="action-btn edit-btn" 
                  onClick={() => handleEditClick(evento)}
                  title="Editar"
                >
                  <Pencil size={20} />
                </button>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => handleDelete(evento.id)}
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events-message">
            <CalendarOff size={48} />
            <p>Não foram encontrados eventos {mostrarPassados ? "passados" : "próximos"}.</p>
          </div>
        )}
      </div>

      {/* O modal de edição foi substituído por uma página dedicada */}
    </MainLayout>
  );
};

export default EventosListagem;