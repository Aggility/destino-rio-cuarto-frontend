'use client';
import React, { useState, useEffect } from 'react';
import GoogleMapViewer from './GoogleMapViewer';

export default function LocationWithRoute({ address, lat, lng, name, type = 'service' }) {
  const [showMap, setShowMap] = useState(false);

  const getTheme = () => {
    switch (type) {
      case 'event': return { color: '#f54286', bg: '#fdf2f8' };
      case 'actividad':
      case 'activity': return { color: '#8a38f5', bg: '#f5f3ff' };
      case 'experiencia': return { color: '#ff5a1f', bg: '#fff7ed' };
      default: return { color: '#1a56db', bg: '#e1effe' };
    }
  };

  const theme = getTheme();

  // Bloquear scroll si el mapa está abierto
  useEffect(() => {
    if (showMap) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMap]);

  return (
    <>
      <div 
        className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 hover-lift transition-all shadow-sm" 
        onClick={() => setShowMap(true)} 
        style={{ cursor: 'pointer', backgroundColor: theme.bg, width: 'fit-content', border: `1px solid ${theme.color}22` }}
      >
        <i className="bi bi-geo-alt-fill" style={{ color: theme.color }}></i>
        <span className="font-inter fw-bold" style={{ color: theme.color, fontSize: '14px' }}>
          {address} <i className="bi bi-arrow-up-right ms-1 opacity-50"></i>
        </span>
      </div>

      {showMap && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" style={{ zIndex: 10000, backgroundColor: 'white' }}>
          
          {/* Header Map */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom shadow-sm bg-white position-relative" style={{ zIndex: 10 }}>
            <div>
              <h5 className="font-inter fw-bold m-0" style={{ letterSpacing: '-0.3px' }}>{name}</h5>
              <small className="text-muted font-inter"><i className="bi bi-geo-alt me-1"></i>{address}</small>
            </div>
            <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }} onClick={() => setShowMap(false)}>
              <i className="bi bi-x-lg text-dark"></i>
            </button>
          </div>

          {/* Map Area */}
          <div className="flex-grow-1 p-3 bg-light">
            <GoogleMapViewer 
              lat={lat} 
              lng={lng} 
              title={name} 
              type={type} 
            />
            
            <div className="mt-4 p-4 bg-white rounded-4 shadow-sm">
                <h6 className="font-inter fw-bold text-gray-900 mb-2">Cómo llegar</h6>
                <p className="text-muted small mb-3">
                    Podés ver la ruta óptima en el mapa de arriba. Si preferís usar navegación por voz o GPS en tiempo real, hacé clic en el botón inferior.
                </p>
                <div className="d-flex gap-2">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 py-3 fw-bold text-white shadow-premium rounded-3"
                      style={{ backgroundColor: theme.color }}
                    >
                        <i className="bi bi-cursor-fill me-2"></i>ABRIR EN GPS
                    </a>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
