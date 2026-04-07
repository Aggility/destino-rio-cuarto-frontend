import React from 'react';
import EventCard from '@/components/server/EventCard';
import Link from 'next/link';

/**
 * EventsListing - Destino Río Cuarto
 * Basado en Figma ID 3640:28420 (Vistas/Eventos V2)
 * Implementa la grilla de búsqueda y listado dinámico.
 * Compatible con Server Components (sin styled-jsx).
 */
export default function EventsPage() {
  const events = [
    { id: 1, title: 'Ivan Noble', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con “canciones traspapeladas”' },
    { id: 2, title: 'Ulises Bueno', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable. Llega el Aniversario de Opus y lo festejamos a lo grande!' },
    { id: 3, title: 'Negociemos', date: 'vie, 27 feb, 21:00', location: 'Teatro Municipal', description: 'Rodolfo Ranni y Marta González protagonizan esta comedia de reencuentro.' },
    { id: 4, title: 'Tardecita Musicales', date: 'dom, 11 ene', location: 'Plaza Central - Holmberg', description: 'Grupo invitado de folklore a la gran Copla Bar. ¡Los esperamos! Gran noche de música y baile.' },
    { id: 5, title: 'Ivan Noble (Repise)', date: 'jue, 12 mar, 21:00', location: 'Elvis RockandBar', description: 'Llega Iván Noble a la esquina de Elvis con “canciones traspapeladas”' },
    { id: 6, title: 'Ulises Bueno (Repise)', date: 'lun, 6 ene, 00:00', location: 'Opus Costanera', description: 'Regresa Ulises Bueno para una noche inolvidable.' }
  ];

  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-listing-page min-vh-100">
      
      {/* 1. TOP INFO BAR — Figma ID 3410:5609 */}
      <div className="top-info-bar">
        <div className="container-xxl px-lg-5 text-center d-flex align-items-center justify-content-center">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', backgroundColor: '#1c64f2' }}>
            <i className="bi bi-sparkles text-white" style={{ fontSize: '18px' }}></i>
          </div>
          <span className="font-inter">Este es el lugar donde encontrás cosas para hacer en Rio Cuarto</span>
          <i className="bi bi-chevron-down ms-2 opacity-50"></i>
        </div>
      </div>

      {/* 2. HERO TITLE SECTION — Figma ID 3640:28424 */}
      <section className="bg-white py-5">
        <div className="container-xxl px-lg-5">
          <div className="max-w-768px">
            <h1 className="display-4 fw-medium text-gray-900 tracking-tight font-inter" style={{ fontSize: '60px', letterSpacing: '-1.8px' }}>
              Eventos en Rio Cuarto
            </h1>
          </div>
        </div>
      </section>

      {/* 3. FILTERS SECTION — Figma ID 3640:28428 */}
      <section className="bg-white border-bottom pb-5">
        <div className="container-xxl px-lg-5">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-4">
            
            {/* Search and Filters Group */}
            <div className="d-flex flex-wrap gap-3 align-items-end flex-grow-1" style={{ maxWidth: '1000px' }}>
              
              {/* Keyword Input */}
              <div className="flex-grow-1" style={{ maxWidth: '512px' }}>
                <div className="input-group">
                  <span className="input-group-text bg-light-gray border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control bg-light-gray border-start-0 py-2" placeholder="Dread Mar i" />
                  <span className="input-group-text bg-light-gray">
                    <i className="bi bi-x-circle text-muted"></i>
                  </span>
                </div>
              </div>

              {/* Date Filter */}
              <div style={{ width: '237px' }}>
                <label className="form-label font-inter fw-medium text-gray-900 small mb-1">¿Cuando?</label>
                <div className="input-group">
                  <select className="form-select bg-light-gray py-2 shadow-none">
                    <option>Esta semana</option>
                    <option>Hoy</option>
                    <option>Este Mes</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div style={{ width: '237px' }}>
                <label className="form-label font-inter fw-medium text-gray-900 small mb-1">Tipo</label>
                <div className="input-group">
                  <select className="form-select bg-light-gray py-2 shadow-none">
                    <option>Todos</option>
                    <option>Música</option>
                    <option>Teatro</option>
                  </select>
                </div>
              </div>

              {/* Submit Search */}
              <button className="btn btn-primary px-4 fw-medium border-0" style={{ height: '52px', minWidth: '119px', backgroundColor: '#1a56db' }}>
                Buscar
              </button>

            </div>

            {/* Extra CTA (Calendar) */}
            <div className="ms-auto align-self-end">
              <button className="btn btn-outline-primary px-4 fw-medium shadow-premium border-2" style={{ height: '52px', color: '#1a56d8', borderColor: '#1a56d8' }}>
                Calendario de Eventos
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. LISTING GRID SECTION — Figma ID 3640:28468 */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5 pt-4">
          
          <div className="listing-grid pb-5">
            {events.map((event, idx) => (
              <div key={idx} className="animate-hover-lift">
                <EventCard 
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  thumbnail={localThumbnail}
                  category={event.id % 2 === 0 ? "FESTIVAL" : "TEATRO"}
                />
              </div>
            ))}
          </div>

          {/* LOAD MORE — Figma ID 3640:28482 */}
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary px-5 py-2 rounded-2 shadow-premium fw-medium" style={{ 
               minWidth: '178px',
               height: '52px',
               borderColor: '#1a56db',
               color: '#1a56d8'
            }}>
              Ver mas resultados
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
