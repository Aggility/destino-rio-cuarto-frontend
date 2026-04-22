'use client';
import React, { useRef } from 'react';
import EventCard from '@/components/server/EventCard';

export default function PlacesSlider({ stops, themeColor, experienceTitle }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold font-inter m-0" style={{ fontSize: 'clamp(18px, 5vw, 24px)' }}>
          Lugares que incluye la experiencia
        </h3>
        <div className="d-flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center" 
            style={{ width: '40px', height: '40px' }}
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="btn btn-primary rounded-circle shadow-premium d-flex align-items-center justify-content-center" 
            style={{ width: '40px', height: '40px', backgroundColor: themeColor, border: 'none' }}
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="d-flex gap-3 overflow-auto flex-nowrap pb-4 hide-scrollbar px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {stops.map((stop) => (
          <div 
            key={stop.id} 
            className="flex-shrink-0" 
            style={{ width: 'clamp(280px, 80vw, 320px)', scrollSnapAlign: 'start' }}
          >
            <EventCard 
              id={stop.id}
              title={stop.name}
              location={experienceTitle}
              description={stop.description}
              category="LUGAR"
              typeColor={themeColor}
              thumbnail={stop.thumbnail}
              lat={stop.lat}
              lng={stop.lng}
              basePath="experiencias"
              date={stop.id.toString()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
