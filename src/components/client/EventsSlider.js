'use client';
import React from 'react';
import EventCard from '@/components/server/EventCard';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';

/**
 * EventsSlider — Destino Río Cuarto
 * Slider horizontal de eventos aleatorios con navegación por botones.
 * Utiliza HomeSectionSlider para mantener la consistencia visual y funcional.
 */
export default function EventsSlider({ events = [] }) {
  if (!events || events.length === 0) return null;

  return (
    <HomeSectionSlider title="También te puede interesar">
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
    </HomeSectionSlider>
  );
}
