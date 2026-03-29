import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  addMonths, subMonths, format, startOfMonth, endOfMonth, 
  eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, 
  isSameDay, parseISO, setMonth, setYear 
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../components/template/MainLayout';
import { eventService } from '../services/api'; // Importação direta recomendada
import './CalendarioPagina.css';

const CalendarioPagina = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [listaAtualizada, setListaAtualizada] = useState([]);

  const anoAtual = new Date().getFullYear();
  const anos = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => (anoAtual - 6) + i);
  }, [anoAtual]);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // 1. Buscar eventos usando o token sincronizado (supabase_token)
  useEffect(() => {
    const fetchEventos = async () => {
      const token = localStorage.getItem('supabase_token');
      if (token) {
        try {
          const eventos = await eventService.getEventos(token);
          setListaAtualizada(eventos);
        } catch (e) {
          console.error("Erro ao buscar eventos:", e);
          setListaAtualizada([]);
        }
      }
    };
    fetchEventos();
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthChange = (e) => {
    setCurrentDate(setMonth(currentDate, parseInt(e.target.value)));
  };

  const handleYearChange = (e) => {
    setCurrentDate(setYear(currentDate, parseInt(e.target.value)));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Começar na Segunda-feira
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

  return (
    <MainLayout>
      <div className="calendar-page-container">
        <button className="calendar-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} />
        </button>

        <div className="calendar-main-panel">
          <div className="calendar-nav-header">
            <div className="nav-controls">
              <button className="nav-arrow" onClick={prevMonth}>←</button>
              <h2 className="current-month-label">
                {format(currentDate, 'MMMM yyyy', { locale: pt })}
              </h2>
              <button className="nav-arrow" onClick={nextMonth}>→</button>
            </div>

            <div className="calendar-page-filters">
              <select 
                value={currentDate.getMonth()} 
                onChange={handleMonthChange}
                className="calendar-page-select"
              >
                {meses.map((mes, index) => (
                  <option key={mes} value={index}>{mes}</option>
                ))}
              </select>

              <select 
                value={currentDate.getFullYear()} 
                onChange={handleYearChange}
                className="calendar-page-select"
              >
                {anos.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="calendar-grid-body">
            {weekdays.map(day => (
              <div key={day} className="weekday-cell">{day}</div>
            ))}

            {daysGrid.map(day => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              // 2. CORREÇÃO DA LÓGICA DE FILTRO:
              // O Supabase devolve 'dia_hora' e o nome do evento é 'Nome'
              const eventsOnThisDay = listaAtualizada.filter(event => 
                event.dia_hora && isSameDay(parseISO(event.dia_hora), day)
              );

              return (
                <div 
                  key={day.toString()} 
                  className={`day-cell 
                    ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isSameDay(day, new Date()) ? 'today-cell' : ''}
                    ${eventsOnThisDay.length > 0 && isCurrentMonth ? 'has-events-bg' : ''}`}
                >
                  <span className="day-number">{format(day, 'd')}</span>
                  
                  <div className="events-labels-container">
                    {isCurrentMonth && eventsOnThisDay.map(event => (
                      <div 
                        key={event.id} 
                        className="calendar-event-label" 
                        title={event.Nome}
                        onClick={() => navigate(`/dashboard/evento/${event.id}`)}
                      >
                        {event.Nome}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarioPagina;