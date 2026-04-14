import React from 'react';

/**
 * MacroEventCard - Destino Río Cuarto
 * Basado en Figma ID 3786:27623 (Data Date Block)
 * Card horizontal para eventos destacados. Optimizado para móvil.
 */
export default function MacroEventCard({
  title = "Ceremonia Inagural",
  date = "miércoles 11 de mar. 2026",
  time = "20:00hs",
  location = "Plaza Olmos de la Juventud",
  thumbnail = "/Thumbnail.png"
}) {
  return (
    <div className="macro-event-card bg-white border border-light-subtle rounded-3 p-3 d-flex flex-column flex-md-row align-items-center gap-3 w-100" 
         style={{ border: '1px solid #e5e7eb', minHeight: '131px' }}>
      
      {/* 1. Thumbnail — Figma ID 3777:13327 (Clase 'macro-thumb' manejada en globals.scss) */}
      <div className="macro-thumb flex-shrink-0 card-zoom-effect rounded-2 shadow-sm overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-100 h-100 object-cover"
        />
      </div>

      {/* 2. Content — Figma ID 3634:12460 */}
      <div className="flex-grow-1 d-flex flex-column gap-2 py-1 w-100 text-center text-md-start">
        <h3 className="font-inter fw-bold mb-1" style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#f54286', lineHeight: '1.2' }}>
          {title}
        </h3>
        
        <div className="d-flex flex-column gap-2 mb-2">
          {/* Date */}
          <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
            <i className="bi bi-calendar-event text-dark opacity-75"></i>
            <span className="font-inter text-gray-900 small fw-medium">{date}</span>
          </div>
          
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
            {/* Time */}
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clock text-dark opacity-75"></i>
              <span className="font-inter text-gray-700 small">{time}</span>
            </div>
            
            {/* Location */}
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt text-dark opacity-75"></i>
              <span className="font-inter text-gray-700 small">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actions — Figma ID 3634:12465 */}
      <div className="d-flex flex-md-column align-items-center align-items-md-end justify-content-center justify-content-md-between h-100 gap-3 py-1 w-100 w-md-auto">
        <button className="btn btn-sm shadow-premium bg-white border border-light-subtle rounded-2 font-inter fw-bold px-4 transition-all hover-lift w-100 w-md-auto" 
                style={{ fontSize: '14px', color: '#374151', minHeight: '42px' }}>
          Consultar <i className="bi bi-calendar-check ms-2"></i>
        </button>
        
        {/* Enlarge Icon — Solo visible en Desktop */}
        <div className="mt-auto d-none d-md-block opacity-25">
          <i className="bi bi-arrows-angle-expand" style={{ fontSize: '18px' }}></i>
        </div>
      </div>
    </div>
  );
}
