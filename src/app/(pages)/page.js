import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import ActivityCard from '@/components/server/ActivityCard';

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
      // Excluir eventos con status inactivo
      apiEvents = apiEvents.filter(evt => evt.status?.toLowerCase() !== 'inactive');
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
      thumbnail: evt.media?.cover || evt.media?.gallery?.[0] || evt.image_url || "/Thumbnail.png"
    };
  });

  const sections = [
    { id: 1, title: 'Eventos Destacados', slug: 'eventos', color: '#f54286' },
    { id: 2, title: 'Recorré la Ciudad', slug: 'servicios', color: '#8a38f5' },
    { id: 3, title: 'Actividades Populares', slug: 'actividades', color: '#8a38f5' },
    { id: 4, title: 'Experiencias Únicas', slug: 'experiencias', color: '#ff5a1f' },
  ];

  const localThumbnail = "/Thumbnail.png";

  const renderCards = (cat, index) => {
    // 1. EVENTOS (API)
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

    // 2. ACTIVIDADES (ActivityCard)
    if (cat.slug === 'actividades') {
        const items = [
            { id: 'trencito', title: 'Trencito Rio IV', time: '15:00 a 19:00', address: 'Plaza Roca', schedule: 'Fines de semana', thumbnail: '/trencito.jfif' },
            { id: 'parque-ecologico', title: 'Parque Ecológico', time: '10:00 a 18:00', address: 'Ruta A005', schedule: 'Todos los días', thumbnail: '/peu.webp' }
        ];

        return items.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(240px, 70vw, 280px)' }}>
                <ActivityCard 
                    id={item.id}
                    title={item.title}
                    time={item.time}
                    address={item.address}
                    schedule={item.schedule}
                    description=""
                    thumbnail={item.thumbnail}
                    type={cat.slug}
                />
            </div>
        ));
    }

    // 3. EXPERIENCIAS (EventCard)
    if (cat.slug === 'experiencias') {
        const items = [
            { id: 'respira-aire-libre', title: 'Respira Aire Libre', time: 'Todo el día', address: 'Parque Sarmiento', schedule: 'Todos los días', thumbnail: '/psarmiento.jfif' },
            { id: 'recorrido-7-iglesias', title: 'Recorrido 7 Iglesias', time: '3 a 4 horas', address: 'Microcentro', schedule: 'Semana Santa', thumbnail: 'https://images.unsplash.com/photo-1548625235-36af58169128?auto=format&fit=crop&q=80&w=600' }
        ];

        return items.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)' }}>
                <EventCard 
                    id={item.id}
                    title={item.title}
                    date={item.time}
                    location={item.address}
                    category={item.schedule}
                    description=""
                    thumbnail={item.thumbnail}
                    basePath="experiencias"
                    typeColor={cat.color}
                />
            </div>
        ));
    }

    // 4. FALLBACK (Servicios u otros)
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
            <div key={cat.id} className="w-100 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>

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
                        borderColor: cat.color,
                        color: cat.color,
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
