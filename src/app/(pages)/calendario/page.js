import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import CalendarClient from '@/components/client/CalendarClient';
import { getThumbnail } from '@/utils/image';

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

  // 2. Normalizar y ordenar: más próximos primero (start_date asc)
  const formattedEvents = allEvents
    .filter(evt => evt.calendars?.[0]?.start_date)
    .sort((a, b) =>
      new Date(a.calendars[0].start_date) - new Date(b.calendars[0].start_date)
    )
    .map(evt => ({
      id:        evt.id,
      title:     evt.title,
      date_raw:  evt.calendars?.[0]?.start_date,
      calendars: evt.calendars,
      image_url: getThumbnail(evt.cover, evt.gallery),
      thumbnail: getThumbnail(evt.cover, evt.gallery),
    }));

  return (
    <div className="calendar-page-container">
      <CalendarClient initialEvents={formattedEvents} />
      <ChatbotIcon />
    </div>
  );
}
