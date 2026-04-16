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
  lng = null,
  variant = "default" // "default" | "calendar"
}) {
  const isActivity = type === "activity";
  const isService = type === "service";
  const isCalendar = variant === "calendar";
  
  const getColors = () => {
    if (isCalendar) return { bg: '#fdf2f8', text: '#f54286', arrow: '#f54286', sub: '#f54286' };
    if (isActivity) return { bg: '#8a38f5', text: '#white', arrow: '#8a38f5', sub: '#6b7280' };
    if (isService) return { bg: '#ebf5ff', text: '#1a56db', arrow: '#1a56db', sub: '#6b7280' };
    return { bg: '#fdf2f8', text: '#f54286', arrow: '#f54286', sub: '#6b7280' }; // Default event (pink)
  };

  const theme = getColors();

  return (
    <Link href={href} className={`sidebar-list-card text-decoration-none transition-all hover-lift d-block group overflow-hidden ${isCalendar ? 'rounded-3 p-1' : ''}`}
          style={{ backgroundColor: isCalendar ? theme.bg : 'transparent' }}>
      <div className={`d-flex align-items-center gap-2 ${isCalendar ? 'py-1' : 'py-2'}`}>
        
        {/* Thumbnail */}
        <div className="flex-shrink-0 overflow-hidden rounded-2 shadow-sm card-zoom-effect" 
             style={{ 
                width: isCalendar ? '46px' : '80px', 
                height: isCalendar ? '46px' : '80px' 
             }}>
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-100 h-100 object-fit-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div className="flex-grow-1 d-flex flex-column min-w-0">
          <div className="min-w-0 overflow-hidden">
            <h5 className="font-inter fw-bold mb-0 text-truncate w-100" 
                style={{ fontSize: isCalendar ? '12px' : '14px', lineHeight: '1.2', color: theme.text }}>
              {title}
            </h5>
            
            {!isCalendar && (
              <>
                <p className="font-inter text-gray-500 mb-0 text-truncate w-100" 
                   style={{ fontSize: '13px', lineHeight: '1.2' }}>
                  {subtitle}
                </p>
                <div className="mt-1">
                  <EventDistanceBadge eventLat={lat} eventLng={lng} minimal={true} type={type} />
                </div>
              </>
            )}

            {isCalendar && (
                <span className="font-inter fw-bold opacity-90" style={{ fontSize: '10px', color: theme.text }}>
                    {badge}
                </span>
            )}
          </div>

          {!isCalendar && (
            <div className="d-inline-flex px-2 py-0-5 rounded-1 mt-1 w-fit-content" 
                 style={{ backgroundColor: isService ? '#e1effe' : (isActivity ? '#8a38f5' : '#f54286'), width: 'fit-content' }}>
              <span className="font-inter fw-bold shadow-sm" 
                    style={{ fontSize: '9px', lineHeight: '1.2', color: isService ? '#1a56db' : 'white' }}>
                {badge.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="ms-auto ps-1 opacity-25 group-hover:opacity-100 transition-opacity d-none d-sm-block">
            <i className="bi bi-chevron-right" style={{ color: theme.arrow, fontSize: '12px' }}></i>
        </div>
      </div>
    </Link>
  );
}
