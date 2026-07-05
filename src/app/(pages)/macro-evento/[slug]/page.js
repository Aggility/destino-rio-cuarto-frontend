import React from 'react';
import Link from 'next/link';
import MacroEventAgenda from '@/components/client/MacroEventAgenda';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';
import GoogleMapViewer from '@/components/client/GoogleMapViewer';
import { getThumbnail } from '@/utils/image';
import { parseLocalDate } from '@/utils/date';

/**
 * MacroEventoPage - Detalle de Gran Evento / Festival / Experiencia
 * Basado en los diseños de Macro Eventos (Day-by-Day Agenda)
 */
export default async function MacroEventoPage({ params }) {
  const { slug } = await params;
  let frameworkData = null;
  const isNumeric = /^\d+$/.test(slug);

  if (isNumeric) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        frameworkData = json.data || json;
      }
    } catch (err) {
      console.error('Error fetching event-framework by ID:', err);
    }
  }

  if (!frameworkData) {
    try {
      // La API no soporta ?slug= como filtro, traemos el listado completo y filtramos localmente
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks?per_page=200`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        const found = list.find(f => f.slug === slug);
        if (found) {
          // Obtener el objeto completo por su ID para traer la relación "events"
          const resIndividual = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-frameworks/${found.id}`, { cache: 'no-store' });
          if (resIndividual.ok) {
            const jsonIndividual = await resIndividual.json();
            frameworkData = jsonIndividual.data || jsonIndividual;
          } else {
            frameworkData = found;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching event-framework by slug:', err);
    }
  }

  if (!frameworkData) {
    return (
      <div className="bg-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="fw-bold">Contenido no encontrado</h2>
          <Link href="/experiencias" className="btn btn-primary mt-3">Volver a Experiencias</Link>
        </div>
      </div>
    );
  }

  // Mapear datos
  const festival = {
    id: frameworkData.id,
    title: frameworkData.title || frameworkData.name || "Sin título",
    dateRange: (frameworkData.start_date && frameworkData.end_date)
      ? (() => {
          const s = parseLocalDate(frameworkData.start_date);
          const e = parseLocalDate(frameworkData.end_date);
          return s && e
            ? `Del ${s.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} al ${e.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : 'Fecha a confirmar';
        })()
      : "Fecha a confirmar",
    description: frameworkData.description?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') || "Sin descripción disponible.",
    descriptionHtml: frameworkData.description || "<p>Sin descripción disponible.</p>",
    excerpt: frameworkData.excerpt || frameworkData.short_description || "",
    events: frameworkData.events || [],
    thumbnail: getThumbnail(frameworkData.cover, frameworkData.gallery),
    location: frameworkData.organization?.name || frameworkData.location || "Río Cuarto",
    address: frameworkData.organization?.addresses?.[0]?.address || "Río Cuarto, Córdoba",
    lat: frameworkData.organization?.addresses?.[0]?.latitude,
    lng: frameworkData.organization?.addresses?.[0]?.longitude,
  };

  // Agenda dinámica basada en los calendarios del framework
  const agenda = (frameworkData.calendars || []).map((cal, idx) => {
    const d = parseLocalDate(cal.start_date) || new Date();
    return {
      day: d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }),
      fullDate: d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
      events: [
        {
          id: `${frameworkData.id}-event-${idx}`,
          title: cal.observations || festival.title,
          time: cal.start_time ? cal.start_time.substring(0, 5) + ' hs' : '',
          location: festival.location,
          thumbnail: festival.thumbnail,
        }
      ]
    };
  });

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO FESTIVAL (PORTADA) */}
      <section className="position-relative overflow-hidden" style={{ minHeight: '450px', backgroundColor: '#1a1a1a' }}>
        <img 
            src={festival.thumbnail || '/no-img.webp'} 
            alt={festival.title} 
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
            }}
        />
        
        {/* Overlay degradado */}
        <div
            style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 40%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.35) 100%)',
            }}
        />

        {/* Contenido centrado */}
        <div className="position-absolute start-0 end-0 p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ zIndex: 2, inset: 0 }}>
            <h1
                className="font-inter fw-bold text-white mb-3 mt-4 mt-md-0"
                style={{
                  fontSize: 'clamp(42px, 7vw, 72px)',
                  lineHeight: '1.1',
                  letterSpacing: '-1px',
                  textShadow: '0 4px 20px rgba(0,0,0,0.7)',
                  maxWidth: '900px',
                }}
            >
                {festival.title}
            </h1>
            
            {festival.dateRange !== "Fecha a confirmar" && (
                <div className="badge rounded-pill mt-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', padding: '10px 24px', fontSize: '15px', fontWeight: '500', textShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <i className="bi bi-calendar3 me-2"></i>
                    {festival.dateRange}
                </div>
            )}
        </div>
      </section>

      {/* 3. INFO SECTION */}
      <section className="py-5">
        <div className="container-xxl px-lg-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-9">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
                    <div className="flex-grow-1">
                        <h2 className="h4 fw-bold text-gray-900 mb-3">Información General</h2>
                        
                        {festival.excerpt && (
                           <p className="font-inter text-gray-700 fw-medium mb-3 fs-5" style={{ lineHeight: '1.5' }}>
                              {festival.excerpt}
                           </p>
                        )}
                        
                        <div 
                           className="font-inter text-gray-600 mb-4 fs-5" 
                           style={{ lineHeight: '1.6' }}
                           dangerouslySetInnerHTML={{ __html: festival.descriptionHtml }}
                        />
                        
                        <div className="d-flex align-items-center gap-2 text-muted">
                           <i className="bi bi-geo-alt-fill text-primary"></i>
                           <span className="small">{festival.location} - {festival.address}</span>
                        </div>

                        {/* EVENTOS DISPONIBLES */}
                        {festival.events.length > 0 && (
                          <div className="mt-5 pt-4 border-top">
                            <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>
                              Eventos Disponibles
                            </h2>
                            <div className="d-flex flex-column gap-4">
                              {festival.events.map((evt) => {
                                const lat = parseFloat(evt.organization?.addresses?.[0]?.latitude);
                                const lng = parseFloat(evt.organization?.addresses?.[0]?.longitude);
                                const hasCoords = !isNaN(lat) && !isNaN(lng);
                                const thumb = getThumbnail(evt.cover, evt.gallery);

                                return (
                                  <div key={evt.id} className="bg-light-subtle rounded-4 p-4 border border-light-subtle shadow-sm position-relative" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                    <div className="row g-3 align-items-center">
                                      {thumb && (
                                        <div className="col-12 col-md-3">
                                          <img
                                            src={thumb}
                                            alt={evt.title || evt.name}
                                            className="img-fluid rounded-3 w-100"
                                            style={{ maxHeight: '140px', objectFit: 'cover' }}
                                          />
                                        </div>
                                      )}
                                      <div className={thumb ? "col-12 col-md-9" : "col-12"}>
                                        <span className="badge font-inter fw-semibold mb-2" style={{ backgroundColor: '#fed7e2', color: '#f54286' }}>Evento</span>
                                        <h3 className="font-inter fw-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>
                                          {evt.title || evt.name}
                                        </h3>
                                        <p 
                                          className="text-muted small mb-0 font-inter"
                                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                        >
                                          {evt.excerpt || evt.short_description || evt.description?.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                        <div className="d-flex align-items-center gap-2 mt-3">
                                          {(evt.slug || evt.id) && (
                                            <Link 
                                              href={evt.slug ? `/eventos/${evt.slug}?id=${evt.id}` : `/eventos/${evt.id}`}
                                              className="btn shadow-premium d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all hover-lift text-decoration-none stretched-link"
                                              style={{ backgroundColor: '#f54286', color: '#fff' }}
                                            >
                                              <span className="font-inter fw-semibold small d-none d-md-inline">Ver más</span>
                                              <i className="bi bi-info-circle-fill"></i>
                                            </Link>
                                          )}
                                          {hasCoords && (
                                            <a 
                                              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="btn shadow-premium d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all hover-lift text-decoration-none position-relative z-1"
                                              style={{ backgroundColor: '#f54286', color: '#fff' }}
                                            >
                                              <span className="font-inter fw-semibold small d-none d-md-inline">Cómo llegar</span>
                                              <i className="bi bi-geo-alt-fill"></i>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGENDA SECTION */}
      {agenda.length > 0 && (
        <div className="container-xxl px-lg-5 py-4">
          <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                  <hr className="mb-5 opacity-10" />
                  <h3 className="h4 fw-bold mb-4">Cronograma de la Experiencia</h3>
                  <MacroEventAgenda initialAgenda={agenda} />
              </div>
          </div>
        </div>
      )}

      {/* 5. MAPA SECTION */}
      {festival.lat && (
        <div className="container-xxl px-lg-5 py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="rounded-4 overflow-hidden shadow-premium border" style={{ height: '400px' }}>
                        <GoogleMapViewer 
                            lat={festival.lat} 
                            lng={festival.lng} 
                            title={festival.title} 
                            type="experiencia" 
                        />
                    </div>
                </div>
            </div>
        </div>
      )}

      <ChatbotIcon />
    </div>
  );
}
