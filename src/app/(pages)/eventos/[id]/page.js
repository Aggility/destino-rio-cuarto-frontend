import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventCard from '@/components/server/EventCard';

/**
 * EventDetailPage - Destino Río Cuarto
 * Diseño basado en Figma ID 3640:28420 / 3777:8215 (Mobile)
 * Implementa la vista detallada de un evento con sidebar de recomendaciones.
 */
export default async function EventDetailPage({ params }) {
  const { id } = await params;
  
  // Mock data para el evento (Ulises Bueno como ejemplo del diseño)
  const event = {
    id: id || '2',
    title: 'Ulises Bueno en Opus Costanera',
    date: 'sáb, 7 de mar, 21 hs',
    location: 'Opus Costanera / Río Grande 688, Río Cuarto',
    fullLocation: {
        name: 'Opus Costanera',
        address: 'Río Grande 688',
        city: 'Río Cuarto, Córdoba 5800'
    },
    description: 'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande! Este 07 de marzo, viví una noche única con el show mas esperado.',
    fullDescription: [
        'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande! Este 07 de marzo, viví una noche única con el show mas esperado.',
        'Conseguí tu entrada a partir del 18 de febrero en:',
        'Opus Costanera de Lunes a Viernes (Rio Grande 688)',
        'Kiosco Newen (Buenos Aires 55)',
        'A través del siguiente link: https://www.edenentradas.ar/event/ulises-bueno---rio-cuarto'
    ],
    category: 'EVENTO',
    thumbnail: '/Thumbnail.png',
    relatedEvents: [
        { id: 1, title: 'Ivan Noble', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar' },
        { id: 3, title: 'Negociemos', date: 'vie, 27 feb, 21:00', location: 'Teatro Municipal' }
    ]
  };

  const accommodation = [
    { name: 'AMERIAN RÍO CUARTO APART & SUITES', address: 'AV. GUILLERMO MARCONI 771', phone: '08108102637' },
    { name: 'Colores Rio Cuarto', address: 'Caseros 1012, Río Cuarto', phone: '3584225286' }
  ];

  const restaurants = [
    { name: 'Abriles El Andino', address: 'Bv. General Roca 1020, Río Cuarto', phone: '0358 548-3882' },
    { name: 'Al Dente Tradición Familiar', address: 'Fray Quirico Porreca 547, Río Cuarto', phone: '+54 9 358 425-5129' }
  ];

  return (
    <div className="bg-light-gray min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — Basado en Figma Mobile/Desktop */}
      <section className="position-relative overflow-hidden bg-dark" style={{ height: 'clamp(300px, 45vh, 480px)' }}>
        <img 
          src={event.thumbnail} 
          alt={event.title} 
          className="position-absolute w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark Overlay sutil para profundidad */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.1)' }}></div>
        <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)' }}></div>
        {/* Desktop Buttons */}
        <div className="position-absolute bottom-0 end-0 p-4 d-none d-lg-flex gap-3">
            <button className="btn btn-white shadow-premium d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0">
                <span className="font-inter fw-medium small">Agendar</span>
                <i className="bi bi-calendar-event"></i>
            </button>
            <button className="btn btn-white shadow-premium d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0">
                <span className="font-inter fw-medium small">Compartir</span>
                <i className="bi bi-share"></i>
            </button>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="container-xxl px-lg-5 mt-4 mt-lg-n5-detail position-relative z-1 mb-5">
        <div className="row g-4">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100">
                
                {/* Mobile Action Buttons */}
                <div className="d-flex d-lg-none gap-2 mb-4">
                  <button className="btn btn-primary flex-grow-1 py-2 fw-semibold rounded-2 shadow-premium" style={{ backgroundColor: '#1a56db' }}>
                    Agendar
                  </button>
                  <button className="btn btn-outline-secondary py-2 px-3 rounded-2">
                    <i className="bi bi-share"></i>
                  </button>
                </div>

                {/* Category & Title */}
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-pink-500 rounded-2 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f54286' }}>
                        <i className="bi bi-star-fill text-white small"></i>
                    </div>
                    <span className="text-pink-500 font-inter fw-semibold" style={{ color: '#f54286', borderBottom: '1px solid #f54286' }}>
                        Eventos
                    </span>
                </div>
                
                <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4" style={{ letterSpacing: '-1px' }}>
                    {(() => {
                        const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'qué', 'hay', 'vos', 'para'];
                        const text = event.title;
                        if (!text) return '';
                        return text.split(' ').map((word, index) => {
                            if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                            if (connectors.includes(cleanWord)) return word.toLowerCase();
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        }).join(' ');
                    })()}
                </h1>

                {/* Info Bar */}
                <div className="row g-3 mb-5 border-top border-bottom py-4 mx-0">
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 border-md-end mb-3 mb-md-0">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Cuando</span>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-calendar3 text-primary"></i>
                            <span className="text-gray-900 font-inter fw-medium">{event.date}</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 ps-md-4">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Donde</span>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-geo-alt text-primary"></i>
                            <span className="text-gray-900 font-inter fw-medium text-decoration-underline" style={{ cursor: 'pointer' }}>
                                {event.location}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Full Description */}
                <div className="description-content font-inter text-gray-600 fs-5 mb-5" style={{ lineHeight: '1.6' }}>
                    {event.fullDescription.map((para, idx) => (
                        <p key={idx} className={idx === 0 ? 'mb-4 text-gray-900 fw-medium' : 'mb-3'}>
                            {para}
                        </p>
                    ))}
                    <button className="btn btn-link p-0 text-gray-500 fw-medium text-decoration-underline mt-2">
                        Ver más
                    </button>
                </div>

                {/* Location Box */}
                <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '22px' }}>Ubicación</h2>
                    <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center bg-gray-50 p-4 rounded-4 border-1-5 border-dashed">
                        <div className="flex-grow-1">
                            <p className="font-inter fw-bold text-gray-900 mb-1">{event.fullLocation.name}</p>
                            <p className="font-inter text-muted small mb-0">{event.fullLocation.address}</p>
                            <p className="font-inter text-muted small mb-0">{event.fullLocation.city}</p>
                        </div>
                        <div className="rounded-3 overflow-hidden bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '140px', height: '100px', minWidth: '140px' }}>
                            <i className="bi bi-geo-alt-fill text-muted fs-2"></i>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Recommendations) */}
          <div className="col-12 col-lg-4">
            <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              
              {/* Dormir */}
              <div className="bg-listing-page p-4 rounded-4 mb-4" style={{ backgroundColor: '#ebf5ff' }}>
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#203f83' }}>Donde alojarme</h3>
                <div className="d-flex flex-column gap-3 mb-4">
                    {accommodation.map((item, idx) => (
                        <Link href="/servicios" key={idx} className="bg-white p-3 rounded-3 shadow-sm border position-relative text-decoration-none d-block transition-all hover-lift">
                            <p className="font-inter fw-bold text-gray-900 small mb-2">{item.name}</p>
                            <div className="d-flex align-items-start gap-2 mb-1">
                                <i className="bi bi-geo-alt text-muted" style={{ fontSize: '12px' }}></i>
                                <span className="font-inter text-muted text-decoration-underline" style={{ fontSize: '12px' }}>{item.address}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-telephone text-muted" style={{ fontSize: '12px' }}></i>
                                <span className="font-inter text-muted" style={{ fontSize: '12px' }}>{item.phone}</span>
                            </div>
                            <i className="bi bi-chevron-right position-absolute bottom-0 end-0 m-3 opacity-50"></i>
                        </Link>
                    ))}
                </div>
                <Link href="/servicios" className="btn btn-outline-primary w-100 py-2 font-inter fw-medium rounded-2 border-1-5 text-decoration-none d-flex justify-content-center" style={{ color: '#1a56db', borderColor: '#a4cafe' }}>
                    Ver más
                </Link>
              </div>

              {/* Comer */}
              <div className="bg-listing-page p-4 rounded-4 shadow-premium-subtle" style={{ backgroundColor: '#fff7ed' }}>
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#9a3412' }}>Donde comer</h3>
                <div className="d-flex flex-column gap-3 mb-4">
                    {restaurants.map((item, idx) => (
                        <Link href="/servicios" key={idx} className="bg-white p-3 rounded-3 shadow-sm border position-relative text-decoration-none d-block transition-all hover-lift">
                            <p className="font-inter fw-bold text-gray-900 small mb-2">{item.name}</p>
                            <div className="d-flex align-items-start gap-2 mb-1">
                                <i className="bi bi-geo-alt text-muted" style={{ fontSize: '12px' }}></i>
                                <span className="font-inter text-muted text-decoration-underline" style={{ fontSize: '12px' }}>{item.address}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-telephone text-muted" style={{ fontSize: '12px' }}></i>
                                <span className="font-inter text-muted" style={{ fontSize: '12px' }}>{item.phone}</span>
                            </div>
                            <i className="bi bi-chevron-right position-absolute bottom-0 end-0 m-3 opacity-50"></i>
                        </Link>
                    ))}
                </div>
                <Link href="/servicios" className="btn btn-outline-warning w-100 py-2 font-inter fw-medium rounded-2 border-1-5 text-decoration-none d-flex justify-content-center" style={{ color: '#c2410c', borderColor: '#fed7aa' }}>
                    Ver más
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* RELATED EVENTS SECTION */}
        <div className="mt-5 pt-5 border-top">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <h2 className="font-inter fw-bold text-gray-900 display-6" style={{ letterSpacing: '-1.5px' }}>También te puede interesar</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn btn-primary rounded-circle shadow-premium d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: '#1a56db' }}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <div className="row g-4 mb-4">
                {event.relatedEvents.map((ev, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <EventCard 
                            id={ev.id}
                            title={ev.title}
                            date={ev.date}
                            location={ev.location}
                            thumbnail="/Thumbnail.png"
                            category={idx === 0 ? "MÚSICA" : "TEATRO"}
                        />
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-5">
                <Link href="/eventos" className="btn btn-outline-primary px-5 py-3 rounded-3 border-2 fw-bold shadow-sm transition-all hover-lift" style={{ color: '#1a56d8', borderColor: '#1a56db' }}>
                    Ver todos los eventos
                </Link>
            </div>
        </div>
      </div>

      <ChatbotIcon />
    </div>
  );
}
