'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/**
 * MacroEventsSlider - Destino Río Cuarto
 * Basado en Figma ID 3786:24022
 * Slider de eventos destacados con autoplay, scroll snap,
 * flechas de navegación y dots indicadores.
 */
export default function MacroEventsSlider({ events = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Scroll programático a un índice
  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  // Sincronizar activeIndex con scroll manual del usuario
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollRef.current.scrollLeft / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  // Autoplay cada 5 segundos — se pausa en hover
  useEffect(() => {
    if (isPaused || events.length <= 1) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % events.length;
      scrollToIndex(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, events.length, scrollToIndex]);

  if (!events || events.length === 0) return null;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < events.length - 1;

  return (
    <div
      className="position-relative overflow-hidden rounded-4 shadow-premium"
      style={{ background: 'linear-gradient(135deg, #f54286 0%, #d92d6b 100%)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Contenedor de slides ── */}
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
        {events.map((event, index) => (
          <div
            key={event.id || index}
            style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start' }}
          >
            <div className="row g-0 align-items-stretch">

              {/* 1. Thumbnail */}
              <div className="col-12 col-md-5 position-relative" style={{ minHeight: '220px' }}>
                <img
                  src={event.thumbnail || '/Thumbnail.png'}
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
                {/* Badge EVENTO DESTACADO */}
                <span
                  className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-white fw-bold px-3 py-2 font-inter shadow-sm"
                  style={{ color: '#f54286', fontSize: '10px', zIndex: 2 }}
                >
                  EVENTO DESTACADO
                </span>
              </div>

              {/* 2. Contenido */}
              <div className="col-12 col-md-7 d-flex flex-column justify-content-center p-4 p-lg-5 text-white">
                <h3
                  className="font-inter fw-extrabold mb-4"
                  style={{
                    fontSize: 'clamp(22px, 4vw, 34px)',
                    lineHeight: '1.1',
                    letterSpacing: '-1px',
                  }}
                >
                  {event.title}
                </h3>

                {/* Info: fecha, hora, lugar */}
                <div className="d-flex flex-column gap-3 mb-4 opacity-90">
                  {/* Fecha */}
                  {event.date && (
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <i className="bi bi-calendar-event" style={{ color: '#f54286', fontSize: '14px' }}></i>
                      </div>
                      <span className="font-inter fw-semibold" style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: '#fed7e2' }}>
                        {event.date}
                      </span>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-3">
                    {/* Hora */}
                    {event.time && (
                      <div className="d-flex align-items-center gap-2 opacity-80">
                        <i className="bi bi-clock" style={{ fontSize: '13px' }}></i>
                        <span className="font-inter fw-medium" style={{ fontSize: '12px' }}>{event.time}</span>
                      </div>
                    )}
                    {/* Lugar */}
                    {event.location && (
                      <div className="d-flex align-items-center gap-2 opacity-80">
                        <i className="bi bi-geo-alt" style={{ fontSize: '13px' }}></i>
                        <span className="font-inter fw-medium" style={{ fontSize: '12px' }}>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div>
                  <Link
                    href={event.href || `/eventos/${event.id}`}
                    className="btn btn-light rounded-pill font-inter fw-bold px-5 py-3 transition-all hover-scale shadow-sm"
                    style={{ fontSize: '14px', color: '#f54286', letterSpacing: '0.5px' }}
                  >
                    VER MÁS DETALLES <i className="bi bi-chevron-right ms-2"></i>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ── Flechas de navegación — Solo desktop ── */}
      {events.length > 1 && (
        <div className="d-none d-md-block">
          <button
            onClick={() => canPrev && scrollToIndex(activeIndex - 1)}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 btn rounded-circle d-flex align-items-center justify-content-center border-0 shadow-premium transition-all"
            style={{
              width: '44px', height: '44px',
              backgroundColor: '#000',
              color: '#fff',
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
            className="position-absolute top-50 end-0 translate-middle-y me-3 btn rounded-circle d-flex align-items-center justify-content-center border-0 shadow-premium transition-all"
            style={{
              width: '44px', height: '44px',
              backgroundColor: '#000',
              color: '#fff',
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

      {/* ── Dots indicadores ── */}
      {events.length > 1 && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
          style={{ zIndex: 10 }}
        >
          {events.map((_, idx) => (
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
