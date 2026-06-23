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

      {/* Menú Desplegable */}
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
            {/* Google Calendar */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-google text-danger fs-5"></i>
              <span className="font-inter fw-medium">Google Calendar</span>
            </a>

            {/* Outlook Web */}
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-envelope text-primary fs-5"></i>
              <span className="font-inter fw-medium">Outlook Web</span>
            </a>

            {/* Separador */}
            <div className="border-top my-1" style={{ borderColor: '#f3f4f6' }}></div>

            {/* iCal / Apple Calendar / Descargar .ics */}
            <button
              onClick={downloadICS}
              className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 border-0 bg-transparent text-start w-100 text-gray-800 hover-bg-light transition-all"
              style={{ fontSize: '14px', color: '#374151' }}
            >
              <i className="bi bi-calendar-event text-secondary fs-5"></i>
              <span className="font-inter fw-medium">Descargar archivo .ics</span>
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
