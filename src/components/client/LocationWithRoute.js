'use client';
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function LocationWithRoute({ address, lat, lng, name, type = 'service' }) {
  const [showMap, setShowMap] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);

  const getTheme = () => {
    switch (type) {
      case 'event': return { color: '#f54286', bg: '#fdf2f8' };
      case 'actividad': return { color: '#8a38f5', bg: '#f5f3ff' };
      case 'experiencia': return { color: '#ff5a1f', bg: '#fff7ed' };
      case 'gastronomia': 
      case 'alojamiento':
      case 'service':
      default: return { color: '#1a56db', bg: '#e1effe' };
    }
  };

  const theme = getTheme();

  // Parse coords safely, fallback to Rio Cuarto center if invalid
  const targetLat = parseFloat(lat) || -33.1232;
  const targetLng = parseFloat(lng) || -64.3493;

  // Manejo del body scroll for modal
  useEffect(() => {
    if (showMap) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMap]);

  // If open map and global geo permission granted, get location
  useEffect(() => {
    if (showMap && localStorage.getItem('geo_permission_granted') === 'true') {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Map: error location", err)
      );
    }
  }, [showMap]);

  // Fetch route from OSRM
  useEffect(() => {
    if (userLoc && targetLat && targetLng) {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            setRouteGeoJson(data.routes[0].geometry);
          }
        }).catch(e => console.log("Error routing OSRM", e));
    }
  }, [userLoc, targetLat, targetLng]);

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
      'line-width': 5,
      'line-opacity': 0.8
    }
  };

  return (
    <>
      <div 
        className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 hover-lift transition-all" 
        onClick={() => setShowMap(true)} 
        style={{ cursor: 'pointer', backgroundColor: theme.bg, width: 'fit-content' }}
      >
        <i className="bi bi-geo-alt-fill" style={{ color: theme.color }}></i>
        <span className="font-inter fw-bold" style={{ color: theme.color, fontSize: '14px' }}>
          {address} <i className="bi bi-arrow-up-right ms-1"></i>
        </span>
      </div>

      {showMap && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" style={{ zIndex: 10000, backgroundColor: 'white' }}>
          
          {/* Header Map */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom shadow-sm bg-white position-relative" style={{ zIndex: 10 }}>
            <div>
              <h5 className="font-inter fw-bold m-0" style={{ letterSpacing: '-0.3px' }}>{name}</h5>
              <small className="text-muted font-inter"><i className="bi bi-geo-alt me-1"></i>{address}</small>
            </div>
            <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }} onClick={() => setShowMap(false)}>
              <i className="bi bi-x-lg text-dark"></i>
            </button>
          </div>

          {/* Map Area */}
          <div className="flex-grow-1 position-relative">
            <Map
              initialViewState={{
                longitude: userLoc ? ((userLoc.lng + targetLng)/2) : targetLng,
                latitude: userLoc ? ((userLoc.lat + targetLat)/2) : targetLat,
                zoom: userLoc ? 12 : 14
              }}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="bottom-right" />
              
              {/* Target Marker */}
              <Marker longitude={targetLng} latitude={targetLat} anchor="bottom">
                <i className="bi bi-geo-alt-fill text-shadow" style={{ fontSize: '32px', color: theme.color }}></i>
              </Marker>

              {/* User Marker */}
              {userLoc && (
                <Marker longitude={userLoc.lng} latitude={userLoc.lat} anchor="bottom">
                   <div style={{ width: '15px', height: '15px', backgroundColor: theme.color, border: '3px solid white', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}></div>
                </Marker>
              )}

              {/* Route Line */}
              {routeGeoJson && (
                <Source id="route-source" type="geojson" data={routeGeoJson}>
                  <Layer {...routeLayer} />
                </Source>
              )}
            </Map>
            
            {/* Info Floating Bubble */}
            {userLoc && routeGeoJson && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-white px-4 py-2 rounded-pill shadow-lg border">
                    <span className="font-inter fw-bold" style={{ color: theme.color }}>
                        <i className="bi bi-sign-turn-right-fill me-2"></i>Ruta calculada a destino
                    </span>
                </div>
            )}
             {!userLoc && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white px-4 py-2 rounded-pill shadow-lg border">
                    <span className="font-inter small">
                        Ubicación no activada. Viendo mapa estático.
                    </span>
                </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}
