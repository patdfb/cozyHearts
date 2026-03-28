import React, { useState, useEffect } from 'react';
import MainLayout from '../components/template/MainLayout';
import EventCard from '../components/molecules/EventCard';
import StatCard from '../components/molecules/StatCard';
import CalendarWidget from '../components/organisms/CalendarWidget';
import Button from '../components/atoms/Button';

import { eventService } from '../services/api';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';

const Dashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDadosDoDashboard = async () => {
      try {
        setLoading(true);

        // 1. Sincronização do Token (usando a chave supabase_token)
        const token = localStorage.getItem('supabase_token');
        
        let eventosBackend = [];
        if (token) {
          // 2. Buscar eventos do backend
          eventosBackend = await eventService.getEventos(token);
        }

        // 3. Filtrar apenas eventos futuros e ordenar por data
        const agora = new Date();
        const eventosOrdenados = [...eventosBackend]
          .filter(a => a.dia_hora && new Date(a.dia_hora) >= agora)
          .sort((a, b) => new Date(a.dia_hora) - new Date(b.dia_hora));

        setEventos(eventosOrdenados);
        
        // 4. Simulação de dados de resumo (Poderás criar uma rota no backend para isto depois)
        setResumo({
          inscritosTotal: 42,
          eventosRealizados: 15,
          'taxa de idosos felizes': '98%'
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>A carregar dados da Junta...</p>
      </div>
    );
  }

  return (
    <MainLayout>      
      <div className="dashboard-grid">
        {/* COLUNA ESQUERDA: Painel de Eventos */}
        <section className="panel events-section">
          <h2 className="panel-title">Próximos Eventos</h2>
          <div className="events-list">
            {eventos.length > 0 ? (
              // Mostramos apenas os 5 mais recentes na lista do Dashboard
              eventos.slice(0, 5).map(evento => (
                <EventCard key={evento.id} evento={evento} />
              ))
            ) : (
              <div className="no-events-dashboard">
                <p>Não há eventos próximos.</p>
              </div>
            )}
          </div>
          
          <div className="panel-footer-btns">
            <Button variant="secondary" onClick={() => navigate('/dashboard/eventos')}>
              Todos os Eventos
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/criar-evento')}>
              Novo Evento
            </Button>
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <div className="right-column">
          <section className="panel calendar-section">
            <CalendarWidget onViewFull={() => navigate('/dashboard/calendario')} />
          </section>

          <section className="panel summary-section">
            <h2 className="panel-title">Resumo</h2>
            <StatCard label="Pessoas Inscritas" value={resumo?.inscritosTotal || 0} />
            <StatCard label="Eventos Ativos" value={eventos.length} />
            <StatCard label="Eventos Realizados" value={resumo?.eventosRealizados || 0} />
            <StatCard label="Taxa de Idosos Felizes" value={resumo?.['taxa de idosos felizes'] || '0%'} />
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;