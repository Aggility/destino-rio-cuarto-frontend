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
        frameworkData = list.find(f => f.slug === slug) || null;
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
      
      {/* 1. HERO FESTIVAL */}
      <section className="text-white py-5 text-center" style={{ backgroundColor: '#ff5a1f', paddingBottom: '80px !important' }}>
        <div className="container py-4">
            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1.5px' }}>{festival.title}</h1>
            <p className="lead px-md-5 mb-4 mx-auto" style={{ maxWidth: '700px', fontSize: '18px', opacity: '0.9' }}>
                {festival.description.substring(0, 150)}...
            </p>
            <div className="d-inline-block bg-white fw-bold px-3 py-1 rounded-2 shadow-sm small mb-2" style={{ color: '#ff5a1f' }}>
                {agenda.length} FECHAS
            </div>
        </div>
      </section>

      {/* 2. DATE BAR & MAIN IMAGE */}
      <section className="position-relative" style={{ marginTop: '-40px' }}>
        <div className="container-fluid px-0">
            <div className="bg-dark text-white text-center py-2 fw-bold w-100 mx-auto" style={{ maxWidth: '900px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                {festival.dateRange}
            </div>
            
            <div className="position-relative overflow-hidden shadow-lg mx-auto" style={{ maxWidth: '900px', height: '450px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <img 
                    src={festival.thumbnail} 
                    alt={festival.title} 
                    className="w-100 h-100 object-cover"
                    style={{ objectFit: 'cover' }}
                />
            </div>
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
                        <p className="font-inter text-gray-600 mb-4 fs-5" style={{ lineHeight: '1.6' }}>
                           {festival.description}
                        </p>
                        
                        <div className="d-flex align-items-center gap-2 text-muted">
                           <i className="bi bi-geo-alt-fill text-primary"></i>
                           <span className="small">{festival.location} - {festival.address}</span>
                        </div>
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
