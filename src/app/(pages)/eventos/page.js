import React from 'react';
import EventCard from '@/components/server/EventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import Link from 'next/link';
import MacroEventCard from '@/components/server/MacroEventCard';
import EventsListClient from '@/components/client/EventsListClient';
import { getThumbnail } from '@/utils/image';
import { formatEventDate } from '@/utils/date';
import { parseLocalDate } from '@/utils/date';

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
  let apiEvents         = [];
  let apiFrameworks     = [];
  let initialHasMore    = false;

  try {
    const [resEvents, resFrameworks] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=12`, {
        next: { revalidate: 300 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks?per_page=200`, {
        next: { revalidate: 300 },
      }),
    ]);

    if (resEvents.ok) {
      const data = await resEvents.json();
      const all  = Array.isArray(data) ? data : (data.data || []);
      const getStartTime = (e) => {
        const raw = e.calendars?.[0]?.start_date;
        if (!raw) return Infinity;
        const [y, m, d] = raw.split('T')[0].split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
      };

      apiEvents = all
        .filter(evt => evt.status?.toLowerCase() !== 'inactive')
        .sort((a, b) => getStartTime(a) - getStartTime(b));

      // Hay más si la API reporta más páginas, o si devolvió el máximo que pedimos
      const totalPages = data.pagination?.total_pages ?? data.meta?.last_page ?? 1;
      initialHasMore = totalPages > 1 || all.length >= 12;
    }

    if (resFrameworks.ok) {
      const data = await resFrameworks.json();
      const all  = Array.isArray(data) ? data : (data.data || []);
      // Filtrar solo los activos (status === 'active' o status === 1)
      apiFrameworks = all.filter(f => {
        const s = f.status;
        return s === 'active' || s === 1 || s === '1';
      });
    }
  } catch (error) {
    console.error('Error fetching events/frameworks API:', error);
  }


  const getCover = (evt) => getThumbnail(evt.cover, evt.gallery);

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

  // ── Slider: Eventos Marco activos (desde /event-frameworks) ─────────────────
  const getFrameworkDateRange = (f) => {
    if (f.start_date && f.end_date) {
      const start = parseLocalDate(f.start_date);
      const end   = parseLocalDate(f.end_date);
      if (start && end) {
        return `${start.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
    }
    if (f.calendars?.length > 0) {
      const first = parseLocalDate(f.calendars[0].start_date);
      if (first) return first.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return 'Fecha a confirmar';
  };

  const sliderEvents = apiFrameworks.map(f => ({
    id:          f.id,
    title:       f.title || f.name || 'Sin título',
    date:        getFrameworkDateRange(f),
    eventsCount: Array.isArray(f.events) ? f.events.length : (f.events_count ?? f.calendars?.length ?? 0),
    location:    f.organization?.name || 'Río Cuarto',
    thumbnail:   getThumbnail(f.cover, f.gallery),
    href:        `/macro-evento/${f.slug || f.id}`,
    excerpt:     (f.excerpt || f.short_description || '')
                   .replace(/<[^>]*>?/gm, '')
                   .replace(/&nbsp;/g, ' ')
                   .trim() || null,
  }));

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
      <EventsListClient initialEvents={formattedEvents} initialHasMore={initialHasMore} />

      <ChatbotIcon />
    </div>
  );
}
