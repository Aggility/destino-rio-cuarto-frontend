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
      case 'eventos': return '/hero_eventos.jpg';
      case 'actividades': return '/hero_actividades.jpg';
      case 'experiencias': return '/hero_actividades.jpg'; // Fallback a actividades
      case 'servicios': return '/hero_servicios.png';
      default: return '/hero_home.png';
    }
  };

  const bgImage = activeCategory
    ? getBackgroundImage(activeCategory.slug)
    : '/hero_home.png';

  let displayTitle;
  const coloredSpanStyle = (color) => ({
    backgroundColor: color,
    color: '#ffffff',
    fontWeight: '800',
    padding: '4px 14px',
    borderRadius: '14px',
    display: 'inline-block',
    lineHeight: '1.1',
    margin: '0 4px',
    verticalAlign: 'baseline'
  });

  if (!activeCategory) {
    displayTitle = (
      <>
        {formatTitle("Descubrí qué cosas")} <br className="d-none d-md-block" />
        {formatTitle("podés hacer en")} <span className="text-white">Río Cuarto</span>
      </>
    );
  } else if (activeCategory.slug === 'actividades') {
    displayTitle = (
      <>
        {formatTitle("Explorá")} <span style={coloredSpanStyle(activeCategory.color)}>{formatTitle(activeCategory.label)}</span> <br className="d-none d-md-block" />
        {formatTitle("para vos en")} <span className="text-white">Río Cuarto</span>
      </>
    );
  } else if (activeCategory.slug === 'experiencias') {
    displayTitle = (
      <>
        {formatTitle("Descubrí")} <span style={coloredSpanStyle(activeCategory.color)}>{formatTitle(activeCategory.label)}</span> <br className="d-none d-md-block" />
        {formatTitle("únicas en")} <span className="text-white">Río Cuarto</span>
      </>
    );
  } else {
    displayTitle = (
      <>
        {formatTitle("Encontra")} <span style={coloredSpanStyle(activeCategory.color)}>{formatTitle(activeCategory.label)}</span> {formatTitle("pensados")} <br className="d-none d-md-block" />
        {formatTitle("para vos en")} <span className="text-white">Río Cuarto</span>
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

      <div className="container-xxl px-3 px-lg-5 h-100 d-flex flex-column justify-content-center w-100 position-relative z-1 pt-5">

        {/* 1. Title Group */}
        <div className="mb-4">
          <h1 className="hero-title text-white mb-0 text-center text-md-start mx-auto mx-md-0" style={{
            maxWidth: '800px',
            fontSize: 'clamp(42px, 11vw, 64px)',
            lineHeight: '1.1',
            letterSpacing: '-1.5px',
            fontWeight: '700'
          }}>
            {displayTitle}
          </h1>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="row g-2 g-md-3 align-items-center">
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
