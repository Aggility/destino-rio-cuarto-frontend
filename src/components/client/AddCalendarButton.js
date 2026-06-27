'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * AddCalendarButton - Destino Río Cuarto
 * Botón interactivo que despliega opciones para agregar un evento al calendario personal
 * del usuario (Google Calendar, Outlook Web, o descargar archivo .ics / Apple Calendar).
 */
export default function AddCalendarButton({ event, themeColor = '#f54286' }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const title = event.title || 'Evento - Destino Río Cuarto';
  const description = event.description || 'Evento publicado en Destino Río Cuarto';
  const location = event.location || 'Río Cuarto, Córdoba';

  // Obtener fechas en formato ISO para los calendarios
  const getDates = () => {
    let startDt = new Date();
    let endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000); // +2 horas por defecto

    if (event.startDateRaw) {
      const dateStr = event.startDateRaw; // YYYY-MM-DD
      const timeStr = event.startTimeRaw || '00:00:00'; // HH:MM:SS
      startDt = new Date(`${dateStr}T${timeStr}`);
      
      if (event.endDateRaw) {
        const endDateStr = event.endDateRaw;
        const endTimeStr = event.endTimeRaw || '23:59:59';
        endDt = new Date(`${endDateStr}T${endTimeStr}`);
      } else {
        // Por defecto 2 horas de duración
        endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000);
      }
    }

    // Si la fecha no es válida, usar la actual
    if (isNaN(startDt.getTime())) startDt = new Date();
    if (isNaN(endDt.getTime())) endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000);

    return { startDt, endDt };
  };

  const { startDt, endDt } = getDates();

  // Formatos específicos
  const getGoogleFormat = (dt) => {
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getOutlookFormat = (dt) => {
    return dt.toISOString();
  };

  // Enlaces de Calendario
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${getGoogleFormat(startDt)}/${getGoogleFormat(endDt)}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
    title
  )}&startdt=${getOutlookFormat(startDt)}&enddt=${getOutlookFormat(endDt)}&body=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Descarga del archivo iCal (.ics)
  const downloadICS = (e) => {
    e.preventDefault();
    setIsOpen(false);

    const pad = (num) => String(num).padStart(2, '0');
    
    // Formatear fechas locales para iCal sin Z (local time es preferible para archivos ICS en este caso)
    const formatLocalICS = (dt) => {
      return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(
        dt.getMinutes()
      )}${pad(dt.getSeconds())}`;
    };

    const cleanTitle = title.replace(/[,;]/g, '\\,');
    const cleanDesc = description.replace(/<[^>]*>?/gm, '').replace(/[,;]/g, '\\,').replace(/\n/g, '\\n');
    const cleanLoc = location.replace(/[,;]/g, '\\,');

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Destino Rio Cuarto//Agenda//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${event.id || Math.random()}@destinoriocuarto.gob.ar`,
      `DTSTAMP:${formatLocalICS(new Date())}`,
      `DTSTART:${formatLocalICS(startDt)}`,
      `DTEND:${formatLocalICS(endDt)}`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLoc}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    const icsContent = icsLines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <span className="font-inter small">Agendar</span>
        <i className="bi bi-calendar-plus"></i>
      </button>

      {/* Menú Modal/Popup optimizado para Mobile (Bottom sheet) y Desktop (Modal) */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-end align-items-md-center justify-content-center"
          style={{ zIndex: 1050 }}
        >
          {/* Backdrop oscuro */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, animation: 'fadeIn 0.2s ease' }}
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Contenedor principal del Popup */}
          <div
            className="position-relative bg-white w-100 shadow-lg d-flex flex-column popup-container"
            id="calendar-modal"
          >
            {/* Header del Popup */}
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="font-inter fw-bold m-0" style={{ color: '#111928', fontSize: '20px' }}>Agendar Evento</h5>
              <button 
                onClick={() => setIsOpen(false)} 
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 bg-gray-100" 
                style={{ width: '36px', height: '36px', color: '#6b7280' }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '18px' }}></i>
              </button>
            </div>
            
            <p className="font-inter text-muted mb-4" style={{ fontSize: '14px' }}>
              Selecciona dónde quieres guardar este evento.
            </p>

            <div className="d-flex flex-column gap-2">
              {/* Google Calendar */}
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none border transition-all hover-border-google"
                style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                onClick={() => setIsOpen(false)}
              >
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '40px', height: '40px', backgroundColor: '#fef2f2' }}>
                  <i className="bi bi-google text-danger fs-5"></i>
                </div>
                <div className="d-flex flex-column">
                  <span className="font-inter fw-bold text-gray-900" style={{ fontSize: '15px' }}>Google Calendar</span>
                  <span className="font-inter text-muted" style={{ fontSize: '13px' }}>Guardar en tu cuenta de Google</span>
                </div>
              </a>

              {/* Outlook Web */}
              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none border transition-all hover-border-outlook"
                style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                onClick={() => setIsOpen(false)}
              >
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff' }}>
                  <i className="bi bi-envelope text-primary fs-5"></i>
                </div>
                <div className="d-flex flex-column">
                  <span className="font-inter fw-bold text-gray-900" style={{ fontSize: '15px' }}>Outlook Web</span>
                  <span className="font-inter text-muted" style={{ fontSize: '13px' }}>Guardar en cuenta de Microsoft</span>
                </div>
              </a>

              {/* iCal / Apple Calendar / Descargar .ics */}
              <button
                onClick={downloadICS}
                className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 border bg-white text-start w-100 transition-all hover-border-ical mt-2"
                style={{ borderColor: '#e5e7eb' }}
              >
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6' }}>
                  <i className="bi bi-calendar-event text-secondary fs-5"></i>
                </div>
                <div className="d-flex flex-column">
                  <span className="font-inter fw-bold text-gray-900" style={{ fontSize: '15px' }}>Apple Calendar / .ics</span>
                  <span className="font-inter text-muted" style={{ fontSize: '13px' }}>Descargar archivo para otros calendarios</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones y hover */}
      <style jsx global>{`
        .popup-container {
          padding: 24px;
          border-radius: 24px 24px 0 0;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 100%;
        }
        
        @media (min-width: 768px) {
          .popup-container {
            border-radius: 24px;
            max-width: 420px;
            animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }

        .hover-border-google:hover { border-color: #ef4444 !important; background-color: #fef2f2 !important; }
        .hover-border-outlook:hover { border-color: #3b82f6 !important; background-color: #eff6ff !important; }
        .hover-border-ical:hover { border-color: #6b7280 !important; background-color: #f9fafb !important; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.5; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
