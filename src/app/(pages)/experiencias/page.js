import React from 'react';
import EventCard from '@/components/server/EventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';

/**
 * ExperiencesPage - Destino Río Cuarto
 * Basado en Figma ID 3640:28636
 * Listado de experiencias turísticas y gastronómicas.
 */
export default function ExperiencesPage() {
  const experiences = [
    { 
        id: 'respira-aire-libre', 
        title: 'Respira Aire Libre', 
        time: 'Todo el día', 
        address: 'Parque Sarmiento', 
        schedule: 'Todos los días', 
        description: 'Disfrutá de la naturaleza en el pulmón verde de la ciudad. Incluye trencito, botes y feria.', 
        thumbnail: '/Thumbnail.png' 
    },
    { 
        id: 'recorrido-7-iglesias', 
        title: 'Recorrido 7 Iglesias', 
        time: '3 a 4 horas', 
        address: 'Puntos varios del microcentro', 
        schedule: 'Semana Santa / Permanente', 
        description: 'Circuito de fe y arquitectura por los templos más emblemáticos de Río Cuarto.', 
        thumbnail: '/Thumbnail.png' 
    },
    { 
        id: 'recorrido-historico-cultural', 
        title: 'Recorrido Histórico Cultural', 
        time: '2 a 3 horas', 
        address: 'Microcentro histórico', 
        schedule: 'Lunes a Sábados', 
        description: 'Conocé el Palacio Municipal, el Teatro y el Museo Histórico en un paseo inolvidable.', 
        thumbnail: '/Thumbnail.png' 
    }
  ];

  // El color asignado para Experiencias es #ff5a1f (Naranja vibrante)
  const themeColor = '#ff5a1f';

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* GLOBAL HERO SECTION */}
      <HeroHome initialSlug="experiencias" />

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
                       placeholder="Buscar gastronomía, paseos rurales..." style={{ height: '52px' }} />
                <button className="btn btn-primary d-md-none border-0 px-3" style={{ backgroundColor: themeColor }}>
                   <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Chips Scrollable */}
            <div className="col-12 d-md-none mt-3">
                <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
                    <button className="btn rounded-pill px-4 btn-sm text-white" style={{ minWidth: 'fit-content', backgroundColor: themeColor, borderColor: themeColor }}>Todas</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Gastronomía</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Cervecerías</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Rural</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" style={{ minWidth: 'fit-content' }}>Nocturno</button>
                </div>
            </div>

            {/* Desktop Filters */}
            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Categoría</label>
              <select className="form-select bg-gray-50 py-3 shadow-none border font-inter" style={{ height: '52px' }}>
                <option>Todas</option>
                <option>Gastronomía</option>
                <option>Cervecerías</option>
                <option>Rural</option>
              </select>
            </div>

            {/* Desktop Search Button */}
            <div className="col-12 col-xl-2 d-none d-md-block">
              <button className="btn w-100 fw-bold border-0 font-inter shadow-premium text-white" style={{ height: '52px', backgroundColor: themeColor }}>
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
              Todas las Experiencias
          </h2>
          
          <div className="row g-4 pb-5">
            {experiences.map((exp, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <EventCard 
                  id={exp.id}
                  title={exp.title}
                  date={exp.time}
                  location={exp.address}
                  category={exp.schedule}
                  description={exp.description}
                  thumbnail={exp.thumbnail}
                  basePath="experiencias"
                  typeColor={themeColor}
                />
              </div>
            ))}
          </div>

          {/* LOAD MORE */}
          <div className="text-center mt-2">
            <button className="btn px-5 py-2 rounded-2 shadow-premium fw-bold bg-white" style={{ 
               minWidth: '220px',
               height: '56px',
               borderColor: themeColor,
               color: themeColor
            }}>
              MÁS EXPERIENCIAS
            </button>
          </div>
        </div>
      </section>

      <ChatbotIcon />

    </div>
  );
}
