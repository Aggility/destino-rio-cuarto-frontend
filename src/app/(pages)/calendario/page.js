import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';

/**
 * CalendarPage - Destino Río Cuarto
 * Implementa una vista mensual con eventos en formato miniatura.
 * Uso de clases globales de globals.scss para la cuadrícula semanal.
 */
export default function CalendarPage() {
  const currentMonth = "Marzo 2026";
  const daysOfWeek = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  
  // Mock de eventos para el calendario
  const calendarEvents = [
    { day: 7, month: 'Marzo', events: [
        { id: '2', title: 'Ulises Bueno en Opus', type: 'event', badge: '21:00hs', thumbnail: '/Thumbnail.png' }
    ]},
    { day: 11, month: 'Marzo', events: [
        { id: '1', title: '7° Festival Otoño Polifónico', type: 'event', badge: '19:00hs', thumbnail: '/Thumbnail.png' }
    ]},
    { day: 15, month: 'Marzo', events: [
        { id: '4', title: 'Tardecita Musical en Holmberg', type: 'event', badge: '18:30hs', thumbnail: '/Thumbnail.png' }
    ]},
    { day: 22, month: 'Marzo', events: [
        { id: 'andino', title: 'Paseo del Andino Feria', type: 'activity', badge: '16:00hs', thumbnail: '/Thumbnail.png' }
    ]}
  ];

  // Generar cuadrícula de días para Marzo 2026 (Empieza en Domingo - index 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-light-gray min-vh-100 position-relative pb-5">
      
      {/* 1. Header Area */}
      <section className="bg-white pt-5 pb-4 border-bottom">
        <div className="container-xxl px-lg-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 className="display-5 fw-bold text-gray-900 font-inter mb-1" style={{ letterSpacing: '-1.5px' }}>
                        {(() => {
                            const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'qué', 'hay', 'vos', 'para'];
                            const text = "Calendario de Eventos";
                            return text.split(' ').map((word, index) => {
                                if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                                if (connectors.includes(cleanWord)) return word.toLowerCase();
                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            }).join(' ');
                        })()}
                    </h1>
                    <p className="text-muted mb-0">Explora la agenda cultural y actividades por día.</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-light rounded-circle border shadow-sm px-3"><i className="bi bi-chevron-left"></i></button>
                    <h2 className="h4 fw-bold mb-0 font-inter" style={{ minWidth: '150px', textAlign: 'center', color: '#f54286' }}>{currentMonth}</h2>
                    <button className="btn btn-light rounded-circle border shadow-sm px-3"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Calendar Grid Area */}
      <section className="py-5">
        <div className="container-xxl px-lg-5">
            
            {/* Header Días — Visible solo en Desktop */}
            <div className="row g-0 mb-3 d-none d-xl-flex">
                {daysOfWeek.map(day => (
                    <div key={day} className="col-xl-7-cols text-center py-2">
                        <span className="fw-bold text-gray-400 small tracking-widest">{day}</span>
                    </div>
                ))}
            </div>

            {/* Grid de Días */}
            <div className="row g-3">
                {days.map(num => {
                    const dayEvents = calendarEvents.find(e => e.day === num);
                    return (
                        <div key={num} className="col-12 col-md-6 col-lg-4 col-xl-7-cols">
                            <div className={`calendar-day-box bg-white rounded-4 border p-3 transition-all ${dayEvents ? 'shadow-premium' : 'opacity-80'}`} style={{ borderColor: dayEvents ? '#f5428644' : '#dee2e6' }}>
                                
                                <span className={`day-number font-inter`} style={{ color: dayEvents ? '#f54286' : '#9ca3af' }}>
                                    {num}
                                </span>

                                {dayEvents ? (
                                    <div className="mini-card-container d-flex flex-column gap-2 mt-auto">
                                        {dayEvents.events.map((ev, idx) => (
                                            <div key={idx}>
                                                <SidebarListCard 
                                                    id={ev.id}
                                                    type={ev.type}
                                                    title={ev.title}
                                                    subtitle=""
                                                    badge={ev.badge}
                                                    thumbnail={ev.thumbnail}
                                                    href={ev.type === 'event' ? `/eventos/${ev.id}` : `/actividades/${ev.id}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-auto">
                                        <span className="small text-gray-300 italic font-inter px-1">Vacío</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
