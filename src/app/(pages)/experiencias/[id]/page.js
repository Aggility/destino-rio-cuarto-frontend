import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ExperienceInteractiveMap from '@/components/client/ExperienceInteractiveMap';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import ContactButtons from '@/components/client/ContactButtons';
import EventCard from '@/components/server/EventCard';
import PlacesSlider from '@/components/client/PlacesSlider';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';

/**
 * ExperienceDetailPage - Destino Río Cuarto
 * Diseño unificado con fondo desenfocado y visualización original.
 */
export default async function ExperienceDetailPage({ params }) {
  const { id } = await params;

  // Obtener Organizaciones para buscar imágenes de las paradas
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

  // Moqueo de datos para la experiencia
  const experienceData = {
    'respira-aire-libre': {
        title: 'Respira Aire Libre: Parque Sarmiento',
        category: 'Aire Libre',
        duration: '2 a 5 horas',
        language: 'N/A',
        rating: 4.7,
        reviews: 89,
        description: 'Disfrutá de la naturaleza en el pulmón verde más grande de Río Cuarto. Un paseo ideal para familias.',
        fullDescription: 'El Parque Sarmiento ofrece una variedad de actividades recreativas. Comenzaremos con el clásico paseo en trencito que recorre todo el predio, luego disfrutaremos de un momento de paz en el lago con los botes a pedal, y terminaremos visitando la feria de emprendedores locales donde podrás encontrar artesanías únicas.',
        thumbnail: '/psarmiento.jfif',
        price: 'Gratis / Pago x Actividad',
        coords: { lat: -33.10636300, lng: -64.33748200 },
        stops: [
            { id: 1, name: 'Parque Sarmiento', lat: -33.10636300, lng: -64.33748200, description: 'Pulmón verde de la ciudad con recreación y naturaleza.', icon: 'bi-tree' },
            { id: 2, name: 'Anfiteatro Atahualpa Yupanqui', lat: -33.10602300, lng: -64.33399800, description: 'Escenario de grandes eventos en el corazón del parque.', icon: 'bi-mic-fill' },
            { id: 3, name: 'Botes en el Lago', lat: -33.10750000, lng: -64.33500000, description: 'Paseo relajante por el lago artificial del Parque Sarmiento.', icon: 'bi-water' }
        ]
    },
    'recorrido-7-iglesias': {
        title: 'Recorrido de las 7 Iglesias',
        category: 'Religioso',
        duration: '3 a 4 horas',
        language: 'Español',
        rating: 4.9,
        reviews: 56,
        description: 'Un circuito de reflexión y patrimonio arquitectónico por los templos más significativos del centro.',
        fullDescription: 'Este recorrido tradicional, emblemático de Semana Santa, te lleva por siete templos significativos de Río Cuarto. Iniciamos en la Catedral frente a Plaza Roca y recorremos los hitos espirituales y arquitectónicos que definen la identidad de la ciudad.',
        thumbnail: 'https://images.unsplash.com/photo-1548625235-36af58169128?auto=format&fit=crop&q=80&w=600',
        price: 'Gratis',
        coords: { lat: -33.12373200, lng: -64.35115100 },
        stops: [
            { id: 1, name: 'Catedral (Villa de la Concepción)', lat: -33.12373200, lng: -64.35115100, description: 'Sede de la Diócesis, frente a Plaza Roca.', icon: 'bi-bank' },
            { id: 2, name: 'Iglesia San Francisco Solano', lat: -33.12226900, lng: -64.35029400, description: 'Histórico templo con gran valor patrimonial.', icon: 'bi-bank' },
            { id: 3, name: 'Parroquia San Roque', lat: -33.11482100, lng: -64.35757800, description: 'Ubicada en una zona residencial histórica.', icon: 'bi-bank' },
            { id: 4, name: 'Santuario Ntra. Sra. de Fátima', lat: -33.12281800, lng: -64.36166400, description: 'Lugar de gran devoción mariana.', icon: 'bi-bank' },
            { id: 5, name: 'Parroquia Ntra. Sra. de Luján', lat: -33.13154900, lng: -64.35654600, description: 'Dedicada a la patrona de la Argentina.', icon: 'bi-bank' },
            { id: 6, name: 'Parroquia de La Merced', lat: -33.13396600, lng: -64.33442500, description: 'Emblemática iglesia de la zona sur.', icon: 'bi-bank' },
            { id: 7, name: 'Parroquia Santa Lucía', lat: -33.14415700, lng: -64.34496200, description: 'Ubicada en el sector de Banda Norte.', icon: 'bi-bank' }
        ]
    },
    'recorrido-historico-cultural': {
        title: 'Recorrido Histórico Cultural',
        category: 'Cultural',
        duration: '2.5 horas',
        language: 'Español',
        rating: 4.8,
        reviews: 42,
        description: 'Viaja en el tiempo conociendo los edificios más emblemáticos del poder y el arte local.',
        fullDescription: 'Río Cuarto respira historia en sus muros. En este paseo visitaremos el Palacio Municipal, joya arquitectónica del centro, el Teatro Municipal donde late el arte riocuartense, y culminaremos en el Paseo del Andino para entender nuestras raíces ferroviarias.',
        thumbnail: '/museo-historico.jpg',
        price: 'Gratis',
        coords: { lat: -33.12565000, lng: -64.35014100 },
        stops: [
            { id: 1, name: 'Teatro Municipal', lat: -33.12565000, lng: -64.35014100, description: 'Icono del arte y la cultura de Río Cuarto.', icon: 'bi-music-note-beamed' },
            { id: 2, name: 'Museo Histórico Regional', lat: -33.12108900, lng: -64.34935500, description: 'Resguardo de la memoria local en la casa Fotheringham.', icon: 'bi-compass' },
            { id: 3, name: 'Museo del Riel', lat: -33.12987100, lng: -64.34008000, description: 'Memoria ferroviaria en el predio del Andino.', icon: 'bi-train-front' }
        ]
    }
  };

  const experience = experienceData[id] || experienceData['respira-aire-libre'];
  const themeColor = '#ff5a1f'; // Color institucional de Experiencias

  return (
    <div className="bg-white min-vh-100 pb-5">
      
      {/* 1. HERO HEADER — Fondo desenfocado y foto original */}
      <section className="position-relative overflow-hidden bg-dark d-flex align-items-center justify-content-center" 
               style={{ height: 'clamp(300px, 45vh, 480px)' }}>
        {/* Fondo desenfocado */}
        <img 
          src={experience.thumbnail} 
          alt="" 
          className="position-absolute w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(20px)', opacity: 0.6, transform: 'scale(1.1)' }}
        />
        {/* Imagen principal (Contenida) */}
        <img 
          src={experience.thumbnail} 
          alt={experience.title} 
          className="position-relative h-100 mw-100 shadow-lg"
          style={{ objectFit: 'contain', zIndex: 1 }}
        />
        {/* Overlay transparente */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0)', zIndex: 2 }}></div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container-xxl px-lg-5 position-relative z-1 mb-5" style={{ marginTop: '-80px' }}>
        <div className="row g-5">
            
            {/* Left Column: Details & Map */}
            <div className="col-12 col-lg-8">
                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm h-100">
                    
                    {/* Header: Category & Title */}
                    <div className="bg-white">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="rounded-2 p-1 d-flex align-items-center justify-content-center" 
                                 style={{ backgroundColor: themeColor, width: '32px', height: '32px' }}>
                                <i className="bi bi-compass text-white small"></i>
                            </div>
                            <span className="font-inter fw-semibold" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                                {experience.category}
                            </span>
                        </div>
                        
                        <h1 className="display-5-custom fw-bold text-gray-900 font-inter mb-3" style={{ letterSpacing: '-1px' }}>
                            {experience.title}
                        </h1>

                        <div className="d-flex align-items-center gap-3 text-muted mb-4">
                            <span className="badge rounded-pill px-3 py-2 border" style={{ backgroundColor: '#f9fafb', color: '#4b5563' }}>
                                <i className="bi bi-star-fill text-warning me-1"></i> {experience.rating} ({experience.reviews} reseñas)
                            </span>
                            <span className="d-flex align-items-center gap-1 small fw-medium">
                                <i className="bi bi-clock"></i> {experience.duration}
                            </span>
                            {experience.coords && (
                                <EventDistanceBadge eventLat={experience.coords.lat} eventLng={experience.coords.lng} type="experience" />
                            )}
                        </div>
                    </div>

                    {/* Abstract & Benefits */}
                    <div className="mb-5 pt-4 border-top">
                        <h2 className="fw-bold mb-4 font-inter" style={{ fontSize: '24px', color: '#111928' }}>Sobre esta experiencia</h2>
                        <p className="lead font-inter text-gray-700 mb-4" style={{ lineHeight: '1.6' }}>
                            {experience.description}
                        </p>

                        <div className="font-inter text-gray-800" style={{ lineHeight: '1.8', fontSize: '17px' }}>
                            {experience.fullDescription.split('. ').map((p, i) => (
                                <p key={i}>{p}.</p>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Map Section */}
                    <div className="mb-5 pt-4 border-top">
                        <h3 className="fw-bold mb-4 font-inter" style={{ fontSize: '24px' }}>
                            Recorrido Sugerido <span className="badge ms-2" style={{ backgroundColor: themeColor + '22', color: themeColor, fontSize: '14px' }}>{experience.stops.length} paradas</span>
                        </h3>
                        <ExperienceInteractiveMap stops={experience.stops} themeColor={themeColor} />
                    </div>

                    {/* Lugares de la experiencia (Slider con Flechas) */}
                    <div className="mb-5 pt-4 border-top">
                        {(() => {
                            const stopsWithImages = experience.stops.map((stop) => {
                                const match = (allOrganizations || []).find(org => 
                                    org.name.toLowerCase().includes(stop.name.toLowerCase()) || 
                                    stop.name.toLowerCase().includes(org.name.toLowerCase())
                                );
                                return {
                                    ...stop,
                                    thumbnail: match?.media?.cover || match?.media?.gallery?.[0] || match?.image_url || experience.thumbnail
                                };
                            });

                            return (
                                <PlacesSlider 
                                    stops={stopsWithImages} 
                                    themeColor={themeColor} 
                                    experienceTitle={experience.title} 
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Right Column: Sticky Sidebar / Contact */}
            <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="p-4" style={{ backgroundColor: themeColor }}>
                            <span className="text-white opacity-75 small fw-bold">Desde</span>
                            <h3 className="text-white fw-bold mb-0">{experience.price}</h3>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="small text-muted mb-4">
                                Esta experiencia requiere reserva previa de al menos 24hs. Contactá con el organizador para consultar disponibilidad.
                            </p>
                            <div className="d-flex flex-column gap-3">
                                <button className="btn btn-primary py-3 fw-bold rounded-3 shadow-sm border-0 transition-all hover-lift" 
                                        style={{ backgroundColor: themeColor }}>
                                    RESERVAR AHORA
                                </button>
                                <button className="btn btn-outline-light py-3 fw-bold rounded-3 text-dark border-light-subtle d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-share"></i> Compartir
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tourist Support Card */}
                    <div className="card rounded-4 border shadow-sm p-4 text-center bg-white">
                        <div className="mb-3">
                            <i className="bi bi-info-circle fs-1" style={{ color: themeColor }}></i>
                        </div>
                        <h5 className="fw-bold">Información Útil</h5>
                        <p className="small text-muted mb-3">
                            ¿Necesitás ayuda personalizada para planear tu viaje? Contactate con el Centro de Atención al Turista.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <a href="tel:03584671234" className="btn btn-sm btn-light border-light-subtle rounded-circle p-2" title="Llamar">
                                <i className="bi bi-telephone"></i>
                            </a>
                            <a href="https://wa.me/5493581234567" className="btn btn-sm btn-light border-light-subtle rounded-circle p-2" title="WhatsApp">
                                <i className="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>

      <ChatbotIcon />
    </div>
  );
}
