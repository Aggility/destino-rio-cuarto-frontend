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

/**
 * ServicioDetailPage - Destino Río Cuarto
 * Vista individual de una Organización/Servicio basada en los mocks "Organización - Desktop" y "Organización Ejemplo - Mobile"
 */
export default async function ServicioDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Obtener datos de la organización desde la API
  let orgData = null;
  const isNumeric = /^\d+$/.test(slug);

  if (isNumeric) {
    try {
      const res = await fetch(`http://destbackdev.aggility.io/api/v1/organizations/${slug}`, { cache: 'no-store' });
      if (res.ok) {
         orgData = (await res.json()).data;
      }
    } catch (err) {
      console.error("Error fetching organization by ID:", err);
    }
  }

  if (!orgData) {
    try {
      const res = await fetch(`http://destbackdev.aggility.io/api/v1/organizations?slug=${slug}`, { cache: 'no-store' });
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
  const service = {
    id: orgData?.id || id || '1',
    name: orgData?.name || '47 Street',
    category: orgData?.categories?.[0]?.name || 'Tiendas de Ropa',
    address: orgData?.addresses?.[0]?.address || 'Hipólito Irigoyen 3076, Río Cuarto',
    lat: orgData?.addresses?.[0]?.latitude || -33.1293,
    lng: orgData?.addresses?.[0]?.longitude || -64.3496,
    phones: orgData?.phone ? [orgData.phone] : ['358 475-4624', '358 422-1360'],
    socials: [
      { type: 'web', label: 'www.47street.com', url: 'https://www.47street.com', icon: 'bi-link-45deg' },
      { type: 'instagram', label: 'Instagram', url: '#', icon: 'bi-instagram' },
      { type: 'facebook', label: 'facebook', url: '#', icon: 'bi-facebook' }
    ],
    description: orgData?.description || 'Empresa que brinda servicio de transporte automotor interurbano regular de pasajeros y servicio de transporte automotor turístico de pasajeros.',
    image: getThumbnail(orgData?.cover, orgData?.gallery)
  };

  // 3. Obtener Datos para Recomendaciones (Eventos y Organizaciones Relacionadas)
  let nearbyEvents = [];
  let relatedOrgs = [];

  try {
    // Buscar eventos cercanos
    const resEvents = await fetch(`http://destbackdev.aggility.io/api/v1/events`, { cache: 'no-store' });
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

    // Buscar organizaciones relacionadas (mismo rubro)
    const resOrgs = await fetch(`http://destbackdev.aggility.io/api/v1/organizations?per_page=50`, { cache: 'no-store' });
    if (resOrgs.ok) {
        let allOrgs = (await resOrgs.json()).data || [];
        // Filtramos servicios inactivos
        allOrgs = allOrgs.filter(org => org.status?.toLowerCase() !== 'inactive');

        relatedOrgs = allOrgs
          .filter(org => org.id !== service.id && org.categories?.some(c => c.name === service.category))
          .slice(0, 4)
          .map(org => ({
            id: org.id,
            slug: org.slug,
            title: org.name,
            category: org.categories?.[0]?.name || 'Servicio',
            address: org.addresses?.[0]?.address?.split(',')[0] || 'Río Cuarto',
            phone: org.phone || 'Consultar contacto',
            thumbnail: getThumbnail(org.cover, org.gallery)
          }));
    }
  } catch (err) {
    console.error("Error fetching recommendations:", err);
  }

  // Fallbacks si no hay datos reales suficientes
  const finalRelated = relatedOrgs.length > 0 ? relatedOrgs : [
    { title: '3G Bebidas S.A.S', category: 'Tienda de Bebidas', address: 'Hipólito Irigoyen 3076, Río Cuarto', phone: '358 475-4624', thumbnail: '/Thumbnail.png' },
    { title: '3G Bebidas S.A.S', category: 'Tienda de Bebidas', address: 'Hipólito Irigoyen 3076, Río Cuarto', phone: '358 475-4624', thumbnail: '/Thumbnail.png' }
  ];

  const finalEvents = nearbyEvents.length > 0 ? nearbyEvents : [
    { title: 'Cine Bajo las Estrellas', subtitle: 'Parque Sarmiento', badge: '15 DIC', type: 'event', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300', href: '#' }
  ];

  const suggestedActivities = [
    { title: 'Circuito del Bienestar', subtitle: 'Río Cuarto', badge: '4 Lugares', type: 'activity', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300', href: '#' },
    { title: 'Circuito del Bienestar', subtitle: 'Río Cuarto', badge: '4 Lugares', type: 'activity', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300', href: '#' },
    { title: 'Circuito del Bienestar', subtitle: 'Río Cuarto', badge: '4 Lugares', type: 'activity', thumbnail: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=300', href: '#' }
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
            <div className="mb-3">
                <EventDistanceBadge eventLat={service.lat} eventLng={service.lng} type="service" />
            </div>
            <div className="d-inline-flex bg-primary-100 rounded-1 px-2 py-1 mb-3" style={{ backgroundColor: '#e1effe' }}>
                <span className="font-inter fw-medium text-primary-800" style={{ color: '#1e429f', fontSize: '13px' }}>
                    {service.category}
                </span>
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

                {/* Más Información */}
                <div className="mb-5">
                    <h2 className="h4 fw-bold font-inter text-gray-900 mb-3" style={{ fontSize: '24px' }}>Más Información</h2>
                    <p className="font-inter text-gray-700" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        {service.description}
                    </p>
                </div>

                {/* Otras ubicaciones relacionadas */}
                <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: '#f0f7ff', border: '1px solid #e1effe' }}>
                    <h3 className="fw-bold font-inter mb-4" style={{ color: '#1e429f', fontSize: '22px' }}>Otras ubicaciones relacionadas</h3>
                    <div className="row g-3 mb-4">
                        {finalRelated.map((rs, i) => (
                            <div className="col-12 col-md-6" key={i}>
                                <ServiceListItem 
                                    id={rs.id}
                                    slug={rs.slug}
                                    title={rs.title}
                                    category={rs.category}
                                    address={rs.address}
                                    phone={rs.phone}
                                    thumbnail={rs.thumbnail}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-outline-primary bg-white shadow-sm font-inter text-primary rounded-2 px-4 shadow-premium-subtle transition-all hover-lift" style={{ color: '#1a56db', borderColor: '#a4cafe' }}>
                        Ver más
                    </button>
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
                            Ver más Actividades
                        </Link>
                    </div>

                    {/* Actividades Turísticas Section */}
                    <div className="mb-2 pt-2">
                        <div className="d-flex align-items-center gap-2 mb-3 mt-3">
                            <div className="d-flex align-items-center justify-content-center text-white rounded-2" style={{ width: '28px', height: '28px', backgroundColor: '#8a38f5' }}>
                                <i className="bi bi-person-arms-up small"></i>
                            </div>
                            <h4 className="font-inter fw-bold m-0" style={{ color: '#8a38f5', fontSize: '18px' }}>Actividades Turísticas</h4>
                        </div>
                        <div className="d-flex flex-column mb-3 border-bottom pb-2">
                            {suggestedActivities.map((ac, i) => (
                                <div key={i} className={i !== 0 ? 'border-top pt-1 mt-1' : ''}>
                                    <SidebarListCard {...ac} />
                                </div>
                            ))}
                        </div>
                        <Link href="/actividades" className="font-inter text-decoration-none small fw- medium" style={{ color: '#8a38f5' }}>
                            Ver más Experiencias
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
