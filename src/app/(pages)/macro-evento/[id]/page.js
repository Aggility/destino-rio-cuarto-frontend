import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import MacroEventAgenda from '@/components/client/MacroEventAgenda';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';

/**
 * MacroEventoPage - Detalle de Gran Evento / Festival
 * Basado en los diseños de Macro Eventos (Day-by-Day Agenda)
 */
export default async function MacroEventoPage({ params }) {
  const { id } = await params;

  // En un entorno real, buscaríamos el framework por ID
  // const resFramework = await fetch(`http://destbackdev.aggility.io/api/v1/event-frameworks/${id}`);
  // const resEvents = await fetch(`http://destbackdev.aggility.io/api/v1/events?framework_id=${id}`);
  
  const festival = {
    id: id,
    title: "7° Festival Otoño Polifónico",
    dateRange: "Miércoles 11 al domingo 15 de marzo",
    description: "El festival más importante de música clásica y polifónica de la región regresa al Teatro Municipal y espacios públicos de Río Cuarto. Una semana para disfrutar de lo mejor del arte sonoro.",
    thumbnail: "/oto-polifono.webp",
    location: "Teatro Municipal y sedes diversas"
  };

  // Mock de eventos agrupados por día
  const agenda = [
    {
      day: "Mier 11",
      fullDate: "Miércoles 11 de Marzo",
      events: [
        { id: 101, title: "Gala de Apertura", time: "20:00hs", location: "Teatro Municipal", thumbnail: "/Thumbnail.png" },
        { id: 102, title: "Concerto bajo las estrellas", time: "22:30hs", location: "Plaza Olmos", thumbnail: "/Thumbnail.png" }
      ]
    },
    {
      day: "Jue 12",
      fullDate: "Jueves 12 de Marzo",
      events: [
        { id: 201, title: "Coros Infantiles", time: "18:00hs", location: "Centro Cultural Andino", thumbnail: "/Thumbnail.png" },
        { id: 202, title: "Orquesta de Cámara", time: "21:00hs", location: "Teatro Municipal", thumbnail: "/Thumbnail.png" }
      ]
    },
    {
      day: "Vie 13",
      fullDate: "Viernes 13 de Marzo",
      events: [
        { id: 301, title: "Noche de Jazz & Polifonía", time: "21:00hs", location: "Teatro Municipal", thumbnail: "/Thumbnail.png" }
      ]
    },
    {
        day: "Sab 14",
        fullDate: "Sábado 14 de Marzo",
        events: [
          { id: 401, title: "Gran Final Polifónico", time: "21:00hs", location: "Teatro Municipal", thumbnail: "/Thumbnail.png" }
        ]
      }
  ];

  return (
    <div className="bg-white min-vh-100">
      
      {/* 1. HERO FESTIVAL - Fondo Violeta Centrado */}
      <section className="bg-primary text-white py-5 text-center" style={{ backgroundColor: '#8a38f5', paddingBottom: '80px !important' }}>
        <div className="container py-4">
            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1.5px' }}>{festival.title}</h1>
            <p className="lead px-md-5 mb-4 mx-auto" style={{ maxWidth: '700px', fontSize: '18px', opacity: '0.9' }}>
                Una noche para disfrutar al aire libre con patio gastronómico, <br className="d-none d-md-block" /> feria emprendedora y música en vivo.
            </p>
            <div className="d-inline-block bg-white text-primary fw-bold px-3 py-1 rounded-2 shadow-sm small mb-2" style={{ color: '#8a38f5' }}>
                4 FECHAS
            </div>
        </div>
      </section>

      {/* 2. DATE BAR & MAIN IMAGE */}
      <section className="position-relative" style={{ marginTop: '-40px' }}>
        <div className="container-fluid px-0">
             {/* Black Date Bar */}
            <div className="bg-dark text-white text-center py-2 fw-bold w-100 mx-auto" style={{ maxWidth: '900px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                Del miércoles 11/03 al domingo 15/03
            </div>
            
            {/* Featured Image with blur edges style */}
            <div className="position-relative overflow-hidden shadow-lg mx-auto" style={{ maxWidth: '900px', height: '450px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                <div className="position-absolute w-100 h-100" style={{ 
                    backgroundImage: `url('${festival.thumbnail}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                    zIndex: 0
                }}></div>
                <img 
                    src={festival.thumbnail} 
                    alt={festival.title} 
                    className="position-relative w-100 h-100 object-contain z-1"
                />
            </div>
        </div>
      </section>

      {/* 3. INFO SECTION BELOW IMAGE */}
      <section className="py-5">
        <div className="container-xxl px-lg-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-9">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
                    <div className="flex-grow-1">
                        <h2 className="h4 fw-bold text-gray-900 mb-3">Info</h2>
                        <p className="font-inter text-gray-600 mb-2" style={{ lineHeight: '1.6' }}>
                           Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande! Este 07 de marzo, viví una noche única con el show mas esperado.
                        </p>
                        <button className="btn btn-link p-0 text-muted small text-decoration-underline fw-medium">Ver más</button>
                    </div>
                    <div>
                        <button className="btn btn-white shadow-premium d-flex align-items-center gap-2 px-4 py-2 rounded-3 border">
                            <span className="font-inter fw-medium small">Compartir</span>
                            <i className="bi bi-share"></i>
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGENDA SECTION (Cronograma) — Mantenemos la lógica de pestañas abajo */}
      <div className="container-xxl px-lg-5 py-4">
        <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
                <hr className="mb-5 opacity-10" />

            {/* Agenda Logic en Client Component */}
            <MacroEventAgenda initialAgenda={agenda} />

            <div className="row g-4 mt-5">
                {/* Sedes */}
                <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
                        <h3 className="h5 fw-bold mb-4">Sedes del Festival</h3>
                        <div className="d-flex flex-column gap-3">
                            <SidebarListCard 
                                title="Teatro Municipal"
                                subtitle="Constitución 945"
                                badge="SEDE CENTRAL"
                                type="location"
                                thumbnail="/Thumbnail.png"
                            />
                            <SidebarListCard 
                                title="Plaza Olmos"
                                subtitle="S. M. de Olmos 500"
                                badge="AIRE LIBRE"
                                type="location"
                                thumbnail="/Thumbnail.png"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Servicios */}
                <div className="col-12 col-md-6">
                    <div className="bg-primary text-white p-4 rounded-4 shadow-premium text-center d-flex flex-column justify-content-center h-100" style={{ backgroundColor: '#1a56db' }}>
                        <h4 className="fw-bold mb-2">¿Vienes de afuera?</h4>
                        <p className="small opacity-90 mb-4 px-lg-5">Encontrá hoteles y restaurantes recomendados cerca de las sedes.</p>
                        <Link href="/servicios" className="btn btn-outline-light w-100 rounded-2 fw-bold py-3 mt-auto" style={{ borderWidth: '2px' }}>
                            VER SERVICIOS
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <ChatbotIcon />

    </div>
  );
}
