'use client';
import React from 'react';
import GoogleMapViewer from './GoogleMapViewer';

/**
 * ContactAndLocationWidget - Destino Río Cuarto
 * Card de ubicación: mapa expandido al 100% (sin info de texto).
 * Respeta los colores temáticos: rosa (eventos), violeta (actividades), naranja (experiencias), azul (servicios).
 */
export default function ContactAndLocationWidget({ service, type = 'service' }) {
  const targetLat = parseFloat(service?.lat);
  const targetLng = parseFloat(service?.lng);

  const getTheme = () => {
    switch (type) {
      case 'event':      return { color: '#f54286', bg: '#fdf2f8', border: '#fbcfe8', icon: 'bi-calendar-event-fill' };
      case 'actividad':
      case 'activity':   return { color: '#8a38f5', bg: '#f5f3ff', border: '#ddd6fe', icon: 'bi-person-walking' };
      case 'experiencia':return { color: '#ff5a1f', bg: '#fff7ed', border: '#fed7aa', icon: 'bi-stars' };
      case 'alojamiento':return { color: '#1a56db', bg: '#eff6ff', border: '#bfdbfe', icon: 'bi-house-heart-fill' };
      case 'gastronomia':return { color: '#1a56db', bg: '#eff6ff', border: '#bfdbfe', icon: 'bi-cup-hot-fill' };
      default:           return { color: '#1a56db', bg: '#eff6ff', border: '#bfdbfe', icon: 'bi-geo-alt-fill' };
    }
  };

  const theme = getTheme();
  const hasCoords = !isNaN(targetLat) && !isNaN(targetLng) && targetLat !== 0 && targetLng !== 0;
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`
    : '#';

  return (
    <div
      className="rounded-4 p-2 p-md-3 mb-4 w-100"
      style={{
        backgroundColor: theme.bg,
        border: `1.5px solid ${theme.border}`,
      }}
    >
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="d-block text-decoration-none w-100"
        style={{ cursor: hasCoords ? 'pointer' : 'default' }}
        title="Abrir en Google Maps"
      >
        <div
          className="position-relative overflow-hidden w-100"
          style={{
            borderRadius: '16px',
            border: `3px solid white`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            height: '280px',
          }}
        >
          {hasCoords ? (
            <GoogleMapViewer
              lat={targetLat}
              lng={targetLng}
              title={service?.name}
              type={type}
              height="280px"
              allowExpand={false}
            />
          ) : (
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <div className="text-center text-muted">
                <i className="bi bi-map fs-2 d-block mb-2" />
                <small className="font-inter">Ubicación no disponible</small>
              </div>
            </div>
          )}

          {hasCoords && (
            <div
              className="position-absolute bottom-0 end-0 m-2 mb-2 me-2 px-3 py-2 rounded-2 shadow-sm d-flex align-items-center gap-2"
              style={{
                backgroundColor: '#ffffff',
                color: theme.color,
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              <i className="bi bi-arrows-angle-expand" style={{ fontSize: '12px', strokeWidth: '1px' }} />
              AMPLIAR MAPA
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
