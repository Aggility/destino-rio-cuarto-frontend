import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import CalendarClient from '@/components/client/CalendarClient';

/**
 * CalendarPage - Destino Río Cuarto
 * Implementa una vista mensual dinámica consumiendo datos reales de la API.
 */
export default async function CalendarPage() {
  
  // 1. Obtener eventos de la API (Cargamos una cantidad considerable para llenar el calendario)
  let allEvents = [];
  try {
    // Intentamos traer un par de páginas para tener datos suficientes
    const [res1, res2] = await Promise.all([
      fetch('http://destbackdev.aggility.io/api/v1/events?per_page=50', { cache: 'no-store' }),
      fetch('http://destbackdev.aggility.io/api/v1/events?page=2&per_page=50', { cache: 'no-store' })
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();
    
    allEvents = [
      ...(data1.data || []),
      ...(data2.data || [])
    ];
  } catch (err) {
    console.error("Calendar: Error fetching events", err);
  }

  // 2. Normalizar eventos para el cliente
  const formattedEvents = allEvents.map(evt => ({
    id: evt.id,
    title: evt.title,
    date_raw: evt.calendars?.[0]?.start_date,
    calendars: evt.calendars,
    image_url: evt.cover?.medium || evt.cover?.small || null,
    thumbnail: evt.cover?.medium || evt.cover?.small || '/Thumbnail.png'
  }));

  return (
    <div className="calendar-page-container">
      <CalendarClient initialEvents={formattedEvents} />
      <ChatbotIcon />
    </div>
  );
}
