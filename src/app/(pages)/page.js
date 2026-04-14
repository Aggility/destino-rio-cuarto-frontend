import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';

/**
 * Home - Destino Río Cuarto (Home V2 Fidelity)
 * Sincronizado con Figma ID 3781:19219
 * Optimizado para Mobile y Desktop.
 */
export default async function Home() {
  // 1. Fetch Events API
  let apiEvents = [];
  try {
    const res = await fetch('http://destbackdev.aggility.io/api/v1/events', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      apiEvents = Array.isArray(data) ? data : (data.data || []);
      apiEvents = apiEvents.slice(0, 5); // Solo tomar 5 para portada
    }
  } catch (error) {
    console.error("Error fetching events API para la home:", error);
  }

  // 2. Format Eventos limitados
  const formatedHomeEvents = apiEvents.map((evt, idx) => {
    const primaryCalendar = evt.calendars?.[0];
    let dateStr = 'Fecha a conf.';
    if (primaryCalendar) {
       const d = new Date(primaryCalendar.start_date);
       dateStr = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
       if (primaryCalendar.start_time) {
         dateStr += `, ${primaryCalendar.start_time.substring(0, 5)}hs`;
       }
    }
    return {
      id: evt.id,
      title: evt.title,
      date: dateStr,
      location: evt.organization?.name || 'A confirmar',
      category: evt.categories?.[0]?.name?.toUpperCase() || 'EVENTO',
      typeColor: '#f54286',
      thumbnail: evt.image_url || "/Thumbnail.png"
    };
  });

  const sections = [
    { id: 1, title: 'Eventos Destacados', slug: 'eventos', color: '#f54286' },
    { id: 2, title: 'Recorré la Ciudad', slug: 'servicios', color: '#8a38f5' },
    { id: 3, title: 'Actividades Populares', slug: 'actividades', color: '#ff5a1f' },
  ];

  const localThumbnail = "/Thumbnail.png";

  const renderCards = (cat, index) => {
    // Si estamos en Eventos y tenemos datos de la API
    if (cat.slug === 'eventos' && formatedHomeEvents.length > 0) {
      return formatedHomeEvents.map((evt) => (
        <div key={evt.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)' }}>
          <EventCard
            id={evt.id}
            title={evt.title}
            date={evt.date}
            location={evt.location}
            category={evt.category}
            typeColor={evt.typeColor}
            thumbnail={evt.thumbnail}
          />
        </div>
      ));
    }

    // Para el rest de secciones o si falla la API
    return [1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)' }}>
        <EventCard
          id={i}
          title={`${cat.title} ${i}`}
          date={index === 0 ? "12 mar, 21:00hs" : "Temporada 2026"}
          location={index === 0 ? "Elvis RockandBar" : "Puntos Emblemáticos"}
          category={cat.title.split(' ')[0].toUpperCase()}
          typeColor={cat.color}
          thumbnail={localThumbnail}
        />
      </div>
    ));
  };

  return (
    <div className="bg-white overflow-hidden pb-5 font-inter">
      {/* 1. Hero Area — Figma ID 3781:19192/19193 */}
      <HeroHome />

      {/* 2. Main Sections — Figma ID 3781:19217 */}
      <section className="container-xxl py-4 py-md-5 px-lg-5">

        <div className="d-flex flex-column gap-5 align-items-start position-relative w-100">
          {sections.map((cat, index) => (
            <div key={cat.id} className="w-100">

              {/* SECTION HEADER — Figma ID 3781:19222 */}
              <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                <div className="max-w-541px">
                  <h2 className="fw-bold text-gray-900 tracking-tight font-inter m-0" 
                      style={{ fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '-1px' }}>
                    {cat.title}
                  </h2>
                </div>

                {/* Desktop Nav Arrows */}
                <div className="d-none d-md-flex align-items-center gap-2">
                  <button className="btn btn-light rounded-circle shadow-sm p-2" aria-label="Anterior">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button className="btn btn-light rounded-circle shadow-sm p-2" aria-label="Siguiente">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* HORIZONTAL CAROUSEL — Figma ID 3781:19225 */}
              <div className="d-flex gap-3 overflow-auto flex-nowrap pb-4 hide-scrollbar px-1">
                {renderCards(cat, index)}
              </div>

              {/* SEE MORE CTA — Figma ID 3781:19232 */}
              <div className="text-center mt-2">
                <Link href={`/${cat.slug}`} className="btn btn-outline-primary px-4 py-2 rounded-2 shadow-premium fw-semibold font-inter transition-all hover-lift" 
                      style={{
                        minWidth: '180px',
                        height: '48px',
                        borderColor: '#1a56db',
                        color: '#1a56d8',
                        fontSize: '15px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                  Ver más {cat.title.toLowerCase()}
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
