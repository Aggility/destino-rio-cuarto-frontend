'use client';
import React from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPreview({ lat, lng, onClick, type = 'service' }) {
  const getTheme = () => {
    switch (type) {
      case 'event': return { icon: 'bi-star-fill', color: '#f54286' };
      case 'actividad': return { icon: 'bi-person-walking', color: '#8a38f5' };
      case 'experiencia': return { icon: 'bi-stars', color: '#ff5a1f' };
      case 'alojamiento': return { icon: 'bi-house-heart-fill', color: '#1a56db' };
      case 'gastronomia': return { icon: 'bi-cup-hot-fill', color: '#ff5a1f' };
      default: return { icon: 'bi-geo-alt-fill', color: '#1a56db' };
    }
  };

  const theme = getTheme();

  return (
    <div 
      className="position-relative w-100 rounded-4 overflow-hidden shadow-sm transition-all hover-lift" 
      style={{ height: '240px', cursor: 'pointer', border: '5px solid white' }}
      onClick={onClick}
    >
        <Map
          initialViewState={{ longitude: lng, latitude: lat, zoom: 15 }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          interactive={false}
          style={{ width: '100%', height: '100%' }}
        >
           <Marker longitude={lng} latitude={lat} anchor="bottom">
             <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style={{ width: '40px', height: '40px', border: `2px solid ${theme.color}` }}>
                <i className={`bi ${theme.icon}`} style={{ color: theme.color, fontSize: '20px' }}></i>
             </div>
           </Marker>
        </Map>
        
        {/* Overlay CTA */}
        <div className="position-absolute bottom-0 start-0 w-100 py-3 text-center" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.8))' }}>
           <span className="font-inter fw-bold" style={{ fontSize: '15px', color: '#1a56db' }}>
              <i className="bi bi-cursor-fill me-2"></i>Ver ruta para llegar
           </span>
        </div>
    </div>
  );
}
