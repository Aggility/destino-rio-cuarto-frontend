'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * GoogleMapViewer - Reemplaza MapPreview con Google Maps
 * @param {number} lat - Latitud del destino (si es punto único)
 * @param {number} lng - Longitud del destino (si es punto único)
 * @param {Array} markers - Array de objetos {lat, lng, title, description} para múltiples puntos
 * @param {string} title - Título del lugar
 * @param {string} type - Tipo (event, activity, etc) para el color del marcador
 */
export default function GoogleMapViewer({ lat, lng, markers = [], title, type = 'service', height = '300px', allowExpand = true }) {
  const mapRef = useRef(null);
  const [distance, setDistance] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Bloquear scroll si el mapa está maximizado
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  // Puntos a renderizar
  const points = markers.length > 0 ? markers : [{ lat, lng, title }];

  const getThemeColor = () => {
    switch (type) {
      case 'event': return '#f54286';
      case 'activity':
      case 'actividad': return '#8a38f5';
      case 'experiencia': return '#ff5a1f';
      default: return '#1a56db';
    }
  };

  const themeColor = getThemeColor();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!points[0]?.lat || !points[0]?.lng) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return;

    const loadMap = () => {
      if (!mapRef.current) return;
      const google = window.google;
      if (!google) return;
      
      const bounds = new google.maps.LatLngBounds();
      
      try {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 15,
          center: { lat: parseFloat(points[0].lat), lng: parseFloat(points[0].lng) },
          disableDefaultUI: true,
          zoomControl: true,
        });

        const infoWindow = new google.maps.InfoWindow();

        points.forEach(p => {
          if (!p.lat || !p.lng) return;
          const pos = { lat: parseFloat(p.lat), lng: parseFloat(p.lng) };
          bounds.extend(pos);

          const pinSvg = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="white" stroke="${themeColor}" stroke-width="2"/>
              <circle cx="20" cy="20" r="14" fill="${themeColor}"/>
              <path d="M20 12V28M12 20H28" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `;

          const marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: p.title || title,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }
          });

          if (p.description || p.title) {
            marker.addListener('click', () => {
              infoWindow.setContent(`
                <div style="padding: 8px; font-family: sans-serif;">
                  <b style="color: ${themeColor}">${p.title || title}</b>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #666;">${p.description || ''}</p>
                </div>
              `);
              infoWindow.open(map, marker);
            });
          }
        });

        if (points.length > 1) {
          map.fitBounds(bounds);
        }

        // Distancia (al primer punto como referencia)
        if (isMobile && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const userPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            const destPos = new google.maps.LatLng(points[0].lat, points[0].lng);
            const distInMeters = google.maps.geometry.spherical.computeDistanceBetween(userPos, destPos);
            setDistance(distInMeters < 1000 ? `${Math.round(distInMeters)}m` : `${(distInMeters / 1000).toFixed(1)}km`);
          }, () => {}, { enableHighAccuracy: false });
        }
      } catch (err) {
        console.error("Google Maps Init Error:", err);
      }
    };

    if (!window.google) {
      if (!window._googleMapsLoading) {
        window._googleMapsLoading = true;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMap&loading=async`;
        script.async = true;
        script.defer = true;
        window.initGoogleMap = () => {
          delete window.initGoogleMap;
          loadMap();
        };
        document.head.appendChild(script);
      }
    } else {
      loadMap();
    }
  }, [points, isMobile, themeColor, title]);

  return (
    <>
      <div 
        className="position-relative w-100 rounded-4 overflow-hidden shadow-premium" 
        style={{ height: height, border: '4px solid white', cursor: allowExpand ? 'pointer' : 'default' }}
        onClick={allowExpand ? () => setIsExpanded(true) : undefined}
      >
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        


        {/* Botón Ver mapa completo / Expandir overlay */}
        {allowExpand && (
          <div 
            className="position-absolute bottom-0 end-0 m-3 px-3 py-2 rounded-3 shadow-premium d-flex align-items-center gap-2"
            style={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(4px)',
              color: themeColor,
              fontSize: '13px',
              fontWeight: '700',
              zIndex: 10
            }}
          >
            <i className="bi bi-arrows-angle-expand"></i>AMPLIAR MAPA
          </div>
        )}
      </div>

      {/* Popup de pantalla completa */}
      {isExpanded && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-white animate-fade-in" style={{ zIndex: 100000 }}>
          {/* Header Map */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom shadow-sm bg-white position-relative" style={{ zIndex: 10 }}>
            <div>
              <h5 className="font-inter fw-bold m-0" style={{ letterSpacing: '-0.3px' }}>{title || 'Mapa de la Experiencia'}</h5>
              <small className="text-muted font-inter"><i className="bi bi-map me-1"></i>Puntos incluidos en el recorrido</small>
            </div>
            <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }} onClick={() => setIsExpanded(false)}>
              <i className="bi bi-x-lg text-dark"></i>
            </button>
          </div>

          {/* Map Area */}
          <div className="flex-grow-1 p-2 bg-light position-relative">
            <button 
              className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-premium border-0 d-flex align-items-center justify-content-center" 
              style={{ width: '44px', height: '44px', zIndex: 100005, backgroundColor: 'white' }} 
              onClick={() => setIsExpanded(false)}
              aria-label="Cerrar mapa"
            >
              <i className="bi bi-x-lg text-dark fs-5"></i>
            </button>
            <GoogleMapViewer 
              markers={points} 
              title={title} 
              type={type} 
              height="100%" 
              allowExpand={false} 
            />
          </div>
        </div>
      )}
    </>
  );
}
