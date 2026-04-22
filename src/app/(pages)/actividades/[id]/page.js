import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventCard from '@/components/server/EventCard';
import SidebarListCard from '@/components/server/SidebarListCard';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';

/**
 * ActivityDetailPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en eventos individuales con fondo desenfocado y visualización original.
 */
export default async function ActivityDetailPage({ params }) {
  const { id } = await params;

  const activityData = {
    'trencito': {
      title: 'Trencito de Rio Cuarto',
      category: 'Actividades Turísticas',
      categoryColor: '#8a38f5',
      tagline: 'Un recorrido histórico por el corazón de la ciudad.',
      description: [
        'El Trencito de Río Cuarto es un clásico paseos para grandes y chicos. Un recorrido que atraviesa los puntos más emblemáticos de la ciudad, permitiendo conocer su historia y arquitectura desde una perspectiva diferente.',
        'Durante el trayecto, se visitan monumentos, plazas principales y sectores residenciales históricos, acompañados de una guía que relata leyendas y anécdotas locales.'
      ],
      details: { horarios: 'Sáb, Dom y Feriados 15 a 19 hs.', duracion: '45 minutos aprox.', precio: 'Consultar tarifas' },
      location: { name: 'Salida desde Plaza Roca', address: 'Constitución 600, Río Cuarto', city: 'Río Cuarto, Córdoba' },
      images: ['/trencito.jfif'],
      recommendedServices: [
          { name: 'HOTEL OPERA', address: '25 de Mayo 55', phone: '0358 464-1100' },
          { name: 'LA PARRILLA DE PANCHO', address: 'San Martín 2500', phone: '0358 426-6430' }
      ]
    },
    'circuito-saludable': {
      title: 'Circuito del Bienestar',
      category: 'Salud y Deporte',
      categoryColor: '#22c55e',
      tagline: 'Senderos de caminata y estaciones de ejercicio al aire libre.',
      description: [
        'Disfrutá del aire puro en el trayecto que une el Parque Sarmiento con la Costanera del Río Cuarto. Un espacio pensado para el movimiento y la salud.',
        'Cuenta con estaciones de gimnasia, bebederos y senderos señalizados para running o caminatas tranquilas frente al río.'
      ],
      details: { horarios: 'Todo el día', duracion: 'Libre', precio: 'Acceso gratuito' },
      location: { name: 'Parque Sarmiento / Costanera', address: 'Av. Marcelo T. de Alvear, Río Cuarto', city: 'Río Cuarto, Córdoba' },
      images: ['/psarmiento.jfif'],
      recommendedServices: [
          { name: 'HOTEL OPERA', address: '25 de Mayo 55', phone: '0358 464-1100' }
      ]
    },
    'museo-historico': {
      title: 'Museo Histórico Regional',
      category: 'Cultura',
      categoryColor: '#f59e0b',
      tagline: 'Un viaje al pasado de nuestra región.',
      description: [
        'El Museo Histórico Regional resguarda el patrimonio cultural de los pioneros de la región, con salas dedicadas a la arqueología y la historia local.',
        'Ubicado en una casona histórica, ofrece visitas guiadas para escuelas y turistas interesados en nuestras raíces.'
      ],
      details: { horarios: 'Mar a Sáb 09:00 a 18:00 hs.', duracion: '1 hora aprox.', precio: 'Entrada libre y gratuita' },
      location: { name: 'Museo Histórico Regional', address: 'Fotheringham 178, Río Cuarto', city: 'Río Cuarto, Córdoba' },
      images: ['/museo-historico.jpg'],
      recommendedServices: [
          { name: 'BIBLIOTECA MARIANO MORENO', address: 'Sobremonte 820', phone: '0358 467-1234' }
      ]
    },
    'parque-ecologico': {
      title: 'Parque Ecológico Urbano',
      category: 'Naturaleza',
      categoryColor: '#059669',
      tagline: 'Contacto directo con la flora y fauna autóctona.',
      description: [
        'Un pulmón verde dedicado a la preservación y educación ambiental. Ideal para pasar el día en familia aprendiendo sobre animales rehabilitados.',
        'El parque cuenta con amplios senderos, áreas de picnic y es un centro de rescate y rehabilitación de especies silvestres.'
      ],
      details: { horarios: 'Fines de semana 10:00 a 18:30 hs.', duracion: '3 horas aprox.', precio: 'Consultar tarifas' },
      location: { name: 'Parque Ecológico Urbano (PEU)', address: 'Ruta A005 Km 7.5, Río Cuarto', city: 'Río Cuarto, Córdoba' },
      images: ['/peu.webp'],
      recommendedServices: [
          { name: 'CAFÉ DEL PARQUE', address: 'Ruta A005', phone: '0358 123-4567' }
      ]
    }
  };

  const activity = activityData[id] || activityData['trencito'];

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — Diseño adaptativo: Blur en Desktop / Cover en Mobile */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" 
               style={{ height: 'clamp(280px, 40vh, 480px)' }}>
        {/* Vista Desktop: Fondo desenfocado + Imagen contenida */}
        <div className="d-none d-md-block w-100 h-100 position-relative">
            <img 
              src={activity.images[0]} 
              alt="" 
              className="position-absolute w-100 h-100"
              style={{ objectFit: 'cover', filter: 'blur(20px)', opacity: 0.6, transform: 'scale(1.1)' }}
            />
            <img 
              src={activity.images[0]} 
              alt={activity.title} 
              className="position-absolute top-50 start-50 translate-middle h-100 mw-100 shadow-lg"
              style={{ objectFit: 'contain', zIndex: 1 }}
            />
        </div>

        {/* Vista Mobile: Imagen completa (Cover) */}
        <img 
          src={activity.images[0]} 
          alt={activity.title} 
          className="d-block d-md-none w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* Overlay transparente */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0)', zIndex: 2 }}></div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container-xxl px-lg-5 mt-n4 mt-md-n5-detail position-relative z-1 mb-5">
        <div className="row g-4">
          
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100">
                
                {/* Header: Category & Title */}
                <div className="bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-2 p-1 d-flex align-items-center justify-content-center" 
                             style={{ backgroundColor: activity.categoryColor, width: '32px', height: '32px' }}>
                            <i className="bi bi-geo-fill text-white small"></i>
                        </div>
                        <span className="font-inter fw-semibold" style={{ color: activity.categoryColor, borderBottom: `1px solid ${activity.categoryColor}` }}>
                            {activity.category}
                        </span>
                    </div>
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4 text-truncate-2" style={{ letterSpacing: '-1px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(() => {
                            const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'qué', 'hay', 'vos', 'para'];
                            const text = activity.title;
                            if (!text) return '';
                            return text.split(' ').map((word, index) => {
                                if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                                if (connectors.includes(cleanWord)) return word.toLowerCase();
                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            }).join(' ');
                        })()}
                    </h1>
                    <div className="mb-4">
                        <EventDistanceBadge eventLat={activity.location?.lat} eventLng={activity.location?.lng} type="activity" />
                    </div>
                </div>

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
                                <div className="bg-white p-3 rounded-4 border shadow-sm transition-all hover-lift">
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
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                      <h3 className="h5 fw-bold mb-4 text-gray-900">Actividades Similares</h3>
                      <div className="d-flex flex-column gap-3">
                          <SidebarListCard 
                            title="Circuito Saludable"
                            subtitle="Parque Sarmiento"
                            badge="DIARIO"
                            type="activity"
                            thumbnail="/psarmiento.jfif"
                            href="/actividades/circuito-saludable"
                          />
                          <SidebarListCard 
                            title="Museo Histórico"
                            subtitle="Fotheringham 178"
                            badge="CULTURAL"
                            type="activity"
                            thumbnail="/museo-historico.jpg"
                            href="/actividades/museo-historico"
                          />
                      </div>
                      <Link href="/actividades" className="btn btn-outline-primary w-100 mt-4 py-2 fw-bold text-decoration-none" 
                            style={{ color: activity.categoryColor, borderColor: activity.categoryColor }}>
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
