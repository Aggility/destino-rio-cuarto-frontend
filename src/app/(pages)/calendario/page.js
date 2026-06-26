import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import CalendarClient from '@/components/client/CalendarClient';

export const metadata = {
  title: 'Agenda de Eventos y Actividades — Destino Río Cuarto',
  description:
    'Descubrí qué hacer en Río Cuarto: eventos, actividades y propuestas culturales. Filtrá por hoy, esta semana o el mes.',
};

/**
 * CalendarPage — Destino Río Cuarto
 * El fetch de datos se realiza desde el cliente (CalendarClient)
 * para garantizar datos siempre frescos y soportar filtros interactivos.
 */
export default function CalendarPage() {
  return (
    <div className="calendar-page-container">
      <CalendarClient />
      <ChatbotIcon />
    </div>
  );
}
