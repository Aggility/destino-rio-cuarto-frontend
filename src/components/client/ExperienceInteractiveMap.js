'use client';
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ExperienceInteractiveMap({ stops = [], themeColor = '#ff5a1f' }) {
  const [selectedStop, setSelectedStop] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [userLoc, setUserLoc] = useState(null);

  // Center the map on the first stop
  const initialLat = stops[0]?.lat || -33.1232;
  const initialLng = stops[0]?.lng || -64.3493;

  useEffect(() => {
    if (stops.length > 1) {
      const coords = stops.map(s => `${s.lng},${s.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
      
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            setRouteGeoJson(data.routes[0].geometry);
          }
        }).catch(e => console.error("Error fetching experience route", e));
    }
  }, [stops]);

  const routeLayer = {
    id: 'experience-route',
    type: 'line',
    source: 'route-source',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': themeColor,
      'line-width': 4,
      'line-opacity': 0.6,
      'line-dasharray': [2, 1]
    }
  };

  return (
    <div className="position-relative w-100 rounded-4 overflow-hidden shadow-premium" style={{ height: '500px', border: '1px solid #e5e7eb' }}>
      <Map
        initialViewState={{
          longitude: initialLng,
          latitude: initialLat,
          zoom: 14
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />

        {/* Route Line */}
        {routeGeoJson && (
          <Source id="route-source" type="geojson" data={routeGeoJson}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* Stops Markers */}
        {stops.map((stop, i) => (
          <Marker 
            key={i} 
            longitude={stop.lng} 
            latitude={stop.lat} 
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedStop(stop);
            }}
          >
            <div className="cursor-pointer transition-all hover-scale" style={{ transform: selectedStop?.id === stop.id ? 'scale(1.2)' : 'scale(1)' }}>
                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg" 
                     style={{ width: '36px', height: '36px', border: `3px solid ${themeColor}` }}>
                    <span className="fw-bold" style={{ color: themeColor, fontSize: '13px' }}>{i + 1}</span>
                </div>
            </div>
          </Marker>
        ))}

        {/* Selected Stop Popup */}
        {selectedStop && (
          <Popup
            longitude={selectedStop.lng}
            latitude={selectedStop.lat}
            anchor="top"
            onClose={() => setSelectedStop(null)}
            closeButton={true}
            className="font-inter"
          >
            <div className="p-1">
              <h6 className="fw-bold mb-1" style={{ color: themeColor }}>{selectedStop.name}</h6>
              <p className="small text-muted mb-0">{selectedStop.description}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Info Overlay (Tourist Help) */}
      <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-white rounded-3 shadow-lg border-start border-4 transition-all" 
           style={{ maxWidth: '280px', borderColor: themeColor, zIndex: 10 }}>
        <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-info-circle-fill" style={{ color: themeColor }}></i>
          Ayuda al Turista
        </h6>
        <p className="small text-muted mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          Esta experiencia incluye {stops.length} paradas clave. Haz clic en los números para ver detalles de cada lugar. 
          El recorrido sugerido está marcado con puntos.
        </p>
      </div>
    </div>
  );
}
