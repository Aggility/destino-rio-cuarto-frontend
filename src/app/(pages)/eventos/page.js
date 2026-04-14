import React from 'react';
import EventCard from '@/components/server/EventCard';
import MacroEventCard from '@/components/server/MacroEventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import Link from 'next/link';

import EventsListClient from '@/components/client/EventsListClient';

/**
 * EventsPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28420 / 3777:8121 (Mobile)
 */
export default async function EventsPage() {
  let apiEvents = [];
  try {
    const res = await fetch('http://destbackdev.aggility.io/api/v1/events', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      apiEvents = Array.isArray(data) ? data : (data.data || []);
    }
  } catch (error) {
    console.error("Error fetching events API: ", error);
  }

  // Format events dynamically
  const formattedEvents = apiEvents.map((evt, idx) => {
    const primaryCalendar = evt.calendars?.[0];
    let dateStr = 'Fecha a confirmar';
    if (primaryCalendar) {
      const d = new Date(primaryCalendar.start_date);
      dateStr = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
      if (primaryCalendar.start_time) {
        dateStr += `, ${primaryCalendar.start_time.substring(0, 5)}hs`;
      }
    }
    
    // Clean description from HTML tags
    let rawDesc = evt.description || '';
    rawDesc = rawDesc.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    const descStr = rawDesc.length > 100 ? rawDesc.substring(0, 100) + '...' : rawDesc;

    return {
      id: evt.id,
      title: evt.title,
      date: dateStr,
      location: evt.organization?.name || 'Ubicación a confirmar',
      description: descStr,
      thumbnail: evt.image_url || "/Thumbnail.png", // Usa image_url si existe
      category: evt.categories?.[0]?.name?.toUpperCase() || (idx % 2 === 0 ? "POP" : "KIDS"),
      typeColor: idx % 2 === 0 ? "#1a56db" : "#f54286"
    };
  });

  // Fallback if empty to keep design intact
  const events = formattedEvents.length > 0 ? formattedEvents : [
    { id: 1, title: 'Ivan Noble', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con “canciones traspapeladas”', category: 'POP', typeColor: '#1a56db' },
    { id: 2, title: 'Ulises Bueno', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande!', category: 'KIDS', typeColor: '#f54286' }
  ];

  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* 2. HERO SECTION REEMPLAZADA POR LA GLOBAL */}
      <HeroHome initialSlug="eventos" />

      {/* 3. FEATURED EVENTS */}
      <section className="py-4 py-md-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
              <h2 className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-1px' }}>
                  Eventos Destacados
              </h2>
              <Link href="/calendario" className="btn btn-link p-0 text-primary fw-bold text-decoration-none small d-none d-md-block">Ver Calendario Completo</Link>
          </div>
          <div className="d-flex flex-column gap-3">
            <Link href="/macro-evento/otono-polifonico" className="text-decoration-none">
              <MacroEventCard 
                title="7° Festival Otoño Polifónico"
                date="Miércoles 11 al domingo 15 de marzo"
                time="20:00hs"
                location="Teatro Municipal de Río Cuarto"
                thumbnail="/oto-polifono.webp"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EVENT FILTERS & LISTING (CLIENT COMPONENT) */}
      <EventsListClient initialEvents={events} />

      <ChatbotIcon />

    </div>
  );
}
