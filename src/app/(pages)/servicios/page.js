import React from 'react';
import ServicesListClient from '@/components/client/ServicesListClient';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import EventCard from '@/components/server/EventCard';
import { getThumbnail } from '@/utils/image';

/**
 * ServiciosPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28485 / 3777:8035 (Mobile)
 */
export default async function ServiciosPage() {
  let apiServices = [];
  try {
    // Fetch initial data from the API
    const res = await fetch('https://destbackdev.aggility.io/api/v1/organizations?per_page=2000', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      apiServices = data.data || (Array.isArray(data) ? data : []);
      apiServices = apiServices
        .filter(org => org.status?.toLowerCase() !== 'inactive')
        .sort((a, b) => {
          const isServiceA = a.types?.some(t => t.key === 'service' || t.slug === 'servicio') ? 1 : 0;
          const isServiceB = b.types?.some(t => t.key === 'service' || t.slug === 'servicio') ? 1 : 0;
          const isPlaceA = a.types?.some(t => t.key === 'place' || t.slug === 'lugar') ? 1 : 0;
          const isPlaceB = b.types?.some(t => t.key === 'place' || t.slug === 'lugar') ? 1 : 0;
          
          const weightA = isServiceA ? 1 : (isPlaceA ? 2 : 3);
          const weightB = isServiceB ? 1 : (isPlaceB ? 2 : 3);
          
          if (weightA !== weightB) {
            return weightA - weightB;
          }
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
    }
  } catch (error) {
    console.error("Error fetching organizations API: ", error);
  }

  const formattedServices = apiServices.map((org) => ({
    id: org.id,
    slug: org.slug,
    title: org.name,
    category: org.categories?.[0]?.name || 'Servicio',
    address: org.addresses?.[0]?.address?.split(',')[0] || 'Río Cuarto',
    phone: org.phone || 'Consultar contacto',
    thumbnail: getThumbnail(org.cover, org.gallery),
    lat: org.addresses?.[0]?.latitude,
    lng: org.addresses?.[0]?.longitude,
    description: org.description || ''
  }));

  // Obtener actividades para el slider inferior
  let activitiesForSlider = [];
  try {
    const resProp = await fetch('https://destbackdev.aggility.io/api/v1/proposals?per_page=50', { cache: 'no-store' });
    if (resProp.ok) {
      const propData = await resProp.json();
      const list = Array.isArray(propData) ? propData : (propData.data || []);
      const allActs = list.filter(p => 
        p.status?.toLowerCase() !== 'inactive' &&
        p.types?.some(t => t.key === 'activity' || t.slug === 'actividad')
      );
      
      activitiesForSlider = allActs.slice(0, 10).map(e => {
        const catName = e.categories?.[0]?.name?.trim() || 'Actividad';
        const addr = e.addresses?.[0]?.organization?.name || e.organization?.name || e.addresses?.[0]?.addressable?.name || e.addresses?.[0]?.address || 'Río Cuarto';
        
        const c = e.calendars?.[0];
        let tBadge = catName;
        if (c) {
          if (c.start_time && c.end_time) {
            tBadge = `${c.start_time.substring(0, 5)} a ${c.end_time.substring(0, 5)} hs`;
          } else if (c.start_time) {
            tBadge = `${c.start_time.substring(0, 5)} hs`;
          }
        }
        
        return {
          id: e.id,
          slug: e.slug,
          title: e.title || 'Actividad',
          date: tBadge,
          location: addr,
          thumbnail: getThumbnail(e.cover, e.gallery),
          category: catName.toUpperCase(),
          typeColor: '#8a38f5',
          schedule: e.calendars?.[0]?.observations || '',
          lat: e.addresses?.[0]?.latitude,
          lng: e.addresses?.[0]?.longitude,
          basePath: '/actividades'
        };
      });
    }
  } catch (err) {
    console.error("Error fetching activities for slider:", err);
  }

  const finalSliderActs = activitiesForSlider.length > 0 ? activitiesForSlider : [
    { id: 1, slug: 'parque-ecologico', title: 'Parque Ecológico Urbano', date: '14:30 a 19:30 hs', location: 'Parque Ecológico Urbano', thumbnail: '/no-img.webp', category: 'NATURALEZA', typeColor: '#8a38f5', basePath: '/actividades' },
    { id: 2, slug: 'botes-del-lago', title: 'Botes del Lago', date: '15:00 a 19:00 hs', location: 'Parque Sarmiento', thumbnail: '/no-img.webp', category: 'RECREACIÓN', typeColor: '#8a38f5', basePath: '/actividades' },
    { id: 3, slug: 'trencito-rio-cuarto', title: 'Trencito de Rio Cuarto', date: '15:00 a 19:00 hs', location: 'Parque Sarmiento', thumbnail: '/no-img.webp', category: 'RECREACIÓN', typeColor: '#8a38f5', basePath: '/actividades' }
  ];

  // Mostramos 9 inicialmente como pidió el usuario
  const initialServices = formattedServices.slice(0, 9);
  const remainingServices = formattedServices.slice(9);

  return (
    <div className="bg-listing-page min-vh-100 position-relative" style={{ overflowX: 'hidden' }}>
      
      {/* GLOBAL HERO SECTION */}
      <HeroHome initialSlug="servicios" />

      {/* 4. CONTENT GRID */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <div className="row g-5 align-items-start">
            
            {/* MAIN LIST & FILTERS */}
            <div className="col-12">
              <ServicesListClient initialServices={initialServices} leftoverFromFirstPage={remainingServices} />
            </div>

          </div>

          {/* EXPLORE ACTIVITIES SECTION */}
          {finalSliderActs.length > 0 && (
            <div className="mt-5 pt-5 border-top w-100">
              <HomeSectionSlider title="Explorar Actividades">
                {finalSliderActs.map((item) => (
                  <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                    <EventCard 
                      id={item.id}
                      slug={item.slug}
                      title={item.title}
                      date={item.date}
                      location={item.location}
                      category={item.category}
                      description={item.schedule}
                      thumbnail={item.thumbnail}
                      lat={item.lat}
                      lng={item.lng}
                      basePath={item.basePath}
                      typeColor={item.typeColor}
                    />
                  </div>
                ))}
              </HomeSectionSlider>
            </div>
          )}
        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
