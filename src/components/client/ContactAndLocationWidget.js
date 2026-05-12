'use client';
import React from 'react';
import GoogleMapViewer from './GoogleMapViewer';
import ContactButtons from './ContactButtons';

export default function ContactAndLocationWidget({ service, type = 'service' }) {
  const targetLat = parseFloat(service?.lat);
  const targetLng = parseFloat(service?.lng);

  const getTheme = () => {
    switch (type) {
      case 'event': return { icon: 'bi-star-fill', color: '#f54286', bg: '#fdf2f8' };
      case 'actividad':
      case 'activity': return { icon: 'bi-person-walking', color: '#8a38f5', bg: '#f5f3ff' };
      case 'experiencia': return { icon: 'bi-stars', color: '#ff5a1f', bg: '#fff7ed' };
      case 'alojamiento': return { icon: 'bi-house-heart-fill', color: '#1a56db', bg: '#ebf5ff' };
      case 'gastronomia': return { icon: 'bi-cup-hot-fill', color: '#1a56db', bg: '#ebf5ff' };
      default: return { icon: 'bi-geo-alt-fill', color: '#1a56db', bg: '#ebf5ff' };
    }
  };

  const theme = getTheme();

  return (
    <div className="rounded-4 shadow-premium border-0 p-4 mb-5" style={{ backgroundColor: theme.bg }}>
      <div className="row g-4 align-items-center">
        
        {/* Mapa de Google */}
        <div className="col-12 col-md-6">
          <GoogleMapViewer 
            lat={targetLat} 
            lng={targetLng} 
            title={service?.name} 
            type={type} 
          />
        </div>

        {/* Datos de Contacto */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column h-100 justify-content-center p-md-2 text-center text-md-start">
            <h3 className="font-inter fw-bold mb-1" style={{ color: theme.color, fontSize: '20px' }}>
              {service?.name || 'Contactate con nosotros'}
            </h3>
            <p className="font-inter text-muted small mb-3">
              <i className="bi bi-geo-alt-fill me-1"></i>{service?.address}
            </p>
            
            <ContactButtons 
              phone={service.phones?.[0]} 
              whatsapp={service.phones?.[0]} 
            />
            
            <p className="font-inter text-muted x-small mt-3 opacity-75">
              Hacé clic en el mapa para navegar con Google Maps y ver la ruta óptima desde tu ubicación.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
