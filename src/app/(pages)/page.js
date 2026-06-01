import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import ActivityCard from '@/components/server/ActivityCard';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import { getThumbnail } from '@/utils/image';

/**
 * Home - Destino Río Cuarto (Home V2 Fidelity)
 * Sincronizado con Figma ID 3781:19219
 * Optimizado para Mobile y Desktop.
 */
export default async function Home() {
  // 1. Fetch Events + Actividades + Experiencias en paralelo
  let apiEvents = [];
  let apiActivities = [];
  let apiExperiences = [];
  try {
    const [resEvents, resActivities, resExperiences] = await Promise.all([
      fetch('https://destbackdev.aggility.io/api/v1/events', { cache: 'no-store' }),
      fetch('https://destbackdev.aggility.io/api/v1/proposals', { cache: 'no-store' }),
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
        // Filtrar por tipo 'activity' como pidió el usuario
        apiActivities = all
          .filter(p => p.status?.toLowerCase() !== 'inactive' && p.types?.some(t => t.key === 'activity'))
          .slice(0, 5);
      }
    if (resExperiences.ok) {
      const data = await resExperiences.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      // Filtrar por tipo 'experience' como pidió el usuario
      apiExperiences = all
        .filter(p => p.status?.toLowerCase() !== 'inactive' && p.types?.some(t => t.key === 'experience'))
        .slice(0, 5);
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
      thumbnail: getThumbnail(evt.cover, evt.gallery)
    };
  });

  const sections = [
    { id: 1, title: 'Eventos Destacados', slug: 'eventos', color: '#f54286' },
    { id: 2, title: 'Vivi tu propia experiencia', slug: 'experiencias', color: '#ff5a1f' },
    { id: 3, title: 'Actividades para Disfrutar', slug: 'actividades', color: '#8a38f5' },
  ];

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
            const categoryName = item.categories?.[0]?.name?.trim() || 'Actividad';
            
            // Lugar: Solo nombre del lugar (priorizando organization dentro de addresses)
            const address = item.addresses?.[0]?.organization?.name || item.organization?.name || item.addresses?.[0]?.addressable?.name || item.addresses?.[0]?.address || 'Río Cuarto';
            
            // Horario claro y corto
            const cal = item.calendars?.[0];
            let timeBadge = categoryName;
            if (cal) {
              if (cal.start_time && cal.end_time) {
                timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
              } else if (cal.start_time) {
                timeBadge = `${cal.start_time.substring(0, 5)} hs`;
              }
            }

            // Imagen con prioridad: medium -> small -> large
            let thumbnail = '/Thumbnail.png';
            if (item.cover && typeof item.cover === 'object') {
              thumbnail = item.cover.medium || item.cover.small || item.cover.large || item.cover.original || getThumbnail(item.cover, item.gallery);
            } else {
              thumbnail = getThumbnail(item.cover, item.gallery);
            }

            return (
              <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <ActivityCard 
                      id={item.id}
                      title={item.title}
                      time={timeBadge}
                      address={address}
                      schedule={cal?.observations || 'Consultar'}
                      description=""
                      thumbnail={thumbnail}
                  />
              </div>
            );
          }),
          seeMoreCard
        ];
    }

    // 3. EXPERIENCIAS (API real /proposals)
    if (cat.slug === 'experiencias') {
        return [
          ...apiExperiences.map((exp) => {
            const category = exp.categories?.[0]?.name?.trim() || 'Experiencia';
            
            // Lugar: Solo nombre del lugar (priorizando organización)
            const location = exp.addresses?.[0]?.organization?.name || exp.organization?.name || exp.addresses?.[0]?.addressable?.name || exp.addresses?.[0]?.address || 'Río Cuarto';

            // Horario: Extraer de calendars de forma clara
            const cal = exp.calendars?.[0];
            let timeBadge = category;
            if (cal) {
              if (cal.start_time && cal.end_time) {
                timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
              } else if (cal.start_time) {
                timeBadge = `${cal.start_time.substring(0, 5)} hs`;
              }
            }

            // Imagen con prioridad: medium (como solicitó el usuario) -> small -> large -> fallback
            let thumbnail = '/no-img.webp';
            if (exp.cover && typeof exp.cover === 'object') {
              thumbnail = exp.cover.medium || exp.cover.small || exp.cover.large || exp.cover.original || getThumbnail(exp.cover, exp.gallery);
            } else {
              thumbnail = getThumbnail(exp.cover, exp.gallery);
            }

            return (
              <div key={exp.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <EventCard 
                      id={exp.id}
                      title={exp.title || 'Sin título'}
                      date={timeBadge}
                      location={location}
                      category={category}
                      description={cal?.observations || 'Consultar horarios'}
                      thumbnail={thumbnail}
                      lat={exp.addresses?.[0]?.latitude}
                      lng={exp.addresses?.[0]?.longitude}
                      basePath="experiencias"
                      typeColor={cat.color}
                  />
              </div>
            );
          }),
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
