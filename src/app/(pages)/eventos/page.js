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
  let apiFeaturedEvents = [];

  try {
    const [resEvents, resHome] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=500`, {
        next: { revalidate: 300 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
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

    if (resHome.ok) {
      const json = await resHome.json();
      const homeData = json.data || {};
      const featured = Array.isArray(homeData.featured_events) ? homeData.featured_events : [];
      apiFeaturedEvents = featured.filter(evt => evt.status?.toLowerCase() !== 'inactive');
    }
  } catch (error) {
    console.error('Error fetching events/frameworks API:', error);
  }

  // ── Parseo de fecha LOCAL (evita timezone shift UTC → UTC-3) ─────────────
  // La API devuelve start_date como "YYYY-MM-DDTHH:MM:SS.000000Z" (UTC)
  // o "YYYY-MM-DD". new Date(string) en UTC resta 3hs → muestra día anterior.
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d); // medianoche local
  };

  // ── Formato de fecha de evento ────────────────────────────────────────────
  const formatEventDate = (evt) => {
    const cal = evt.calendars?.[0];
    if (!cal?.start_date) return 'Fecha a confirmar';
    const d = parseLocalDate(cal.start_date);
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

  // ── Slider: Eventos Destacados (desde /home) ──────────────────────────────
  const featuredSlides = apiFeaturedEvents.map(evt => {
    return {
      id:        evt.id,
      title:     evt.title,
      date:      formatEventDate(evt),
      time:      evt.calendars?.[0]?.start_time ? `${evt.calendars[0].start_time.substring(0, 5)}hs` : '',
      location:  evt.organization?.name || evt.location || 'Río Cuarto',
      thumbnail: getCover(evt),
      href:      `/eventos/${evt.slug || evt.id}`,
    };
  });

  // Fallback slider: si no hay destacados, usar los primeros 5 eventos
  const featuredFromEvents = apiEvents.slice(0, 5).map(evt => ({
    id:        evt.id,
    title:     evt.title,
    date:      formatEventDate(evt),
    time:      evt.calendars?.[0]?.start_time ? `${evt.calendars[0].start_time.substring(0, 5)}hs` : '',
    location:  evt.organization?.name || 'Río Cuarto',
    thumbnail: getCover(evt),
    href:      `/eventos/${evt.slug || evt.id}`,
  }));

  const sliderEvents =
    featuredSlides.length > 0    ? featuredSlides :
    featuredFromEvents.length > 0  ? featuredFromEvents :
    [{ id: 'otono-polifonico', title: '7° Festival Otoño Polifónico', date: 'Miércoles 11 al domingo 15 de marzo', time: '20:00hs', location: 'Teatro Municipal de Río Cuarto', thumbnail: '/oto-polifono.webp', href: '/eventos/otono-polifonico' }];

  return (
    <div className="bg-listing-page min-vh-100 position-relative">

      {/* Hero global */}
      <HeroHome initialSlug="eventos" />

      {/* Slider de eventos destacados / marcos */}
      <section className="py-4 py-md-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">

          <MacroEventCard events={sliderEvents} />
        </div>
      </section>

      {/* Listado con filtros — recibe los eventos ya en el orden de la API */}
      <EventsListClient initialEvents={formattedEvents} />

      <ChatbotIcon />
    </div>
  );
}
