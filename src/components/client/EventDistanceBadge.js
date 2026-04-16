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
      // 1. Verificar cache global en window para evitar múltiples llamadas al sistema
      if (window._userLocCache) {
        const dist = getDistance(window._userLocCache.lat, window._userLocCache.lng, parseFloat(eventLat), parseFloat(eventLng));
        setDistance(dist);
        return;
      }

      // 2. Si no hay cache, pedir ubicación con opciones de velocidad
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window._userLocCache = { lat: latitude, lng: longitude }; // Cachear
          const dist = getDistance(latitude, longitude, parseFloat(eventLat), parseFloat(eventLng));
          setDistance(dist);
        },
        () => {},
        { 
          enableHighAccuracy: false, // Más rápido
          timeout: 5000, 
          maximumAge: 600000 // Usar ubicación cacheada del sistema de hasta 10 min
        }
      );
    }
  }, [eventLat, eventLng, initialDistance]);

  if (distance === null) return null;

  // Multiplicadores diferenciados para reflejar que las rutas son distintas
  const drivingDist = distance * 1.4; // Recorrido por calles (grilla urbana)
  const walkingDist = distance * 1.15; // Recorrido más directo (peatonal)

  // Estimación de tiempos (basado en promedios urbanos: auto 30km/h, caminando 5km/h)
  const drivingTime = Math.max(1, Math.round((drivingDist / 1000) / 30 * 60)); 
  const walkingTime = Math.max(1, Math.round((walkingDist / 1000) / 5 * 60));

  const formatDist = (d) => d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;

  if (minimal) {
    return (
      <div className="d-flex align-items-center gap-x-2 gap-y-1 mt-1 flex-wrap overflow-hidden" style={{ minWidth: 0 }}>
        <span className="font-inter fw-bold d-flex align-items-center gap-1" style={{ fontSize: '10px', color: theme.dark, whiteSpace: 'nowrap' }}>
          <i className="bi bi-car-front-fill" style={{ color: theme.color }}></i> {drivingTime}m <small className="opacity-50 fw-normal">({formatDist(drivingDist)})</small>
        </span>
        <span className="font-inter fw-bold d-flex align-items-center gap-1" style={{ fontSize: '10px', color: theme.dark, whiteSpace: 'nowrap' }}>
          <i className="bi bi-person-walking" style={{ color: theme.color }}></i> {walkingTime}m <small className="opacity-50 fw-normal">({formatDist(walkingDist)})</small>
        </span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-row flex-nowrap gap-2 align-items-center overflow-auto hide-scrollbar pt-1">
        {/* Car Badge */}
        <div className="rounded-1 px-2 py-1 d-flex flex-column justify-content-center shadow-sm" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}33`, whiteSpace: 'nowrap', minWidth: '85px' }}>
            <span className="font-inter fw-bold d-flex align-items-center" style={{ color: theme.dark, fontSize: '13px', lineHeight: '1' }}>
              <i className="bi bi-car-front-fill me-1" style={{ color: theme.color }}></i>
              {drivingTime} min
            </span>
            <span className="font-inter opacity-75 fw-medium" style={{ fontSize: '10px', marginLeft: '16px' }}>{formatDist(drivingDist)}</span>
        </div>
        {/* Walking Badge */}
        <div className="rounded-1 px-2 py-1 d-flex flex-column justify-content-center shadow-sm" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}33`, whiteSpace: 'nowrap', minWidth: '85px' }}>
            <span className="font-inter fw-bold d-flex align-items-center" style={{ color: theme.dark, fontSize: '13px', lineHeight: '1' }}>
              <i className="bi bi-person-walking me-1" style={{ color: theme.color }}></i>
              {walkingTime} min
            </span>
            <span className="font-inter opacity-75 fw-medium" style={{ fontSize: '10px', marginLeft: '16px' }}>{formatDist(walkingDist)}</span>
        </div>
    </div>
  );
}
