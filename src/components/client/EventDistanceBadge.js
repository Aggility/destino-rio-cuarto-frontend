'use client';

import React, { useState, useEffect } from 'react';
import { getDistance } from '@/utils/geo';

export default function EventDistanceBadge({ eventLat, eventLng, distance: initialDistance = null, minimal = false, type = 'service' }) {
  const [distance, setDistance] = useState(initialDistance);

  const getTheme = (t) => {
    switch (t) {
      case 'event': return { bg: '#f54286', color: '#ffffff', dark: '#ffffff' }; // Pink
      case 'activity': return { bg: '#8a38f5', color: '#ffffff', dark: '#ffffff' }; // Purple
      case 'experience': return { bg: '#ff5a1f', color: '#ffffff', dark: '#ffffff' }; // Orange
      case 'service': return { bg: '#1a56db', color: '#ffffff', dark: '#ffffff' }; // Blue
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
      <div className="d-flex align-items-center mt-1" style={{ minWidth: 0 }}>
        <div className="rounded-1 px-1 py-0 d-flex align-items-center shadow-sm" 
             style={{ backgroundColor: theme.bg, whiteSpace: 'nowrap' }}>
          <i className="bi bi-cursor-fill me-1" style={{ color: theme.color, fontSize: '10px' }}></i>
          <span className="font-inter fw-bold" style={{ fontSize: '11px', color: theme.dark, whiteSpace: 'nowrap' }}>
            {formatDist(distance)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center pt-1">
        <div className="rounded-1 px-2 py-1 d-flex align-items-center shadow-sm" 
             style={{ backgroundColor: theme.bg, border: `1px solid ${theme.bg}`, whiteSpace: 'nowrap' }}>
            <i className="bi bi-cursor-fill me-1" style={{ color: theme.color, fontSize: '13px' }}></i>
            <span className="font-inter fw-bold" style={{ color: theme.dark, fontSize: '13px' }}>
              {formatDist(distance)}
            </span>
        </div>
    </div>
  );
}
