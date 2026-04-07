import React from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import EventCard from '@/components/server/EventCard'; // For recommendation sidebar

/**
 * ServiciosPage - Destino Río Cuarto
 * Basado en Figma ID 3640:28485 (Servicios - Desktop)
 * Implementa el listado de servicios con filtros y sidebar de recomendaciones.
 */
export default function ServiciosPage() {
  const services = [
    { id: 1, title: '3G Bebidas S.A.S', category: 'Tienda de Bebidas', address: 'Hipólito Irigoyen 3076, Río Cuarto', phone: '358 475-4624' },
    { id: 2, title: 'A Mi Manera', category: 'Casa de té', address: 'Alvear 734, Río Cuarto', phone: '358 462-1360' },
    { id: 3, title: 'Hotel Opera', category: 'Alojamiento', address: '25 de Mayo 55, Río Cuarto', phone: '358 464-1011' },
    { id: 4, title: 'Restaurante Central', category: 'Gastronomía', address: 'Sobremonte 654, Río Cuarto', phone: '358 462-0012' },
    { id: 5, title: 'Alquiler de Autos RC', category: 'Transporte', address: 'Aeropuerto Local, Río Cuarto', phone: '358 465-9876' },
  ];

  const categories = ["Comer", "Dormir", "Disfrutar", "Viajar", "Servicios al turista"];
  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-listing-page min-vh-100">
      
      {/* 1. TOP INFO BAR — Figma ID 3410:5609 (Reused) */}
      <div className="top-info-bar">
        <div className="container-xxl px-lg-5 text-center d-flex align-items-center justify-content-center">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', backgroundColor: '#1c64f2' }}>
            <i className="bi bi-sparkles text-white" style={{ fontSize: '18px' }}></i>
          </div>
          <span className="font-inter">Encontrá todos los servicios que necesitás en la ciudad</span>
        </div>
      </div>

      {/* 2. HERO SECTION — Figma ID 3640:28489 */}
      <section className="bg-white py-5">
        <div className="container-xxl px-lg-5">
          <div className="max-w-768px">
            <h1 className="display-4 fw-medium text-gray-900 tracking-tight font-inter mb-2" style={{ fontSize: '60px', letterSpacing: '-1.8px' }}>
              Servicios
            </h1>
            <p className="text-gray-500 font-inter lead" style={{ fontSize: '18px' }}>
              Encontrá comercios, alojamientos y transporte en un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FILTERS & CONTENT — Figma ID 3640:28493 */}
      <section className="pb-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">
          
          <div className="row g-5">
            
            {/* COLUMN 1: MAIN CONTENT (875px) — Figma ID 3640:28497 */}
            <div className="col-lg-8">
              
              {/* Search Form — Figma ID 3640:28500 */}
              <div className="d-flex gap-3 mb-4 align-items-center" style={{ maxWidth: '724px' }}>
                 <div className="input-group flex-grow-1">
                    <span className="input-group-text bg-light-gray border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input type="text" className="form-control bg-light-gray border-start-0 py-2" style={{ height: '52px' }} placeholder="Buscar servicios..." />
                 </div>
                 <button className="btn btn-primary px-4 fw-medium border-0" style={{ height: '52px', minWidth: '119px', backgroundColor: '#1a56db' }}>
                    Buscar
                 </button>
              </div>

              {/* TABS — Figma ID 3640:28517 */}
              <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3 scroll-x-mobile">
                <span className="text-muted font-inter me-2" style={{ fontSize: '14px' }}>Filtrar por:</span>
                {categories.map((cat, idx) => (
                  <button key={idx} className="btn btn-light bg-light-gray border-0 rounded-pill px-3 py-1 font-inter" style={{ fontSize: '13px' }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* SERVICE LIST — Figma ID 3640:28531 */}
              <div className="service-list mt-4">
                <p className="text-gray-500 font-inter mb-4" style={{ fontSize: '15px' }}>Mostrando {services.length} resultados encontrados</p>
                
                {services.map((service) => (
                  <ServiceListItem 
                    key={service.id}
                    title={service.title}
                    category={service.category}
                    address={service.address}
                    phone={service.phone}
                    thumbnail={localThumbnail}
                  />
                ))}

                {/* LOAD MORE — Figma ID 3640:28543 */}
                <div className="text-center mt-5">
                  <button className="btn btn-outline-primary px-5 py-2 rounded-2 shadow-premium fw-medium" style={{ 
                    minWidth: '178px',
                    height: '52px',
                    borderColor: '#1a56db',
                    color: '#1a56d8'
                  }}>
                    Ver más comercios
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN 2: RECOMMENDATIONS (429px) — Figma ID 3640:28545 */}
            <div className="col-lg-4 border-start ps-lg-5">
              <div className="sticky-top" style={{ top: '120px' }}>
                <h3 className="font-inter fw-semibold text-gray-900 mb-4" style={{ fontSize: '24px' }}>
                  Recomendados para vos
                </h3>
                
                <div className="d-flex flex-column gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="recommendation-card-wrap">
                       <EventCard 
                        title={i === 1 ? "Hotel Opera de Lujo" : "Gastronomía Río V"}
                        date="ABIERTO 24HS"
                        location="Centro"
                        category="RECOMENDADO"
                        thumbnail={localThumbnail}
                       />
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-primary-100 rounded-8px text-center shadow-premium-subtle">
                  <h4 className="font-inter fw-bold text-primary-800 mb-2">¿Querés sumar tu comercio?</h4>
                  <p className="small text-primary-700 font-inter mb-3">Unite a la red de servicios de la ciudad.</p>
                  <button className="btn btn-primary w-100 rounded-pill shadow-premium" style={{ backgroundColor: '#1a56db', padding: '12px' }}>
                    Registrar Servicio
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
