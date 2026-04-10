import React from 'react';
import Link from 'next/link';

/**
 * HeroHome - Destino Río Cuarto
 * Basado en Figma ID 3781:19193 (Home V2)
 * Mobile Tabs Refinadas según Figma ID 3777:8057 (Grid 2x2)
 */
export default function HeroHome() {
  const categories = [
    { label: 'Eventos', slug: 'eventos', icon: 'bi-star-fill', color: '#f54286' },
    { label: 'Actividades', slug: 'actividades', icon: 'bi-person-walking', color: '#8a38f5' },
    { label: 'Experiencias', slug: 'actividades', icon: 'bi-sparkles', color: '#ff5a1f' },
    { label: 'Servicios', slug: 'servicios', icon: 'bi-shop', color: '#203f83' },
  ];

  return (
    <section className="position-relative overflow-hidden w-100" style={{ 
      minHeight: '358px',
      backgroundImage: `linear-gradient(rgba(26, 86, 219, 0.4), rgba(26, 86, 219, 0.4)), url('/hero_home.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div className="container-xxl px-lg-5">
        
        {/* 1. Title Group — Figma ID 3781:19195 */}
        <div className="mb-4 mb-md-5">
          <h1 className="hero-title text-white mb-0" style={{ 
              maxWidth: '800px',
              fontSize: 'clamp(32px, 6vw, 64px)',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              fontWeight: '700'
          }}>
            Descubrí que hay <br /> 
            para vos en <span className="text-white">Río Cuarto</span>
          </h1>
        </div>

        {/* 2. Navigation Tabs (Grid 2x2 en Mobile, Row en Desktop) — Figma ID 3777:8057 */}
        <div className="row g-2 g-md-3 align-items-center">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-6 col-md-auto">
                <Link href={`/${cat.slug}`} 
                      className="d-flex align-items-center justify-content-between bg-white border border-light-subtle rounded-3 p-1 ps-3 transition-all hover-lift text-decoration-none shadow-sm"
                      style={{ 
                          height: '52px', 
                          minWidth: '100%',
                          width: '166px', // Ancho base Figma
                      }}>
                  <span className="font-inter fw-medium text-gray-700" style={{ fontSize: '15px' }}>
                    {cat.label}
                  </span>
                  <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" 
                       style={{ 
                           backgroundColor: cat.color, 
                           width: '34px', 
                           height: '34px',
                           marginRight: '2px'
                       }}>
                    <i className={`bi ${cat.icon} text-white`} style={{ fontSize: '14px' }}></i>
                  </div>
                </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
