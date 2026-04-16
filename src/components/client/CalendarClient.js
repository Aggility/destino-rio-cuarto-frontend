'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SidebarListCard from '@/components/server/SidebarListCard';

export default function CalendarClient({ initialEvents = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  const [viewFilter, setViewFilter] = useState('MES'); // 'HOY', 'SEMANA', 'MES'
  const today = new Date();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const isDateInThisWeek = (date) => {
    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days >= -1 && days <= 7;
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generar datos del mes actual
  const { calendarDays, emptyDaysBefore } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    return {
      emptyDaysBefore: Array.from({ length: firstDay }, (_, i) => i),
      calendarDays: Array.from({ length: totalDays }, (_, i) => i + 1)
    };
  }, [currentMonth, currentYear]);

  // Agrupar eventos por día con filtro aplicado
  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach(evt => {
      const dateRaw = evt.calendars?.[0]?.start_date || evt.date_raw;
      if (!dateRaw) return;
      
      const d = new Date(dateRaw);
      const isSameMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      if (!isSameMonth) return;

      // Aplicar Filtro HOY / SEMANA / MES
      const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      const inWeek = isDateInThisWeek(d);

      if (viewFilter === 'HOY' && !isToday) return;
      if (viewFilter === 'SEMANA' && !inWeek) return;

      const dayNum = d.getDate();
      if (!map[dayNum]) map[dayNum] = [];
      map[dayNum].push({
          id: evt.id,
          title: evt.title,
          type: 'event',
          thumbnail: evt.image_url || evt.thumbnail || '/Thumbnail.png',
          badge: evt.calendars?.[0]?.start_time ? evt.calendars[0].start_time.substring(0, 5) + 'hs' : 'Varios'
      });
    });
    return map;
  }, [events, currentMonth, currentYear, viewFilter]);

  return (
    <div className="calendar-client-wrapper">
      
      {/* 1. Header del Calendario */}
      <section className="bg-white pt-5 pb-4 border-bottom shadow-sm position-sticky top-0 z-1030">
        <div className="container-xxl px-lg-5">
            <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h1 className="display-6 fw-bold text-gray-900 font-inter mb-1" style={{ letterSpacing: '-1.2px' }}>
                            Agenda de Eventos
                        </h1>
                        <p className="text-muted small mb-0 font-inter">Descubrí qué hacer en la ciudad día por día.</p>
                    </div>
                    
                    {/* Selector de Mes */}
                    <div className="d-flex align-items-center bg-gray-50 p-1 rounded-pill border">
                        <button 
                            onClick={() => changeMonth(-1)}
                            className="btn btn-white rounded-circle shadow-sm border-0 bg-white d-flex align-items-center justify-content-center" 
                            style={{ width: '42px', height: '42px' }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <div className="px-4 text-center" style={{ minWidth: '180px' }}>
                            <h2 className="h5 fw-bold mb-0 font-inter text-pink-600" style={{ color: '#f54286' }}>
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                        </div>
                        <button 
                            onClick={() => changeMonth(1)}
                            className="btn btn-white rounded-circle shadow-sm border-0 bg-white d-flex align-items-center justify-content-center" 
                            style={{ width: '42px', height: '42px' }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* FILTROS HOY - SEMANA - MES */}
                <div className="d-flex gap-2 pb-2">
                    {['HOY', 'SEMANA', 'MES'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setViewFilter(filter)}
                            className={`btn rounded-pill px-4 py-2 font-inter fw-bold transition-all border-1.5 ${viewFilter === filter ? 'btn-primary text-white shadow-premium' : 'btn-outline-secondary bg-white text-muted opacity-75'}`}
                            style={{ 
                                backgroundColor: viewFilter === filter ? '#f54286' : 'white',
                                borderColor: viewFilter === filter ? '#f54286' : '#dee2e6',
                                fontSize: '13px',
                                minWidth: '100px'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 2. Cuadrícula del Calendario */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
            
            {/* Cabecera de días de la semana (Desktop) */}
            <div className="row g-0 mb-3 d-none d-xl-flex">
                {daysOfWeek.map(day => (
                    <div key={day} className="col-xl-7-cols text-center py-2">
                        <span className="fw-bold text-gray-500 small tracking-widest">{day}</span>
                    </div>
                ))}
            </div>

            {/* Grid Principal */}
            <div className="row g-3 g-xl-0 border-xl-start border-xl-top">
                {/* Espacios vacíos al inicio (Mobile: Ocultos para no confundir) */}
                {emptyDaysBefore.map(idx => (
                    <div key={`empty-${idx}`} className="col-xl-7-cols d-none d-xl-block border-xl-end border-xl-bottom bg-gray-50/50" style={{ minHeight: '180px' }}>
                    </div>
                ))}

                {/* Días del Mes */}
                {calendarDays.map(dayNum => {
                    const dayEvents = eventsByDay[dayNum] || [];
                    const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
                    
                    return (
                        <div key={dayNum} className="col-12 col-md-6 col-lg-4 col-xl-7-cols">
                            <div className={`calendar-day-box h-100 bg-white p-3 transition-all border rounded-4 ${dayEvents.length > 0 ? 'bg-pink-50/10' : ''} ${isToday ? 'border-primary border-2 shadow-sm' : 'border-light-subtle'}`}
                                 style={{ borderColor: isToday ? '#1a56db' : '#f1f1f1' }}>
                                
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className={`day-number font-inter fs-4 fw-bold ${dayEvents.length > 0 ? 'text-pink-600' : 'text-gray-400'}`} style={{ color: dayEvents.length > 0 ? '#f54286' : '#9ca3af' }}>
                                        {dayNum}
                                    </span>
                                    {isToday && (
                                        <span className="badge rounded-pill bg-primary px-2" style={{ fontSize: '10px' }}>HOY</span>
                                    )}
                                </div>

                                {dayEvents.length > 0 ? (
                                    <div className="mini-card-container d-flex flex-column gap-2 overflow-hidden">
                                        {dayEvents.slice(0, 3).map((ev, idx) => (
                                            <div key={idx} className="calendar-mini-event animate-fade-in group pointer">
                                                <SidebarListCard 
                                                    id={ev.id}
                                                    type="event"
                                                    title={ev.title}
                                                    subtitle=""
                                                    badge={ev.badge}
                                                    thumbnail={ev.thumbnail}
                                                    href={`/eventos/${ev.id}`}
                                                    variant="calendar"
                                                />
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <Link href={`/eventos?date=${currentYear}-${currentMonth + 1}-${dayNum}`} className="text-decoration-none small fw-bold text-pink-500 mt-1">
                                                +{dayEvents.length - 3} más
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-auto opacity-25 d-none d-xl-block">
                                        <span className="small text-muted italic font-inter">Sin eventos</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      <style jsx global>{`
        .col-xl-7-cols {
          @media (min-width: 1200px) {
            flex: 0 0 auto;
            width: 14.2857% !important;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
