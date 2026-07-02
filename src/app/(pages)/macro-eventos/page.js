import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import { getThumbnail } from '@/utils/image';
import { parseLocalDate } from '@/utils/date';

export const revalidate = 300;

export default async function MacroEventosPage() {
  let frameworks = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks?per_page=200`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      frameworks = all
        .filter(f => f.status?.toLowerCase() !== 'inactive')
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  } catch (error) {
    console.error('Error fetching event-frameworks:', error);
  }

  const getDateRange = (f) => {
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

  const items = frameworks.map(f => ({
    id:        f.id,
    slug:      f.slug,
    title:     f.title || f.name || 'Sin título',
    date:      getDateRange(f),
    location:  f.organization?.name || 'Río Cuarto',
    category:  f.categories?.[0]?.name?.trim() || 'Festival',
    thumbnail: getThumbnail(f.cover, f.gallery),
    lat:       f.organization?.addresses?.[0]?.latitude,
    lng:       f.organization?.addresses?.[0]?.longitude,
  }));

  return (
    <div className="bg-listing-page min-vh-100 position-relative">

      <HeroHome initialSlug="eventos" />

      <section className="py-5">
        <div className="container-xxl px-lg-5">
          <h2
            className="font-inter fw-bold text-gray-900 mb-4"
            style={{ fontSize: 'clamp(28px, 7vw, 36px)', letterSpacing: '-1px', lineHeight: '1.1' }}
          >
            Festivales y Grandes Eventos
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 mb-3 d-block" />
              <h4>No hay festivales disponibles</h4>
              <p>Próximamente encontrarás aquí los grandes eventos de Río Cuarto.</p>
            </div>
          ) : (
            <div className="listing-grid pb-5">
              {items.map(item => (
                <EventCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  title={item.title}
                  date={item.date}
                  location={item.location}
                  category={item.category}
                  typeColor="#ff5a1f"
                  thumbnail={item.thumbnail}
                  lat={item.lat}
                  lng={item.lng}
                  basePath="macro-evento"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ChatbotIcon />
    </div>
  );
}
