import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import { getNearbyLocations } from "@/utils/geo";
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import EventImageWithFallback from '@/components/client/EventImageWithFallback';
import { getThumbnail } from '@/utils/image';
import EventContactButton from '@/components/client/EventContactButton';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import EventCard from '@/components/server/EventCard';
import { formatEventDateFull } from '@/utils/date';

export const revalidate = 300;

/**
 * PlaceDetailPage - Destino Río Cuarto
 * Vista individual de un Lugar adaptando la estructura y el formato visual de la página de servicio (/servicio/[slug])
 * utilizando el color distintivo verde (#059669) e incorporando el slider de Eventos Destacados en la parte inferior.
 */
export default async function PlaceDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const { id: queryId } = await searchParams;

  const themeColor = '#059669';
  const themeColorLight = '#ecfdf5';
  const themeColorText = '#047857';

  let orgData = null;
  const isNumeric = /^\d+$/.test(slug);
  const fetchId = queryId || (isNumeric ? slug : null);

  // 1. Obtener datos de la organización/lugar desde la API
  if (fetchId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${fetchId}`, { cache: 'no-store' });
      if (res.ok) {
        orgData = (await res.json()).data;
      }
    } catch (err) {
      console.error("Error fetching place by ID:", err);
    }
  }

  if (!orgData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?slug=${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json;
        if (Array.isArray(list) && list.length > 0) {
          const tempOrg = list[0];
          const detailRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${tempOrg.id}`, { cache: 'no-store' });
          if (detailRes.ok) {
            orgData = (await detailRes.json()).data;
          } else {
            orgData = tempOrg;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching place by slug:", err);
    }
  }

  if (!orgData) {
    return (
      <div className="bg-white min-vh-100 pb-5 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-geo-alt fs-1 text-muted d-block mb-3"></i>
          <h2 className="font-inter fw-bold text-gray-800">Lugar no encontrado</h2>
          <p className="text-muted">Es posible que haya sido removido o que el enlace no sea válido.</p>
          <Link href="/lugares" className="btn text-white mt-3 rounded-3" style={{ backgroundColor: themeColor, border: 'none' }}>
            Ver todos los lugares
          </Link>
        </div>
        <ChatbotIcon />
      </div>
    );
  }

  // 2. Mapeo de datos del lugar
  const phoneContact = orgData?.contacts?.find(c => c.type === 'phone' || c.type === 'telephone');
  const whatsappContact = orgData?.contacts?.find(c => c.type === 'whatsapp');
  const instagramContact = orgData?.contacts?.find(c => c.type === 'instagram');
  const facebookContact = orgData?.contacts?.find(c => c.type === 'facebook');
  const webContact = orgData?.contacts?.find(c => c.type === 'web');

  const mainAddress = orgData?.addresses?.[0];

  const place = {
    id: orgData?.id || slug,
    name: orgData?.name || 'Lugar Destacado',
    category: orgData?.categories?.[0]?.name || 'Espacio Público',
    address: mainAddress?.address || 'Río Cuarto, Córdoba',
    lat: parseFloat(mainAddress?.latitude) || -33.1232,
    lng: parseFloat(mainAddress?.longitude) || -64.3493,
    phone: phoneContact?.value || orgData?.phone || '',
    whatsapp: whatsappContact?.value || '',
    instagram: instagramContact?.value || '',
    facebook: facebookContact?.value || '',
    web: webContact?.value || '',
    description: orgData?.description || orgData?.excerpt || 'Espacio turístico y cultural en la ciudad de Río Cuarto.',
    image: getThumbnail(orgData?.cover, orgData?.gallery)
  };

  // 3. Recomendaciones: Eventos Cercanos, Lugares Relacionados, Actividades Realizadas y Slider de Eventos Destacados
  let nearbyEvents = [];
  let relatedPlaces = [];
  let realActivities = [];
  let featuredEventsSlider = [];

  try {
    const [resEvents, resOrgs, resProp, resHome] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?per_page=100`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals?per_page=50`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, { cache: 'no-store' })
    ]);

    // a. Eventos cercanos para el sidebar
    if (resEvents.ok) {
      const allEvents = (await resEvents.json()).data || [];
      const formattedEvents = allEvents.map(ev => ({
        ...ev,
        lat: ev.organization?.addresses?.[0]?.latitude,
        lng: ev.organization?.addresses?.[0]?.longitude
      }));
      const center = { lat: place.lat, lng: place.lng };
      const nearby = getNearbyLocations(center, formattedEvents, 5000);

      nearbyEvents = nearby
        .filter(ev => ev.status?.toLowerCase() !== 'inactive')
        .slice(0, 3)
        .map(ev => ({
          id: ev.id,
          title: ev.title,
          subtitle: ev.organization?.name || place.name,
          badge: '',
          type: 'event',
          thumbnail: getThumbnail(ev.cover, ev.gallery),
          lat: ev.lat,
          lng: ev.lng,
          href: `/eventos/${ev.slug || ev.id}`
        }));
    }

    // b. Lugares relacionados (organizaciones de tipo 'place')
    if (resOrgs.ok) {
      let allOrgs = (await resOrgs.json()).data || [];
      const placesList = allOrgs.filter(org =>
        org.status?.toLowerCase() !== 'inactive' &&
        org.types?.some(t => t.key === 'place') &&
        String(org.id) !== String(place.id)
      );

      relatedPlaces = placesList.slice(0, 4).map(org => ({
        id: org.id,
        slug: org.slug,
        title: org.name,
        category: org.categories?.[0]?.name || 'Lugar',
        address: org.addresses?.[0]?.address || 'Río Cuarto',
        phone: org.phone || 'Consultar contacto',
        thumbnail: getThumbnail(org.cover, org.gallery)
      }));
    }

    // c. Actividades reales para el sidebar
    if (resProp.ok) {
      const propData = await resProp.json();
      const list = Array.isArray(propData) ? propData : (propData.data || []);
      const allActivities = list.filter(p =>
        p.status?.toLowerCase() !== 'inactive' &&
        p.types?.some(t => t.key === 'activity' || t.slug === 'actividad')
      );

      realActivities = allActivities.slice(0, 3).map(p => {
        const cat = p.categories?.[0]?.name?.trim() || 'Actividad';
        const addr = p.addresses?.[0]?.organization?.name || p.organization?.name || p.addresses?.[0]?.address || 'Río Cuarto';
        return {
          title: p.title,
          subtitle: addr,
          badge: cat,
          type: 'activity',
          thumbnail: getThumbnail(p.cover, p.gallery),
          href: `/actividades/${p.slug || p.id}`
        };
      });
    }

    // d. Slider de Eventos Destacados para la parte inferior
    if (resHome.ok) {
      const homeJson = await resHome.json();
      const homeData = homeJson.data || {};
      const featured = Array.isArray(homeData.featured_events) ? homeData.featured_events : [];
      featuredEventsSlider = featured.filter(evt => evt.status?.toLowerCase() !== 'inactive');
    }
  } catch (err) {
    console.error("Error fetching recommendations in PlaceDetailPage:", err);
  }

  const finalRelated = relatedPlaces;
  const finalEvents = nearbyEvents.length > 0 ? nearbyEvents : [
    { title: 'Evento en la Ciudad', subtitle: place.name, badge: '', type: 'event', thumbnail: '/no-img.webp', href: '/eventos' }
  ];
  const finalActivities = realActivities;

  return (
    <div className="bg-white min-vh-100 pb-5">
      <div className="container-xxl px-lg-5 pt-4">

        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="d-flex align-items-center justify-content-center text-white rounded-2" style={{ width: '32px', height: '32px', backgroundColor: themeColor }}>
            <i className="bi bi-geo-alt-fill"></i>
          </div>
          <Link href="/lugares" className="text-decoration-underline font-inter fw-medium" style={{ color: themeColor }}>
            Lugares
          </Link>
        </div>

        {/* Title & Category Top Block */}
        <div className="mb-4">
          <h1 className="display-4 fw-bold text-gray-900 font-inter mb-2" style={{ letterSpacing: '-1px' }}>
            {place.name}
          </h1>

          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <div className="d-inline-flex rounded-1 px-2 py-1" style={{ backgroundColor: themeColorLight }}>
              <span className="font-inter fw-medium" style={{ color: themeColorText, fontSize: '13px' }}>
                {place.category}
              </span>
            </div>
            <div style={{ marginTop: '-4px' }}>
              <EventDistanceBadge eventLat={place.lat} eventLng={place.lng} type="service" />
            </div>
          </div>
        </div>

        {/* Main Grid: Info + Sidebar */}
        <div className="row g-5">

          {/* LEFT COLUMN: Main Detail */}
          <div className="col-12 col-lg-8">

            {/* Featured Image */}
            <div className="w-100 bg-gray-200 rounded-3 mb-5 overflow-hidden position-relative" style={{ height: 'clamp(300px, 50vh, 450px)' }}>
              <EventImageWithFallback
                src={place.image}
                alt={place.name}
                sizes="100vw"
              />
            </div>

            {/* Descripción / Más Información */}
            <div className="mb-5">
              <div
                className="font-inter text-gray-700 rich-text-content"
                style={{ fontSize: '16px', lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{ __html: place.description }}
              />
              <style>{`
                .rich-text-content p { margin-bottom: 0.85rem; }
                .rich-text-content p:last-child { margin-bottom: 0; }
                .rich-text-content ul, .rich-text-content ol { padding-left: 1.4rem; margin-bottom: 0.85rem; }
                .rich-text-content li { margin-bottom: 0.3rem; }
                .rich-text-content strong, .rich-text-content b { font-weight: 700; color: #1a1a2e; }
                .rich-text-content em, .rich-text-content i { font-style: italic; }
                .rich-text-content a { color: ${themeColor}; text-decoration: underline; word-break: break-all; }
                .rich-text-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
                .rich-text-content table td, .rich-text-content table th { border: 1px solid #e5e7eb; padding: 0.4rem 0.6rem; }
              `}</style>
            </div>

            {/* Mapa + Contacto Widget */}
            <ContactAndLocationWidget
              service={place}
              showContact={false}
              type="service"
            />

            {/* Botón de Contacto Desplegable */}
            <div className="mb-5">
              <EventContactButton contacts={orgData?.contacts || []} themeColor={themeColor} themeColorLight={themeColorLight} />
            </div>

            {/* Lugares Relacionados */}
            {finalRelated.length > 0 && (
              <div className="p-4 p-md-5 rounded-4 shadow-sm mb-5" style={{ backgroundColor: themeColorLight, border: `1px solid ${themeColor}30` }}>
                <h3 className="fw-bold font-inter mb-4" style={{ color: themeColorText, fontSize: '22px' }}>Lugares Relacionados</h3>
                <div className="row g-3 mb-4">
                  {finalRelated.map((rs, i) => (
                    <div className="col-12 col-md-6" key={i}>
                      <Link href={rs.slug ? `/lugares/${rs.slug}` : `/lugares/${rs.id}`} className="text-decoration-none text-reset">
                        <div className="bg-white p-3 rounded-3 border d-flex gap-3 align-items-center h-100 hover-lift transition-all" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
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
                            <div className="d-inline-flex rounded-pill px-2 py-0-5 mt-1" style={{ backgroundColor: themeColorLight, width: 'fit-content' }}>
                              <span className="font-inter fw-bold text-uppercase" style={{ color: themeColorText, fontSize: '11px', letterSpacing: '0.5px' }}>
                                {rs.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link href="/lugares" className="btn bg-white shadow-sm font-inter rounded-2 px-4 shadow-premium-subtle transition-all hover-lift text-decoration-none d-inline-flex align-items-center" style={{ color: themeColor, borderColor: themeColor }}>
                  Ver más lugares
                </Link>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar (Recommendations) */}
          <div className="col-12 col-lg-4">
            <div className="p-4 bg-white rounded-4 border shadow-sm">
              <h3 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                Nuestras Sugerencias
              </h3>

              {/* Eventos Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center justify-content-center text-white rounded-2" style={{ width: '28px', height: '28px', backgroundColor: '#f54286' }}>
                    <i className="bi bi-star-fill small"></i>
                  </div>
                  <h4 className="font-inter fw-bold m-0" style={{ color: '#f54286', fontSize: '18px' }}>Eventos</h4>
                </div>
                <div className="d-flex flex-column mb-3 border-bottom pb-2">
                  {finalEvents.map((ev, i) => (
                    <div key={i} className={i !== 0 ? 'border-top pt-1 mt-1' : ''}>
                      <SidebarListCard {...ev} />
                    </div>
                  ))}
                </div>
                <Link href="/eventos" className="font-inter text-decoration-none small fw-medium" style={{ color: '#f54286' }}>
                  Ver más eventos
                </Link>
              </div>

              {/* Actividades Sugeridas Section */}
              {finalActivities.length > 0 && (
                <div className="mb-2 pt-2">
                  <div className="d-flex align-items-center gap-2 mb-3 mt-3">
                    <div className="d-flex align-items-center justify-content-center text-white rounded-2" style={{ width: '28px', height: '28px', backgroundColor: '#8a38f5' }}>
                      <i className="bi bi-person-arms-up small"></i>
                    </div>
                    <h4 className="font-inter fw-bold m-0" style={{ color: '#8a38f5', fontSize: '18px' }}>Actividades Sugeridas</h4>
                  </div>
                  <div className="d-flex flex-column mb-3 border-bottom pb-2">
                    {finalActivities.map((ac, i) => (
                      <div key={i} className={i !== 0 ? 'border-top pt-1 mt-1' : ''}>
                        <SidebarListCard {...ac} />
                      </div>
                    ))}
                  </div>
                  <Link href="/actividades" className="font-inter text-decoration-none small fw-medium" style={{ color: '#8a38f5' }}>
                    Ver más actividades
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <ChatbotIcon />
    </div>
  );
}
