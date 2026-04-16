import React from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import ServicesListClient from '@/components/client/ServicesListClient';
import SidebarListCard from '@/components/server/SidebarListCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';

/**
 * ServiciosPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28485 / 3777:8035 (Mobile)
 */
export default async function ServiciosPage() {
  let apiServices = [];
  try {
    const res = await fetch('http://destbackdev.aggility.io/api/v1/organizations', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      apiServices = Array.isArray(data) ? data : (data.data || []);
    }
  } catch (error) {
    console.error("Error fetching organizations API: ", error);
  }

  const formattedServices = apiServices.map((org) => ({
    id: org.id,
    title: org.name,
    category: org.categories?.[0]?.name || 'Servicio',
    address: org.addresses?.[0]?.address?.split(',')[0] || 'Río Cuarto',
    phone: org.phone || 'Consultar contacto',
    thumbnail: org.image_url || "/Thumbnail.png",
    lat: org.addresses?.[0]?.latitude,
    lng: org.addresses?.[0]?.longitude
  }));

  const services = formattedServices.length > 0 ? formattedServices : [
    { id: '1', title: '3G Bebidas S.A.S', category: 'Tienda de Bebidas', address: 'Hipólito Irigoyen 3076, Río Cuarto', phone: '358 475-4624' },
    { id: '2', title: 'A Mi Manera', category: 'Casa de té', address: 'Alvear 734, Río Cuarto', phone: '358 462-1360' },
    { id: '3', title: 'Hotel Opera', category: 'Alojamiento', address: '25 de Mayo 55, Río Cuarto', phone: '358 464-1011' },
    { id: '4', title: 'Restaurante Central', category: 'Gastronomía', address: 'Sobremonte 654, Río Cuarto', phone: '358 462-0012' },
    { id: '5', title: 'Alquiler de Autos RC', category: 'Transporte', address: 'Aeropuerto Local, Río Cuarto', phone: '358 465-9876' },
  ];

  const topSearched = services.slice(0, 5);

  const categories = ["Comer", "Dormir", "Disfrutar", "Viajar", "Servicios generales o al turista"];
  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* GLOBAL HERO SECTION */}
      <HeroHome initialSlug="servicios" />

      {/* 3. FILTERS & SEARCH */}
      <section className="bg-white border-bottom pt-4 pb-4 pb-md-5 overflow-visible shadow-sm">
        <div className="container-xxl px-lg-5">
          <div className="row g-3 align-items-end">
             {/* Search Input */}
             <div className="col-12 col-xl-8">
              <div className="input-group">
                <span className="input-group-text bg-gray-50 border-end-0 py-2 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control bg-gray-50 border-start-0 border-end-0 py-2 shadow-none font-inter" 
                       placeholder="¿Qué estás buscando? (Ej: Hotel, Parrilla, Taxi)" style={{ height: '52px' }} />
                <button className="btn btn-primary border-0 px-4 fw-bold" style={{ backgroundColor: '#1a56db' }}>
                   BUSCAR
                </button>
              </div>
            </div>

            {/* Chips Scrollable (Categorías) */}
            <div className="col-12 mt-3">
                <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
                    <button className="btn btn-primary rounded-pill px-4 btn-sm fw-bold" style={{ minWidth: 'fit-content' }}>Todos</button>
                    {categories.map((cat, idx) => (
                        <button key={idx} className="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-medium shadow-sm transition-all hover-lift" 
                                style={{ minWidth: 'fit-content', backgroundColor: 'white' }}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTENT GRID */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <div className="row g-5">
            
            {/* MAIN LIST */}
            <div className="col-12 col-xl-8">
              <ServicesListClient initialServices={services} />
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
                        href={`/servicio/${s.id}`}
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
