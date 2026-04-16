'use client';
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapPreview from './MapPreview';
import ContactButtons from './ContactButtons';

export default function ContactAndLocationWidget({ service, type = 'service' }) {
  const [showMap, setShowMap] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [travelMode, setTravelMode] = useState('driving'); // 'driving' or 'walking'
  const [routeStats, setRouteStats] = useState(null);

  const targetLat = parseFloat(service?.lat) || -33.1232;
  const targetLng = parseFloat(service?.lng) || -64.3493;

  const getTheme = () => {
    switch (type) {
      case 'event': return { icon: 'bi-star-fill', color: '#f54286', bg: '#fdf2f8' };
      case 'actividad': return { icon: 'bi-person-walking', color: '#8a38f5', bg: '#f5f3ff' };
      case 'experiencia': return { icon: 'bi-stars', color: '#ff5a1f', bg: '#fff7ed' };
      case 'alojamiento': return { icon: 'bi-house-heart-fill', color: '#1a56db', bg: '#ebf5ff' };
      case 'gastronomia': return { icon: 'bi-cup-hot-fill', color: '#ff5a1f', bg: '#fff7ed' };
      default: return { icon: 'bi-geo-alt-fill', color: '#1a56db', bg: '#ebf5ff' };
    }
  };

  const theme = getTheme();

  // Manejo del body scroll para el modal extendido
  useEffect(() => {
    if (showMap) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMap]);

  // Al abrir el modal, buscamos la ruta
  useEffect(() => {
    if (showMap && localStorage.getItem('geo_permission_granted') === 'true') {
      if (window._userLocCache) {
        setUserLoc(window._userLocCache);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          window._userLocCache = loc;
          setUserLoc(loc);
        },
        (err) => console.log("Map: error location", err),
        { enableHighAccuracy: false, maximumAge: 600000, timeout: 5000 }
      );
    }
  }, [showMap]);

  useEffect(() => {
    if (userLoc && targetLat && targetLng) {
      const mode = travelMode === 'walking' ? 'foot' : 'driving';
      const url = `https://router.project-osrm.org/route/v1/${mode}/${userLoc.lng},${userLoc.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
      
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            setRouteGeoJson(data.routes[0].geometry);
            setRouteStats({
                distance: data.routes[0].distance, // en metros
                duration: data.routes[0].duration  // en segundos
            });
          }
        }).catch(e => console.error("Error routing", e));
    }
  }, [userLoc, targetLat, targetLng, travelMode]);

  const routeLayer = {
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': theme.color,
      'line-width': 6,
      'line-opacity': 0.8
    }
  };

  return (
    <>
      {/* Componente Integrado: Mini Mapa + Datos de Contacto */}
      <div className="rounded-4 shadow-premium border-0 p-4 mb-5" style={{ backgroundColor: theme.bg }}>
          <div className="row g-4 align-items-center">
              
              {/* Miniatura del Mapa */}
              <div className="col-12 col-md-5">
                  <MapPreview 
                    lat={targetLat} 
                    lng={targetLng} 
                    type={type} 
                    onClick={() => setShowMap(true)} 
                  />
              </div>

              {/* Botones de Acción */}
              <div className="col-12 col-md-7">
                 <div className="d-flex flex-column h-100 justify-content-center p-md-2 text-center text-md-start">
                     <h3 className="font-inter fw-bold mb-1" style={{ color: theme.color, fontSize: '20px' }}>Contactate con nosotros</h3>
                     <p className="font-inter text-muted small mb-3">Hacé clic en el mapa para ver cómo llegar o usá los botones de contacto.</p>
                     
                     <ContactButtons 
                        phone={service.phones?.[0]} 
                        whatsapp={service.phones?.[0]} 
                     />
                 </div>
              </div>

          </div>
      </div>

      {/* Modal Popup (Trazador de Ruta) */}
      {showMap && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" style={{ zIndex: 10000, backgroundColor: 'white' }}>
          
          {/* Header del Trazador */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom shadow-sm bg-white position-relative" style={{ zIndex: 10 }}>
            <div>
              <h5 className="font-inter fw-bold m-0" style={{ letterSpacing: '-0.3px' }}>{service.name}</h5>
              <small className="text-muted font-inter"><i className="bi bi-geo-alt me-1"></i>{service.address}</small>
            </div>
            <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }} onClick={() => setShowMap(false)}>
              <i className="bi bi-x-lg text-dark"></i>
            </button>
          </div>

          {/* Area del Mapa Fullscreen */}
          <div className="flex-grow-1 position-relative">
            {/* Selector de modo y estadísticas */}
            <div className="position-absolute top-0 start-50 translate-middle-x mt-3 d-flex flex-column align-items-center gap-2 w-100 px-3" style={{ zIndex: 10 }}>
               
               {/* Modo Selector */}
               <div className="bg-white rounded-pill shadow-premium p-1 d-flex gap-1 border">
                  <button 
                    onClick={() => setTravelMode('driving')}
                    className={`btn rounded-pill px-3 py-1 font-inter fw-bold small d-flex align-items-center gap-2 transition-all ${travelMode === 'driving' ? 'text-white' : 'text-muted'}`}
                    style={{ backgroundColor: travelMode === 'driving' ? theme.color : 'transparent', border: 'none' }}>
                    <i className="bi bi-car-front-fill"></i> Auto
                  </button>
                  <button 
                    onClick={() => setTravelMode('walking')}
                    className={`btn rounded-pill px-3 py-1 font-inter fw-bold small d-flex align-items-center gap-2 transition-all ${travelMode === 'walking' ? 'text-white' : 'text-muted'}`}
                    style={{ backgroundColor: travelMode === 'walking' ? theme.color : 'transparent', border: 'none' }}>
                    <i className="bi bi-person-walking"></i> Caminando
                  </button>
               </div>

               {/* Stats de Ruta */}
               {routeStats && (
                  <div className="bg-white px-3 py-1 rounded-pill shadow-sm border animate-fade-in">
                    <span className="font-inter fw-medium text-gray-800" style={{ fontSize: '13px' }}>
                       <i className="bi bi-clock-history me-1 opacity-75"></i>
                       {Math.round(routeStats.duration / 60)} min — {routeStats.distance < 1000 ? `${Math.round(routeStats.distance)}m` : `${(routeStats.distance / 1000).toFixed(1)}km`}
                    </span>
                  </div>
               )}
            </div>

            <Map
              initialViewState={{
                longitude: userLoc ? ((userLoc.lng + targetLng)/2) : targetLng,
                latitude: userLoc ? ((userLoc.lat + targetLat)/2) : targetLat,
                zoom: userLoc ? 13 : 15
              }}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="bottom-right" />
              
              {/* Marcador del Destino dinámico */}
              <Marker longitude={targetLng} latitude={targetLat} anchor="bottom">
                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg" style={{ width: '50px', height: '50px', border: `3px solid ${theme.color}` }}>
                   <i className={`bi ${theme.icon}`} style={{ color: theme.color, fontSize: '24px' }}></i>
                </div>
              </Marker>

              {/* Marcador del Usuario */}
              {userLoc && (
                <Marker longitude={userLoc.lng} latitude={userLoc.lat} anchor="center">
                   <div className="d-flex align-items-center justify-content-center rounded-circle shadow-lg" style={{ width: '22px', height: '22px', border: '3px solid white', backgroundColor: theme.color }}>
                      <div className="rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></div>
                   </div>
                </Marker>
              )}

              {/* Trazado de ruta GeoJSON */}
              {routeGeoJson && (
                <Source id="route" type="geojson" data={routeGeoJson}>
                  <Layer {...routeLayer} />
                </Source>
              )}
            </Map>
            
            {/* Elemento Informativo Flotante */}
            {userLoc && routeGeoJson && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-white px-4 py-3 rounded-pill shadow-lg border text-center" style={{ minWidth: '90%', maxWidth: '340px' }}>
                    <span className="font-inter fw-bold text-gray-900 d-block m-0" style={{ fontSize: '15px' }}>
                        <i className={`bi ${travelMode === 'driving' ? 'bi-car-front-fill' : 'bi-person-walking'} me-2`} style={{ color: theme.color }}></i>
                        Ruta optimizada hasta {service.name}
                    </span>
                </div>
            )}
            
            {!userLoc && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white px-4 py-2 rounded-pill shadow-lg border text-center" style={{ minWidth: '90%', maxWidth: '320px' }}>
                    <span className="font-inter d-block" style={{ fontSize: '14px' }}>
                        <i className="bi bi-geo-alt-fill me-2" style={{ color: theme.color }}></i> 
                        Activa tu ubicación para ver el recorrido.
                    </span>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
