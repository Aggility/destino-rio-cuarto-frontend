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
        
        {/* 1. Thumbnail */}
        <div className="macro-thumb-container flex-shrink-0 position-relative overflow-hidden" 
             style={{ height: '100%', minHeight: '180px' }}>
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-100 h-100 object-fit-cover transition-all"
            style={{ objectFit: 'cover', minHeight: '200px' }}
          />
          <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
            <span className="badge rounded-pill bg-white text-pink fw-bold px-3 py-1 shadow-sm font-inter" style={{ color: '#f54286', fontSize: '10px' }}>
              EVENTO DESTACADO
            </span>
          </div>
        </div>
  
        {/* 2. Content */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center p-3 p-md-3 text-white">
          <h3 className="font-inter fw-extrabold mb-3" style={{ fontSize: 'clamp(24px, 4vw, 34px)', lineHeight: '1.1', letterSpacing: '-1px' }}>
            {title}
          </h3>
          
          <div className="d-flex flex-column gap-3 mb-4">
            {/* Date */}
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                <i className="bi bi-calendar-event" style={{ color: '#f54286', fontSize: '16px' }}></i>
              </div>
              <span className="font-inter fw-semibold" style={{ fontSize: 'clamp(14px, 3.5vw, 15px)', color: '#fed7e2' }}>{date}</span>
            </div>
            
            <div className="d-flex flex-wrap gap-3 mt-1">
              {/* Time */}
              <div className="d-flex align-items-center gap-2 opacity-80">
                <i className="bi bi-clock" style={{ fontSize: '13px' }}></i>
                <span className="font-inter fw-medium" style={{ fontSize: '12px' }}>{time}</span>
              </div>
              
              {/* Location */}
              <div className="d-flex align-items-center gap-2 opacity-80">
                <i className="bi bi-geo-alt" style={{ fontSize: '13px' }}></i>
                <span className="font-inter fw-medium" style={{ fontSize: '12px' }}>{location}</span>
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
