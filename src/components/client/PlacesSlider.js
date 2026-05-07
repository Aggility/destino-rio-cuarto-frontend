'use client';
import React from 'react';
import EventCard from '@/components/server/EventCard';
import HomeSectionSlider from '@/components/client/HomeSectionSlider';

/**
 * PlacesSlider - Slider de lugares incluidos en la experiencia.
 * Utiliza HomeSectionSlider para consistencia visual.
 */
export default function PlacesSlider({ stops, themeColor, experienceTitle }) {
  if (!stops || stops.length === 0) return null;

  return (
    <HomeSectionSlider title="Lugares que incluye la experiencia">
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
    </HomeSectionSlider>
  );
}
