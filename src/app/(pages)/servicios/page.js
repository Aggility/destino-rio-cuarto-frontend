import React from 'react';
import ServicesListClient from '@/components/client/ServicesListClient';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import EventCard from '@/components/server/EventCard';
import { getThumbnail } from '@/utils/image';

export const revalidate = 300;

/**
 * ServiciosPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28485 / 3777:8035 (Mobile)
 */
export default async function ServiciosPage() {
  let apiServices = [];
  let activitiesForSlider = [];

  try {
    // Fetch data in parallel with page-level ISR (export const revalidate = 300).
    // The organizations response (~4.4MB) exceeds Next.js's fetch data cache limit (2MB)
    // so Next.js cannot cache the raw response, but the rendered HTML page is still
    // cached and served statically via ISR. The warning "items over 2MB can not be cached"
    // is harmless and does not affect user-facing performance.
    const [resOrgs, resProp] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?type=servicio&per_page=2000`, { next: { revalidate: 300 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals?per_page=50`, { next: { revalidate: 300 } })
    ]);

    if (resOrgs.ok) {
      const data = await resOrgs.json();
      const list = data.data || (Array.isArray(data) ? data : []);
      apiServices = list
        .filter(org => 
          org.status?.toLowerCase() !== 'inactive' &&
          org.types?.some(t => t.key === 'service')
        )
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

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
          basePath: 'actividades'
        };
      });
    }
  } catch (error) {
    console.error("Error fetching data in ServiciosPage: ", error);
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
    lng: org.addresses?.[0]?.longitude
  }));

  const finalSliderActs = activitiesForSlider.length > 0 ? activitiesForSlider : [
    { id: 1, slug: 'parque-ecologico', title: 'Parque Ecológico Urbano', date: '14:30 a 19:30 hs', location: 'Parque Ecológico Urbano', thumbnail: '/no-img.webp', category: 'NATURALEZA', typeColor: '#8a38f5', basePath: 'actividades' },
    { id: 2, slug: 'botes-del-lago', title: 'Botes del Lago', date: '15:00 a 19:00 hs', location: 'Parque Sarmiento', thumbnail: '/no-img.webp', category: 'RECREACIÓN', typeColor: '#8a38f5', basePath: 'actividades' },
    { id: 3, slug: 'trencito-rio-cuarto', title: 'Trencito de Rio Cuarto', date: '15:00 a 19:00 hs', location: 'Parque Sarmiento', thumbnail: '/no-img.webp', category: 'RECREACIÓN', typeColor: '#8a38f5', basePath: 'actividades' }
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
