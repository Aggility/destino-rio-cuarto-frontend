import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import { getThumbnail } from '@/utils/image';

/**
 * ExperienceDetailPage - Destino Río Cuarto
 * Formato unificado con Actividades, conectado a /event-frameworks
 */
export default async function ExperienceDetailPage({ params }) {
  const { id } = await params;
  const themeColor = '#ff5a1f';

  // 1. Obtener la experiencia por ID
  let experienceData = null;
  try {
    const res = await fetch(`https://destbackdev.aggility.io/api/v1/event-frameworks/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      experienceData = json.data || json;
    }
  } catch (err) {
    console.error('Error fetching experience:', err);
  }

  // 2. Obtener otras experiencias para el sidebar
  let relatedExperiences = [];
  try {
    const res = await fetch(`https://destbackdev.aggility.io/api/v1/event-frameworks`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const all = Array.isArray(json) ? json : (json.data || []);
      relatedExperiences = all
        .filter(p => p.status?.toLowerCase() !== 'inactive' && String(p.id) !== String(id))
        .slice(0, 3);
    }
  } catch (err) {
    console.error('Error fetching related experiences:', err);
  }

  // 3. Fallback si no se encontró
  if (!experienceData) {
    return (
      <div className="bg-white min-vh-100 pb-5 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-compass fs-1 text-muted d-block mb-3"></i>
          <h2 className="font-inter fw-bold text-gray-800">Experiencia no encontrada</h2>
          <p className="text-muted">Es posible que haya sido removida o que el enlace no sea válido.</p>
          <Link href="/experiencias" className="btn btn-primary mt-3 rounded-3" style={{ backgroundColor: themeColor, border: 'none' }}>
            Ver todas las experiencias
          </Link>
        </div>
        <ChatbotIcon />
      </div>
    );
  }

  // 4. Mapear datos
  const experience = {
    id: experienceData.id,
    title: experienceData.title || experienceData.name || 'Sin título',
    category: experienceData.categories?.[0]?.name?.trim() || 'Experiencia',
    description: experienceData.description
      ? [experienceData.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')]
      : ['Sin descripción disponible.'],
    details: {
      horarios: experienceData.calendars?.[0]?.observations || 'Todos los días',
      duracion: 'Consultar',
      precio: 'Consultar',
    },
    location: {
      name: experienceData.organization?.name || experienceData.location || 'Río Cuarto',
      address: experienceData.organization?.addresses?.[0]?.address || 'Río Cuarto, Córdoba',
      lat: experienceData.organization?.addresses?.[0]?.latitude,
      lng: experienceData.organization?.addresses?.[0]?.longitude,
    },
    thumbnail: getThumbnail(experienceData.cover, experienceData.gallery),
    tags: experienceData.tags || [],
  };

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" style={{ height: '460px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
            <img 
              src={experience.thumbnail} 
              alt="" 
              className="w-100 h-100"
              style={{ objectFit: 'cover', filter: 'blur(20px)', opacity: 0.5, transform: 'scale(1.1)' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>

        <div className="container-xxl px-0 px-lg-5 h-100 position-relative z-1 d-flex align-items-center justify-content-center">
            <div className="position-relative shadow-lg overflow-hidden d-none d-md-block" style={{ width: '100%', maxWidth: '940px', height: '460px' }}>
                <img 
                  src={experience.thumbnail} 
                  alt={experience.title} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
            </div>
            <img 
              src={experience.thumbnail} 
              alt={experience.title} 
              className="d-block d-md-none w-100 h-100"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <div className="container-xxl px-lg-5 mt-n4 position-relative z-1 mb-5">
        <div className="row g-4">
          
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100">
                
                <div className="bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-2 p-1 d-flex align-items-center justify-content-center" 
                             style={{ backgroundColor: themeColor, width: '32px', height: '32px' }}>
                            <i className="bi bi-compass-fill text-white small"></i>
                        </div>
                        <span className="font-inter fw-semibold" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                            {experience.category}
                        </span>
                    </div>
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4" style={{ letterSpacing: '-1px' }}>
                        {experience.title}
                    </h1>

                    {experience.location?.lat && (
                      <div className="mb-4">
                          <EventDistanceBadge eventLat={experience.location.lat} eventLng={experience.location.lng} type="experience" />
                      </div>
                    )}
                </div>

                <div className="d-flex flex-column flex-md-row gap-3 mb-5 py-4 border-top border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-calendar-event text-primary fs-5" style={{ color: themeColor }}></i>
                        <div>
                            <span className="text-muted d-block small">Disponibilidad</span>
                            <span className="fw-bold text-gray-900">{experience.details.horarios}</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 border-md-start ps-md-4">
                        <i className="bi bi-geo-alt text-primary fs-5" style={{ color: themeColor }}></i>
                        <div>
                            <span className="text-muted d-block small">Ubicación</span>
                            <span className="fw-bold text-gray-900">{experience.location.name}</span>
                        </div>
                    </div>
                </div>

                <div className="activity-info mb-5">
                    <h2 className="h4 fw-bold mb-4 text-gray-800">Sobre la experiencia</h2>
                    {experience.description.map((p, i) => (
                        <p key={i} className="text-gray-600 fs-5 mb-4 leading-relaxed">{p}</p>
                    ))}
                </div>

                <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>Ubicación y Contacto</h2>
                    <ContactAndLocationWidget 
                        service={{
                            name: experience.location.name,
                            address: experience.location.address,
                            lat: experience.location.lat,
                            lng: experience.location.lng,
                            phones: experienceData?.phones || []
                        }} 
                        type="experiencia" 
                    />
                </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
              <aside className="d-flex flex-column gap-4">
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                      <h3 className="h5 fw-bold mb-4 text-gray-900">Más Experiencias</h3>
                      <div className="d-flex flex-column gap-3">
                          {relatedExperiences.map((rel) => (
                            <SidebarListCard 
                              key={rel.id}
                              title={rel.title}
                              subtitle={rel.categories?.[0]?.name?.trim() || 'Experiencia'}
                              badge="RECOMENDADO"
                              type="experience"
                              thumbnail={getThumbnail(rel.cover, rel.gallery)}
                              href={`/experiencias/${rel.id}`}
                            />
                          ))}
                      </div>
                      <Link href="/experiencias" className="btn w-100 mt-4 py-2 fw-bold text-decoration-none text-white" 
                            style={{ backgroundColor: themeColor }}>
                          VER TODAS LAS EXPERIENCIAS
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
