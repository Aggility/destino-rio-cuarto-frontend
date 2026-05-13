import React from 'react';
import EventCard from '@/components/server/EventCard';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import { getThumbnail } from '@/utils/image';

/**
 * ExperiencesPage - Destino Río Cuarto
 * Consume datos dinámicos desde el endpoint /event-frameworks
 */
export default async function ExperiencesPage() {
  let apiFrameworks = [];

  try {
    const res = await fetch('https://destbackdev.aggility.io/api/v1/event-frameworks', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      apiFrameworks = all.filter(fw => fw.status?.toLowerCase() !== 'inactive');
    }
  } catch (error) {
    console.error('Error fetching event-frameworks API:', error);
  }

  // Formatear datos para las tarjetas
  const experiences = apiFrameworks.map(fw => {
    // Rango de fechas o descripción de tiempo
    const startDate = fw.start_date || fw.calendars?.[0]?.start_date;
    const endDate = fw.end_date || fw.calendars?.[fw.calendars?.length - 1]?.start_date;
    let timeLabel = 'Todo el día';
    
    if (startDate) {
      const dStart = new Date(startDate);
      if (endDate && endDate !== startDate) {
        const dEnd = new Date(endDate);
        timeLabel = `${dStart.getDate()} al ${dEnd.getDate()} de ${dEnd.toLocaleDateString('es-AR', { month: 'short' })}`;
      } else {
        timeLabel = dStart.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
      }
    }

    return {
      id: fw.id,
      title: fw.title || fw.name || 'Sin título',
      time: timeLabel,
      address: fw.organization?.name || fw.location || 'Río Cuarto',
      schedule: fw.calendars?.[0]?.observations || 'Todos los días',
      description: fw.description 
        ? fw.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 110) + '...'
        : 'Experiencia turística destacada en la ciudad.',
      thumbnail: getThumbnail(fw.cover, fw.gallery),
      lat: fw.organization?.addresses?.[0]?.latitude,
      lng: fw.organization?.addresses?.[0]?.longitude,
    };
  });

  const themeColor = '#ff5a1f';

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      <HeroHome initialSlug="experiencias" />

      {/* FILTERS SECTION (Static for now, as API doesn't support easy filtering yet) */}
      <section className="bg-white border-bottom pt-4 pb-4 pb-md-5 overflow-visible shadow-sm">
        <div className="container-xxl px-lg-5">
          <div className="row g-3 align-items-end">
            
            <div className="col-12 col-md-6 col-xl-5">
              <div className="input-group">
                <span className="input-group-text bg-gray-50 border-end-0 py-2 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control bg-gray-50 border-start-0 border-end-0 py-2 shadow-none font-inter" 
                       placeholder="Buscar experiencias, paseos..." style={{ height: '52px' }} />
              </div>
            </div>

            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Categoría</label>
              <select className="form-select bg-gray-50 py-3 shadow-none border font-inter" style={{ height: '52px' }}>
                <option>Todas</option>
                <option>Cultura</option>
                <option>Naturaleza</option>
                <option>Gastronomía</option>
              </select>
            </div>

            <div className="col-12 col-xl-2 d-none d-md-block">
              <button className="btn w-100 fw-bold border-0 font-inter shadow-premium text-white" style={{ height: '52px', backgroundColor: themeColor }}>
                FILTRAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LISTING GRID SECTION */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}>
              {experiences.length > 0 ? 'Experiencias Destacadas' : 'Cargando experiencias...'}
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
                  basePath="experiencias" // Redirigir a experiencias/[id]
                  typeColor={themeColor}
                  lat={exp.lat}
                  lng={exp.lng}
                />
              </div>
            ))}
          </div>

          {experiences.length === 0 && !apiFrameworks.length && (
            <div className="text-center py-5">
              <p className="text-muted">No se encontraron experiencias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      <ChatbotIcon />
    </div>
  );
}
