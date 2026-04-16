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
    <div className="macro-event-card position-relative overflow-hidden rounded-4 border-0 shadow-premium transition-all hover-lift-lg w-100" 
         style={{ 
            background: 'linear-gradient(135deg, #f54286 0%, #d92d6b 100%)',
            minHeight: '200px'
         }}>
      


      <div className="position-relative z-1 d-flex flex-column flex-md-row align-items-stretch gap-0 w-100 h-100">
        
        {/* 1. Thumbnail — Más grande y con efecto */}
        <div className="macro-thumb-large flex-shrink-0 position-relative overflow-hidden" 
             style={{ width: '100%', maxWidth: '380px', minHeight: '220px' }}>
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-100 h-100 object-cover transition-all"
            style={{ objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
            <span className="badge rounded-pill bg-white text-pink fw-bold px-3 py-2 shadow-sm font-inter" style={{ color: '#f54286', fontSize: '11px' }}>
              EVENTO DESTACADO
            </span>
          </div>
        </div>
  
        {/* 2. Content — Blanco y con Glashmorphism sutil */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center p-4 p-md-5 text-white">
          <h3 className="font-inter fw-extrabold mb-3" style={{ fontSize: 'clamp(24px, 4vw, 34px)', lineHeight: '1.1', letterSpacing: '-1px' }}>
            {title}
          </h3>
          
          <div className="d-flex flex-column gap-3 mb-4">
            {/* Date */}
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-calendar-event fs-5"></i>
              </div>
              <span className="font-inter fw-semibold" style={{ fontSize: '18px' }}>{date}</span>
            </div>
            
            <div className="d-flex flex-wrap gap-4 mt-2">
              {/* Time */}
              <div className="d-flex align-items-center gap-2 opacity-90">
                <i className="bi bi-clock"></i>
                <span className="font-inter small fw-medium">{time}</span>
              </div>
              
              {/* Location */}
              <div className="d-flex align-items-center gap-2 opacity-90">
                <i className="bi bi-geo-alt"></i>
                <span className="font-inter small fw-medium">{location}</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            <button className="btn btn-light rounded-pill font-inter fw-bold px-5 py-3 transition-all hover-scale shadow-sm" 
                    style={{ fontSize: '15px', color: '#f54286' }}>
              VER MÁS DETALLES <i className="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
