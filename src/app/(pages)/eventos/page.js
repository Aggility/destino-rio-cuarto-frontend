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
 * Los eventos se cargan y muestran con la misma lógica que
 * la sección "Eventos Destacados" de la home:
 *  - Orden tal como los devuelve la API (sin reordenamiento)
 *  - Status 'inactive' filtrado
 *  - Fecha formateada desde el primer calendario
 *  - Thumbnail prioridad: cover.medium → cover.small → cover.large
 */
export const revalidate = 300;

export default async function EventsPage() {
  let apiEvents    = [];
  let apiFrameworks = [];

  try {
    const [resEvents, resFrameworks] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=500`, {
        next: { revalidate: 300 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks?per_page=500`, {
        next: { revalidate: 300 },
      }),
    ]);

    if (resEvents.ok) {
      const data = await resEvents.json();
      const all  = Array.isArray(data) ? data : (data.data || []);
      apiEvents = all
        .filter(evt => evt.status?.toLowerCase() !== 'inactive')
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    if (resFrameworks.ok) {
      const data = await resFrameworks.json();
      const all  = Array.isArray(data) ? data : (data.data || []);
      apiFrameworks = all.filter(fw => fw.status?.toLowerCase() !== 'inactive');
    }
  } catch (error) {
    console.error('Error fetching events/frameworks API:', error);
  }

  // ── Formato idéntico al de featured_events en home ────────────────────────
  const formatEventDate = (evt) => {
    const cal = evt.calendars?.[0];
    if (!cal) return 'Fecha a confirmar';
    const d = new Date(cal.start_date);
    let str = d.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    if (cal.start_time) str += `, ${cal.start_time.substring(0, 5)}hs`;
    return str;
  };

  const getCover = (evt) => {
    if (evt.cover && typeof evt.cover === 'object') {
      return evt.cover.medium || evt.cover.small || evt.cover.large || getThumbnail(evt.cover, evt.gallery);
    }
    return getThumbnail(evt.cover, evt.gallery);
  };

  const formattedEvents = apiEvents.map((evt) => ({
    id:        evt.id,
    slug:      evt.slug,
    title:     evt.title,
    date:      formatEventDate(evt),
    location:  evt.organization?.name || 'A confirmar',
    category:  evt.categories?.[0]?.name?.toUpperCase() || 'EVENTO',
    typeColor: '#f54286',
    thumbnail: getCover(evt),
    lat:       evt.organization?.addresses?.[0]?.latitude,
    lng:       evt.organization?.addresses?.[0]?.longitude,
    rawDate:   evt.calendars?.[0]?.start_date,
    // description limpia para el filtro de texto
    description: (evt.description || '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .substring(0, 120),
  }));

  // ── Slider: Eventos Marco (event-frameworks) ──────────────────────────────
  const frameworkSlides = apiFrameworks.map(fw => {
    const startDate = fw.start_date || fw.calendars?.[0]?.start_date;
    const endDate   = fw.end_date   || fw.calendars?.[fw.calendars?.length - 1]?.start_date;
    let dateStr = 'Fecha a confirmar';
    let timeStr = '';
    if (startDate) {
      const dStart = new Date(startDate);
      if (endDate && endDate !== startDate) {
        const dEnd = new Date(endDate);
        dateStr = `${dStart.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} al ${dEnd.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      } else {
        dateStr = dStart.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      const time = fw.start_time || fw.calendars?.[0]?.start_time;
      if (time) timeStr = `${String(time).substring(0, 5)}hs`;
    }
    const thumbnail = fw.cover && typeof fw.cover === 'object'
      ? (fw.cover.large || fw.cover.original || fw.cover.medium || fw.cover.small || getThumbnail(fw.cover, fw.gallery))
      : getThumbnail(fw.cover, fw.gallery);

    return {
      id:       fw.id,
      title:    fw.title || fw.name,
      date:     dateStr,
      time:     timeStr,
      location: fw.organization?.name || fw.location || 'Río Cuarto',
      thumbnail,
      href:     `/macro-evento/${fw.slug || fw.id}`,
    };
  });

  // Fallback slider: si no hay frameworks, usar los primeros 5 eventos
  const featuredFromEvents = apiEvents.slice(0, 5).map(evt => ({
    id:        evt.id,
    title:     evt.title,
    date:      formatEventDate(evt),
    time:      evt.calendars?.[0]?.start_time?.substring(0, 5) + 'hs' || '',
    location:  evt.organization?.name || 'Río Cuarto',
    thumbnail: getCover(evt),
    href:      `/eventos/${evt.slug || evt.id}`,
  }));

  const sliderEvents =
    frameworkSlides.length > 0    ? frameworkSlides :
    featuredFromEvents.length > 0  ? featuredFromEvents :
    [{ id: 'otono-polifonico', title: '7° Festival Otoño Polifónico', date: 'Miércoles 11 al domingo 15 de marzo', time: '20:00hs', location: 'Teatro Municipal de Río Cuarto', thumbnail: '/oto-polifono.webp', href: '/macro-evento/otono-polifonico' }];

  return (
    <div className="bg-listing-page min-vh-100 position-relative">

      {/* Hero global */}
      <HeroHome initialSlug="eventos" />

      {/* Slider de eventos destacados / marcos */}
      <section className="py-4 py-md-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2
              className="font-inter fw-bold text-gray-900 mb-0"
              style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-1px' }}
            >
              Eventos Destacados
            </h2>
            <Link
              href="/calendario"
              className="btn btn-link p-0 fw-bold text-decoration-none small d-none d-md-block"
              style={{ color: '#f54286' }}
            >
              Ver Calendario Completo
            </Link>
          </div>
          <MacroEventCard events={sliderEvents} />
        </div>
      </section>

      {/* Listado con filtros — recibe los eventos ya en el orden de la API */}
      <EventsListClient initialEvents={formattedEvents} />

      <ChatbotIcon />
    </div>
  );
}
