'use client';

import React, { useState, useEffect } from 'react';
import { getDistance } from '@/utils/geo';

export default function EventDistanceBadge({ eventLat, eventLng, distance: initialDistance = null, minimal = false, type = 'service' }) {
  const [distance, setDistance] = useState(initialDistance);

  const getTheme = (t) => {
    switch (t) {
      case 'event': return { bg: '#fdf2f8', color: '#f54286', dark: '#be185d' }; // Pink
      case 'activity': return { bg: '#f5f3ff', color: '#8a38f5', dark: '#6d28d9' }; // Purple
      case 'experience': return { bg: '#fff7ed', color: '#ff5a1f', dark: '#c2410c' }; // Orange
      case 'service': return { bg: '#ebf5ff', color: '#1a56db', dark: '#1e429f' }; // Blue
      default: return { bg: '#f3f4f6', color: '#374151', dark: '#111827' }; // Gray
    }
  };

  const theme = getTheme(type);

  useEffect(() => {
    if (initialDistance !== null) {
      setDistance(initialDistance);
      return;
    }
    
    if (typeof navigator !== 'undefined' && navigator.geolocation && eventLat && eventLng) {
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
        () => {}
      );
    }
  }, [eventLat, eventLng, initialDistance]);

  if (distance === null) return null;

  // Multiplicadores aproximados para ruta real vs línea recta
  const drivingDist = distance * 1.3;
  const walkingDist = distance * 1.1;

  const formatDist = (d) => d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;

  if (minimal) {
    return (
      <div className="d-flex align-items-center gap-2 mt-1">
        <span className="font-inter fw-medium" style={{ fontSize: '11px', color: theme.dark }}>
          <i className="bi bi-car-front-fill me-1"></i> {formatDist(drivingDist)}
        </span>
        <span className="font-inter fw-medium" style={{ fontSize: '11px', color: theme.dark }}>
          <i className="bi bi-person-walking me-1"></i> {formatDist(walkingDist)}
        </span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
        {/* Car Badge */}
        <div className="rounded-1 px-2 py-1 d-flex align-items-center" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}22` }}>
            <span className="font-inter fw-bold" style={{ color: theme.dark, fontSize: '12px' }}>
              <i className="bi bi-car-front-fill me-1" style={{ color: theme.color }}></i>
              {formatDist(drivingDist)}
            </span>
        </div>
        {/* Walking Badge */}
        <div className="rounded-1 px-2 py-1 d-flex align-items-center" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}22` }}>
            <span className="font-inter fw-bold" style={{ color: theme.dark, fontSize: '12px' }}>
              <i className="bi bi-person-walking me-1" style={{ color: theme.color }}></i>
              {formatDist(walkingDist)}
            </span>
        </div>
    </div>
  );
}
