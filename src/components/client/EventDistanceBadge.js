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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return; // Solo calcular en mobile

    if (initialDistance !== null) {
      setDistance(initialDistance);
      return;
    }
    
    if (typeof navigator !== 'undefined' && navigator.geolocation && eventLat && eventLng) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dist = getDistance(latitude, longitude, parseFloat(eventLat), parseFloat(eventLng));
          setDistance(dist);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    }
  }, [eventLat, eventLng, initialDistance, isMobile]);

  const formatDist = (d) => d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;

  if (!isMobile || distance === null) return null;

  if (minimal) {
    return (
      <div className="d-flex align-items-center gap-1 mt-1" style={{ minWidth: 0 }}>
        <i className="bi bi-cursor-fill" style={{ color: theme.color, fontSize: '11px' }}></i>
        <span className="font-inter fw-bold" style={{ fontSize: '12px', color: theme.dark, whiteSpace: 'nowrap' }}>
          a {formatDist(distance)} de vos
        </span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center pt-1">
        <div className="rounded-1 px-2 py-1 d-flex align-items-center shadow-sm" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}33`, whiteSpace: 'nowrap' }}>
            <i className="bi bi-cursor-fill me-1" style={{ color: theme.color, fontSize: '13px' }}></i>
            <span className="font-inter fw-bold" style={{ color: theme.dark, fontSize: '13px' }}>
              a {formatDist(distance)} de tu ubicación
            </span>
        </div>
    </div>
  );
}
