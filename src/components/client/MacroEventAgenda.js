'use client';

import React, { useState } from 'react';
import MacroEventCard from '@/components/server/MacroEventCard';

/**
 * MacroEventAgenda - Destino Río Cuarto
 * Maneja las pestañas de días y el listado de eventos del festival.
 */
export default function MacroEventAgenda({ initialAgenda = [] }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  const activeDay = initialAgenda[activeDayIdx];

  const tabStyle = (isActive) => ({
    minWidth: '100px',
    backgroundColor: isActive ? '#1a56db' : 'white',
    color: isActive ? 'white' : '#374151',
    borderColor: isActive ? '#1a56db' : '#e5e7eb',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="macro-event-agenda">
      
      {/* 1. Day Selector (Horizontal Scrollable) */}
      <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-3 mb-4 sticky-top bg-light-gray py-2" style={{ top: '80px', zIndex: 5 }}>
        {initialAgenda.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIdx(idx)}
            className={`btn rounded-3 shadow-premium-subtle fw-bold d-flex flex-column align-items-center justify-content-center px-4 py-2 border`}
            style={tabStyle(activeDayIdx === idx)}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: activeDayIdx === idx ? 0.9 : 0.6 }}>Día</span>
            <span style={{ fontSize: '16px' }}>{item.day}</span>
          </button>
        ))}
      </div>

      {/* 2. Active Day Header */}
      <div className="mb-4">
        <h3 className="h5 fw-bold text-gray-700 font-inter d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-primary"></i>
            {activeDay?.fullDate}
        </h3>
      </div>

      {/* 3. Events List */}
      <div className="d-flex flex-column gap-3">
        {activeDay?.events.map((event) => (
          <MacroEventCard 
            key={event.id}
            title={event.title}
            date={activeDay.fullDate}
            time={event.time}
            location={event.location}
            thumbnail={event.thumbnail}
          />
        ))}

        {(!activeDay?.events || activeDay.events.length === 0) && (
            <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                <i className="bi bi-calendar-x fs-1 text-muted opacity-50 mb-2 d-block"></i>
                <p className="text-muted mb-0">No hay actividades programadas para este día.</p>
            </div>
        )}
      </div>

    </div>
  );
}
