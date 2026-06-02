import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import UserDistanceBadge from '@/components/client/UserDistanceBadge';
import { getNearbyLocations, getDistance } from '@/utils/geo';
import ExpandableDescription from '@/components/client/ExpandableDescription';
import { getThumbnail } from '@/utils/image';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import ActivityCard from '@/components/server/ActivityCard';
import EventCard from '@/components/server/EventCard';

/**
 * ExperienceDetailPage - Destino Río Cuarto
 * Implementa la vista detallada de una experiencia alineada con el diseño de Figma.
 */
export default async function ExperienceDetailPage({ params }) {
  const { id } = await params;
  const themeColor = '#ff5a1f';
  const themeColorLight = '#fff7ed';
  
  // 1. Obtener datos de la experiencia desde la API
  let experienceData = null;
  try {
    const res = await fetch(`https://destbackdev.aggility.io/api/v1/proposals/${id}`, { cache: 'no-store' });
    if (res.ok) {
       experienceData = (await res.json()).data || (await res.json());
    }
  } catch (err) {
    console.error("Error fetching proposal:", err);
  }

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

  // 2. Formateo de la experiencia
  const categoryName = experienceData.categories?.[0]?.name?.trim() || 'Experiencia';
  
  const cal = experienceData.calendars?.[0];
  let timeBadge = 'Consultar horarios';
  if (cal) {
    if (cal.start_time && cal.end_time) {
      timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
    } else if (cal.start_time) {
      timeBadge = `${cal.start_time.substring(0, 5)} hs`;
    }
  }

  const experience = {
    id: experienceData.id,
    title: experienceData.title || 'Sin título',
    date: timeBadge,
    location: experienceData.addresses?.[0]?.organization?.name || experienceData.organization?.name || experienceData.addresses?.[0]?.addressable?.name || experienceData.addresses?.[0]?.address || 'Río Cuarto',
    coords: {
        lat: parseFloat(experienceData.addresses?.[0]?.latitude) || 
             parseFloat(experienceData.organization?.addresses?.[0]?.latitude) || -33.1232,
        lng: parseFloat(experienceData.addresses?.[0]?.longitude) || 
             parseFloat(experienceData.organization?.addresses?.[0]?.longitude) || -64.3493
    },
    fullLocation: {
        name: experienceData.addresses?.[0]?.organization?.name || experienceData.organization?.name || 'Río Cuarto',
        address: experienceData.addresses?.[0]?.address || experienceData.organization?.addresses?.[0]?.address || 'Río Cuarto, Córdoba',
        city: 'Río Cuarto, Córdoba'
    },
    description: experienceData.description?.replace(/<[^>]*>?/gm, '') || 'Sin descripción disponible.',
    fullDescription: [experienceData.description?.replace(/<[^>]*>?/gm, '') || 'Sin descripción disponible.'],
    thumbnail: getThumbnail(experienceData.cover, experienceData.gallery),
    category: categoryName.toUpperCase(),
  };

  // 2b. Obtener experiencias relacionadas por misma ubicación
  let relatedExperiences = [];
  let allProposals = [];
  try {
    const resActs = await fetch(`https://destbackdev.aggility.io/api/v1/proposals?per_page=50`, { cache: 'no-store' });
    if (resActs.ok) {
      const actsData = await resActs.json();
      allProposals = Array.isArray(actsData) ? actsData : actsData.data || [];
      const allActs = allProposals
        .filter(e => String(e.id) !== String(id) && e.status?.toLowerCase() !== 'inactive');
        
      const currentLoc = experience.location.toLowerCase();
      const sameLocationActs = allActs.filter(e => {
          const loc = (e.addresses?.[0]?.organization?.name || e.organization?.name || e.addresses?.[0]?.addressable?.name || e.addresses?.[0]?.address || '').toLowerCase();
          return loc && (loc.includes(currentLoc) || currentLoc.includes(loc));
      });

      let relatedToProcess = sameLocationActs;
      if (relatedToProcess.length < 10) {
          const others = allActs.filter(e => !sameLocationActs.some(s => s.id === e.id));
          for (let i = others.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
          }
          relatedToProcess = [...sameLocationActs, ...others.slice(0, 10 - sameLocationActs.length)];
      } else {
          relatedToProcess = sameLocationActs.slice(0, 10);
      }

      relatedExperiences = relatedToProcess.map(e => {
        const catName = e.categories?.[0]?.name?.trim() || 'Experiencia';
        const addr = e.addresses?.[0]?.organization?.name || e.organization?.name || e.addresses?.[0]?.addressable?.name || e.addresses?.[0]?.address || 'Río Cuarto';
        
        const c = e.calendars?.[0];
        let tBadge = catName;
        if (c) {
          if (c.start_time && c.end_time) {
            tBadge = `${c.start_time.substring(0, 5)} a ${c.end_time.substring(0, 5)} hs`;
          } else if (c.start_time) {
            tBadge = `${c.start_time.substring(0, 5)} hs`;
          }
        }

        let thumb = '/no-img.webp';
        if (e.cover && typeof e.cover === 'object') {
          thumb = e.cover.medium || e.cover.small || e.cover.large || e.cover.original || getThumbnail(e.cover, e.gallery);
        } else {
          thumb = getThumbnail(e.cover, e.gallery);
        }

        return {
          id: e.id,
          title: e.title || 'Experiencia',
          date: tBadge,
          location: addr,
          thumbnail: thumb,
          category: catName.toUpperCase(),
          typeColor: themeColor,
          basePath: 'experiencias',
          lat: parseFloat(e.addresses?.[0]?.latitude) || null,
          lng: parseFloat(e.addresses?.[0]?.longitude) || null,
        };
      });
    }
  } catch (err) {
    console.error('Error fetching related experiences:', err);
  }

  // 3. Obtener Organizaciones para filtrar por cercanía
  let allOrganizations = [];
  try {
    const resOrg = await fetch(`https://destbackdev.aggility.io/api/v1/organizations`, { cache: 'no-store' });
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
  
  const nearbyServices = getNearbyLocations(experience.coords, formattedOrgs, 20000);
  
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

  const computeDist = (item) => ({
    ...item,
    distance: getDistance(experience.coords.lat, experience.coords.lng, parseFloat(item.lat || item.addresses?.[0]?.latitude), parseFloat(item.lng || item.addresses?.[0]?.longitude))
  });

  const finalAccommodation = accommodation.slice(0, 2).map(computeDist);
  const finalRestaurants = restaurants.slice(0, 2).map(computeDist);

  // 4. Obtener lugares incluidos en la experiencia actual y sus actividades relacionadas
  const includedPlaces = experienceData.addresses
    ?.map(addr => addr.organization)
    ?.filter((org, index, self) => org && self.findIndex(o => o.id === org.id) === index) || [];

  const placesWithActivities = includedPlaces.map(place => {
    const activities = allProposals.filter(prop => {
      const isActivity = prop.types?.some(t => t.slug === 'actividad' || t.key === 'activity');
      if (!isActivity) return false;
      const belongsToOrg = prop.addresses?.some(addr => addr.organization?.id === place.id);
      return belongsToOrg;
    });
    return {
      ...place,
      activities
    };
  });

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
            <div className="d-block d-md-none w-100 h-100 position-relative">
                <img 
                  src={experience.thumbnail} 
                  alt={experience.title} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="container-xxl px-lg-5 mt-4 position-relative z-1 mb-5">
        
        {/* Action Buttons Row */}
        <div className="d-flex justify-content-center justify-content-md-end gap-2 gap-md-3 mb-4 pe-lg-5">
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

        <div className="row g-4">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100">
                
                {/* Header block for Title and Category */}
                <div className="bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-2 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: themeColor }}>
                            <i className="bi bi-geo-fill text-white small"></i>
                        </div>
                        <span className="font-inter fw-semibold" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                            {(experienceData.tags?.[0]?.name || 'Experiencia').replace(/^experiencias\s+/i, '')}
                        </span>
                    </div>
                    
                    <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-4 text-truncate-2" style={{ letterSpacing: '-1px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {experience.title}
                    </h1>
                    <div className="mb-4">
                        <EventDistanceBadge eventLat={experience.coords.lat} eventLng={experience.coords.lng} type="experience" />
                    </div>
                </div>

                {/* Info Bar */}
                <div className="row g-3 mb-5 border-top border-bottom py-4 mx-0">
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 border-md-end mb-3 mb-md-0">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Horarios</span>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-calendar3" style={{ color: themeColor }}></i>
                            <span className="text-gray-900 font-inter fw-medium">{experience.date}</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-start gap-3 ps-md-4">
                        <span className="text-muted font-inter fw-normal" style={{ minWidth: '80px' }}>Lugar</span>
                        <div className="d-flex flex-column gap-1">
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-geo-alt-fill" style={{ color: themeColor }}></i>
                                <span className="text-gray-900 font-inter fw-medium text-decoration-underline" style={{ cursor: 'pointer' }}>
                                    {experience.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Description */}
                <ExpandableDescription fullDescription={experience.fullDescription} color={themeColor} />

                {/* Tags */}
                {experienceData.tags?.length > 1 && (
                  <div className="d-flex flex-wrap gap-2 mb-4 mt-4">
                    {experienceData.tags.slice(1).map((tag, i) => (
                      <span key={i} className="badge rounded-pill px-3 py-2 font-inter fw-medium"
                            style={{ backgroundColor: themeColorLight, color: themeColor, border: `1px solid ${themeColor}40` }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Places & Activities Included Section */}
                {placesWithActivities.length > 0 && (
                  <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>
                      Lugares que incluye
                    </h2>
                    <div className="d-flex flex-column gap-4">
                      {placesWithActivities.map((place) => (
                        <div key={place.id} className="bg-light-subtle rounded-4 p-4 border border-light-subtle shadow-sm" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                          <div className="row g-3 align-items-center">
                            {place.cover && (
                              <div className="col-12 col-md-3">
                                <img
                                  src={getThumbnail(place.cover, place.gallery)}
                                  alt={place.name}
                                  className="img-fluid rounded-3 w-100"
                                  style={{ maxHeight: '140px', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                            <div className={place.cover ? "col-12 col-md-9" : "col-12"}>
                              <span className="badge font-inter fw-semibold mb-2" style={{ backgroundColor: themeColorLight, color: themeColor }}>Lugar</span>
                              <h3 className="font-inter fw-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>
                                {place.name}
                              </h3>
                              <p className="text-muted small mb-0 font-inter">
                                {place.excerpt || place.description?.replace(/<[^>]*>?/gm, '')}
                              </p>
                            </div>
                          </div>

                          {/* Activities at this Place */}
                          {place.activities?.length > 0 && (
                            <div className="mt-4 pt-3 border-top" style={{ borderColor: '#e5e7eb' }}>
                              <h4 className="font-inter fw-semibold text-gray-800 mb-3" style={{ fontSize: '15px' }}>
                                <i className="bi bi-compass-fill me-2" style={{ color: themeColor }}></i>
                                Actividades y atracciones en {place.name}:
                              </h4>
                              <div className="row g-3">
                                {place.activities.map((act) => {
                                  const actTime = act.calendars?.[0]
                                    ? (act.calendars[0].start_time ? `${act.calendars[0].start_time.substring(0,5)} hs` : 'Consultar')
                                    : 'Consultar';
                                  const actSchedule = act.calendars?.[0]?.observations || 'Horarios no especificados';
                                  const actThumb = getThumbnail(act.cover, act.gallery);

                                  return (
                                    <div key={act.id} className="col-12 col-sm-6">
                                      <ActivityCard
                                        id={act.id}
                                        title={act.title}
                                        time={actTime}
                                        address={place.name}
                                        schedule={actSchedule}
                                        description={act.excerpt || act.description?.replace(/<[^>]*>?/gm, '')}
                                        thumbnail={actThumb}
                                        type="actividades"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Box */}
                <div className="mt-5 pt-4 border-top">
                    <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px' }}>Ubicación y Contacto</h2>
                    <ContactAndLocationWidget 
                        service={{
                            name: experience.fullLocation.name,
                            address: experience.fullLocation.address,
                            lat: experience.coords.lat,
                            lng: experience.coords.lng,
                            phones: experienceData?.phones || []
                        }} 
                        type="experiencia"
                        showContact={false}
                    />
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Recommendations) */}
          <div className="col-12 col-lg-4">
            <div>
              {/* Donde Alojarme */}
              <div className="p-4 rounded-4 mb-4 shadow-sm border" style={{ backgroundColor: '#f0f7ff' }}>
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#1a56db' }}>Donde Alojarme</h3>
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
                                    <UserDistanceBadge 
                                        targetLat={item.lat || item.addresses?.[0]?.latitude} 
                                        targetLng={item.lng || item.addresses?.[0]?.longitude} 
                                        staticDistance={item.distance} 
                                        staticLabel={`de ${experience.location}`} 
                                        theme="blue"
                                    />
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

              {/* Donde Comer */}
              <div className="p-4 rounded-4 shadow-sm border" style={{ backgroundColor: '#f0f7ff' }}>
                <h3 className="font-inter fw-bold text-listing-title mb-4" style={{ fontSize: '22px', color: '#1a56db' }}>Donde Comer</h3>
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
                                    <UserDistanceBadge 
                                        targetLat={item.lat || item.addresses?.[0]?.latitude} 
                                        targetLng={item.lng || item.addresses?.[0]?.longitude} 
                                        staticDistance={item.distance} 
                                        staticLabel={`de ${experience.location}`} 
                                        theme="orange"
                                    />
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
            </div>
          </div>
        </div>

        {/* RELATED EXPERIENCES SECTION */}
        {relatedExperiences.length > 0 && (
          <div className="mt-5 pt-5 border-top w-100">
            <HomeSectionSlider title="También te puede interesar">
              {relatedExperiences.map((item) => (
                <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <EventCard 
                    id={item.id}
                    title={item.title}
                    date={item.date}
                    location={item.location}
                    category={item.category}
                    description={item.schedule}
                    thumbnail={item.thumbnail}
                    lat={item.lat}
                    lng={item.lng}
                    basePath="experiencias"
                    typeColor={themeColor}
                  />
                </div>
              ))}
              <div key="more-experiences" className="flex-shrink-0" style={{ width: 'clamp(200px, 50vw, 240px)', scrollSnapAlign: 'start' }}>
                <Link href="/experiencias" className="text-decoration-none h-100 d-block">
                  <div className="rounded-4 d-flex flex-column align-items-center justify-content-center text-white shadow-premium p-4 h-100" 
                       style={{ 
                         backgroundColor: themeColor, 
                         transition: 'all 0.3s ease'
                       }}>
                    <div className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '54px', height: '54px', backgroundColor: 'transparent' }}>
                      <i className="bi bi-plus-lg fs-3"></i>
                    </div>
                    <span className="fw-bold font-inter" style={{ fontSize: '18px' }}>Ver más</span>
                    <span className="opacity-80 small text-center mt-1 font-inter">Experiencias</span>
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
