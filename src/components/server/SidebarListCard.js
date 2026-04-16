import React from 'react';
import Link from 'next/link';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';

/**
 * SidebarListCard - Destino Río Cuarto
 * Basado en Figma "Card S" (Compact Sidebar Cards)
 * Soporta variantes para Eventos y Actividades Turísticas.
 */
export default function SidebarListCard({
  id = "1",
  type = "event", // "event" | "activity"
  title = "Nombre del Item",
  subtitle = "Lugar o ubicación",
  badge = "10 NOV",
  thumbnail = "/Thumbnail.png",
  href = "#",
  lat = null,
  lng = null
}) {
  const isActivity = type === "activity";
  
  return (
    <Link href={href} className="sidebar-list-card text-decoration-none transition-all hover-lift d-block group">
      <div className="d-flex align-items-center gap-3 py-2">
        
        {/* Thumbnail - Diferentes proporciones según tipo */}
        <div className="flex-shrink-0 overflow-hidden rounded-2 shadow-sm card-zoom-effect" 
             style={{ 
                width: isActivity ? '122px' : '83px', 
                height: '83px' 
             }}>
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-100 h-100 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow-1 d-flex flex-column gap-1 min-w-0">
          <div className="min-w-0">
            <h5 className="font-inter fw-bold text-gray-900 mb-0 text-truncate" 
                style={{ fontSize: '15px', lineHeight: '1.3' }}>
              {title}
            </h5>
            <p className="font-inter text-gray-700 mb-0 text-truncate" 
               style={{ fontSize: '14px', lineHeight: '1.3' }}>
              {subtitle}
            </p>
            <EventDistanceBadge eventLat={lat} eventLng={lng} minimal={true} type={isActivity ? "activity" : "event"} />
          </div>

          <div className="d-inline-flex px-2 py-1 rounded-1 mt-1 w-fit-content" 
               style={{ backgroundColor: !isActivity ? '#f54286' : '#374151', width: 'fit-content' }}>
            <span className="font-inter fw-medium text-white shadow-sm" 
                  style={{ fontSize: '12px', lineHeight: '1' }}>
              {badge}
            </span>
          </div>
        </div>

        {/* Arrow (Figma I3804:30290;3613:24634) */}
        <div className="ms-2 opacity-50 group-hover:opacity-100 transition-opacity d-none d-sm-block">
            <i className="bi bi-chevron-right" style={{ color: !isActivity ? '#f54286' : '#1a56db' }}></i>
        </div>
      </div>
    </Link>
  );
}
