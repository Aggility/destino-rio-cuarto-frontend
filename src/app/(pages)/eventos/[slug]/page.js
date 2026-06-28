import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import UserDistanceBadge from '@/components/client/UserDistanceBadge';
import { getNearbyLocations, getDistance } from '@/utils/geo';
import ExpandableDescription from '@/components/client/ExpandableDescription';
import EventsSlider from '@/components/client/EventsSlider';
import { getThumbnail } from '@/utils/image';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import EventCard from '@/components/server/EventCard';
import ShareButton from '@/components/client/ShareButton';
import AddCalendarButton from '@/components/client/AddCalendarButton';
import EventContactButton from '@/components/client/EventContactButton';
import EventGallerySlider from '@/components/client/EventGallerySlider';

/**
 * EventDetailPage - Destino Río Cuarto
 * Implementa la vista detallada de un evento con sugerencias basadas en cercanía (Haversine).
 */
export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Obtener datos del evento desde la API
  let eventData = null;
  const isNumeric = /^\d+$/.test(slug);

  // Si el slug es un ID numérico, buscar directamente por ID
  if (isNumeric) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`, { cache: 'no-store' });
      if (res.ok) {
         eventData = (await res.json()).data;
      }
    } catch (err) {
      console.error("Error fetching event by ID:", err);
    }
  }

  // Si no se encontró por ID (o el slug no es numérico), buscar paginando
  // NOTA: La API ignora el parámetro ?slug= y devuelve todos los eventos paginados,
  // por eso hay que filtrar localmente buscando el evento cuyo slug coincide exactamente.
  if (!eventData) {
    try {
      let page = 1;
      let found = false;
      const PER_PAGE = 100;

      while (!found) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events?per_page=${PER_PAGE}&page=${page}`,
          { cache: 'no-store' }
        );
        if (!res.ok) break;

        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);

        // Buscar el evento con slug exactamente igual al parámetro de URL
        const match = list.find(e => e.slug === slug);
        if (match) {
          eventData = match;
          found = true;
          break;
        }

        // Si ya no hay más páginas, salir
        const totalPages = json.pagination?.total_pages || 1;
        if (page >= totalPages || list.length === 0) break;
        page++;
      }
    } catch (err) {
      console.error("Error fetching event by slug (pagination):", err);
    }
  }

  // 1b. Fetch full organization details to get contacts (which are not included in event payload)
  let orgContacts = [];
  if (eventData?.organization?.id) {
    try {
      const resOrgDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${eventData.organization.id}`, { cache: 'no-store' });
      if (resOrgDetails.ok) {
         const fullOrgData = (await resOrgDetails.json()).data;
         orgContacts = fullOrgData?.contacts || [];
      }
    } catch (err) {
      console.error("Error fetching event organization details:", err);
    }
  }

  // 2. Fallback y formateo del evento (Mock si falla API)
  // La API devuelve start_date como "YYYY-MM-DDTHH:MM:SS.000000Z" (UTC).
  // Usar new Date() directamente desplaza un día en zonas UTC-.
  // Solución: extraer Y, M, D de la parte de fecha y H, M de start_time (separado).
  const buildLocalEventDate = (calendarEntry) => {
    if (!calendarEntry?.start_date) return null;
    const [y, m, d] = calendarEntry.start_date.split('T')[0].split('-').map(Number);
    let hr = 0, min = 0;
    if (calendarEntry.start_time) {
      const parts = calendarEntry.start_time.split(':').map(Number);
      hr = parts[0] ?? 0;
      min = parts[1] ?? 0;
    }
    return new Date(y, m - 1, d, hr, min); // medianoche local, sin desfase UTC
  };
  const firstCal = eventData?.calendars?.[0];
  const localEventDate = buildLocalEventDate(firstCal);

  const event = {
    id: eventData?.id || slug || '2',
    title: eventData?.title || 'Ulises Bueno en Opus Costanera',
    date: localEventDate
      ? localEventDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
      : 'sáb, 7 de mar, 21 hs',
    startDateRaw: firstCal?.start_date ? firstCal.start_date.split('T')[0] : '2026-03-07',
    startTimeRaw: firstCal?.start_time || '21:00:00',
    endDateRaw: firstCal?.end_date ? firstCal.end_date.split('T')[0] : null,
    endTimeRaw: firstCal?.end_time || null,
    location: eventData?.organization?.name ? `${eventData.organization.name} / ${eventData.organization.addresses?.[0]?.address?.split(',')[0] || eventData.organization.address || ''}` : 'Opus Costanera / Río Grande 688, Río Cuarto',
    coords: {
        lat: parseFloat(eventData?.organization?.addresses?.[0]?.latitude) || 
             parseFloat(eventData?.organization?.latitude) || 
             parseFloat(eventData?.latitude) || -33.1232,
        lng: parseFloat(eventData?.organization?.addresses?.[0]?.longitude) || 
             parseFloat(eventData?.organization?.longitude) || 
             parseFloat(eventData?.longitude) || -64.3493
    },
    fullLocation: {
        name: eventData?.organization?.name || 'Opus Costanera',
        address: eventData?.organization?.addresses?.[0]?.address?.split(',')[0] || eventData?.organization?.address || 'Río Grande 688',
        city: 'Río Cuarto, Córdoba 5800'
    },
    description: eventData?.description || 'Regresa Ulises Bueno para una noche inolvidable...',
    fullDescription: eventData?.description || 'Regresa Ulises Bueno para una noche inolvidable...',
    thumbnail: getThumbnail(eventData?.cover, eventData?.gallery),
    relatedEvents: []
  };

  // 2b. Obtener eventos aleatorios para el slider
  let randomEvents = [];
  try {
    const resEvents = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=50`, { cache: 'no-store' });
    if (resEvents.ok) {
      const eventsData = await resEvents.json();
      const allEvents = (eventsData.data || [])
        .filter(e => String(e.id) !== String(event.id) && (e.status === 'active' || e.status === 'activo'))
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : a.id;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : b.id;
          return dateB - dateA;
        });
      
      randomEvents = allEvents.slice(0, 5).map(e => {
        let thumbnail = '/no-img.webp';
        if (e.cover && typeof e.cover === 'object') {
          thumbnail = e.cover.medium || e.cover.small || e.cover.large || e.cover.original || getThumbnail(e.cover, e.gallery);
        } else {
          thumbnail = getThumbnail(e.cover, e.gallery);
        }

        return {
          id: e.id,
          slug: e.slug,
          title: e.title || 'Evento',
          date: e.calendars?.[0]?.start_date
            ? (() => { const [y,m,d] = e.calendars[0].start_date.split('T')[0].split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }); })()
            : '',
          location: e.organization?.name || e.organization?.addresses?.[0]?.address || 'Río Cuarto',
          thumbnail,
          category: e.categories?.[0]?.name?.toUpperCase() || 'EVENTO',
          lat: parseFloat(e.organization?.addresses?.[0]?.latitude) || null,
          lng: parseFloat(e.organization?.addresses?.[0]?.longitude) || null,
        };
      });
    }
  } catch (err) {
    console.error('Error fetching random events:', err);
  }

  // 3. Obtener Organizaciones (Servicios) para filtrar por cercanía
  let allOrganizations = [];
  try {
    const resOrg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, { cache: 'no-store' });
    if (resOrg.ok) {
        const orgData = await resOrg.json();
        allOrganizations = orgData.data || [];
    }
  } catch (err) {
    console.error("Error fetching organizations:", err);
  }

  // 4. Aplicar Haversine para filtrar servicios cercanos (Radio ampliado para encontrar resultados reales)
  const formattedOrgs = allOrganizations.map(org => ({
    ...org,
    lat: org.addresses?.[0]?.latitude,
    lng: org.addresses?.[0]?.longitude
  }));
  
  // Usamos 5000m (5km) para asegurar que aparezcan resultados reales si existen, 
  // pero el usuario puede preferir 500m. Ajustado aquí para mayor cobertura.
  const nearbyServices = getNearbyLocations(event.coords, formattedOrgs, 20000); // Radio de 20km
  
  // Separar por categorías con filtros más amplios
  const accommodation = nearbyServices.filter(s => 
    s.categories?.some(c => {
      const name = c.name.toLowerCase();
      return name.includes('alojamiento') || name.includes('hotel') || name.includes('dormir') || name.includes('hospedaje');
    })
  );
  
  const restaurants = nearbyServices.filter(s => 
    s.categories?.some(c => {
      const name = c.name.toLowerCase();
      return name.includes('gastronomía') || name.includes('comer') || name.includes('restaurante') || name.includes('bar');
    })
  );

  // Fallback si no hay nada cerca para no dejar vacío el diseño (Mocks iniciales)
  const fallbackAccommodation = [
    { name: 'AMERIAN RÍO CUARTO APART & SUITES', address: 'AV. GUILLERMO MARCONI 771', phone: '08108102637', lat: -33.1235, lng: -64.3486 },
    { name: 'Colores Rio Cuarto', address: 'Caseros 1012, Río Cuarto', phone: '3584225286', lat: -33.1260, lng: -64.3460 }
  ];

  const fallbackRestaurants = [
    { name: 'Abriles El Andino', address: 'Bv. General Roca 1020, Río Cuarto', phone: '0358 548-3882', lat: -33.1362, lng: -64.3470 },
    { name: 'Al Dente Tradición Familiar', address: 'Fray Quirico Porreca 547, Río Cuarto', phone: '+54 9 358 425-5129', lat: -33.1110, lng: -64.3315 }
  ];

  const computeDist = (item) => ({
    ...item,
    distance: getDistance(event.coords.lat, event.coords.lng, parseFloat(item.lat || item.addresses?.[0]?.latitude), parseFloat(item.lng || item.addresses?.[0]?.longitude))
  });

  const finalAccommodation = accommodation.length > 0 ? accommodation.slice(0, 2).map(computeDist) : fallbackAccommodation.map(computeDist);

  const finalRestaurants = restaurants.length > 0 ? restaurants.slice(0, 2).map(computeDist) : fallbackRestaurants.map(computeDist);

  const combinedServices = [...finalAccommodation, ...finalRestaurants].map((s, idx) => {
    let thumbnail = '/no-img.webp';
    if (s.cover && typeof s.cover === 'object') {
      thumbnail = s.cover.medium || s.cover.small || s.cover.large || s.cover.original || getThumbnail(s.cover, s.gallery);
    } else if (s.cover || s.gallery) {
      thumbnail = getThumbnail(s.cover, s.gallery);
    } else {
      const mockImages = [
        'https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=150'
      ];
      thumbnail = mockImages[idx % mockImages.length];
    }
    return {
      id: s.id,
      slug: s.slug,
      title: s.name || s.title || 'Servicio',
      address: s.addresses?.[0]?.address || s.address || 'Río Cuarto',
      category: s.categories?.[0]?.name || (finalAccommodation.includes(s) ? 'ALOJAMIENTO' : 'GASTRONOMÍA'),
      thumbnail
    };
  });

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — Diseño adaptativo: Blur en Desktop / Cover en Mobile */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" style={{ height: '460px' }}>
        
        {/* Fondo desenfocado (Full Width) */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
            <img 
              src={event.thumbnail} 
              alt="" 
              className="w-100 h-100"
              style={{ objectFit: 'cover', filter: 'blur(20px)', opacity: 0.5, transform: 'scale(1.1)' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>

        {/* Imagen Contenida al ancho específico de 940x460 */}
        <div className="container-xxl px-0 px-lg-5 h-100 position-relative z-1 d-flex align-items-center justify-content-center">
            <div className="position-relative shadow-lg overflow-hidden d-none d-md-block" style={{ width: '100%', maxWidth: '940px', height: '460px' }}>
                <img 
                  src={event.thumbnail} 
                  alt={event.title} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Vista Mobile: Cover completa sin márgenes laterales */}
            <img 
              src={event.thumbnail} 
              alt={event.title} 
              className="d-block d-md-none w-100 h-100"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />

        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="container-xxl px-lg-5 mt-4 position-relative z-1 mb-5">
        
        {/* Action Buttons Row — Ubicados debajo de la portada */}
        <div className="d-flex justify-content-center justify-content-md-end gap-2 gap-md-3 mb-4 pe-lg-5">
            <AddCalendarButton event={event} themeColor="#f54286" />
            <ShareButton title={event.title} themeColor="#f54286" />
        </div>
        <div className="row g-4">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100">
                

                {/* Sticky Header block for Title and Category */}
                <div className="bg-white">
                    {/* Category & Title */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="bg-pink-500 rounded-2 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#f54286' }}>
                            <i className="bi bi-star-fill text-white small"></i>
                        </div>
                        <span className="text-pink-500 font-inter fw-semibold" style={{ color: '#f54286', borderBottom: '1px solid #f54286' }}>
                            Eventos
                        </span>
                    </div>
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4 text-truncate-2" style={{ letterSpacing: '-1px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(() => {
                            const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'qué', 'hay', 'vos', 'para'];
                            const text = event.title;
                            if (!text) return '';
                            return text.split(' ').map((word, index) => {
                                if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                                if (connectors.includes(cleanWord)) return word.toLowerCase();
                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            }).join(' ');
                        })()}
                    </h1>
                    <div className="mb-4">
                        <EventDistanceBadge eventLat={event.coords.lat} eventLng={event.coords.lng} type="event" />
                    </div>
                </div>

                {/* Info Bar */}
                <div className="row g-3 mb-5 border-top border-bottom py-4 mx-0">
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 border-md-end mb-3 mb-md-0">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Cuando</span>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-calendar3 text-primary"></i>
                            <span className="text-gray-900 font-inter fw-medium">{event.date}</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 ps-md-4">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Donde</span>
                        <div className="d-flex flex-column gap-1">
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-geo-alt text-primary"></i>
                                <span className="text-gray-900 font-inter fw-medium text-decoration-underline" style={{ cursor: 'pointer' }}>
                                    {event.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Description */}
                <ExpandableDescription htmlContent={event.fullDescription} />


                {/* Location Box */}
                <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>Ubicación y Contacto</h2>
                    <ContactAndLocationWidget 
                        service={{
                            name: event.fullLocation.name,
                            address: event.fullLocation.address,
                            lat: event.coords.lat,
                            lng: event.coords.lng,
                            phones: eventData?.organization?.phone ? [eventData.organization.phone] : []
                        }} 
                        type="event" 
                        showContact={false}
                    />
                    <div className="mb-5">
                      <EventContactButton contacts={orgContacts} themeColor="#f54286" themeColorLight="#fce8ef" />
                    </div>
                    <EventGallerySlider gallery={eventData?.gallery || []} />
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Recommendations) */}
          <div className="col-12 col-lg-4">
            <div>
              
              {/* Servicios Cercanos */}
              <div className="p-4 bg-white rounded-4 border shadow-sm">
                  <h3 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                      Servicios Más Buscados
                  </h3>
                  <div className="d-flex flex-column gap-3 mb-4">
                      {combinedServices.map((rs, i) => (
                          <Link key={i} href={rs.slug ? `/servicio/${rs.slug}` : `/servicio/${rs.id}`} className="text-decoration-none text-reset">
                              <div className="bg-white p-3 rounded-3 border d-flex gap-3 align-items-center hover-lift transition-all" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                  <div className="flex-shrink-0" style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                                      <img src={rs.thumbnail} alt={rs.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                  </div>
                                  <div className="d-flex flex-column gap-1 overflow-hidden w-100">
                                      <h4 className="font-inter fw-bold text-gray-900 mb-0 text-truncate" style={{ fontSize: '16px', color: '#111928' }}>
                                          {rs.title}
                                      </h4>
                                      <span className="font-inter text-muted small text-truncate" style={{ color: '#6b7280' }}>
                                          {rs.address}
                                      </span>
                                      <div className="d-inline-flex rounded-pill px-2 py-0-5 mt-1" style={{ backgroundColor: '#e1effe', width: 'fit-content' }}>
                                          <span className="font-inter fw-bold text-primary-800 text-uppercase" style={{ color: '#1e429f', fontSize: '11px', letterSpacing: '0.5px' }}>
                                              {rs.category}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                      ))}
                  </div>
                  <Link href="/servicios" className="btn btn-outline-primary bg-white shadow-sm font-inter text-primary rounded-2 px-4 shadow-premium-subtle transition-all hover-lift text-decoration-none d-inline-flex align-items-center w-100 justify-content-center" style={{ color: '#1a56db', borderColor: '#a4cafe' }}>
                      Ver más
                  </Link>
              </div>

            </div>
          </div>
        </div>

        {/* RELATED EVENTS SECTION — Slider con eventos aleatorios estilo Home */}
        {randomEvents.length > 0 && (
          <div className="mt-5 pt-5 border-top w-100">
            <HomeSectionSlider title="También te puede interesar">
              {randomEvents.map((evt) => (
                <div key={evt.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <EventCard
                    id={evt.id}
                    title={evt.title}
                    date={evt.date}
                    location={evt.location}
                    category={evt.category}
                    typeColor="#f54286"
                    thumbnail={evt.thumbnail}
                  />
                </div>
              ))}
              {/* Ver más card */}
              <div key="more-events" className="flex-shrink-0" style={{ width: 'clamp(200px, 50vw, 240px)', scrollSnapAlign: 'start' }}>
                <Link href="/eventos" className="text-decoration-none h-100 d-block">
                  <div className="rounded-4 d-flex flex-column align-items-center justify-content-center text-white shadow-premium p-4 h-100" 
                       style={{ 
                         backgroundColor: '#f54286', 
                         transition: 'all 0.3s ease'
                       }}>
                    <div className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '54px', height: '54px', backgroundColor: 'transparent' }}>
                      <i className="bi bi-plus-lg fs-3"></i>
                    </div>
                    <span className="fw-bold font-inter" style={{ fontSize: '18px' }}>Ver más</span>
                    <span className="opacity-80 small text-center mt-1 font-inter">Eventos</span>
                  </div>
                </Link>
              </div>
            </HomeSectionSlider>
          </div>
        )}
      </div>

      <ChatbotIcon />
    </div>
  );
}
