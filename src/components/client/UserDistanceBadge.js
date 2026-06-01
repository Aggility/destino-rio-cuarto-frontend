'use client';

import React, { useState, useEffect } from 'react';
import { getDistance } from '@/utils/geo';

/**
 * UserDistanceBadge - Destino Río Cuarto
 * Muestra la distancia desde la ubicación del usuario al servicio/lugar.
 * Si no hay geolocalización o no se ha otorgado permiso, hace fallback 
 * a la distancia estática respecto al evento/actividad.
 */
export default function UserDistanceBadge({ 
  targetLat, 
  targetLng, 
  staticDistance = null, 
  staticLabel = '',
  theme = 'blue' // 'blue' para alojamientos, 'orange' para restaurantes
}) {
  const [distance, setDistance] = useState(null);
  const [useUserLocation, setUseUserLocation] = useState(false);

  useEffect(() => {
    const checkLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (targetLat && targetLng) {
              const dist = getDistance(latitude, longitude, parseFloat(targetLat), parseFloat(targetLng));
              setDistance(dist);
              setUseUserLocation(true);
            }
          },
          () => {
            // Error o denegado
            setUseUserLocation(false);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
        );
      }
    };

    // Intentar obtener de inmediato
    checkLocation();

    // Escuchar si se otorga permiso desde el popup
    window.addEventListener('geo_granted_event', checkLocation);
    return () => window.removeEventListener('geo_granted_event', checkLocation);
  }, [targetLat, targetLng]);

  const formatDist = (d) => {
    if (d === null || isNaN(d)) return '';
    return d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;
  };

  const getStyle = () => {
    return { backgroundColor: '#1a56db', color: '#ffffff', fontSize: '10px', border: 'none' };
  };

  // Si tenemos ubicación real del usuario
  if (useUserLocation && distance !== null) {
    return (
      <span className="badge rounded-1 fw-bold" style={getStyle()}>
        {formatDist(distance)}
      </span>
    );
  }

  // Fallback a distancia estática si existe
  if (staticDistance !== null) {
    return (
      <span className="badge rounded-1 fw-bold" style={getStyle()}>
        {formatDist(staticDistance)}
      </span>
    );
  }

  return null;
}
