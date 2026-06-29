'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * HeroHome - Destino Río Cuarto
 * Basado en Figma ID 3781:19193 (Home V2)
 */
export default function HeroHome({ initialSlug = null }) {
  const pathname = usePathname();

  const categories = [
    { label: 'Eventos', slug: 'eventos', icon: 'bi-star-fill', color: '#f54286' },
    { label: 'Actividades', slug: 'actividades', icon: 'bi-person-walking', color: '#8a38f5' },
    { label: 'Experiencias', slug: 'experiencias', icon: 'bi-stars', color: '#ff5a1f' },
    { label: 'Servicios', slug: 'servicios', icon: 'bi-shop', color: '#1a56db' },
  ];

  // Buscamos si la ruta actual coincide con alguna categoría
  const currentCategoryPath = categories.find(c => pathname.includes(`/${c.slug}`));

  // O usamos la categoría actual de la ruta, o el slug inicial que pasamos
  const activeCategory = currentCategoryPath || categories.find(c => c.slug === initialSlug) || null;

  const connectors = ['de', 'del', 'en', 'y', 'a', 'e', 'o', 'u', 'por', 'para', 'con', 'sin', 'el', 'la', 'lo', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que', 'qué', 'hay', 'vos', 'para'];

  const formatTitle = (text) => {
    if (!text) return '';
    return text.split(' ').map((word, index) => {
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
      if (connectors.includes(cleanWord)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const getBackgroundImage = (slug) => {
    switch (slug) {
      case 'eventos': return '/Eventos_okk.jpg';
      case 'actividades': return '/Actividades_ok.jpg';
      case 'experiencias': return '/Experiencias_ok.jpg';
      case 'servicios': return '/Servicios_ok.jpg';
      default: return '/Portada_home.jpg';
    }
  };

  const bgImage = activeCategory
    ? getBackgroundImage(activeCategory.slug)
    : '/Portada_home.jpg';

  let displayTitle;
  const coloredSpanStyle = (color) => ({
    backgroundColor: color,
    color: '#ffffff',
    fontWeight: '800',
    padding: '4px 14px',
    borderRadius: '8px',
    display: 'inline-block',
    lineHeight: '1.2',
    margin: '4px 4px',
    verticalAlign: 'middle'
  });

  if (!activeCategory) {
    displayTitle = (
      <>
        Una forma ágil y moderna de{' '}
        <br className="d-none d-md-block" />
        conocer <span className="text-white">Río Cuarto</span>
      </>
    );
  } else if (activeCategory.slug === 'actividades') {
    displayTitle = (
      <>
        Explorá todas las{' '}
        <span style={coloredSpanStyle(activeCategory.color)}>Actividades</span>{' '}
        <br className="d-none d-md-block" />
        pensadas para vos
      </>
    );
  } else if (activeCategory.slug === 'experiencias') {
    displayTitle = (
      <>
        Buscá nuevas{' '}
        <span style={coloredSpanStyle(activeCategory.color)}>Experiencias</span>{' '}
        <br className="d-none d-md-block" />
        para descubrir la Ciudad
      </>
    );
  } else if (activeCategory.slug === 'eventos') {
    displayTitle = (
      <>
        Conocé todos los{' '}
        <span style={coloredSpanStyle(activeCategory.color)}>Eventos</span>{' '}
        <br className="d-none d-md-block" />
        en un solo lugar
      </>
    );
  } else {
    displayTitle = (
      <>
        Encontrá todos los{' '}
        <span style={coloredSpanStyle(activeCategory.color)}>Servicios</span>{' '}
        <br className="d-none d-md-block" />que necesitás

      </>
    );
  }

  return (
    <section className="position-relative overflow-hidden w-100" style={{
      minHeight: '440px', // Cambiado de height a minHeight para flexibilidad
      backgroundImage: `url('${bgImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      transition: 'background-image 0.4s ease-in-out',
      overflowX: 'clip'
    }}>
      {/* Overlay sutil para móvil (toda la pantalla) */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-md-none" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>

      {/* Overlay gradiente intenso para escritorio (izquierda a derecha) */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)' }}></div>

      <div className="container-xxl px-3 px-lg-5 h-100 d-flex flex-column w-100 position-relative z-1 pt-5">

        {/* 1. Title Group - Centrado verticalmente en el espacio disponible */}
        <div className="flex-grow-1 d-flex align-items-center py-5">
          <h1 className="hero-title text-white mb-0 text-center text-md-start mx-auto mx-md-0" style={{
            maxWidth: '800px',
            fontSize: 'clamp(42px, 11vw, 64px)',
            lineHeight: '1.4',
            letterSpacing: '-1.5px',
            fontWeight: '700'
          }}>
            {displayTitle}
          </h1>
        </div>

        {/* 2. Navigation Tabs - Pegadas al margen inferior */}
        <div className="row g-2 g-md-3 align-items-center mb-5">
          {categories.map((cat, idx) => {
            const isActive = activeCategory?.slug === cat.slug;
            return (
              <div key={idx} className="col-6 col-md-auto">
                <Link
                  href={`/${cat.slug}`}
                  className={`d-flex align-items-center justify-content-between bg-white border border-light-subtle rounded-3 p-1 ps-3 transition-all text-decoration-none shadow-sm ${isActive ? 'shadow-premium border-primary' : 'hover-lift'}`}
                  style={{
                    height: '52px',
                    width: '100%',
                    outline: 'none'
                  }}>
                  <span className="font-inter fw-medium text-gray-700 text-truncate me-2" style={{ fontSize: '14px' }}>
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
            );
          })}
        </div>

      </div>
    </section>
  );
}
