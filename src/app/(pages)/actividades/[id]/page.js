import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventCard from '@/components/server/EventCard';
import SidebarListCard from '@/components/server/SidebarListCard';

/**
 * ActivityDetailPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28602 (Desktop) / 3777:8313 (Mobile)
 */
export default async function ActivityDetailPage({ params }) {
  const { id } = await params;

  const activity = {
    id: id || 'trencito',
    title: 'Trencito de Rio Cuarto',
    category: 'Actividades Turísticas',
    categoryColor: '#8a38f5',
    tagline: 'Un recorrido histórico por el corazón de la ciudad.',
    description: [
      'El Trencito de Río Cuarto es un clásico paseos para grandes y chicos. Un recorrido que atraviesa los puntos más emblemáticos de la ciudad, permitiendo conocer su historia y arquitectura desde una perspectiva diferente.',
      'Durante el trayecto, se visitan monumentos, plazas principales y sectores residenciales históricos, acompañados de una guía que relata leyendas y anécdotas locales.'
    ],
    details: {
      horarios: 'Sáb, Dom y Feriados 15 a 19 hs.',
      duracion: '45 minutos aprox.',
      precio: 'Consultar tarifas'
    },
    location: {
      name: 'Salida desde Plaza Roca',
      address: 'Constitución 600, Río Cuarto',
      city: 'Río Cuarto, Córdoba'
    },
    images: ['/Thumbnail.png'],
    recommendedServices: [
        { name: 'HOTEL OPERA', address: '25 de Mayo 55', phone: '0358 464-1100' },
        { name: 'LA PARRILLA DE PANCHO', address: 'San Martín 2500', phone: '0358 426-6430' }
    ]
  };

  return (
    <div className="bg-light-gray min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — Altura fluida para mobile */}
      <section className="position-relative overflow-hidden bg-dark" 
               style={{ height: 'clamp(300px, 40vh, 450px)' }}>
        <img 
          src={activity.images[0]} 
          alt={activity.title} 
          className="position-absolute w-100 h-100 object-cover opacity-75"
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 text-white bg-gradient-dark">
          <div className="container-xxl px-lg-5">
            <nav aria-label="breadcrumb" className="mb-2 d-none d-md-block">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link href="/" className="text-white opacity-75 text-decoration-none">Inicio</Link></li>
                <li className="breadcrumb-item"><Link href="/actividades" className="text-white opacity-75 text-decoration-none">Actividades</Link></li>
                <li className="breadcrumb-item active text-white" aria-current="page">{activity.title}</li>
              </ol>
            </nav>
            <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-1 p-1 d-flex align-items-center justify-content-center" 
                     style={{ backgroundColor: activity.categoryColor, width: '24px', height: '24px' }}>
                    <i className="bi bi-geo-fill text-white small" style={{ fontSize: '10px' }}></i>
                </div>
                <span className="fw-bold text-uppercase small tracking-wider" style={{ fontSize: '11px' }}>{activity.category}</span>
            </div>
            <h1 className="fw-bold mb-0 text-shadow-sm" 
                style={{ fontSize: 'clamp(32px, 6vw, 64px)', letterSpacing: '-2px', lineHeight: '1' }}>
              {activity.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container-xxl px-lg-5 mt-4 mt-md-5">
        <div className="row g-4">
          
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                
                {/* Mobile Quick Info Bar */}
                <div className="d-flex flex-column flex-md-row gap-3 mb-5 py-4 border-top border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-clock text-primary fs-5"></i>
                        <div>
                            <span className="text-muted d-block small">Horarios</span>
                            <span className="fw-bold text-gray-900">{activity.details.horarios}</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 border-md-start ps-md-4">
                        <i className="bi bi-geo-alt text-primary fs-5"></i>
                        <div>
                            <span className="text-muted d-block small">Ubicación</span>
                            <span className="fw-bold text-gray-900">{activity.location.name}</span>
                        </div>
                    </div>
                </div>

                <div className="activity-info mb-5">
                    <h2 className="h4 fw-bold mb-4 text-gray-800">Sobre la actividad</h2>
                    {activity.description.map((p, i) => (
                        <p key={i} className="text-gray-600 fs-5 mb-4 leading-relaxed">{p}</p>
                    ))}
                </div>

                {/* Recommendations Grid */}
                <div className="pt-4 border-top">
                    <h3 className="h5 fw-bold mb-4">Servicios Recomendados</h3>
                    <div className="row g-3">
                        {activity.recommendedServices.map((item, i) => (
                            <div key={i} className="col-12 col-md-6">
                                <div className="bg-light p-3 rounded-4 border shadow-sm transition-all hover-lift">
                                    <p className="fw-bold text-dark mb-2">{item.name}</p>
                                    <p className="text-muted small mb-1"><i className="bi bi-geo-alt me-2"></i>{item.address}</p>
                                    <p className="text-muted small mb-0"><i className="bi bi-telephone me-2"></i>{item.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
              <aside className="d-flex flex-column gap-4">
                  <div className="bg-white p-4 rounded-4 border shadow-premium">
                      <h3 className="h5 fw-bold mb-4 text-gray-900">Actividades Similares</h3>
                      <div className="d-flex flex-column gap-3">
                          <SidebarListCard 
                            title="Circuito Saludable"
                            subtitle="Parque Sarmiento"
                            badge="DIARIO"
                            type="activity"
                            thumbnail="/Thumbnail.png"
                            href="/actividades/id"
                          />
                          <SidebarListCard 
                            title="Museo Histórico"
                            subtitle="Fotheringham 178"
                            badge="CULTURAL"
                            type="activity"
                            thumbnail="/Thumbnail.png"
                            href="/actividades/id"
                          />
                      </div>
                      <Link href="/actividades" className="btn btn-outline-primary w-100 mt-4 py-2 fw-bold text-decoration-none" 
                            style={{ color: '#8a38f5', borderColor: '#c084fc' }}>
                          VER TODAS LAS ACTIVIDADES
                      </Link>
                  </div>
              </aside>
          </div>

        </div>
      </div>

      <ChatbotIcon />
    </div>
  );
}
