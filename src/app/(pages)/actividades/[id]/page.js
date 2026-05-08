import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventCard from '@/components/server/EventCard';
import SidebarListCard from '@/components/server/SidebarListCard';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';

/**
 * ActivityDetailPage - Destino Río Cuarto
 * Consume datos reales del endpoint /proposals/:id
 */
export default async function ActivityDetailPage({ params }) {
  const { id } = await params;

  // 1. Obtener la actividad por ID
  let activityData = null;
  try {
    const res = await fetch(`https://destbackdev.aggility.io/api/v1/proposals/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      activityData = json.data || json;
    }
  } catch (err) {
    console.error('Error fetching proposal:', err);
  }

  // 2. Obtener otras actividades para el sidebar (excluir la actual)
  let relatedActivities = [];
  try {
    const res = await fetch(`https://destbackdev.aggility.io/api/v1/proposals?per_page=10`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const all = Array.isArray(json) ? json : (json.data || []);
      relatedActivities = all
        .filter(p => p.status?.toLowerCase() !== 'inactive' && String(p.id) !== String(id))
        .slice(0, 3);
    }
  } catch (err) {
    console.error('Error fetching related proposals:', err);
  }

  // 3. Fallback si no se encontró la actividad
  if (!activityData) {
    return (
      <div className="bg-white min-vh-100 pb-5 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
          <h2 className="font-inter fw-bold text-gray-800">Actividad no encontrada</h2>
          <p className="text-muted">Es posible que haya sido removida o que el enlace no sea válido.</p>
          <Link href="/actividades" className="btn btn-primary mt-3 rounded-3" style={{ backgroundColor: '#8a38f5', border: 'none' }}>
            Ver todas las actividades
          </Link>
        </div>
        <ChatbotIcon />
      </div>
    );
  }

  // 4. Mapear datos de la API
  const categoryColor = '#8a38f5';
  const activity = {
    id: activityData.id,
    title: activityData.title || 'Sin título',
    category: activityData.categories?.[0]?.name?.trim() || 'Actividad',
    categoryColor,
    description: activityData.description
      ? [activityData.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')]
      : ['Sin descripción disponible.'],
    details: {
      horarios: activityData.tags?.find(t => t.key?.includes('horario'))?.name || 'Ver detalle',
      duracion: activityData.tags?.find(t => t.key?.includes('duracion'))?.name || 'Variable',
      precio: activityData.tags?.find(t => t.key?.includes('precio'))?.name || 'Consultar',
    },
    location: {
      name: activityData.organization?.name || 'Río Cuarto',
      address: activityData.organization?.addresses?.[0]?.address || 'Río Cuarto, Córdoba',
      city: 'Río Cuarto, Córdoba',
      lat: activityData.organization?.addresses?.[0]?.latitude,
      lng: activityData.organization?.addresses?.[0]?.longitude,
    },
    thumbnail: activityData.cover?.large || activityData.cover?.medium || activityData.gallery?.[0]?.large || '/Thumbnail.png',
    gallery: activityData.gallery || [],
    tags: activityData.tags || [],
  };

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — 940x460 en Desktop */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" style={{ height: '460px' }}>
        {/* Fondo desenfocado */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
            <img 
              src={activity.thumbnail} 
              alt="" 
              className="w-100 h-100"
              style={{ objectFit: 'cover', filter: 'blur(20px)', opacity: 0.5, transform: 'scale(1.1)' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>

        {/* Imagen 940x460 */}
        <div className="container-xxl px-0 px-lg-5 h-100 position-relative z-1 d-flex align-items-center justify-content-center">
            <div className="position-relative shadow-lg overflow-hidden d-none d-md-block" style={{ width: '100%', maxWidth: '940px', height: '460px' }}>
                <img 
                  src={activity.thumbnail} 
                  alt={activity.title} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
            </div>
            {/* Mobile */}
            <img 
              src={activity.thumbnail} 
              alt={activity.title} 
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
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4" style={{ letterSpacing: '-1px' }}>
                        {activity.title}
                    </h1>

                    {activity.location?.lat && (
                      <div className="mb-4">
                          <EventDistanceBadge eventLat={activity.location.lat} eventLng={activity.location.lng} type="activity" />
                      </div>
                    )}
                </div>

                {/* Quick Info Bar */}
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
                    {activity.details.precio && activity.details.precio !== 'Consultar' && (
                      <div className="d-flex align-items-center gap-3 border-md-start ps-md-4">
                          <i className="bi bi-tag text-primary fs-5"></i>
                          <div>
                              <span className="text-muted d-block small">Precio</span>
                              <span className="fw-bold text-gray-900">{activity.details.precio}</span>
                          </div>
                      </div>
                    )}
                </div>

                {/* Tags */}
                {activity.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-5">
                    {activity.tags.map((tag, i) => (
                      <span key={i} className="badge rounded-pill px-3 py-2 font-inter fw-medium"
                            style={{ backgroundColor: `${categoryColor}15`, color: categoryColor, border: `1px solid ${categoryColor}40` }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="activity-info mb-5">
                    <h2 className="h4 fw-bold mb-4 text-gray-800">Sobre la actividad</h2>
                    {activity.description.map((p, i) => (
                        <p key={i} className="text-gray-600 fs-5 mb-4 leading-relaxed">{p}</p>
                    ))}
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
              <aside className="d-flex flex-column gap-4">
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                      <h3 className="h5 fw-bold mb-4 text-gray-900">Actividades Similares</h3>
                      <div className="d-flex flex-column gap-3">
                          {relatedActivities.map((rel) => (
                            <SidebarListCard 
                              key={rel.id}
                              title={rel.title}
                              subtitle={rel.categories?.[0]?.name?.trim() || 'Actividad'}
                              badge={rel.tags?.[0]?.name?.toUpperCase() || 'ACTIVIDAD'}
                              type="activity"
                              thumbnail={rel.cover?.medium || rel.cover?.small || '/Thumbnail.png'}
                              href={`/actividades/${rel.id}`}
                            />
                          ))}
                      </div>
                      <Link href="/actividades" className="btn w-100 mt-4 py-2 fw-bold text-decoration-none text-white" 
                            style={{ backgroundColor: categoryColor }}>
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
