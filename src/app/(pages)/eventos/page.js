import React from 'react';
import EventCard from '@/components/server/EventCard';
import MacroEventCard from '@/components/server/MacroEventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import Link from 'next/link';

/**
 * EventsPage - Destino Río Cuarto
 * Diseño Píxel Perfect basado en Figma ID 3640:28420 / 3777:8121 (Mobile)
 */
export default function EventsPage() {
  const events = [
    { id: 1, title: 'Ivan Noble', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con “canciones traspapeladas”' },
    { id: 2, title: 'Ulises Bueno', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande!' },
    { id: 3, title: 'Negociemos', date: 'vie, 27 feb, 21:00', location: 'Teatro Municipal', description: 'Rodolfo Ranni y Marta González protagonizan esta comedia de reencuentro.' },
    { id: 4, title: 'Tardecita Musicales en Holmberg', date: 'Dom 11 de Ene', location: 'Plaza Central - Holmberg', description: 'Grupo invitado de folklore a la gran Copla Bar. ¡Los esperamos! Gran noche de música y baile.' },
    { id: 5, title: 'Ivan Noble (Segunda Función)', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con “canciones traspapeladas”' },
    { id: 6, title: 'Ulises Bueno (Aniversario)', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable.' }
  ];

  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* 2. HERO SECTION REEMPLAZADA POR LA GLOBAL */}
      <HeroHome initialSlug="eventos" />

      {/* 3. FILTERS SECTION — Optimizado para Mobile */}
      <section className="bg-white border-bottom pt-4 pb-4 pb-md-5 overflow-visible shadow-sm">
        <div className="container-xxl px-lg-5">
          <div className="row g-3 align-items-end">
            
            {/* Search Input */}
            <div className="col-12 col-md-6 col-xl-5">
              <div className="input-group">
                <span className="input-group-text bg-gray-50 border-end-0 py-2 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control bg-gray-50 border-start-0 border-end-0 py-2 shadow-none font-inter" 
                       placeholder="Buscar un evento, artista, teatro..." style={{ height: '52px' }} />
                <button className="btn btn-primary d-md-none border-0 px-3" style={{ backgroundColor: '#1a56db' }}>
                   <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Chips Scrollable (Basado en Figma Mobile: node 3640:22026) */}
            <div className="col-12 d-md-none mt-3">
                <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
                    <button className="btn btn-primary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Todos</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Música</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Teatro</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Enero</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Febrero</button>
                </div>
            </div>

            {/* Desktop-only select filters */}
            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Cuándo?</label>
              <select className="form-select bg-gray-50 py-3 shadow-none border font-inter" style={{ height: '52px' }}>
                <option>Esta semana</option>
                <option>Hoy mismo</option>
                <option>Este mes</option>
              </select>
            </div>

            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Categoría</label>
              <select className="form-select bg-gray-50 py-3 shadow-none border font-inter" style={{ height: '52px' }}>
                <option>Todos</option>
                <option>Música</option>
                <option>Teatro</option>
                <option>Festivales</option>
              </select>
            </div>

            {/* Desktop Search Button */}
            <div className="col-12 col-xl-2 d-none d-md-block">
              <button className="btn btn-primary w-100 fw-bold border-0 font-inter shadow-premium" style={{ height: '52px', backgroundColor: '#1a56db' }}>
                FILTRAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED EVENTS */}
      <section className="py-4 py-md-5 bg-white border-bottom">
        <div className="container-xxl px-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
              <h2 className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-1px' }}>
                  Eventos Destacados
              </h2>
              <Link href="/calendario" className="btn btn-link p-0 text-primary fw-bold text-decoration-none small d-none d-md-block">Ver Calendario Completo</Link>
          </div>
          <div className="d-flex flex-column gap-3">
            <MacroEventCard 
              title="7° Festival Otoño Polifónico"
              date="Miércoles 11 al domingo 15 de marzo"
              time="20:00hs"
              location="Teatro Municipal de Río Cuarto"
              thumbnail={localThumbnail}
            />
          </div>
        </div>
      </section>

      {/* 5. LISTING GRID SECTION — Figma ID 3640:28468 */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}>
              Descubrí más Eventos
          </h2>
          
          <div className="listing-grid pb-5">
            {events.map((event, idx) => (
              <EventCard 
                key={idx}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                description={event.description}
                thumbnail={localThumbnail}
                category={event.id % 2 === 0 ? "POP" : "KIDS"}
                typeColor={event.id % 2 === 0 ? "#1a56db" : "#f54286"}
              />
            ))}
          </div>

          {/* LOAD MORE */}
          <div className="text-center mt-2">
            <button className="btn btn-outline-primary px-5 py-2 rounded-2 shadow-premium fw-bold" style={{ 
               minWidth: '220px',
               height: '56px',
               borderColor: '#1a56db',
               color: '#1a56d8'
            }}>
              CARGAR MÁS EVENTOS
            </button>
          </div>
        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
