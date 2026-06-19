import React from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import ServicesListClient from '@/components/client/ServicesListClient';
import SidebarListCard from '@/components/server/SidebarListCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
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
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
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

  // Mostramos 9 inicialmente como pidió el usuario
  const initialServices = formattedServices.slice(0, 9);
  const remainingServices = formattedServices.slice(9);

  const topSearched = initialServices.slice(0, 5);
  const localThumbnail = "/Thumbnail.png";


  return (
    <div className="bg-listing-page min-vh-100 position-relative" style={{ overflowX: 'hidden' }}>
      
      {/* GLOBAL HERO SECTION */}
      <HeroHome initialSlug="servicios" />

      {/* 4. CONTENT GRID */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <div className="row g-5 align-items-start">
            
            {/* MAIN LIST & FILTERS */}
            <div className="col-12 col-xl-8">
              <ServicesListClient initialServices={initialServices} leftoverFromFirstPage={remainingServices} />
            </div>


            {/* SIDEBAR */}
            <div className="col-12 col-xl-4">
               <div className="p-4 bg-white rounded-4 border shadow-sm position-sticky" style={{ top: '120px', zIndex: 10 }}>
                  <h3 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                    Más Buscados
                  </h3>
                  
                  <div className="d-flex flex-column gap-2 mb-4">
                    {topSearched.map((s, idx) => (
                      <SidebarListCard 
                        key={s.id || idx}
                        id={s.id}
                        title={s.title}
                        subtitle={s.address}
                        badge={s.category}
                        type="service"
                        thumbnail={s.thumbnail || localThumbnail}
                        href={`/servicio/${s.slug || s.id}`}
                        lat={s.lat}
                        lng={s.lng}
                      />
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-4 text-center border border-blue-100 shadow-sm" style={{ backgroundColor: '#f0f7ff' }}>
                    <h4 className="font-inter fw-bold text-primary mb-2">¿Sumamos tu negocio?</h4>
                    <p className="small text-gray-600 font-inter mb-4">Llegá a más turistas y vecinos registrando tu comercio gratis.</p>
                    <button className="btn btn-primary w-100 rounded-3 shadow-premium py-2 fw-bold" style={{ backgroundColor: '#1a56db' }}>
                      REGISTRAR MI COMERCIO
                    </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
