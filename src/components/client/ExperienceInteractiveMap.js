'use client';
import React from 'react';
import GoogleMapViewer from './GoogleMapViewer';

export default function ExperienceInteractiveMap({ stops = [], themeColor = '#ff5a1f' }) {
  // Mapear stops al formato esperado por GoogleMapViewer
  const markers = stops.map(stop => ({
    lat: stop.lat,
    lng: stop.lng,
    title: stop.name,
    description: stop.description
  }));

  return (
    <div className="position-relative w-100 rounded-4 overflow-hidden shadow-premium" style={{ height: 'clamp(400px, 60vh, 600px)', border: '4px solid white' }}>
      <GoogleMapViewer 
        markers={markers}
        type="experiencia"
      />

      {/* Info Overlay (Ayuda al Turista) */}
      <div className="position-absolute bottom-0 start-0 m-2 m-md-3 p-3 bg-white rounded-3 shadow-lg border-start border-4" 
           style={{ maxWidth: '240px', borderColor: themeColor, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)' }}>
        <h6 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          <i className="bi bi-info-circle-fill" style={{ color: themeColor }}></i>
          Puntos del Recorrido
        </h6>
        <p className="small text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.3' }}>
          Hacé clic en los marcadores para ver detalles de cada parada. Podés navegar entre ellas usando el mapa.
        </p>
      </div>
    </div>
  );
}
