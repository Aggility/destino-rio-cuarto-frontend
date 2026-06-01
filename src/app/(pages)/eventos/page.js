import React from 'react';
import EventCard from '@/components/server/EventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import Link from 'next/link';
import MacroEventCard from '@/components/server/MacroEventCard';
import EventsListClient from '@/components/client/EventsListClient';
import { getThumbnail } from '@/utils/image';

/**
 * EventsPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28420 / 3777:8121 (Mobile)
 */
export default async function EventsPage() {
  let apiEvents = [];
  let apiFrameworks = [];

  try {
    // Fetch en paralelo: eventos regulares + event-frameworks
    const [resEvents, resFrameworks] = await Promise.all([
      fetch('http://destbackdev.aggility.io/api/v1/events', { cache: 'no-store' }),
      fetch('http://destbackdev.aggility.io/api/v1/event-frameworks', { cache: 'no-store' }),
    ]);

    if (resEvents.ok) {
      const data = await resEvents.json();
      apiEvents = Array.isArray(data) ? data : (data.data || []);
      apiEvents = apiEvents.filter(evt => evt.status?.toLowerCase() !== 'inactive');
    }

    if (resFrameworks.ok) {
      const data = await resFrameworks.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      apiFrameworks = all.filter(fw => fw.status?.toLowerCase() !== 'inactive');
    }
  } catch (error) {
    console.error('Error fetching events/frameworks API:', error);
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

    let thumbnail = '/no-img.webp';
    if (evt.cover && typeof evt.cover === 'object') {
      thumbnail = evt.cover.medium || evt.cover.small || evt.cover.large || evt.cover.original || getThumbnail(evt.cover, evt.gallery);
    } else {
      thumbnail = getThumbnail(evt.cover, evt.gallery);
    }

    return {
      id: evt.id,
      title: evt.title,
      date: dateStr,
      location: evt.organization?.name || 'Ubicación a confirmar',
      description: descStr,
      thumbnail,
      category: evt.categories?.[0]?.name?.toUpperCase() || (idx % 2 === 0 ? "POP" : "KIDS"),
      typeColor: "#f54286",
      lat: evt.organization?.addresses?.[0]?.latitude,
      lng: evt.organization?.addresses?.[0]?.longitude,
      rawDate: evt.calendars?.[0]?.start_date
    };

  });

  // Fallback if empty to keep design intact
  const events = formattedEvents.length > 0 ? formattedEvents : [
    { id: 1, title: 'Ivan Noble', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con "canciones traspapeladas"', category: 'POP', typeColor: '#f54286' },
    { id: 2, title: 'Ulises Bueno', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande!', category: 'KIDS', typeColor: '#f54286' }
  ];

  // ── Slider: Eventos Marco (event-frameworks) ─────────────────────────────
  const frameworkSlides = apiFrameworks.map(fw => {
    // Rango de fechas del marco
    const startDate = fw.start_date || fw.calendars?.[0]?.start_date;
    const endDate   = fw.end_date   || fw.calendars?.[fw.calendars?.length - 1]?.start_date;
    let dateStr = 'Fecha a confirmar';
    let timeStr = '';
    if (startDate) {
      const dStart = new Date(startDate);
      if (endDate && endDate !== startDate) {
        const dEnd = new Date(endDate);
        // Rango tipo "11 al 15 de marzo"
        dateStr = `${dStart.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} al ${dEnd.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      } else {
        dateStr = dStart.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      const time = fw.start_time || fw.calendars?.[0]?.start_time;
      if (time) timeStr = `${String(time).substring(0, 5)}hs`;
    }
    let thumbnail = '/no-img.webp';
    if (fw.cover && typeof fw.cover === 'object') {
      thumbnail = fw.cover.large || fw.cover.original || fw.cover.medium || fw.cover.small || getThumbnail(fw.cover, fw.gallery);
    } else {
      thumbnail = getThumbnail(fw.cover, fw.gallery);
    }

    return {
      id: fw.id,
      title: fw.title || fw.name,
      date: dateStr,
      time: timeStr,
      location: fw.organization?.name || fw.location || 'Río Cuarto',
      // Portada del slider: imagen grande
      thumbnail,
      href: `/macro-evento/${fw.id}`,
    };
  });

  // ── Fallback: si no hay event-frameworks, usar primeros 5 eventos regulares
  const featuredFromEvents = apiEvents.slice(0, 5).map(evt => {
    const primaryCalendar = evt.calendars?.[0];
    let dateStr = 'Fecha a confirmar';
    let timeStr = '';
    if (primaryCalendar) {
      const d = new Date(primaryCalendar.start_date);
      dateStr = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (primaryCalendar.start_time) timeStr = `${primaryCalendar.start_time.substring(0, 5)}hs`;
    }
    let thumbnail = '/no-img.webp';
    if (evt.cover && typeof evt.cover === 'object') {
      thumbnail = evt.cover.large || evt.cover.original || evt.cover.medium || evt.cover.small || getThumbnail(evt.cover, evt.gallery);
    } else {
      thumbnail = getThumbnail(evt.cover, evt.gallery);
    }

    return {
      id: evt.id,
      title: evt.title,
      date: dateStr,
      time: timeStr,
      location: evt.organization?.name || 'Río Cuarto',
      thumbnail,
      href: `/eventos/${evt.id}`,
    };
  });

  // Prioridad: event-frameworks → eventos regulares → fallback estático
  const sliderEvents =
    frameworkSlides.length > 0   ? frameworkSlides :
    featuredFromEvents.length > 0 ? featuredFromEvents :
    [{ id: 'otono-polifonico', title: '7° Festival Otoño Polifónico', date: 'Miércoles 11 al domingo 15 de marzo', time: '20:00hs', location: 'Teatro Municipal de Río Cuarto', thumbnail: '/oto-polifono.webp', href: '/macro-evento/otono-polifonico' }];

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* 2. HERO SECTION REEMPLAZADA POR LA GLOBAL */}
      <HeroHome initialSlug="eventos" />

      {/* 3. FEATURED EVENTS — Slider dinámico (Figma 3786:24022) */}
      <section className="py-4 py-md-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-1px' }}>
              Eventos Destacados
            </h2>
            <Link href="/calendario" className="btn btn-link p-0 fw-bold text-decoration-none small d-none d-md-block" style={{ color: '#f54286' }}>Ver Calendario Completo</Link>
          </div>
          <MacroEventCard events={sliderEvents} />
        </div>
      </section>

      {/* 4. EVENT FILTERS & LISTING (CLIENT COMPONENT) */}
      <EventsListClient initialEvents={events} />

      <ChatbotIcon />

    </div>
  );
}
