import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import { getNearbyLocations, getDistance } from '@/utils/geo';
import ExpandableDescription from '@/components/client/ExpandableDescription';
import EventsSlider from '@/components/client/EventsSlider';
import { getThumbnail } from '@/utils/image';

/**
 * ActivityDetailPage - Destino Río Cuarto
 * Implementa la vista detallada de una actividad alineada con el diseño de Figma.
 */
export default async function ActivityDetailPage({ params }) {
  const { id } = await params;
  const themeColor = '#8a38f5';
  const themeColorLight = '#f3e8ff';
  
  // 1. Obtener datos de la actividad desde la API
  let activityData = null;
  try {
    const res = await fetch(`http://destbackdev.aggility.io/api/v1/proposals/${id}`, { cache: 'no-store' });
    if (res.ok) {
       activityData = (await res.json()).data || (await res.json());
    }
  } catch (err) {
    console.error("Error fetching proposal:", err);
  }

  if (!activityData) {
    return (
      <div className="bg-white min-vh-100 pb-5 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
          <h2 className="font-inter fw-bold text-gray-800">Actividad no encontrada</h2>
          <p className="text-muted">Es posible que haya sido removida o que el enlace no sea válido.</p>
          <Link href="/actividades" className="btn btn-primary mt-3 rounded-3" style={{ backgroundColor: themeColor, border: 'none' }}>
            Ver todas las actividades
          </Link>
        </div>
        <ChatbotIcon />
      </div>
    );
  }

  // 2. Formateo de la actividad
  const categoryName = activityData.categories?.[0]?.name?.trim() || 'Actividad';
  const placeName = activityData.addresses?.[0]?.addressable?.name || activityData.organization?.name;
  const placeAddress = activityData.addresses?.[0]?.address || activityData.organization?.addresses?.[0]?.address;

  const activity = {
    id: activityData.id,
    title: activityData.title || 'Actividad sin título',
    date: activityData.calendars?.[0]?.observations || 'Consultar horarios',
    location: placeName ? `${placeName}${placeAddress ? ` / ${placeAddress.split(',')[0]}` : ''}` : (placeAddress || 'Río Cuarto'),
    coords: {
        lat: parseFloat(activityData.addresses?.[0]?.latitude) || 
             parseFloat(activityData.organization?.addresses?.[0]?.latitude) || -33.1232,
        lng: parseFloat(activityData.addresses?.[0]?.longitude) || 
             parseFloat(activityData.organization?.addresses?.[0]?.longitude) || -64.3493
    },
    fullLocation: {
        name: placeName || 'Río Cuarto',
        address: placeAddress || 'Río Cuarto, Córdoba',
        city: 'Río Cuarto, Córdoba'
    },
    description: activityData.description?.replace(/<[^>]*>?/gm, '') || 'Sin descripción disponible.',
    fullDescription: [activityData.description?.replace(/<[^>]*>?/gm, '') || 'Sin descripción disponible.'],
    thumbnail: getThumbnail(activityData.cover, activityData.gallery),
    category: categoryName.toUpperCase(),
  };

  // 2b. Obtener actividades aleatorias para el slider
  let randomActivities = [];
  try {
    const resActs = await fetch(`http://destbackdev.aggility.io/api/v1/proposals?per_page=50`, { cache: 'no-store' });
    if (resActs.ok) {
      const actsData = await resActs.json();
      const allActs = (Array.isArray(actsData) ? actsData : actsData.data || [])
        .filter(e => String(e.id) !== String(id) && e.status?.toLowerCase() !== 'inactive');
        
      for (let i = allActs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allActs[i], allActs[j]] = [allActs[j], allActs[i]];
      }
      randomActivities = allActs.slice(0, 10).map(e => ({
        id: e.id,
        title: e.title || 'Actividad',
        date: e.calendars?.[0]?.observations || 'Consultar',
        location: e.addresses?.[0]?.addressable?.name || e.addresses?.[0]?.address || 'Río Cuarto',
        thumbnail: getThumbnail(e.cover, e.gallery),
        category: e.categories?.[0]?.name?.toUpperCase() || 'ACTIVIDAD',
        typeColor: themeColor,
        basePath: 'actividades',
        lat: parseFloat(e.addresses?.[0]?.latitude) || null,
        lng: parseFloat(e.addresses?.[0]?.longitude) || null,
      }));
    }
  } catch (err) {
    console.error('Error fetching random activities:', err);
  }

  // 3. Obtener Organizaciones (Servicios) para filtrar por cercanía
  let allOrganizations = [];
  try {
    const resOrg = await fetch(`http://destbackdev.aggility.io/api/v1/organizations`, { cache: 'no-store' });
    if (resOrg.ok) {
        const orgData = await resOrg.json();
        allOrganizations = orgData.data || [];
    }
  } catch (err) {
    console.error("Error fetching organizations:", err);
  }

  const formattedOrgs = allOrganizations.map(org => ({
    ...org,
    lat: org.addresses?.[0]?.latitude,
    lng: org.addresses?.[0]?.longitude
  }));
  
  const nearbyServices = getNearbyLocations(activity.coords, formattedOrgs, 5000);
  
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
    distance: getDistance(activity.coords.lat, activity.coords.lng, parseFloat(item.lat || item.addresses?.[0]?.latitude), parseFloat(item.lng || item.addresses?.[0]?.longitude))
  });

  const finalAccommodation = accommodation.length > 0 ? accommodation.slice(0, 2).map(computeDist) : fallbackAccommodation.map(computeDist);
  const finalRestaurants = restaurants.length > 0 ? restaurants.slice(0, 2).map(computeDist) : fallbackRestaurants.map(computeDist);

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" style={{ height: '460px' }}>
        
        <div className="position-absolute top-0 start-0 w-100 h-100">
            <img 
              src={activity.thumbnail} 
              alt="" 
              className="w-100 h-100"
              style={{ objectFit: 'cover', filter: 'blur(20px)', opacity: 0.5, transform: 'scale(1.1)' }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>

        <div className="container-xxl px-0 px-lg-5 h-100 position-relative z-1 d-flex align-items-center justify-content-center">
            <div className="position-relative shadow-lg overflow-hidden d-none d-md-block" style={{ width: '100%', maxWidth: '940px', height: '460px' }}>
                <img 
                  src={activity.thumbnail} 
                  alt={activity.title} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
            </div>

            <img 
              src={activity.thumbnail} 
              alt={activity.title} 
              className="d-block d-md-none w-100 h-100"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />

            <div className="position-absolute bottom-0 end-0 p-4 d-none d-lg-flex gap-3 mb-2 me-lg-5" style={{ zIndex: 10 }}>
                <button className="btn shadow-premium d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 transition-all hover-lift"
                        style={{ backgroundColor: themeColor, color: '#fff' }}>
                    <span className="font-inter fw-semibold small">Participar</span>
                    <i className="bi bi-plus-lg"></i>
                </button>
                <button className="btn shadow-premium d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 transition-all hover-lift"
                        style={{ backgroundColor: themeColor, color: '#fff' }}>
                    <span className="font-inter fw-semibold small">Compartir</span>
                    <i className="bi bi-share"></i>
                </button>
            </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="container-xxl px-lg-5 mt-n4 mt-md-n5-detail position-relative z-1 mb-5">
        <div className="row g-4">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100">
                
                {/* Mobile Action Buttons */}
                <div className="d-flex d-lg-none gap-2 mb-4">
                  <button className="btn flex-grow-1 py-2 fw-bold rounded-2 shadow-premium text-white" style={{ backgroundColor: themeColor }}>
                    Participar
                  </button>
                  <button className="btn py-2 px-3 rounded-2 border-2" style={{ borderColor: themeColor, color: themeColor }}>
                    <i className="bi bi-share"></i>
                  </button>
                </div>

                {/* Sticky Header block for Title and Category */}
                <div className="bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-2 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: themeColor }}>
                            <i className="bi bi-geo-fill text-white small"></i>
                        </div>
                        <span className="font-inter fw-semibold" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                            Actividades
                        </span>
                    </div>
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4 text-truncate-2" style={{ letterSpacing: '-1px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(() => {
                            const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas'];
                            const text = activity.title;
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
                        <EventDistanceBadge eventLat={activity.coords.lat} eventLng={activity.coords.lng} type="activity" />
                    </div>
                </div>

                {/* Info Bar */}
                <div className="row g-3 mb-5 border-top border-bottom py-4 mx-0">
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 border-md-end mb-3 mb-md-0">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Horarios</span>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-clock text-primary" style={{ color: themeColor }}></i>
                            <span className="text-gray-900 font-inter fw-medium">{activity.date}</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 ps-md-4">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Lugar</span>
                        <div className="d-flex flex-column gap-1">
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-geo-alt text-primary" style={{ color: themeColor }}></i>
                                <span className="text-gray-900 font-inter fw-medium text-decoration-underline" style={{ cursor: 'pointer' }}>
                                    {activity.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Description */}
                <ExpandableDescription fullDescription={activity.fullDescription} />

                {/* Tags */}
                {activityData.tags?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-4 mt-4">
                    {activityData.tags.map((tag, i) => (
                      <span key={i} className="badge rounded-pill px-3 py-2 font-inter fw-medium"
                            style={{ backgroundColor: themeColorLight, color: themeColor, border: `1px solid ${themeColor}40` }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Location Box */}
                <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>Ubicación y Contacto</h2>
                    <ContactAndLocationWidget 
                        service={{
                            name: activity.fullLocation.name,
                            address: activity.fullLocation.address,
                            lat: activity.coords.lat,
                            lng: activity.coords.lng,
                            phones: activityData?.phones || []
                        }} 
                        type="actividad" 
                    />
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Recommendations) */}
          <div className="col-12 col-lg-4">
            <div>
              
              {/* Dormir */}
              <div className="bg-white p-4 rounded-4 mb-4 shadow-sm border">
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#203f83' }}>Donde alojarme</h3>
                <div className="d-flex flex-column gap-3 mb-4">
                    {finalAccommodation.map((item, idx) => {
                        const displayName = item.name || item.title || 'Servicio';
                        const displayAddress = item.addresses?.[0]?.address || item.address || 'Río Cuarto';
                        const displayPhone = item.phone || 'Consultar contacto';
                        const displayId = item.id || '';

                        return (
                            <Link href={displayId ? `/servicio/${displayId}` : '#'} key={idx} className="bg-white p-3 rounded-3 shadow-sm border position-relative text-decoration-none d-block transition-all hover-lift">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <p className="font-inter fw-bold text-gray-900 small mb-0">{displayName}</p>
                                    {item.distance && (
                                        <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#ebf5ff', color: '#203f83', fontSize: '10px' }}>
                                            {item.distance < 1000 ? `${Math.round(item.distance)}m` : `${(item.distance / 1000).toFixed(1)}km`}
                                        </span>
                                    )}
                                </div>
                                <div className="d-flex align-items-start gap-2 mb-1">
                                    <i className="bi bi-geo-alt text-muted" style={{ fontSize: '12px' }}></i>
                                    <span className="font-inter text-muted text-decoration-underline" style={{ fontSize: '12px' }}>{displayAddress}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-telephone text-muted" style={{ fontSize: '12px' }}></i>
                                    <span className="font-inter text-muted" style={{ fontSize: '12px' }}>{displayPhone}</span>
                                </div>
                                <i className="bi bi-chevron-right position-absolute bottom-0 end-0 m-3 opacity-50"></i>
                            </Link>
                        );
                    })}
                </div>
                <Link href="/servicios" className="btn btn-outline-primary w-100 py-2 font-inter fw-medium rounded-2 border-1-5 text-decoration-none d-flex justify-content-center" style={{ color: '#1a56db', borderColor: '#a4cafe' }}>
                    Ver más
                </Link>
              </div>

              {/* Comer */}
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#9a3412' }}>Donde comer</h3>
                <div className="d-flex flex-column gap-3 mb-4">
                    {finalRestaurants.map((item, idx) => {
                        const displayName = item.name || item.title || 'Restaurante';
                        const displayAddress = item.addresses?.[0]?.address || item.address || 'Río Cuarto';
                        const displayPhone = item.phone || 'Consultar contacto';
                        const displayId = item.id || '';

                        return (
                            <Link href={displayId ? `/servicio/${displayId}` : '#'} key={idx} className="bg-white p-3 rounded-3 shadow-sm border position-relative text-decoration-none d-block transition-all hover-lift">
                                 <div className="d-flex justify-content-between align-items-start mb-2">
                                    <p className="font-inter fw-bold text-gray-900 small mb-0">{displayName}</p>
                                    {item.distance && (
                                        <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#fff7ed', color: '#9a3412', fontSize: '10px' }}>
                                            {item.distance < 1000 ? `${Math.round(item.distance)}m` : `${(item.distance / 1000).toFixed(1)}km`}
                                        </span>
                                    )}
                                </div>
                                <div className="d-flex align-items-start gap-2 mb-1">
                                    <i className="bi bi-geo-alt text-muted" style={{ fontSize: '12px' }}></i>
                                    <span className="font-inter text-muted text-decoration-underline" style={{ fontSize: '12px' }}>{displayAddress}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-telephone text-muted" style={{ fontSize: '12px' }}></i>
                                    <span className="font-inter text-muted" style={{ fontSize: '12px' }}>{displayPhone}</span>
                                </div>
                                <i className="bi bi-chevron-right position-absolute bottom-0 end-0 m-3 opacity-50"></i>
                            </Link>
                        );
                    })}
                </div>
                <Link href="/servicios" className="btn btn-outline-warning w-100 py-2 font-inter fw-medium rounded-2 border-1-5 text-decoration-none d-flex justify-content-center" style={{ color: '#c2410c', borderColor: '#fed7aa' }}>
                    Ver más
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* RELATED ACTIVITIES SECTION — Slider con actividades aleatorias */}
        {randomActivities.length > 0 && (
          <div className="mt-5 pt-5 border-top">
            <EventsSlider events={randomActivities} />
            <div className="text-center mt-5">
              <Link
                href="/actividades"
                className="btn px-5 py-3 rounded-3 border-2 fw-bold shadow-sm transition-all hover-lift"
                style={{ color: themeColor, borderColor: themeColor, backgroundColor: 'transparent' }}
              >
                Ver todas las actividades
              </Link>
            </div>
          </div>
        )}
      </div>

      <ChatbotIcon />
    </div>
  );
}
