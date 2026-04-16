import React from 'react';
import Link from 'next/link';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';

/**
 * ServiceListItem - Destino Río Cuarto
 * Implementación Píxel Perfect basada en Figma:
 * - Desktop: ID 3640:28534
 * - Mobile: ID 3777:8035 (Service Data Block)
 */
export default function ServiceListItem({ 
  id,
  title = "Nombre del Servicio", 
  category = "Categoría", 
  address = "Dirección no especificada", 
  phone = "Sin teléfono",
  thumbnail = "/Thumbnail.png",
  distance = null,
  lat = null,
  lng = null
}) {
  return (
    <div className="service-list-item bg-white border border-light-subtle rounded-3 transition-all shadow-sm w-100 position-relative"
         style={{ 
            border: '1px solid #d1d5db',
            borderLeft: '4px solid #1a56db',
            padding: '12px 16px',
            borderRadius: '8px'
         }}>
      
      {/* WRAP CONTENT IN LINK */}
      <Link href={id ? `/servicio/${id}` : "#"} className="text-decoration-none text-reset">
        {/* 1. HEADER ROW (Layout mixto) */}
        <div className="d-flex align-items-start justify-content-between gap-3 w-100 mb-2">
        
        <div className="d-flex flex-row align-items-start gap-3 flex-grow-1 overflow-hidden">
             {/* Thumbnail (90x65 en mobile, algo más grande en desktop vía clamp) */}
            <div className="flex-shrink-0 card-zoom-effect rounded-2 border overflow-hidden" 
                style={{ 
                    width: '90px', 
                    height: '65px',
                    borderColor: '#d1d5db'
                }}>
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="w-100 h-100 object-cover"
                />
            </div>

            {/* Title & Badge */}
            <div className="d-flex flex-column gap-1 overflow-hidden">
                <h3 className="font-inter fw-bold text-gray-900 mb-0 text-truncate-2" 
                    style={{ fontSize: '16px', lineHeight: '1.3' }}>
                    {title}
                </h3>
                <div className="d-flex flex-column gap-1">
                   <EventDistanceBadge eventLat={lat} eventLng={lng} distance={distance} type="service" />
                   <div className="rounded-1 px-2 py-0-5 w-fit-content" 
                        style={{ backgroundColor: '#ebf5ff' }}>
                       <span className="font-inter fw-medium" style={{ color: '#1a56db', fontSize: '12px' }}>
                       {category}
                       </span>
                   </div>
                </div>
            </div>
        </div>

        {/* Desktop-only action icon (Arrow) - d-none d-md-block moved to footer area to match mobile */}
      </div>

      {/* 2. DATA LIST (Address & Phone) */}
      <div className="d-flex flex-column gap-2 py-2 border-top border-md-0 mt-2 mt-md-0">
        <div className="d-flex align-items-start gap-2">
          <div className="flex-shrink-0" style={{ width: '14px' }}>
            <i className="bi bi-geo-alt text-muted" style={{ fontSize: '14px' }}></i>
          </div>
          <p className="font-inter text-gray-900 mb-0 text-decoration-underline text-truncate-2 small" 
             style={{ lineHeight: '1.5' }}>
            {address}
          </p>
        </div>
        <div className="d-flex align-items-start gap-2">
          <div className="flex-shrink-0" style={{ width: '14px' }}>
            <i className="bi bi-telephone text-muted" style={{ fontSize: '14px' }}></i>
          </div>
          <p className="font-inter text-gray-900 mb-0 text-truncate small" 
             style={{ lineHeight: '1.5' }}>
            {phone}
          </p>
        </div>
      </div>
      </Link>

      {/* 3. ACTIONS FOOTER - Figma ID 3605:22704 */}
      <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-2 border-top">
        <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0">
          <button className="btn btn-sm shadow-premium bg-white border rounded-2 font-inter fw-medium px-3 transition-all hover-lift d-flex align-items-center justify-content-center gap-2" 
                  style={{ fontSize: '13px', color: '#0f172a', height: '37px', borderColor: '#e5e7eb' }}>
            Contactar <i className="bi bi-telephone text-muted" style={{ fontSize: '12px' }}></i>
          </button>
          <button className="btn btn-sm shadow-premium bg-white border rounded-2 font-inter fw-medium px-3 transition-all hover-lift d-flex align-items-center justify-content-center gap-2" 
                  style={{ fontSize: '13px', color: '#0f172a', height: '37px', borderColor: '#e5e7eb' }}>
            WhatsApp <i className="bi bi-whatsapp text-success" style={{ fontSize: '14px' }}></i>
          </button>
        </div>

        {/* Arrow Icon (Figma 3605:22706) */}
        <div className="flex-shrink-0">
           <i className="bi bi-chevron-right text-muted opacity-50" style={{ fontSize: '18px' }}></i>
        </div>
      </div>
    </div>
  );
}
