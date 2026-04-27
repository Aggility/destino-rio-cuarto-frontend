'use client';
import React, { useRef, useState } from 'react';
import EventCard from '@/components/server/EventCard';

/**
 * EventsSlider — Destino Río Cuarto
 * Slider horizontal de eventos aleatorios con navegación por botones.
 * Recibe los eventos pre-fetched desde el Server Component padre.
 */
export default function EventsSlider({ events = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollTo = direction === 'left'
      ? scrollLeft - clientWidth * 0.8
      : scrollLeft + clientWidth * 0.8;
    scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="position-relative">
      {/* Header — mismo patrón que home/experiencias */}
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
        <div className="max-w-541px">
          <h2
            className="fw-bold text-gray-900 tracking-tight font-inter m-0"
            style={{ fontSize: 'clamp(22px, 5vw, 34px)', letterSpacing: '-1px' }}
          >
            También te puede interesar
          </h2>
        </div>

        {/* Flechas solo en desktop — igual que home */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', opacity: canScrollLeft ? 1 : 0.4 }}
            aria-label="Eventos anteriores"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="btn rounded-circle shadow-premium d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#f54286', border: 'none', color: '#fff', opacity: canScrollRight ? 1 : 0.4 }}
            aria-label="Eventos siguientes"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>

      {/* Slider Track — mx-n3 px-3 para que las tarjetas lleguen al borde en mobile */}
      <div className="mx-n3 px-3">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="d-flex gap-3 overflow-auto flex-nowrap pb-4 hide-scrollbar px-1"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {events.map((ev, idx) => (
            <div
              key={ev.id ?? idx}
              className="flex-shrink-0"
              style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}
            >
              <EventCard
                id={ev.id}
                title={ev.title}
                date={ev.date}
                location={ev.location}
                thumbnail={ev.thumbnail}
                category={ev.category}
                typeColor="#f54286"
                lat={ev.lat}
                lng={ev.lng}
                basePath="eventos"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
