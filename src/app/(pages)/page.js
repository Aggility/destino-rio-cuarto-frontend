import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import ActivityCard from '@/components/server/ActivityCard';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';

/**
 * Home - Destino Río Cuarto (Home V2 Fidelity)
 * Sincronizado con Figma ID 3781:19219
 * Optimizado para Mobile y Desktop.
 */
export default async function Home() {
  // 1. Fetch Events + Actividades en paralelo
  let apiEvents = [];
  let apiActivities = [];
  try {
    const [resEvents, resActivities] = await Promise.all([
      fetch('https://destbackdev.aggility.io/api/v1/events', { cache: 'no-store' }),
      fetch('https://destbackdev.aggility.io/api/v1/proposals', { cache: 'no-store' })
    ]);
    if (resEvents.ok) {
      const data = await resEvents.json();
      apiEvents = Array.isArray(data) ? data : (data.data || []);
      apiEvents = apiEvents.filter(evt => evt.status?.toLowerCase() !== 'inactive');
      apiEvents = apiEvents.slice(0, 5);
    }
    if (resActivities.ok) {
      const data = await resActivities.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      apiActivities = all.filter(p => p.status?.toLowerCase() !== 'inactive').slice(0, 5);
    }
  } catch (error) {
    console.error("Error fetching home data:", error);
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
      thumbnail: evt.cover?.small || evt.cover?.medium || evt.gallery?.[0]?.small || "/Thumbnail.png"
    };
  });

  const sections = [
    { id: 1, title: 'Eventos Destacados', slug: 'eventos', color: '#f54286' },
    { id: 2, title: 'Vivi tu propia experiencia', slug: 'experiencias', color: '#ff5a1f' },
    { id: 3, title: 'Actividades para Disfrutar', slug: 'actividades', color: '#8a38f5' },
  ];

  const localThumbnail = "/Thumbnail.png";

  const renderCards = (cat, index) => {
    const seeMoreCard = (
      <div key={`more-${cat.slug}`} className="flex-shrink-0" style={{ width: 'clamp(200px, 50vw, 240px)', scrollSnapAlign: 'start' }}>
        <Link href={`/${cat.slug}`} className="text-decoration-none h-100 d-block">
          <div className="rounded-4 d-flex flex-column align-items-center justify-content-center text-white shadow-premium p-4 h-100" 
               style={{ 
                 backgroundColor: cat.color, 
                 transition: 'all 0.3s ease'
               }}>
            <div className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '54px', height: '54px', backgroundColor: 'transparent' }}>
              <i className="bi bi-plus-lg fs-3"></i>
            </div>
            <span className="fw-bold font-inter" style={{ fontSize: '18px' }}>Ver más</span>
            <span className="opacity-80 small text-center mt-1 font-inter">{cat.title}</span>
          </div>
        </Link>
      </div>
    );

    // 1. EVENTOS (API)
    if (cat.slug === 'eventos' && formatedHomeEvents.length > 0) {
      return [
        ...formatedHomeEvents.map((evt) => (
          <div key={evt.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
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
        )),
        seeMoreCard
      ];
    }

    // 2. ACTIVIDADES (API real /proposals)
    if (cat.slug === 'actividades') {
        return [
          ...apiActivities.map((item) => {
            // Mapping logic consistent with actividades/page.js
            const categoryName = item.categories?.[0]?.name?.trim() || 'Actividad';
            const placeName = item.addresses?.[0]?.addressable?.name;
            const placeAddress = item.addresses?.[0]?.address;
            const address = placeName ? `${placeName}${placeAddress ? ` / ${placeAddress.split(',')[0]}` : ''}` : (placeAddress || 'Río Cuarto');
            
            const schedule = item.calendars?.[0]?.observations || 'Consultar horarios';
            const startTime = item.calendars?.[0]?.start_time?.substring(0, 5);
            const time = startTime ? `${startTime} hs` : categoryName;

            return (
              <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <ActivityCard 
                      id={item.id}
                      title={item.title}
                      time={time}
                      address={address}
                      schedule={schedule}
                      description=""
                      thumbnail={item.cover?.small || item.cover?.medium || item.gallery?.[0]?.small || '/Thumbnail.png'}
                  />
              </div>
            );
          }),
          seeMoreCard
        ];
    }

    // 3. EXPERIENCIAS (EventCard)
    if (cat.slug === 'experiencias') {
        const items = [
            { id: 'respira-aire-libre', title: 'Respira Aire Libre', time: 'Todo el día', address: 'Parque Sarmiento', schedule: 'Naturaleza', thumbnail: '/psarmiento.jfif' },
            { id: 'recorrido-7-iglesias', title: 'Recorrido 7 Iglesias', time: '3 a 4 horas', address: 'Microcentro', schedule: 'Patrimonio', thumbnail: 'https://images.unsplash.com/photo-1548625235-36af58169128?auto=format&fit=crop&q=80&w=600' },
            { id: 'recorrido-historico-cultural', title: 'Histórico Cultural', time: '2.5 horas', address: 'Palacio de Mójica', schedule: 'Historia', thumbnail: '/museo-historico.jpg' }
        ];

        return [
          ...items.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
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
          )),
          seeMoreCard
        ];
    }

    return null;
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
              <HomeSectionSlider title={cat.title}>
                {renderCards(cat, index)}
              </HomeSectionSlider>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
