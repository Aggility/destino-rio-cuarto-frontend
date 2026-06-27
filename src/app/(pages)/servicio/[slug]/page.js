import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import SidebarListCard from '@/components/server/SidebarListCard';
import ServiceListItem from '@/components/server/ServiceListItem';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import { getNearbyLocations } from "@/utils/geo";
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import EventImageWithFallback from '@/components/client/EventImageWithFallback';
import { getThumbnail } from '@/utils/image';
import ContactButtons from '@/components/client/ContactButtons';

/**
 * ServicioDetailPage - Destino Río Cuarto
 * Vista individual de una Organización/Servicio basada en los mocks "Organización - Desktop" y "Organización Ejemplo - Mobile"
 */
export default async function ServicioDetailPage({ params }) {
  const { slug } = await params;  // 1. Obtener datos de la organización desde la API
  let orgData = null;
  const isNumeric = /^\d+$/.test(slug);

  if (isNumeric) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${slug}`, { cache: 'no-store' });
      if (res.ok) {
         orgData = (await res.json()).data;
      }
    } catch (err) {
      console.error("Error fetching organization by ID:", err);
    }
  }

  if (!orgData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?slug=${slug}`, { cache: 'no-store' });
      if (res.ok) {
         const json = await res.json();
         const list = json.data || json;
         if (Array.isArray(list) && list.length > 0) {
            orgData = list[0];
         }
      }
    } catch (err) {
      console.error("Error fetching organization by slug:", err);
    }
  }

  // 2. Mapeo de datos (Fallback por si falla la API o faltan datos)
  const phoneContact = orgData?.contacts?.find(c => c.type === 'phone' || c.type === 'telephone');
  const whatsappContact = orgData?.contacts?.find(c => c.type === 'whatsapp');
  const instagramContact = orgData?.contacts?.find(c => c.type === 'instagram');
  const facebookContact = orgData?.contacts?.find(c => c.type === 'facebook');
  const webContact = orgData?.contacts?.find(c => c.type === 'web');

  const service = {
    id: orgData?.id || '1',
    name: orgData?.name || '47 Street',
    category: orgData?.categories?.[0]?.name || 'Tiendas de Ropa',
    address: orgData?.addresses?.[0]?.address || 'Hipólito Irigoyen 3076, Río Cuarto',
    lat: orgData?.addresses?.[0]?.latitude || -33.1293,
    lng: orgData?.addresses?.[0]?.longitude || -64.3496,
    phone: phoneContact?.value || orgData?.phone || '',
    whatsapp: whatsappContact?.value || '',
    instagram: instagramContact?.value || '',
    facebook: facebookContact?.value || '',
    web: webContact?.value || '',
    description: orgData?.description || 'Empresa que brinda servicio de transporte automotor interurbano regular de pasajeros y servicio de transporte automotor turístico de pasajeros.',
    image: getThumbnail(orgData?.cover, orgData?.gallery)
  };

  // 3. Obtener Datos para Recomendaciones (Eventos, Organizaciones y Actividades Relacionadas)
  let nearbyEvents = [];
  let relatedOrgs = [];
  let realActivities = [];

  try {
    // Buscar eventos cercanos
    const resEvents = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { cache: 'no-store' });
    if (resEvents.ok) {
       const allEvents = (await resEvents.json()).data || [];
       const formattedEvents = allEvents.map(ev => ({
         ...ev,
         lat: ev.organization?.addresses?.[0]?.latitude,
         lng: ev.organization?.addresses?.[0]?.longitude
       }));
       // Filtrar por cercanía (3km)
       const center = { lat: service.lat, lng: service.lng };
       const nearby = getNearbyLocations(center, formattedEvents, 3000);
       
       nearbyEvents = nearby
          .filter(ev => ev.status?.toLowerCase() !== 'inactive')
          .slice(0, 3)
          .map(ev => ({
             id: ev.id,
             title: ev.title,
             subtitle: ev.organization?.name || 'Río Cuarto',
             badge: ev.calendars?.[0]?.start_date ? new Date(ev.calendars[0].start_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).toUpperCase() : 'PRÓXIMAMENTE',
             type: 'event',
             thumbnail: getThumbnail(ev.cover, ev.gallery),
             lat: ev.lat,
             lng: ev.lng,
             href: `/eventos/${ev.slug || ev.id}`
          }));
    }

    // Buscar organizaciones relacionadas (mismo rubro/categoría)
    const categoryId = orgData?.categories?.[0]?.id;
    const relatedQuery = categoryId 
      ? `category_id=${categoryId}` 
      : `category=${encodeURIComponent(service.category)}`;

    const resOrgs = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?${relatedQuery}&per_page=50`, { cache: 'no-store' });
    if (resOrgs.ok) {
        let allOrgs = (await resOrgs.json()).data || [];
        // Filtramos servicios inactivos
        allOrgs = allOrgs.filter(org => org.status?.toLowerCase() !== 'inactive');

        relatedOrgs = allOrgs
          .filter(org => org.id !== service.id)
          .slice(0, 4)
          .map(org => ({
            id: org.id,
            slug: org.slug,
            title: org.name,
            category: org.categories?.[0]?.name || service.category,
            address: org.addresses?.[0]?.address || 'Río Cuarto',
            phone: org.phone || 'Consultar contacto',
            thumbnail: getThumbnail(org.cover, org.gallery)
          }));
    }

    // Buscar actividades reales desde el endpoint /proposals
    const resProp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals?per_page=50`, { cache: 'no-store' });
    if (resProp.ok) {
       const propData = await resProp.json();
       const list = Array.isArray(propData) ? propData : (propData.data || []);
       const allActivities = list.filter(p => 
          p.status?.toLowerCase() !== 'inactive' &&
          p.types?.some(t => t.key === 'activity' || t.slug === 'actividad')
       );

       // Filtrar las vinculadas a esta organización (si aplica)
       const orgIdStr = String(service.id);
       const relatedToOrg = allActivities.filter(p => 
          p.organization_id === service.id || 
          String(p.organization?.id) === orgIdStr ||
          p.addresses?.some(addr => String(addr.organization?.id) === orgIdStr)
       );

       // Rellenar hasta 3 con otras actividades
       let selectedActs = [...relatedToOrg];
       if (selectedActs.length < 3) {
          const others = allActivities.filter(p => !relatedToOrg.some(r => r.id === p.id));
          selectedActs = [...selectedActs, ...others.slice(0, 3 - selectedActs.length)];
       } else {
          selectedActs = selectedActs.slice(0, 3);
       }

       realActivities = selectedActs.map(p => {
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
  } catch (err) {
    console.error("Error fetching recommendations:", err);
  }

  // Fallbacks si no hay datos reales suficientes
  const finalRelated = relatedOrgs.length > 0 ? relatedOrgs : [
    { title: '3G Bebidas S.A.S', category: 'Tienda de Bebidas', address: 'Hipólito Irigoyen 3076, Río Cuarto', phone: '358 475-4624', thumbnail: '/Thumbnail.png' },
    { title: 'Gibar', category: 'Comercio', address: 'San Martín 123, Río Cuarto', phone: '358 412-3456', thumbnail: '/Thumbnail.png' },
    { title: 'El Aljibe', category: 'Gastronomía', address: 'Belgrano 456, Río Cuarto', phone: '358 456-7890', thumbnail: '/Thumbnail.png' },
    { title: 'Parque Hotel', category: 'Alojamiento', address: 'Sobremonte 789, Río Cuarto', phone: '358 489-0123', thumbnail: '/Thumbnail.png' }
  ];

  const finalEvents = nearbyEvents.length > 0 ? nearbyEvents : [
    { title: 'Cine Bajo las Estrellas', subtitle: 'Parque Sarmiento', badge: '15 DIC', type: 'event', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300&q=80&w=300', href: '#' }
  ];

  const finalActivities = realActivities.length > 0 ? realActivities : [
    { title: 'Parque Ecológico Urbano', subtitle: 'Río Cuarto', badge: 'Naturaleza', type: 'activity', thumbnail: '/no-img.webp', href: '/actividades/parque-ecologico-urbano' },
    { title: 'Taller de Fotografía', subtitle: 'Río Cuarto', badge: 'Taller', type: 'activity', thumbnail: '/no-img.webp', href: '/actividades/taller-de-fotografia-y-narrativa-visual' },
    { title: 'Taller de Historietas', subtitle: 'Río Cuarto', badge: 'Taller', type: 'activity', thumbnail: '/no-img.webp', href: '/actividades/taller-de-historietas-breves' }
  ];

  return (
    <div className="bg-white min-vh-100 pb-5">
      <div className="container-xxl px-lg-5 pt-4">
        
        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-2" style={{ width: '32px', height: '32px', backgroundColor: '#1a56db' }}>
                <i className="bi bi-shop"></i>
            </div>
            <Link href="/servicios" className="text-decoration-underline font-inter fw-medium" style={{ color: '#1a56db' }}>
                Servicios
            </Link>
        </div>

        {/* Title & Category Top Block */}
        <div className="mb-4">
            <h1 className="display-4 fw-bold text-gray-900 font-inter mb-2" style={{ letterSpacing: '-1px' }}>
                {service.name}
            </h1>
            
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <div className="d-inline-flex bg-primary-100 rounded-1 px-2 py-1" style={{ backgroundColor: '#e1effe' }}>
                  <span className="font-inter fw-medium text-primary-800" style={{ color: '#1e429f', fontSize: '13px' }}>
                      {service.category}
                  </span>
              </div>
              <div style={{ marginTop: '-4px' }}>
                <EventDistanceBadge eventLat={service.lat} eventLng={service.lng} type="service" />
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
                        src={service.image} 
                        alt={service.name} 
                        sizes="100vw"
                    />
                </div>

                {/* Ubicación y Contacto Component (Mini Mapa + Info + Routing) */}
                <h2 className="h4 fw-bold font-inter text-gray-900 mb-4" style={{ fontSize: '24px' }}>Ubicación y Contacto</h2>
                
                <ContactAndLocationWidget 
                    service={service} 
                    showContact={false}
                    type={
                        service.category.toLowerCase().includes('alojamiento') ? 'alojamiento' : 
                        service.category.toLowerCase().includes('gastronomía') ? 'gastronomia' : 'service'
                    }
                />

                {/* Botones de Contacto Rápido */}
                {(service.phone || service.whatsapp) && (
                  <div className="mb-4">
                    <ContactButtons phone={service.phone} whatsapp={service.whatsapp} />
                  </div>
                )}

                {/* Redes Sociales y Web */}
                {(service.instagram || service.facebook || service.web) && (
                  <div className="d-flex align-items-center flex-wrap gap-3 mb-5 mt-4 p-3 bg-light rounded-3 border">
                    <span className="font-inter fw-bold text-gray-900 small m-0">Redes y Sitio Web:</span>
                    <div className="d-flex align-items-center gap-2">
                      {service.web && (
                        <a href={service.web} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all hover-lift" style={{ width: '38px', height: '38px', borderColor: '#bfdbfe' }} title="Visitar Sitio Web">
                          <i className="bi bi-globe" style={{ fontSize: '16px' }}></i>
                        </a>
                      )}
                      {service.instagram && (
                        <a href={service.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all hover-lift" style={{ width: '38px', height: '38px', borderColor: '#fecaca' }} title="Ver Instagram">
                          <i className="bi bi-instagram" style={{ fontSize: '16px' }}></i>
                        </a>
                      )}
                      {service.facebook && (
                        <a href={service.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all hover-lift" style={{ width: '38px', height: '38px', borderColor: '#bfdbfe' }} title="Ver Facebook">
                          <i className="bi bi-facebook" style={{ fontSize: '16px' }}></i>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Más Información */}
                <div className="mb-5">
                    <h2 className="h4 fw-bold font-inter text-gray-900 mb-3" style={{ fontSize: '24px' }}>Más Información</h2>
                    <div
                        className="font-inter text-gray-700 rich-text-content"
                        style={{ fontSize: '16px', lineHeight: '1.7' }}
                        dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    <style>{`
                        .rich-text-content p { margin-bottom: 0.85rem; }
                        .rich-text-content p:last-child { margin-bottom: 0; }
                        .rich-text-content ul, .rich-text-content ol { padding-left: 1.4rem; margin-bottom: 0.85rem; }
                        .rich-text-content li { margin-bottom: 0.3rem; }
                        .rich-text-content strong, .rich-text-content b { font-weight: 700; color: #1a1a2e; }
                        .rich-text-content em, .rich-text-content i { font-style: italic; }
                        .rich-text-content a { color: #1a56db; text-decoration: underline; word-break: break-all; }
                        .rich-text-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
                        .rich-text-content table td, .rich-text-content table th { border: 1px solid #e5e7eb; padding: 0.4rem 0.6rem; }
                    `}</style>
                </div>

                {/* Servicios relacionados */}
                <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: '#f0f7ff', border: '1px solid #e1effe' }}>
                    <h3 className="fw-bold font-inter mb-4" style={{ color: '#1e429f', fontSize: '22px' }}>Servicios Relacionados</h3>
                    <div className="row g-3 mb-4">
                        {finalRelated.map((rs, i) => (
                            <div className="col-12 col-md-6" key={i}>
                                <Link href={rs.slug ? `/servicio/${rs.slug}` : `/servicio/${rs.id}`} className="text-decoration-none text-reset">
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
                                            <div className="d-inline-flex rounded-pill px-2 py-0-5 mt-1" style={{ backgroundColor: '#e1effe', width: 'fit-content' }}>
                                                <span className="font-inter fw-bold text-primary-800 text-uppercase" style={{ color: '#1e429f', fontSize: '11px', letterSpacing: '0.5px' }}>
                                                    {rs.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link href="/servicios" className="btn btn-outline-primary bg-white shadow-sm font-inter text-primary rounded-2 px-4 shadow-premium-subtle transition-all hover-lift text-decoration-none d-inline-flex align-items-center" style={{ color: '#1a56db', borderColor: '#a4cafe' }}>
                        Ver más
                    </Link>
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar (Recommendations) */}
            <div className="col-12 col-lg-4">
                <div className="p-4 bg-white rounded-4 border shadow-sm position-sticky" style={{ top: '120px' }}>
                    <h3 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                        También te puede interesar
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
                        <Link href="/eventos" className="font-inter text-decoration-none small fw-medium text-pink-500" style={{ color: '#f54286' }}>
                            Ver más eventos
                        </Link>
                    </div>

                    {/* Actividades Sugeridas Section */}
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
                </div>
            </div>
        </div>
      </div>

      <ChatbotIcon />
    </div>
  );
}
