'use client';
import React, { useRef, useState, useEffect } from 'react';

/**
 * HomeSectionSlider - Componente para manejar los sliders de la home
 * con flechas de navegación personalizadas (fondo negro, icono blanco).
 */
export default function HomeSectionSlider({ title, children }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    // Re-check after a small delay to ensure content is rendered
    const timer = setTimeout(updateScrollState, 500);
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('resize', updateScrollState);
      clearTimeout(timer);
    };
  }, [children]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    const scrollTo = direction === 'left' 
      ? scrollLeft - scrollAmount 
      : scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-100">
      {/* Header del Slider */}
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
        <div className="max-w-541px">
          <h2 className="fw-bold text-gray-900 tracking-tight font-inter m-0" 
              style={{ fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '-1px' }}>
            {title}
          </h2>
        </div>

        {/* Flechas de Navegación Personalizadas */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="btn rounded-circle d-flex align-items-center justify-content-center shadow-premium" 
            style={{ 
              width: '44px', 
              height: '44px', 
              backgroundColor: '#000', 
              color: '#fff', 
              border: 'none',
              opacity: canScrollLeft ? 1 : 0.3,
              transition: 'all 0.3s ease',
              cursor: canScrollLeft ? 'pointer' : 'default'
            }}
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left fs-5"></i>
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="btn rounded-circle d-flex align-items-center justify-content-center shadow-premium" 
            style={{ 
              width: '44px', 
              height: '44px', 
              backgroundColor: '#000', 
              color: '#fff', 
              border: 'none',
              opacity: canScrollRight ? 1 : 0.3,
              transition: 'all 0.3s ease',
              cursor: canScrollRight ? 'pointer' : 'default'
            }}
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right fs-5"></i>
          </button>
        </div>
      </div>

      {/* Contenedor del Scroll */}
      <div 
        ref={scrollRef}
        onScroll={updateScrollState}
        className="d-flex gap-3 overflow-auto flex-nowrap pb-4 hide-scrollbar px-1 align-items-stretch"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>
    </div>
  );
}
