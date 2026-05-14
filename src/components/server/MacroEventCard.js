'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/**
 * MacroEventCard - Destino Río Cuarto
 * Basado en Figma ID 3786:24022 / 3786:27623
 * Slider de eventos marco (macro eventos) destacados.
 * - Acepta un array `events` para mostrar múltiples slides.
 * - Autoplay de 5s, pausable en hover.
 * - Flechas desktop + dots indicadores expandibles.
 * - Cada slide: thumbnail izquierda + contenido derecho sobre gradiente pink.
 */
export default function MacroEventCard({ events = [], title, date, time, location, thumbnail, href }) {
  // ── Modo compatibilidad: si recibe props individuales, los envuelve en array
  const slides = events.length > 0 ? events : (title ? [{
    id: 'single',
    title,
    date,
    time,
    location,
    thumbnail: thumbnail || '/no-img.webp',
    href: href || '#',
  }] : []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollRef.current.scrollLeft / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  // Autoplay
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % slides.length;
      scrollToIndex(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, slides.length, scrollToIndex]);

  if (!slides || slides.length === 0) return null;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < slides.length - 1;

  return (
    <div
      className="macro-event-card position-relative overflow-hidden rounded-4 shadow-premium"
      style={{ background: 'linear-gradient(135deg, #f54286 0%, #d92d6b 100%)', minHeight: '200px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Contenedor de slides con scroll snap ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {slides.map((event, index) => (
          <div
            key={event.id || index}
            style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start' }}
          >
            <div className="row g-0 align-items-stretch" style={{ minHeight: '340px' }}>

              {/* 1. Thumbnail */}
              <div className="col-12 col-md-5 position-relative" style={{ minHeight: '220px' }}>
                <img
                  src={event.thumbnail || '/no-img.webp'}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '220px',
                    maxHeight: '440px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <span
                  className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-white fw-bold px-3 py-2 font-inter shadow-sm"
                  style={{ color: '#df2a6b', fontSize: '10px', zIndex: 2 }}
                >
                  EVENTO DESTACADO
                </span>
              </div>

              {/* 2. Contenido */}
              <div className="col-12 col-md-7 d-flex flex-column justify-content-center p-4 p-md-5 text-white" style={{ backgroundColor: '#df2a6b' }}>
                <h3
                  className="font-inter fw-semibold mb-4"
                  style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', lineHeight: '1.2', letterSpacing: '-0.5px' }}
                >
                  {event.title}
                </h3>

                <div className="d-flex flex-column gap-3 mb-5">
                  {/* Fecha */}
                  {event.date && (
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '32px', height: '32px', minWidth: '32px' }}
                      >
                        <i className="bi bi-calendar-event" style={{ color: '#df2a6b', fontSize: '14px' }}></i>
                      </div>
                      <span className="font-inter fw-medium" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#ffffff' }}>
                        {event.date}
                      </span>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-4 mt-2 ps-1">
                    {/* Lugar */}
                    {event.location && (
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt" style={{ fontSize: '15px' }}></i>
                        <span className="font-inter fw-medium" style={{ fontSize: '14px' }}>{event.location}</span>
                      </div>
                    )}
                    {/* Hora */}
                    {event.time && (
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-clock" style={{ fontSize: '15px' }}></i>
                        <span className="font-inter fw-medium" style={{ fontSize: '14px' }}>{event.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="d-flex align-items-start mt-2">
                  <Link
                    href={event.href || `/eventos/${event.id}`}
                    className="btn btn-light rounded-pill font-inter fw-bold px-5 py-3 transition-all hover-scale border-0"
                    style={{ fontSize: '14px', color: '#df2a6b', letterSpacing: '0.5px' }}
                  >
                    VER MÁS DETALLES <i className="bi bi-chevron-right ms-2 fw-bold"></i>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ── Flechas de navegación — Solo desktop, solo si hay más de 1 slide ── */}
      {slides.length > 1 && (
        <div className="d-none d-md-block">
          <button
            onClick={() => canPrev && scrollToIndex(activeIndex - 1)}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 btn rounded-circle d-flex align-items-center justify-content-center border-0 shadow-premium"
            style={{
              width: '44px', height: '44px',
              backgroundColor: '#000', color: '#fff',
              opacity: canPrev ? 0.85 : 0.2,
              cursor: canPrev ? 'pointer' : 'default',
              zIndex: 10,
            }}
            aria-label="Evento anterior"
          >
            <i className="bi bi-chevron-left fs-6"></i>
          </button>
          <button
            onClick={() => canNext && scrollToIndex(activeIndex + 1)}
            className="position-absolute top-50 end-0 translate-middle-y me-3 btn rounded-circle d-flex align-items-center justify-content-center border-0 shadow-premium"
            style={{
              width: '44px', height: '44px',
              backgroundColor: '#000', color: '#fff',
              opacity: canNext ? 0.85 : 0.2,
              cursor: canNext ? 'pointer' : 'default',
              zIndex: 10,
            }}
            aria-label="Evento siguiente"
          >
            <i className="bi bi-chevron-right fs-6"></i>
          </button>
        </div>
      )}

      {/* ── Dots indicadores — Solo si hay más de 1 slide ── */}
      {slides.length > 1 && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
          style={{ zIndex: 10 }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              style={{
                width: activeIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: activeIndex === idx ? '4px' : '50%',
                border: 'none',
                backgroundColor: 'white',
                padding: 0,
                opacity: activeIndex === idx ? 1 : 0.4,
                transition: 'all 0.35s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
