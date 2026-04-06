import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';

/**
 * Home - Destino Río Cuarto (Home V2 Fidelity)
 * Sincronizado con Figma ID 3781:19219 (Container Refinado)
 * Sin 'styled-jsx' para total compatibilidad con Server Components.
 */
export default function Home() {
  const sections = [
    { id: 1, title: 'Eventos Destacados', slug: 'eventos', color: '#f54286' },
    { id: 2, title: 'Recorré la Ciudad', slug: 'recorre', color: '#8a38f5' },
    { id: 3, title: 'Actividades Populares', slug: 'actividades', color: '#ff5a1f' },
  ];

  const localThumbnail = "/Thumbnail.png";

  return (
    <div className="bg-white overflow-hidden pb-5 font-inter">
      {/* 1. Navbar & Hero — Figma ID 3781:19192/19193 */}
      <HeroHome />

      {/* 2. Secciones Principales (Base Section Light) — Figma ID 3781:19217 */}
      <section className="container-xxl py-5 px-lg-5">
        
        <div className="d-flex flex-column gap-0 align-items-start position-relative w-100">
          {sections.map((cat, index) => (
            <div key={cat.id} className={`w-100 ${index > 0 ? 'mt-32px' : 'pt-4'}`}>
              
              {/* CAROUSEL HEADER — Gap 20px below — Figma ID 3781:19222 */}
              <div className="d-flex justify-content-between align-items-end" style={{ marginBottom: '20px' }}>
                <div style={{ maxWidth: '541px' }}>
                  <h2 className="display-6 fw-semibold text-gray-900 tracking-tight font-inter" style={{ fontSize: '36px', letterSpacing: '-1.08px' }}>
                    {cat.title}
                  </h2>
                </div>
                
                {/* CAROUSEL NAV — Figma ID 3781:19224 */}
                <div className="carousel-nav-container d-none d-md-flex align-items-center">
                  <button className="carousel-arrow left me-2" aria-label="Anterior">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button className="carousel-arrow right" aria-label="Siguiente">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* CAROUSEL — Gap 16px (gap-3) — Figma ID 3781:19225 */}
              {/* Replaced 'row g-3' with 'd-flex gap-3' for reliable visible separation */}
              <div className="d-flex gap-3 overflow-hidden flex-nowrap pb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-shrink-0 animate-hover-lift" style={{ minWidth: '318px' }}>
                    <EventCard 
                      title={`${cat.title} Item ${i}`}
                      date={index === 0 ? "jue, 12 mar, 21:00" : "Verano 2026"}
                      location={index === 0 ? "Elvis RockandBar" : "Centro Cultural"}
                      category={cat.title}
                      typeColor={cat.color}
                      thumbnail={localThumbnail}
                    />
                  </div>
                ))}
              </div>

              {/* BUTTON WRAP — Gap 20px above — Figma ID 3781:19232 (158x43) */}
              <div className="text-center" style={{ marginTop: '20px' }}>
                <Link href={`/${cat.slug}`} className="btn btn-outline-primary px-3 py-2 rounded-2 shadow-premium fw-normal font-inter" style={{ 
                  minWidth: '158px',
                  height: '43px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#1a56db',
                  color: '#1a56d8',
                  fontSize: '15px'
                }}>
                  Ver más {index === 0 ? 'eventos' : index === 1 ? 'lugares' : 'actividades'}
                </Link>
              </div>
              
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
