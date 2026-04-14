'use client';

import React, { useState, useEffect } from 'react';

export default function GeolocationPopup() {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('geo_popup_seen');
    const hiddenForSession = sessionStorage.getItem('geo_session_hidden');
    
    if (!hasSeenPopup && !hiddenForSession) {
      // Small delay to not be too aggressive on exact load
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('geo_popup_seen', 'true');
    // Save intent so lists know they can request immediately
    localStorage.setItem('geo_permission_granted', 'true'); 
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Trigger a custom event so other components can refresh location if they are already mounted
          window.dispatchEvent(new Event('geo_granted_event'));
          setShow(false);
        },
        (error) => {
          console.error("User denied native prompt or error:", error);
          // If denied, we revert the local storage so we don't ask native continually
          localStorage.removeItem('geo_permission_granted');
          setShow(false);
        }
      );
    } else {
      setShow(false);
    }
  };

  const handleDecline = () => {
    if (dontShowAgain) {
      localStorage.setItem('geo_popup_seen', 'true');
    } else {
      sessionStorage.setItem('geo_session_hidden', 'true');
    }
    setShow(false);
  };

  // Lock body scroll when popup is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999 }}>
      
      {/* Viewport Black Overlay (fondo gris en toda la pagina web para aislar) */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-black" style={{ opacity: 0.65 }}></div>

      {/* Content Container (Card) - Ahora con la imagen de fondo ocupando toda su superficie */}
      <div 
        className="position-relative rounded-4 shadow-lg d-flex flex-column overflow-hidden" 
        style={{ 
          width: '90%', 
          maxWidth: '380px', 
          margin: 'auto',
          backgroundImage: 'url(/geo-popup.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundColor: '#111'
        }}
      >
        {/* Inner Card Overlay - Para oscurecer la foto y resaltar texto */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.75 }}></div>

        {/* Cuerpo del Popup (con position-relative para situarse por encima del overlay oscuro) */}
        <div className="p-4 p-md-5 text-center position-relative text-white" style={{ zIndex: 10 }}>
          
          <div className="d-flex justify-content-center mb-3">
            <i className="bi bi-geo-alt-fill text-white shadow" style={{ fontSize: '38px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}></i>
          </div>

          <h3 className="fw-bold font-inter mb-3" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
            Mejora tu experiencia
          </h3>
          
          <p className="font-inter mb-4" style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
            Te recomendamos activar la ubicación. Así podremos brindarte opciones de <strong>eventos, servicios y actividades</strong> al instante.
          </p>

          <div className="d-flex flex-column gap-3 mt-4">
            <button 
              className="btn btn-primary rounded-pill fw-bold py-3 shadow-premium transition-all hover-lift w-100 font-inter text-uppercase"
              style={{ backgroundColor: '#f54286', border: 'none', fontSize: '14px', letterSpacing: '0.5px' }}
              onClick={handleAccept}
            >
              <i className="bi bi-crosshair me-2"></i> Activar Ubicación
            </button>

            <button 
              className="btn btn-outline-light rounded-pill fw-medium py-2 w-100 font-inter"
              style={{ fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={handleDecline}
            >
              Ahora no
            </button>
          </div>

          {/* Checkbox "No volver a mostrar" */}
          <div className="mt-4 pt-4 border-top d-flex align-items-center justify-content-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.15) !important' }}>
            <input 
              type="checkbox" 
              className="form-check-input m-0 cursor-pointer shadow-none custom-check-dark" 
              id="dontShowCheckbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label className="form-check-label font-inter cursor-pointer mb-0" htmlFor="dontShowCheckbox" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              No volver a mostrar
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
