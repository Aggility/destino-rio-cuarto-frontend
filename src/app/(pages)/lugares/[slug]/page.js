import React from 'react';
import Link from 'next/link';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import ContactAndLocationWidget from '@/components/client/ContactAndLocationWidget';
import UserDistanceBadge from '@/components/client/UserDistanceBadge';
import ExpandableDescription from '@/components/client/ExpandableDescription';
import { getThumbnail } from '@/utils/image';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import EventCard from '@/components/server/EventCard';
import ShareButton from '@/components/client/ShareButton';
import EventGallerySlider from '@/components/client/EventGallerySlider';

export const revalidate = 300;

/**
 * PlaceDetailPage - Destino Río Cuarto
 * Implementa la vista individual de un lugar adaptando el estilo visual y la estructura
 * de la página individual de eventos (/eventos/[slug]).
 */
export default async function PlaceDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const { id: queryId } = await searchParams;

  const themeColor = '#059669';
  const themeColorLight = '#ecfdf5';

  let placeData = null;
  const isNumeric = /^\d+$/.test(slug);
  const fetchId = queryId || (isNumeric ? slug : null);

  // 1. Obtener datos del lugar desde la API de organizaciones
  if (fetchId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${fetchId}`, { cache: 'no-store' });
      if (res.ok) {
        placeData = (await res.json()).data;
      }
    } catch (err) {
      console.error("Error fetching place by ID:", err);
    }
  }

  if (!placeData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?per_page=500`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        const match = list.find(org => org.slug === slug || String(org.id) === String(slug));
        if (match) {
          placeData = match;
        }
      }
    } catch (err) {
      console.error("Error fetching place by slug:", err);
    }
  }

  if (!placeData) {
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

  // 2. Formateo de los datos del lugar
  const categoryName = placeData.categories?.[0]?.name?.trim() || 'Lugar Destacado';
  const mainAddress = placeData.addresses?.[0];
  const placeLat = parseFloat(mainAddress?.latitude) || null;
  const placeLng = parseFloat(mainAddress?.longitude) || null;

  const place = {
    id: placeData.id,
    slug: placeData.slug,
    title: placeData.name || 'Sin título',
    category: categoryName,
    location: mainAddress?.address?.split(',')[0] || placeData.name || 'Río Cuarto',
    fullAddress: mainAddress?.address || 'Río Cuarto, Córdoba',
    city: mainAddress?.city || 'Río Cuarto',
    coords: {
      lat: placeLat,
      lng: placeLng
    },
    excerpt: placeData.excerpt || '',
    fullDescription: placeData.description || placeData.excerpt || 'Lugar de interés turístico y cultural en Río Cuarto.',
    thumbnail: getThumbnail(placeData.cover, placeData.gallery),
    gallery: placeData.gallery || [],
    phone: placeData.phone || placeData.contacts?.[0]?.value || null,
    contacts: placeData.contacts || []
  };

  // Fotos para el slider de galería
  const galleryImages = (place.gallery && place.gallery.length > 0)
    ? place.gallery.map(img => getThumbnail(img))
    : [place.thumbnail];

  // 3. Cargar eventos y actividades en este lugar o sugerencias
  let relatedEvents = [];
  try {
    const resEvents = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=50`, { cache: 'no-store' });
    if (resEvents.ok) {
      const eventsData = await resEvents.json();
      const allEvents = Array.isArray(eventsData) ? eventsData : (eventsData.data || []);
      
      // Filtrar eventos asociados a esta organización o eventos recientes
      const matching = allEvents.filter(e => e.organization?.id === place.id || e.status?.toLowerCase() !== 'inactive');
      
      relatedEvents = matching.slice(0, 6).map(e => ({
        id: e.id,
        slug: e.slug,
        title: e.title || 'Evento',
        date: e.calendars?.[0]?.start_date
          ? new Date(e.calendars[0].start_date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
          : 'Consultar',
        location: e.organization?.name || place.title,
        thumbnail: getThumbnail(e.cover, e.gallery),
        category: e.categories?.[0]?.name?.toUpperCase() || 'EVENTO',
        typeColor: '#f54286',
        lat: parseFloat(e.organization?.addresses?.[0]?.latitude) || null,
        lng: parseFloat(e.organization?.addresses?.[0]?.longitude) || null,
        basePath: 'eventos'
      }));
    }
  } catch (err) {
    console.error('Error fetching related events for place:', err);
  }

  return (
    <div className="bg-white min-vh-100 pb-5 font-inter">

      {/* ── BREADCRUMB + BOTÓN VOLVER ── */}
      <div className="container-xxl pt-4 pb-2 px-lg-5">
        <div className="d-flex align-items-center justify-content-between">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 align-items-center">
              <li className="breadcrumb-item">
                <Link href="/" className="text-decoration-none text-muted small hover-primary">
                  Inicio
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/lugares" className="text-decoration-none text-muted small hover-primary">
                  Lugares
                </Link>
              </li>
              <li className="breadcrumb-item active small text-truncate max-w-xs" aria-current="page">
                {place.title}
              </li>
            </ol>
          </nav>

          <Link href="/lugares" className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-none d-sm-inline-flex align-items-center gap-1">
            <i className="bi bi-arrow-left"></i> Volver a lugares
          </Link>
        </div>
      </div>

      {/* ── HERO BANNER / SLIDER DE IMÁGENES ── */}
      <div className="container-xxl px-lg-5 mb-4">
        <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '480px' }}>
          {galleryImages.length > 1 ? (
            <EventGallerySlider images={galleryImages} title={place.title} />
          ) : (
            <div className="w-100 position-relative" style={{ height: '360px', maxHeight: '480px' }}>
              <img
                src={place.thumbnail}
                alt={place.title}
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)' }}></div>
            </div>
          )}

          {/* Badge de Categoría flotante */}
          <div className="position-absolute top-0 start-0 m-3 z-2">
            <span className="badge text-white px-3 py-2 fw-semibold rounded-2 shadow-sm font-inter" style={{ backgroundColor: themeColor, fontSize: '13px' }}>
              {place.category}
            </span>
          </div>

          {/* Distancia si se dispone de coordenadas */}
          {place.coords.lat && place.coords.lng && (
            <div className="position-absolute top-0 end-0 m-3 z-2">
              <UserDistanceBadge lat={place.coords.lat} lng={place.coords.lng} />
            </div>
          )}
        </div>
      </div>

      {/* ── DETALLE PRINCIPAL DEL LUGAR ── */}
      <div className="container-xxl px-lg-5">
        <div className="row g-4 g-lg-5">

          {/* Columna Izquierda: Información, Título y Descripción */}
          <div className="col-12 col-lg-8">

            {/* Título e Insignias */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge px-3 py-2 font-inter fw-medium rounded-pill" style={{ backgroundColor: themeColorLight, color: themeColor }}>
                  <i className="bi bi-geo-alt-fill me-1"></i> {place.category}
                </span>
                {place.coords.lat && place.coords.lng && (
                  <EventDistanceBadge eventLat={place.coords.lat} eventLng={place.coords.lng} minimal={false} />
                )}
              </div>

              <h1 className="fw-bold text-gray-900 font-inter mb-3" style={{ fontSize: 'clamp(26px, 5vw, 38px)', letterSpacing: '-0.5px' }}>
                {place.title}
              </h1>

              <div className="d-flex align-items-center text-muted font-inter gap-2 mb-3">
                <i className="bi bi-geo-alt text-success fs-5"></i>
                <span className="fw-medium text-gray-700">{place.fullAddress}</span>
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            {/* Descripción expandible */}
            <div className="mb-5">
              <h3 className="h5 fw-bold text-gray-900 font-inter mb-3">Acerca de este lugar</h3>
              <ExpandableDescription htmlContent={place.fullDescription} />
            </div>

            {/* Botón de Compartir */}
            <div className="mb-4">
              <ShareButton title={place.title} text={`Descubrí ${place.title} en Río Cuarto`} />
            </div>

          </div>

          {/* Columna Derecha: Widget de Contacto y Mapa */}
          <div className="col-12 col-lg-4">
            <div className="position-sticky" style={{ top: '110px' }}>
              <ContactAndLocationWidget
                name={place.title}
                address={place.fullAddress}
                targetLat={place.coords.lat}
                targetLng={place.coords.lng}
                phone={place.phone}
                contacts={place.contacts}
                themeColor={themeColor}
              />
            </div>
          </div>

        </div>

        {/* ── SECCIÓN DE EVENTOS O ACTIVIDADES RELACIONADAS EN ESTE LUGAR ── */}
        {relatedEvents.length > 0 && (
          <div className="mt-5 pt-5 border-top">
            <HomeSectionSlider title="Eventos y Actividades Destacadas">
              {relatedEvents.map((evt) => (
                <div key={evt.id} className="flex-shrink-0" style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}>
                  <EventCard
                    id={evt.id}
                    slug={evt.slug}
                    title={evt.title}
                    date={evt.date}
                    location={evt.location}
                    category={evt.category}
                    typeColor={evt.typeColor}
                    thumbnail={evt.thumbnail}
                    lat={evt.lat}
                    lng={evt.lng}
                    basePath={evt.basePath}
                  />
                </div>
              ))}
            </HomeSectionSlider>
          </div>
        )}

      </div>

      <ChatbotIcon />
    </div>
  );
}
