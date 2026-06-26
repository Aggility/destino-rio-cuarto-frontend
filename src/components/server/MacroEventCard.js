'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/**
 * MacroEventCard - Destino Río Cuarto
 * Slider de eventos destacados con imagen fullscreen de fondo,
 * overlay degradado y contenido superpuesto.
 */
export default function MacroEventCard({ events = [], title, date, time, location, thumbnail, href }) {
  // Modo compatibilidad: si recibe props individuales, los envuelve en array
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
      style={{ minHeight: '420px' }}
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
          minHeight: '420px',
        }}
      >
        {slides.map((event, index) => (
          <Link
            key={event.id || index}
            href={event.href || `/eventos/${event.id}`}
            className="text-decoration-none d-block text-white"
            style={{
              flexShrink: 0,
              width: '100%',
              scrollSnapAlign: 'start',
              position: 'relative',
              minHeight: '420px',
            }}
          >
            {/* Imagen de fondo */}
            <img
              src={event.thumbnail || '/no-img.webp'}
              alt={event.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />

            {/* Overlay degradado para legibilidad */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.10) 100%)',
              }}
            />

            {/* Badge superior izquierdo */}
            <span
              className="position-absolute top-0 start-0 m-3 badge rounded-pill fw-bold px-3 py-2 font-inter shadow-sm"
              style={{
                backgroundColor: '#f54286',
                color: '#ffffff',
                fontSize: '10px',
                letterSpacing: '0.5px',
                zIndex: 2,
              }}
            >
              EVENTO DESTACADO
            </span>

            {/* Contenido superpuesto — alineado al fondo */}
            <div
              className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5 d-flex flex-column align-items-center text-center"
              style={{ zIndex: 2 }}
            >
              {/* Título */}
              <h3
                className="font-inter fw-bold text-white mb-3"
                style={{
                  fontSize: 'clamp(32px, 6vw, 56px)',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                {event.title}
              </h3>

              {/* Metadatos */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                {event.date && (
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                    >
                      <i className="bi bi-calendar-event text-white" style={{ fontSize: '12px' }}></i>
                    </div>
                    <span className="font-inter fw-medium text-white" style={{ fontSize: 'clamp(13px, 3vw, 15px)' }}>
                      {event.date}
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                    >
                      <i className="bi bi-geo-alt text-white" style={{ fontSize: '12px' }}></i>
                    </div>
                    <span className="font-inter fw-medium text-white" style={{ fontSize: 'clamp(13px, 3vw, 15px)' }}>
                      {event.location}
                    </span>
                  </div>
                )}

                {event.time && (
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                    >
                      <i className="bi bi-clock text-white" style={{ fontSize: '12px' }}></i>
                    </div>
                    <span className="font-inter fw-medium text-white" style={{ fontSize: 'clamp(13px, 3vw, 15px)' }}>
                      {event.time}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </Link>
        ))}
      </div>



      {/* ── Dots indicadores — Solo si hay más de 1 slide ── */}
      {slides.length > 1 && (
        <div
          className="position-absolute bottom-0 end-0 mb-4 me-4 d-flex gap-2"
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
                opacity: activeIndex === idx ? 1 : 0.45,
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
