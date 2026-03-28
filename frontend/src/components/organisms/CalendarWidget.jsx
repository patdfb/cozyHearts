import React, { useMemo, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, setMonth, setYear } from 'date-fns';
import { pt } from 'date-fns/locale';
import Button from '../atoms/Button';
import { eventService } from '../../services/api'; // Importação direta recomendada
import './CalendarWidget.css';

const CalendarWidget = ({ onViewFull }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [listaEventos, setListaEventos] = useState([]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const years = Array.from({ length: 31 }, (_, i) => 2020 + i);

  // 1. Sincronização do Fetch com o token correto (supabase_token)
  useEffect(() => {
    const fetchEventos = async () => {
      const token = localStorage.getItem('supabase_token');
      if (token) {
        try {
          const eventos = await eventService.getEventos(token);
          setListaEventos(eventos);
        } catch (e) {
          console.error("Erro no Widget de Calendário:", e);
          setListaEventos([]);
        }
      }
    };
    fetchEventos();
  }, []);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); 
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const daysGrid = eachDayOfInterval({ start: startDate, end: endDate });

  const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // 2. Ajuste da lógica para filtrar pelo campo 'dia_hora' do Supabase
  const getEventsForDay = (day) => {
    return listaEventos.filter(event => 
      event.dia_hora && isSameDay(parseISO(event.dia_hora), day)
    );
  };

  return (
    <div className="calendar-panel">
      <div className="calendar-card">
        
        <div className="calendar-filters">
          <select 
            value={viewDate.getMonth()} 
            onChange={(e) => setViewDate(setMonth(viewDate, parseInt(e.target.value)))}
            className="calendar-select"
          >
            {months.map((m, index) => (
              <option key={m} value={index}>{m}</option>
            ))}
          </select>

          <select 
            value={viewDate.getFullYear()} 
            onChange={(e) => setViewDate(setYear(viewDate, parseInt(e.target.value)))}
            className="calendar-select year-select"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="calendar-header-display">
           <span className="current-view-label">
             {format(viewDate, 'MMMM yyyy', { locale: pt })}
           </span>
        </div>
        
        <div className="calendar-grid">
          {weekdays.map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
          
          {daysGrid.map((day, index) => {
            const events = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            // Pintar apenas se estiver no mês atual e tiver eventos
            const shouldPaint = isCurrentMonth && events.length > 0;
                    
            return (
              <div 
                key={index} 
                className={`day 
                  ${!isCurrentMonth ? 'other-month' : ''} 
                  ${shouldPaint ? 'event-day' : ''}`
                }
              >
                {format(day, 'd')}
                {shouldPaint && <span className="dot-indicator"></span>}
              </div>
            );
          })}
        </div>
      </div>

      <Button variant="primary" className="calendar-btn" onClick={onViewFull}>
        Ver Calendário Completo
      </Button>
    </div>
  );
};

export default CalendarWidget;