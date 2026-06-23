'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * ShareButton - Destino Río Cuarto
 * Botón interactivo de compartir. Usa Web Share API si está disponible,
 * y en escritorio muestra un menú desplegable elegante con micro-animaciones.
 */
export default function ShareButton({ title, themeColor = '#8a38f5' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    const shareData = {
      title: title,
      text: `Mirá esto en Destino Río Cuarto: ${title}`,
      url: getShareUrl(),
    };

    // Si soporta Web Share API (por ejemplo en móviles)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Ignorar error de cancelación de usuario
        if (err.name !== 'AbortError') {
          console.error('Error al compartir con Web Share:', err);
        } else {
          return;
        }
      }
    }

    // Si no lo soporta, alternar el desplegable
    setIsOpen(!isOpen);
  };

  const copyToClipboard = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `¡Mirá lo que encontré en Destino Río Cuarto! *${title}*: ` + getShareUrl()
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Mirá esto en Destino Río Cuarto: ${title}`
    )}&url=${encodeURIComponent(getShareUrl())}`,
  };

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={handleShareClick}
        className="btn shadow-premium d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 transition-all hover-lift"
        style={{
          backgroundColor: themeColor,
          color: '#fff',
          fontWeight: 600,
          fontSize: '14px',
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="font-inter small">Compartir</span>
        <i className="bi bi-share"></i>
      </button>

      {/* Menú Desplegable (Fallback de Escritorio) */}
      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2 animate-fade-in"
          style={{
            zIndex: 1050,
            minWidth: '220px',
            animation: 'fadeIn 0.2s ease',
            border: '1px solid #e5e7eb',
          }}
        >
          <div className="d-flex flex-column gap-1">
            {/* Compartir en WhatsApp */}
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-whatsapp text-success fs-5"></i>
              <span className="font-inter fw-medium">WhatsApp</span>
            </a>

            {/* Compartir en Facebook */}
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-facebook text-primary fs-5"></i>
              <span className="font-inter fw-medium">Facebook</span>
            </a>

            {/* Compartir en X / Twitter */}
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-twitter-x text-dark fs-5"></i>
              <span className="font-inter fw-medium">Compartir en X</span>
            </a>

            {/* Separador */}
            <div className="border-top my-1" style={{ borderColor: '#f3f4f6' }}></div>

            {/* Copiar Enlace */}
            <button
              onClick={copyToClipboard}
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 border-0 bg-transparent text-start w-100 text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
            >
              <i
                className={`bi ${copied ? 'bi-check-circle-fill text-success' : 'bi-link-45deg text-secondary'} fs-5`}
              ></i>
              <span className="font-inter fw-medium">{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS para la animación fadeIn del dropdown */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hover-bg-light:hover {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  );
}
