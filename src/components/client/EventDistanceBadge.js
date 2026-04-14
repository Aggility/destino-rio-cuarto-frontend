'use client';

import React, { useState, useEffect } from 'react';
import { getDistance } from '@/utils/geo';

export default function EventDistanceBadge({ eventLat, eventLng }) {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (navigator.geolocation && eventLat && eventLng) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dist = getDistance(
            latitude,
            longitude,
            parseFloat(eventLat),
            parseFloat(eventLng)
          );
          setDistance(dist);
        },
        (error) => {
          console.error("Error getting user location for event distance:", error);
        }
      );
    }
  }, [eventLat, eventLng]);

  if (distance === null) return null;

  return (
    <div className="bg-success-100 rounded-1 px-2 py-1 ms-2 d-inline-flex align-items-center" 
         style={{ backgroundColor: '#def7ec', verticalAlign: 'middle' }}>
        <span className="font-inter fw-medium text-success-800" style={{ color: '#03543f', fontSize: '13px' }}>
          <i className="bi bi-geo-alt-fill me-1"></i>
          A {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`} de vos
        </span>
    </div>
  );
}
