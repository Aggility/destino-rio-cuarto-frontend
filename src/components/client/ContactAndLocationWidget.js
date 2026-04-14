'use client';
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ContactAndLocationWidget({ service }) {
  const [showMap, setShowMap] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);

  const targetLat = parseFloat(service?.lat) || -33.1232;
  const targetLng = parseFloat(service?.lng) || -64.3493;

  // Manejo del body scroll para el modal extendido
  useEffect(() => {
    if (showMap) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMap]);

  // Al abrir el modal, buscamos la ruta
  useEffect(() => {
    if (showMap && localStorage.getItem('geo_permission_granted') === 'true') {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Map: error location", err)
      );
    }
  }, [showMap]);

  useEffect(() => {
    if (userLoc && targetLat && targetLng) {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            setRouteGeoJson(data.routes[0].geometry);
          }
        }).catch(e => console.log("Error routing", e));
    }
  }, [userLoc, targetLat, targetLng]);

  const routeLayer = {
    id: 'route',
    type: 'line',
    source: 'route', // This must match the source ID
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#f54286',
      'line-width': 5,
      'line-opacity': 0.8
    }
  };

  return (
    <>
      {/* Componente Integrado: Mini Mapa + Datos de Contacto */}
      <div className="rounded-4 shadow-premium border-0 p-4 mb-5" style={{ backgroundColor: '#e1effe' }}>
          <div className="row g-4 align-items-center">
              
              {/* Miniatura del Mapa Interactivo (Sin hacer scroll, dispara el Modal) */}
              <div className="col-12 col-md-5 col-xl-4 flex-shrink-0">
                  <div 
                    className="position-relative w-100 rounded-4 overflow-hidden shadow-sm transition-all hover-lift" 
                    style={{ height: '240px', cursor: 'pointer', border: '2px solid white' }}
                    onClick={() => setShowMap(true)}
                  >
                      {/* Vista Previa inerte con Maplibre */}
                      <Map
                        initialViewState={{ longitude: targetLng, latitude: targetLat, zoom: 15 }}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        interactive={false} // Para no scrollear accidentalmente desde la vista previa
                        style={{ width: '100%', height: '100%' }}
                      >
                         <Marker longitude={targetLng} latitude={targetLat} anchor="bottom">
                           <i className="bi bi-geo-alt-fill text-danger" style={{ fontSize: '36px', filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.4))' }}></i>
                         </Marker>
                      </Map>
                      
                      {/* Overlay CTA sobre el mapa */}
                      <div className="position-absolute bottom-0 start-0 w-100 py-3 text-center" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.8))' }}>
                         <span className="font-inter fw-bold" style={{ fontSize: '15px', color: '#1a56db' }}>
                            <i className="bi bi-cursor-fill me-2"></i>Ver ruta para llegar
                         </span>
                      </div>
                  </div>
              </div>

              {/* Información de Contacto */}
              <div className="col-12 col-md-7 col-xl-8">
                 <div className="d-flex flex-column h-100 justify-content-center p-md-2">
                     
                     {/* Lista Info */}
                     <div className="d-flex flex-column gap-3 mb-4">
                        <div className="d-flex align-items-start gap-3">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                                <i className="bi bi-geo-alt-fill" style={{ color: '#1a56db' }}></i>
                            </div>
                            <span className="font-inter fw-medium mt-1" style={{ color: '#1e429f', fontSize: '16px' }}>{service.address}</span>
                        </div>
                        
                        {service.phones && service.phones.length > 0 && (
                            <div className="d-flex align-items-start gap-3">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                                    <i className="bi bi-telephone-fill" style={{ color: '#1a56db' }}></i>
                                </div>
                                <span className="font-inter fw-medium mt-1" style={{ color: '#1e429f', fontSize: '16px' }}>{service.phones.join(' / ')}</span>
                            </div>
                        )}
                        
                        {service.socials && service.socials.map((social, index) => (
                            <div key={index} className="d-flex align-items-start gap-3">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                                    <i className={`bi ${social.icon}`} style={{ color: '#1a56db' }}></i>
                                </div>
                                <a href={social.url} className="font-inter fw-medium mt-1 text-decoration-none hover-underline" target="_blank" rel="noreferrer" style={{ color: '#1e429f', fontSize: '16px' }}>
                                    {social.label}
                                </a>
                            </div>
                        ))}
                     </div>

                     {/* Botones de Acción */}
                     <div className="d-flex flex-wrap gap-3 mt-2">
                         <button className="btn d-flex align-items-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift" style={{ padding: '12px 28px', backgroundColor: 'white', color: '#111827', border: 'none' }}>
                             Contactar <i className="bi bi-telephone text-muted ms-1"></i>
                         </button>
                         <button className="btn btn-success d-flex align-items-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift" style={{ padding: '12px 28px', backgroundColor: '#25D366', border: 'none' }}>
                             WhatsApp <i className="bi bi-whatsapp"></i>
                         </button>
                     </div>
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
            <Map
              initialViewState={{
                // Zoom out if routing to fit both roughly, or closer if static
                longitude: userLoc ? ((userLoc.lng + targetLng)/2) : targetLng,
                latitude: userLoc ? ((userLoc.lat + targetLat)/2) : targetLat,
                zoom: userLoc ? 13 : 15
              }}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="bottom-right" />
              
              {/* Marcador del Destino */}
              <Marker longitude={targetLng} latitude={targetLat} anchor="bottom">
                <i className="bi bi-geo-alt-fill text-danger text-shadow" style={{ fontSize: '38px', filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}></i>
              </Marker>

              {/* Marcador del Usuario */}
              {userLoc && (
                <Marker longitude={userLoc.lng} latitude={userLoc.lat} anchor="center">
                   <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle shadow-lg" style={{ width: '20px', height: '20px', border: '3px solid white' }}>
                      <div className="rounded-circle bg-white" style={{ width: '6px', height: '6px' }}></div>
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
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-white px-4 py-3 rounded-pill shadow-lg border text-center" style={{ minWidth: '90%', maxWidth: '300px' }}>
                    <span className="font-inter fw-bold text-gray-900 d-block m-0" style={{ fontSize: '15px' }}>
                        <i className="bi bi-sign-turn-right-fill text-pink-500 me-2" style={{ color: '#f54286' }}></i> Ruta trazada hasta el lugar
                    </span>
                </div>
            )}
            
            {!userLoc && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white px-4 py-2 rounded-pill shadow-lg border text-center" style={{ minWidth: '90%', maxWidth: '320px' }}>
                    <span className="font-inter d-block" style={{ fontSize: '14px' }}>
                        <i className="bi bi-info-circle me-2"></i> Activa tu ubicación para ver cómo llegar.
                    </span>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
