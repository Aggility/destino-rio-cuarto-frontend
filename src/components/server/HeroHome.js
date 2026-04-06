import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * HeroHome - Destino Río Cuarto
 * Basado exactamente en Figma ID 3781:19193 (Height 358px)
 * Refinado: Título arriba y tabs en una misma fila debajo (ID 3781:19196).
 */
export default function HeroHome() {
  const categories = [
    { label: 'Eventos', icon: 'bi-calendar-event', color: '#f54291' },
    { label: 'Hacia Donde ir?', icon: 'bi-geo-alt', color: '#8b3dfc' },
    { label: 'Experiencias', icon: 'bi-stars', color: '#ff5a1f' },
    { label: 'Actividades', icon: 'bi-lightning-charge', color: '#ffb41f' },
  ];

  return (
    <section className="position-relative overflow-hidden w-100" style={{ 
      height: '358px',
      backgroundImage: `linear-gradient(rgba(26, 86, 219, 0.4), rgba(26, 86, 219, 0.4)), url('/hero_home.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container-xxl px-lg-5">
        
        {/* 1. Title Group — ID 3781:19195 */}
        <div className="mb-4">
          <h1 className="hero-title text-white mb-0" style={{ maxWidth: '800px' }}>
            Descubrí que hay <br /> 
            para vos en <span className="text-white fw-bold">Río Cuarto</span>
          </h1>
        </div>

        {/* 2. Tabs Row — ID 3781:19196 (Tabs en una misma fila) */}
        <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/${cat.label.toLowerCase()}`} className="category-tab-btn" style={{ minWidth: 'auto', paddingRight: '6px' }}>
              <span className="font-inter me-3">{cat.label}</span>
              <div className="icon-box" style={{ backgroundColor: cat.color }}>
                <i className={`bi ${cat.icon}`}></i>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
