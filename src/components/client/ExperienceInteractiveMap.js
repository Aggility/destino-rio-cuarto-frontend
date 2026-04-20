'use client';
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ExperienceInteractiveMap({ stops = [], themeColor = '#ff5a1f' }) {
  const [selectedStop, setSelectedStop] = useState(null);

  // Center the map on the first stop
  const initialLat = stops[0]?.lat || -33.1232;
  const initialLng = stops[0]?.lng || -64.3493;

  return (
    <div className="position-relative w-100 rounded-4 overflow-hidden shadow-premium" style={{ height: 'clamp(350px, 50vh, 500px)', border: '1px solid #e5e7eb' }}>
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
                     style={{ width: '38px', height: '38px', border: `2px solid ${themeColor}` }}>
                    <i className={`bi ${stop.icon || 'bi-geo-alt-fill'}`} style={{ color: themeColor, fontSize: '18px' }}></i>
                </div>
                {/* Pointer tip */}
                <div className="mx-auto shadow-sm" style={{ 
                    width: '0', 
                    height: '0', 
                    borderLeft: '8px solid transparent', 
                    borderRight: '8px solid transparent', 
                    borderTop: `10px solid ${themeColor}`,
                    marginTop: '-2px'
                }}></div>
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
            <div className="p-1" style={{ maxWidth: '200px' }}>
              <h6 className="fw-bold mb-1" style={{ color: themeColor, fontSize: '14px' }}>{selectedStop.name}</h6>
              <p className="small text-muted mb-0" style={{ fontSize: '12px' }}>{selectedStop.description}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Info Overlay (Tourist Help) */}
      <div className="position-absolute bottom-0 start-0 m-2 m-md-3 p-2 p-md-3 bg-white rounded-3 shadow-lg border-start border-4 transition-all" 
           style={{ maxWidth: 'calc(100% - 20px)', width: '220px', borderColor: themeColor, zIndex: 10 }}>
        <h6 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
          <i className="bi bi-info-circle-fill" style={{ color: themeColor }}></i>
          Puntos de Interés
        </h6>
        <p className="small text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.3' }}>
          Toca los marcadores para conocer más sobre cada sitio histórico.
        </p>
      </div>
    </div>
  );
}
