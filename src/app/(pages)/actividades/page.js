import React from 'react';
import ActivityCard from '@/components/server/ActivityCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import Link from 'next/link';

/**
 * ActivitiesPage - Destino Río Cuarto
 * Basado en el sistema de diseño de Eventos (Figma 3640:28420 / 3777:8121)
 * Adaptado para el listado de actividades turísticas permanentes.
 */
export default function ActivitiesPage() {
  const activities = [
    { 
        id: 'trencito', 
        title: 'Trencito de Rio Cuarto', 
        time: '15:00 a 19:00 hs', 
        address: 'Salida desde Plaza Roca', 
        schedule: 'Sáb, Dom y Feriados', 
        description: 'Un recorrido histórico por los puntos más emblemáticos del centro de la ciudad.', 
        thumbnail: '/Thumbnail.png' 
    },
    { 
        id: 'circuito-saludable', 
        title: 'Circuito del Bienestar', 
        time: 'Todo el día', 
        address: 'Parque Sarmiento / Costanera', 
        schedule: 'Todos los días', 
        description: 'Recorrido por estaciones de ejercicio al aire libre y senderos de caminata.', 
        thumbnail: '/Thumbnail.png' 
    },
    { 
        id: 'museo-historico', 
        title: 'Museo Histórico Regional', 
        time: '09:00 a 18:00 hs', 
        address: 'Fotheringham 178', 
        schedule: 'Mar a Sáb', 
        description: 'Conocé la historia de los fundadores y la evolución de nuestra región.', 
        thumbnail: '/Thumbnail.png' 
    },
    { 
        id: 'parque-ecologico', 
        title: 'Parque Ecológico Urbano', 
        time: '10:00 a 18:30 hs', 
        address: 'Ruta A005 Km 7.5', 
        schedule: 'Fines de Semana', 
        description: 'Contacto directo con la flora y fauna autóctona en un entorno protegido.', 
        thumbnail: '/Thumbnail.png' 
    }
  ];


  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* GLOBAL HERO SECTION */}
      <HeroHome initialSlug="actividades" />

      {/* 3. FILTERS SECTION */}
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
                       placeholder="Buscar paseos, parques, museos..." style={{ height: '52px' }} />
                <button className="btn btn-primary d-md-none border-0 px-3" style={{ backgroundColor: '#8a38f5' }}>
                   <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Chips Scrollable */}
            <div className="col-12 d-md-none mt-3">
                <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
                    <button className="btn btn-primary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content', backgroundColor: '#8a38f5', borderColor: '#8a38f5' }}>Todos</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Museos</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Parques</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Paseos</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Deportes</button>
                </div>
            </div>

            {/* Desktop Filters */}
            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Categoría</label>
              <select className="form-select bg-gray-50 py-3 shadow-none border font-inter" style={{ height: '52px' }}>
                <option>Todos</option>
                <option>Museos</option>
                <option>Al Aire Libre</option>
                <option>Culturales</option>
              </select>
            </div>

            {/* Desktop Search Button */}
            <div className="col-12 col-xl-2 d-none d-md-block">
              <button className="btn btn-primary w-100 fw-bold border-0 font-inter shadow-premium" style={{ height: '52px', backgroundColor: '#8a38f5' }}>
                FILTRAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LISTING GRID SECTION */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}>
              Explora todas las Experiencias
          </h2>
          
          <div className="row g-4 pb-5">
            {activities.map((act, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <ActivityCard 
                  id={act.id}
                  title={act.title}
                  time={act.time}
                  address={act.address}
                  schedule={act.schedule}
                  description={act.description}
                  thumbnail={act.thumbnail}
                />
              </div>
            ))}
          </div>

          {/* LOAD MORE */}
          <div className="text-center mt-2">
            <button className="btn btn-outline-primary px-5 py-2 rounded-2 shadow-premium fw-bold" style={{ 
               minWidth: '220px',
               height: '56px',
               borderColor: '#8a38f5',
               color: '#8a38f5'
            }}>
              MÁS ACTIVIDADES
            </button>
          </div>
        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
