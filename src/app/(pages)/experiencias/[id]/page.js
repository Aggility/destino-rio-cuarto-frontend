import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ExperienceInteractiveMap from '@/components/client/ExperienceInteractiveMap';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import ContactButtons from '@/components/client/ContactButtons';

export default async function ExperienceDetailPage({ params }) {
  const { id } = await params;

  // Moqueo de datos para la experiencia (En el futuro esto vendría de una API)
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
        thumbnail: '/Thumbnail.png',
        price: 'Gratis / Pago x Actividad',
        stops: [
            { id: 1, name: 'Trencito Parque Sarmiento', lat: -33.1110, lng: -64.3320, description: 'Recorrido histórico por el parque.' },
            { id: 2, name: 'Botes en el Lago', lat: -33.1125, lng: -64.3335, description: 'Paseo relajante por el agua.' },
            { id: 3, name: 'Feria de Emprendedores', lat: -33.1140, lng: -64.3310, description: 'Artesanías y productos regionales.' }
        ]
    },
    'recorrido-7-iglesias': {
        title: 'Recorrido de las 7 Iglesias',
        category: 'Religioso',
        duration: '3 horas',
        language: 'Español',
        rating: 4.9,
        reviews: 56,
        description: 'Un circuito de reflexión y patrimonio arquitectónico por el centro de la ciudad.',
        fullDescription: 'Este recorrido tradicional te lleva por los templos más significativos de Río Cuarto. Desde la imponente Catedral frente a Plaza Roca hasta pequeñas capillas con historias fascinantes. Ideal para realizar en Semana Santa o como un tour arquitectónico permanente.',
        thumbnail: '/Thumbnail.png',
        price: 'Gratis',
        stops: [
            { id: 1, name: 'Catedral Inmaculada Concepción', lat: -33.1237, lng: -64.3488, description: 'Principal templo frente a Plaza Roca.' },
            { id: 2, name: 'Iglesia San Francisco de Asís', lat: -33.1252, lng: -64.3512, description: 'Ubicada en Alvear y San Martín.' },
            { id: 3, name: 'Parroquia Ntra. Sra. del Carmen', lat: -33.1217, lng: -64.3441, description: 'Esquina de Sobremonte y Gral. Paz.' },
            { id: 4, name: 'Parroquia Sagrados Corazones', lat: -33.1221, lng: -64.3465, description: 'Ubicada en calle Cabrera 742.' },
            { id: 5, name: 'Parroquia Santa Teresita', lat: -33.1290, lng: -64.3350, description: 'Centro espiritual en calle Santa Fe.' },
            { id: 6, name: 'Iglesia de la Merced', lat: -33.1312, lng: -64.3592, description: 'Punto histórico de la zona sur.' },
            { id: 7, name: 'Santuario San Pantaleón', lat: -33.1415, lng: -64.3455, description: 'Lugar de promesas y devoción.' }
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
        fullDescription: 'Río Cuarto respira historia en sus muros. En este paseo visitaremos el Palacio Municipal, joya arquitectónica del centro, el Teatro Municipal donde late el arte riocuartense, y culminaremos en el Museo Histórico Regional para entender nuestras raíces.',
        thumbnail: '/Thumbnail.png',
        price: 'Gratis',
        stops: [
            { id: 1, name: 'Palacio Municipal', lat: -33.1235, lng: -64.3495, description: 'Sede del gobierno municipal, ícono arquitectónico.' },
            { id: 2, name: 'Teatro Municipal', lat: -33.1238, lng: -64.3508, description: 'Escenario principal de la cultura local.' },
            { id: 3, name: 'Museo Histórico Regional', lat: -33.1230, lng: -64.3475, description: 'Resguardo de la memoria y el pasado de la ciudad.' }
        ]
    }
  };

  const experience = experienceData[id] || experienceData['respira-aire-libre'];
  const themeColor = '#ff5a1f'; // Color institucional de Experiencias

  return (
    <div className="bg-white min-vh-100">
      
      {/* 0. NAVIGATION / BACK LINK */}
      <div className="container-xxl px-lg-5 pt-3 mb-2">
          <Link href="/experiencias" className="d-inline-flex align-items-center gap-2 text-decoration-none transition-all hover-translate-x-n2" style={{ color: themeColor }}>
              <i className="bi bi-arrow-left"></i>
              <span className="fw-bold font-inter text-uppercase small" style={{ letterSpacing: '0.5px' }}>Volver a todas las experiencias</span>
          </Link>
      </div>
      
      {/* 1. HERO SECTION (Premium) */}
      <section className="position-relative w-100" style={{ height: '60vh', minHeight: '400px' }}>
        <Image 
          src={experience.thumbnail}
          alt={experience.title}
          fill
          priority
          className="object-fit-cover shadow-lg"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }}></div>
        
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5">
            <div className="container-xxl px-lg-5">
                <nav aria-label="breadcrumb" className="mb-3 animate-fade-in">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/experiencias" className="text-white opacity-75 text-decoration-none">Experiencias</Link></li>
                        <li className="breadcrumb-item active text-white fw-bold" aria-current="page">{experience.category}</li>
                    </ol>
                </nav>
                <h1 className="text-white fw-bold mb-2 animate-fade-in-up" style={{ fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '-1.5px' }}>
                    {experience.title}
                </h1>
                <div className="d-flex align-items-center gap-3 text-white opacity-90 animate-fade-in">
                    <span className="badge rounded-pill px-3 py-2 border border-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <i className="bi bi-star-fill text-warning me-1"></i> {experience.rating} ({experience.reviews} reseñas)
                    </span>
                    <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-clock"></i> {experience.duration}
                    </span>
                </div>
            </div>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="py-5">
        <div className="container-xxl px-lg-5">
            <div className="row g-5">
                
                {/* Left Column: Details & Map */}
                <div className="col-12 col-lg-8">
                    
                    {/* Abstract & Benefits */}
                    <div className="mb-5">
                        <h2 className="fw-bold mb-4 font-inter" style={{ fontSize: '28px', color: '#111928' }}>Sobre esta experiencia</h2>
                        <p className="lead font-inter text-gray-700 mb-4" style={{ lineHeight: '1.6' }}>
                            {experience.description}
                        </p>
                        <div className="bg-gray-50 rounded-4 p-4 border mb-5">
                            <h4 className="fw-bold mb-3 h5">¿Qué incluye?</h4>
                            <div className="row g-3">
                                <div className="col-md-6 d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-check2-circle fs-5" style={{ color: themeColor }}></i>
                                    </div>
                                    <span className="small fw-semibold">Guía especializado</span>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-bicycle fs-5" style={{ color: themeColor }}></i>
                                    </div>
                                    <span className="small fw-semibold">Traslados incluidos</span>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-translate fs-5" style={{ color: themeColor }}></i>
                                    </div>
                                    <span className="small fw-semibold">{experience.language}</span>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-cup-straw fs-5" style={{ color: themeColor }}></i>
                                    </div>
                                    <span className="small fw-semibold">Degustaciones</span>
                                </div>
                            </div>
                        </div>
                        <div className="font-inter text-gray-800" style={{ lineHeight: '1.8', fontSize: '17px' }}>
                            {experience.fullDescription.split('. ').map((p, i) => (
                                <p key={i}>{p}.</p>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Map Section */}
                    <div className="mb-5">
                        <h3 className="fw-bold mb-4 font-inter" style={{ fontSize: '24px' }}>
                            Recorrido Sugerido <span className="badge ms-2" style={{ backgroundColor: themeColor + '22', color: themeColor, fontSize: '14px' }}>{experience.stops.length} paradas</span>
                        </h3>
                        <ExperienceInteractiveMap stops={experience.stops} themeColor={themeColor} />
                    </div>

                </div>

                {/* Right Column: Sticky Sidebar / Contact */}
                <div className="col-12 col-lg-4">
                    <div className="sticky-top" style={{ top: '120px' }}>
                        <div className="card border-0 shadow-premium rounded-4 overflow-hidden mb-4">
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
                                    <Link href="#" className="btn btn-outline-light py-3 fw-bold rounded-3 text-dark border-light-subtle d-flex align-items-center justify-content-center gap-2">
                                        <i className="bi bi-share"></i> Compartir
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Tourist Support Card */}
                        <div className="card rounded-4 border-0 shadow-sm p-4 text-center" style={{ backgroundColor: '#f9fafb' }}>
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
      </section>

      <ChatbotIcon />

    </div>
  );
}
