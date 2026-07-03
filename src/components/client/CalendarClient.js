'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';

// ─── Constantes ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
// Semana empieza en Lunes (1=Lun, 2=Mar, …, 7=Dom)
const DAY_NAMES_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAY_NAMES_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// API days_of_week: 1=Lunes, 2=Martes, …, 6=Sábado, 7=Domingo
// JS getDay():       0=Domingo, 1=Lunes, …, 6=Sábado
// Conversión correcta: apiDay % 7  (7%7=0 → Domingo, 1→Lunes, …, 6→Sábado)
const apiDayToJsDay = (apiDay) => Number(apiDay) % 7;

// Convierte JS getDay() (0=Dom…6=Sáb) al índice del array Lun-first (0=Lun…6=Dom)
// Lun(1)→0, Mar(2)→1, …, Sáb(6)→5, Dom(0)→6
const jsDayToGridIdx = (jsDay) => (jsDay + 6) % 7;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parsea "YYYY-MM-DD" como fecha LOCAL sin ambigüedad de timezone.
 * new Date("YYYY-MM-DD") interpreta en UTC → off-by-one en zonas UTC-.
 * new Date(y, m-1, d) siempre construye en hora local del navegador.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d); // medianoche local, sin desfase de timezone
}

/**
 * Devuelve las fechas activas de un registro de calendario dentro del rango [fromDate, toDate].
 *
 * Regla de negocio:
 *  - Si NO tiene end_date → el evento ocurre SOLO en start_date (fecha puntual).
 *  - Si TIENE end_date    → el evento es recurrente: se repite en los days_of_week
 *                           entre start_date y end_date.
 */
function getActiveDatesInRange(cal, fromDate, toDate) {
  const start = parseLocalDate(cal.start_date);
  if (!start) return [];

  // ── Caso 1: evento puntual (sin end_date) ──────────────────────────────────
  if (!cal.end_date) {
    // Solo aparece si start_date cae dentro del rango consultado
    if (start >= fromDate && start <= toDate) {
      return [new Date(start)];
    }
    return [];
  }

  // ── Caso 2: evento recurrente (con end_date y days_of_week) ───────────────
  // end_date es inclusivo → usar el final del día
  const end = parseLocalDate(cal.end_date);
  end.setHours(23, 59, 59, 999);

  const allowedJsDays = (cal.days_of_week || []).map(apiDayToJsDay);

  const activeDates = [];
  const rangeStart = new Date(Math.max(start.getTime(), fromDate.getTime()));
  const rangeEnd = new Date(Math.min(end.getTime(), toDate.getTime()));

  if (rangeStart > rangeEnd) return []; // sin solapamiento

  const cursor = new Date(rangeStart);
  cursor.setHours(0, 0, 0, 0); // garantizar medianoche local en el cursor
  while (cursor <= rangeEnd) {
    const jsDay = cursor.getDay();
    if (allowedJsDays.length === 0 || allowedJsDays.includes(jsDay)) {
      activeDates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return activeDates;
}

/**
 * Formatea hora "HH:MM:SS" → "HH:MMhs"
 */
const formatTime = (t) => t ? t.substring(0, 5) + 'hs' : null;

/**
 * Devuelve true si dos fechas son el mismo día (ignora hora)
 */
const isSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

// ─── Sub-componente: tarjeta de evento ─────────────────────────────────────────
function CalendarItemCard({ item }) {
  const isEvent = item.itemType === 'event';
  const bgColor = isEvent ? '#FFF0F6' : '#F5F0FF';
  const accentColor = isEvent ? '#FA4489' : '#8A38F5';
  const tagBg = isEvent ? '#FA4489' : '#8A38F5';
  const tagLabel = isEvent ? 'Evento' : 'Actividad';
  const href = isEvent
    ? `/eventos/${item.slug || item.calendarable_id}`
    : `/actividades/${item.slug || item.calendarable_id}`;

  return (
    <Link
      href={href}
      className="text-decoration-none d-block"
      aria-label={`${tagLabel}: ${item.title}`}
    >
      <div
        className="calendar-item-card d-flex align-items-start gap-2 p-2 rounded-3 mb-2 transition-all"
        style={{
          backgroundColor: bgColor,
          border: `1.5px solid ${accentColor}22`,
        }}
      >
        {/* Barra de color lateral */}
        <div
          className="flex-shrink-0 rounded-pill"
          style={{ width: '4px', minHeight: '100%', height: '100%', backgroundColor: accentColor, alignSelf: 'stretch', minWidth: '4px' }}
          aria-hidden="true"
        />

        <div className="flex-grow-1 min-w-0">
          {/* Badge de tipo */}
          <div className="d-flex align-items-center gap-1 mb-1 flex-wrap">
            <span
              className="badge rounded-pill fw-bold"
              style={{ fontSize: '9px', backgroundColor: tagBg, color: 'white', padding: '2px 7px' }}
            >
              {tagLabel}
            </span>
            {item.startTime && (
              <span
                className="fw-bold"
                style={{ fontSize: '10px', color: accentColor }}
                aria-label={`Hora: ${item.startTime}`}
              >
                <i className="bi bi-clock me-1" aria-hidden="true" />
                {item.startTime}
              </span>
            )}
            {item.endTime && (
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                → {item.endTime}
              </span>
            )}
          </div>

          {/* Título */}
          <p
            className="mb-0 fw-semibold text-truncate"
            style={{ fontSize: '12px', color: '#1f2a37', lineHeight: '1.3' }}
          >
            {item.title}
          </p>

          {/* Lugar */}
          {item.location && (
            <p
              className="mb-0 mt-1 d-flex align-items-center gap-1 text-truncate"
              style={{ fontSize: '10px', color: '#6b7280', lineHeight: '1.3' }}
              aria-label={`Lugar: ${item.location}`}
            >
              <i className="bi bi-geo-alt-fill flex-shrink-0" style={{ fontSize: '9px', color: accentColor }} aria-hidden="true" />
              <span className="text-truncate">{item.location}</span>
            </p>
          )}
        </div>

        {/* Flecha */}
        <i
          className="bi bi-chevron-right flex-shrink-0 mt-1"
          style={{ fontSize: '11px', color: accentColor, opacity: 0.7 }}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

// ─── Sub-componente: vista de lista ────────────────────────────────────────────
function ListView({ groupedItems, filterLabel, todayRef }) {
  const days = Object.keys(groupedItems).sort((a, b) => new Date(a) - new Date(b));
  const today = new Date();

  if (days.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3" style={{ fontSize: '48px' }}>📅</div>
        <p className="fw-bold text-muted mb-1" style={{ fontSize: '16px' }}>
          Sin eventos para {filterLabel.toLowerCase()}
        </p>
        <p className="text-muted small">Intentá con otro rango de fechas.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {days.map(dayKey => {
        const [year, month, day] = dayKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const isToday = isSameDay(date, today);
        const isTomorrow = isSameDay(date, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
        const jsDay = date.getDay();
        const gridIdx = jsDayToGridIdx(jsDay);

        const dayLabel = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : `${DAY_NAMES_FULL[gridIdx]}`;
        const dateLabel = `${day} de ${MONTH_NAMES[month - 1]}`;

        return (
          <section
            key={dayKey}
            ref={isToday ? todayRef : null}
            aria-label={`${dayLabel} ${dateLabel}`}
          >
            {/* Encabezado del día */}
            <div
              className="d-flex align-items-center gap-2 mb-2 pb-2"
              style={{ borderBottom: '2px solid #f3f4f6' }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-3 fw-black"
                style={{
                  width: '44px', height: '44px',
                  backgroundColor: isToday ? '#FA4489' : '#f3f4f6',
                  color: isToday ? 'white' : '#374151',
                  fontSize: '18px', fontWeight: '800',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {day}
              </div>
              <div>
                <p className="mb-0 fw-bold" style={{ fontSize: '15px', color: isToday ? '#FA4489' : '#1f2a37', lineHeight: '1.2' }}>
                  {dayLabel}
                  {isToday && (
                    <span className="ms-2 badge rounded-pill" style={{ backgroundColor: '#FA4489', fontSize: '9px', verticalAlign: 'middle' }}>
                      HOY
                    </span>
                  )}
                </p>
                <p className="mb-0" style={{ fontSize: '12px', color: '#6b7280' }}>
                  {DAY_NAMES_FULL[gridIdx]}, {dateLabel}
                </p>
              </div>
              <span
                className="ms-auto badge rounded-pill"
                style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '11px' }}
                aria-label={`${groupedItems[dayKey].length} elemento${groupedItems[dayKey].length !== 1 ? 's' : ''}`}
              >
                {groupedItems[dayKey].length}
              </span>
            </div>

            {/* Items del día */}
            <div>
              {groupedItems[dayKey].map((item, idx) => (
                <CalendarItemCard key={`${item.id}-${idx}`} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── Sub-componente: Vista de cuadrícula mensual ────────────────────────────────
function MonthGridView({ calendarDays, emptyDaysBefore, itemsByDay, currentMonth, currentYear, onDaySelect, selectedDay }) {
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <div role="grid" aria-label={`Calendario de ${MONTH_NAMES[currentMonth]} ${currentYear}`}>
      {/* Encabezados de días */}
      <div
        className="d-grid mb-1"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        role="row"
        aria-hidden="true"
      >
        {DAY_NAMES_SHORT.map(d => (
          <div
            key={d}
            className="text-center py-1"
            style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div
        className="d-grid gap-1"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        role="row"
      >
        {/* Celdas vacías */}
        {emptyDaysBefore.map(i => (
          <div key={`e-${i}`} aria-hidden="true" />
        ))}

        {/* Días del mes */}
        {calendarDays.map(dayNum => {
          const dayItems = itemsByDay[dayNum] || [];
          const isToday = isCurrentMonth && today.getDate() === dayNum;
          const isSelected = selectedDay === dayNum;
          const hasItems = dayItems.length > 0;
          const eventsCount = dayItems.filter(i => i.itemType === 'event').length;
          const activitiesCount = dayItems.filter(i => i.itemType === 'activity').length;

          return (
            <button
              key={dayNum}
              onClick={() => onDaySelect(hasItems ? dayNum : null)}
              className="calendar-grid-day border-0 rounded-2 p-1 d-flex flex-column align-items-center position-relative transition-all"
              style={{
                minHeight: '52px',
                cursor: hasItems ? 'pointer' : 'default',
                backgroundColor: isSelected
                  ? '#1f2a37'
                  : isToday
                    ? '#FA4489'
                    : hasItems
                      ? 'white'
                      : '#f9fafb',
                outline: isToday && !isSelected ? '2px solid #FA4489' : 'none',
                outlineOffset: '2px',
              }}
              aria-label={`${dayNum} de ${MONTH_NAMES[currentMonth]}${hasItems ? `, ${dayItems.length} evento(s)` : ''}`}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
            >
              {/* Número de día */}
              <span
                className="fw-bold"
                style={{
                  fontSize: '13px',
                  lineHeight: '1',
                  color: isSelected ? 'white' : isToday ? 'white' : hasItems ? '#1f2a37' : '#d1d5db',
                }}
              >
                {dayNum}
              </span>

              {/* Puntos indicadores */}
              {hasItems && (
                <div className="d-flex gap-1 mt-1" aria-hidden="true">
                  {eventsCount > 0 && (
                    <div
                      className="rounded-circle"
                      style={{ width: '5px', height: '5px', backgroundColor: isSelected ? 'white' : '#FA4489' }}
                      title="Eventos"
                    />
                  )}
                  {activitiesCount > 0 && (
                    <div
                      className="rounded-circle"
                      style={{ width: '5px', height: '5px', backgroundColor: isSelected ? '#d8b4fe' : '#8A38F5' }}
                      title="Actividades"
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function CalendarClient() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [calendars, setCalendars] = useState([]);
  const [eventLocations, setEventLocations] = useState({});
  const [proposalLocations, setProposalLocations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewFilter, setViewFilter] = useState('MES');
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'
  const todaySectionRef = useRef(null);

  // Fetch de la API: eventos + propuestas
  useEffect(() => {
    /**
     * Obtiene TODOS los registros de un endpoint paginado de Laravel.
     * Itera sobre last_page para traer todas las páginas si hay más de una.
     */
    const fetchAllPages = async (url) => {
      const PER_PAGE = 200; // máximo por página para minimizar requests
      const firstRes = await fetch(`${url}?per_page=${PER_PAGE}&page=1`, { cache: 'no-store' });
      if (!firstRes.ok) return [];

      const firstJson = await firstRes.json();
      const items = Array.isArray(firstJson) ? firstJson : (firstJson.data || []);

      // Detectar estructura de paginación (Laravel: last_page en raíz o en meta)
      const lastPage = firstJson.last_page || firstJson.meta?.last_page || 1;

      if (lastPage <= 1) return items;

      // Obtener las páginas restantes en paralelo
      const remainingPages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
      const restResults = await Promise.all(
        remainingPages.map(page =>
          fetch(`${url}?per_page=${PER_PAGE}&page=${page}`, { cache: 'no-store' })
            .then(r => r.ok ? r.json() : { data: [] })
            .then(json => Array.isArray(json) ? json : (json.data || []))
        )
      );

      return [...items, ...restResults.flat()];
    };

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://destbackdev.aggility.io/api/v1';
        const [evItems, prItems] = await Promise.all([
          fetchAllPages(`${BASE}/events`),
          fetchAllPages(`${BASE}/proposals`),
        ]);

        // Adaptar para mantener la estructura esperada por el resto del código
        const evJson = { data: evItems };
        const prJson = { data: prItems };

        const flatCalendars = [];
        const evLoc = {};
        const prLoc = {};

        // Procesar Eventos
        (evJson.data || []).forEach(ev => {
          if (ev.status !== 'active') return;

          const name = ev.organization?.name;
          if (name) evLoc[ev.id] = name;

          (ev.calendars || []).forEach(cal => {
            flatCalendars.push({
              ...cal,
              calendarable_type: 'App\\Models\\Event',
              calendarable_id: ev.id,
              title: ev.title,
              slug: ev.slug,
              // El endpoint nuevo devuelve "YYYY-MM-DDTHH:MM:SS.000000Z". Nos quedamos con la parte YYYY-MM-DD
              start_date: cal.start_date ? cal.start_date.split('T')[0] : null,
              end_date: cal.end_date ? cal.end_date.split('T')[0] : null,
            });
          });
        });

        // Procesar Propuestas (Actividades)
        (prJson.data || []).forEach(pr => {
          if (pr.status !== 'active') return;

          const name = pr.addresses?.[0]?.organization?.name || pr.organization?.name;
          if (name) prLoc[pr.id] = name;

          (pr.calendars || []).forEach(cal => {
            flatCalendars.push({
              ...cal,
              calendarable_type: 'App\\Models\\Proposal',
              calendarable_id: pr.id,
              title: pr.title,
              slug: pr.slug,
              start_date: cal.start_date ? cal.start_date.split('T')[0] : null,
              end_date: cal.end_date ? cal.end_date.split('T')[0] : null,
            });
          });
        });

        // Filtrar: solo desde enero 2026 en adelante
        const MIN_DATE = '2026-01-01';
        const filtered = flatCalendars.filter(cal => cal.start_date >= MIN_DATE);

        setCalendars(filtered);
        setEventLocations(evLoc);
        setProposalLocations(prLoc);
      } catch (err) {
        console.error('CalendarClient: Error fetching data', err);
        setError('No pudimos cargar los eventos. Por favor, intentá de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Rango de fechas según filtro
  const { rangeStart, rangeEnd, filterLabel } = useMemo(() => {
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    if (viewFilter === 'HOY') {
      const end = new Date(todayMidnight);
      end.setHours(23, 59, 59, 999);
      return { rangeStart: todayMidnight, rangeEnd: end, filterLabel: 'Hoy' };
    }

    if (viewFilter === 'SEMANA') {
      // Lunes de esta semana → Domingo de esta semana
      const day = todayMidnight.getDay(); // 0=Dom...6=Sab
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(todayMidnight);
      monday.setDate(todayMidnight.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return { rangeStart: monday, rangeEnd: sunday, filterLabel: 'Esta semana' };
    }

    // MES
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    return { rangeStart: firstDay, rangeEnd: lastDay, filterLabel: `${MONTH_NAMES[currentMonth]} ${currentYear}` };
  }, [viewFilter, today, currentMonth, currentYear]);

  // Normalizar entradas del calendario en items con fechas activas
  const allItems = useMemo(() => {
    if (!calendars.length) return [];

    const items = [];
    calendars.forEach(cal => {
      const itemType = cal.calendarable_type === 'App\\Models\\Event'
        ? 'event'
        : cal.calendarable_type === 'App\\Models\\Proposal'
          ? 'activity'
          : null;

      if (!itemType) return; // ignorar otros tipos

      const activeDates = getActiveDatesInRange(cal, rangeStart, rangeEnd);
      // Buscar el lugar según el tipo de item
      const location = itemType === 'event'
        ? eventLocations[cal.calendarable_id]
        : proposalLocations[cal.calendarable_id];

      activeDates.forEach(date => {
        items.push({
          id: cal.id,
          calendarable_id: cal.calendarable_id,
          itemType,
          title: cal.title,
          slug: cal.slug,
          startTime: formatTime(cal.start_time),
          endTime: formatTime(cal.end_time),
          location,
          activeDate: date,
        });
      });
    });

    // Ordenar por fecha → hora
    items.sort((a, b) => a.activeDate - b.activeDate);
    return items;
  }, [calendars, rangeStart, rangeEnd, eventLocations, proposalLocations]);

  // Agrupar por día (key = "YYYY-MM-DD")
  const groupedByDay = useMemo(() => {
    const map = {};
    allItems.forEach(item => {
      const d = item.activeDate;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [allItems]);

  // Para la cuadrícula mensual: agrupar por número de día del mes
  const itemsByDayNum = useMemo(() => {
    if (viewFilter !== 'MES') return {};
    const map = {};
    allItems.forEach(item => {
      const d = item.activeDate;
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return;
      const dayNum = d.getDate();
      if (!map[dayNum]) map[dayNum] = [];
      map[dayNum].push(item);
    });
    return map;
  }, [allItems, viewFilter, currentMonth, currentYear]);

  // Días del mes para la cuadrícula
  const { calendarDays, emptyDaysBefore } = useMemo(() => {
    // Con semana Lun-first: (getDay()+6)%7 → Lun=0, Mar=1, …, Dom=6
    const firstDay = jsDayToGridIdx(new Date(currentYear, currentMonth, 1).getDay());
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    return {
      emptyDaysBefore: Array.from({ length: firstDay }, (_, i) => i),
      calendarDays: Array.from({ length: totalDays }, (_, i) => i + 1),
    };
  }, [currentMonth, currentYear]);

  // Items del día seleccionado en la vista grid
  const selectedDayItems = useMemo(() => {
    if (selectedDay === null) return [];
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return groupedByDay[key] || [];
  }, [selectedDay, groupedByDay, currentMonth, currentYear]);

  const changeMonth = useCallback((offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDay(null);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setViewFilter(filter);
    setSelectedDay(null);
    if (filter === 'HOY' || filter === 'SEMANA') {
      setViewMode('list');
    } else {
      setViewMode('grid');
    }
  }, []);

  const totalItems = allItems.length;
  const eventCount = allItems.filter(i => i.itemType === 'event').length;
  const activityCount = allItems.filter(i => i.itemType === 'activity').length;

  // Scroll automático al día de hoy cuando carga la vista lista
  useEffect(() => {
    if (!isLoading && (viewFilter !== 'MES' || viewMode === 'list')) {
      // Pequeño delay para que el DOM se renderice
      const timer = setTimeout(() => {
        if (todaySectionRef.current) {
          // Offset = navbar (97px) + header calendario (~57px) + margen pequeño (16px)
          const OFFSET = 300;
          const rect = todaySectionRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - OFFSET;
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, viewFilter, viewMode]);

  return (
    <div className="calendar-client-wrapper">

      {/* ── HEADER ── */}
      <header className="bg-white border-bottom" style={{ position: 'sticky', top: '97px', zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div className="container-xxl px-3 px-lg-5 py-3">

          {/* Título + navegación de mes */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
            <div>
              <h1
                className="fw-black mb-0"
                style={{
                  fontSize: 'clamp(22px, 5vw, 34px)',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.1',
                  color: '#1f2a37',
                  fontWeight: 900,
                }}
              >
                Calendario
              </h1>
            </div>

            {/* Selector de mes (solo visible en modo MES) */}
            {viewFilter === 'MES' && (
              <nav
                aria-label="Navegación de mes"
                className="d-flex align-items-center gap-1"
                style={{ backgroundColor: '#f9fafb', borderRadius: '50px', padding: '4px', border: '1px solid #e5e7eb' }}
              >
                <button
                  onClick={() => changeMonth(-1)}
                  className="btn btn-sm border-0 bg-white rounded-pill d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '36px', height: '36px' }}
                  aria-label="Mes anterior"
                >
                  <i className="bi bi-chevron-left" aria-hidden="true" />
                </button>
                <span
                  className="fw-bold px-2 text-center"
                  style={{ fontSize: 'clamp(11px, 3.5vw, 14px)', color: '#FA4489', whiteSpace: 'nowrap', minWidth: '100px' }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="btn btn-sm border-0 bg-white rounded-pill d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '36px', height: '36px' }}
                  aria-label="Mes siguiente"
                >
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>

          {/* ── FILTROS HOY / SEMANA / MES ── */}
          <div role="group" aria-label="Filtrar por período" className="d-flex gap-2 mb-3">
            {[
              { key: 'HOY', label: 'Hoy', icon: 'bi-sun' },
              { key: 'SEMANA', label: 'Semana', icon: 'bi-calendar-week' },
              { key: 'MES', label: 'Mes', icon: 'bi-calendar-month' },
            ].map(({ key, label, icon }) => {
              const active = viewFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  className="btn d-flex align-items-center gap-1 fw-bold transition-all"
                  style={{
                    borderRadius: '50px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: active ? '#1f2a37' : 'white',
                    color: active ? 'white' : '#6b7280',
                    border: active ? '1.5px solid #1f2a37' : '1.5px solid #e5e7eb',
                    boxShadow: active ? '0 4px 12px rgba(31,42,55,0.2)' : 'none',
                  }}
                  aria-pressed={active}
                >
                  <i className={`bi ${icon}`} style={{ fontSize: '13px' }} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}

            {/* Toggle vista (solo modo MES) */}
            {viewFilter === 'MES' && (
              <div
                className="ms-auto d-flex align-items-center gap-1"
                style={{ backgroundColor: '#f3f4f6', borderRadius: '50px', padding: '3px' }}
                role="group"
                aria-label="Modo de visualización"
              >
                <button
                  onClick={() => { setViewMode('grid'); setSelectedDay(null); }}
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px', height: '32px', borderRadius: '50px',
                    backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                    boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                  aria-label="Vista de cuadrícula"
                  aria-pressed={viewMode === 'grid'}
                >
                  <i className="bi bi-grid-3x3" style={{ fontSize: '14px', color: '#374151' }} aria-hidden="true" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px', height: '32px', borderRadius: '50px',
                    backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                    boxShadow: viewMode === 'list' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                  aria-label="Vista de lista"
                  aria-pressed={viewMode === 'list'}
                >
                  <i className="bi bi-list-ul" style={{ fontSize: '14px', color: '#374151' }} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* ── LEYENDA + CONTADORES ── */}
          {!isLoading && !error && (
            <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '12px' }}>
              <span className="text-muted">
                <strong style={{ color: '#1f2a37' }}>{totalItems}</strong> resultado{totalItems !== 1 ? 's' : ''} en {filterLabel}
              </span>
              {eventCount > 0 && (
                <div className="d-flex align-items-center gap-1">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#FA4489' }} aria-hidden="true" />
                  <span style={{ color: '#6b7280' }}>{eventCount} evento{eventCount !== 1 ? 's' : ''}</span>
                </div>
              )}
              {activityCount > 0 && (
                <div className="d-flex align-items-center gap-1">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#8A38F5' }} aria-hidden="true" />
                  <span style={{ color: '#6b7280' }}>{activityCount} actividad{activityCount !== 1 ? 'es' : ''}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── CONTENIDO ── */}
      <main className="bg-listing-page" style={{ minHeight: '60vh' }}>
        <div className="container-xxl px-3 px-lg-5 py-4">

          {/* Estado de carga */}
          {isLoading && (
            <div className="text-center py-5" aria-live="polite" aria-busy="true">
              <div
                className="spinner-border mb-3"
                style={{ color: '#FA4489', width: '40px', height: '40px' }}
                role="status"
              >
                <span className="visually-hidden">Cargando eventos...</span>
              </div>
              <p className="text-muted">Cargando la agenda...</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div
              className="alert d-flex align-items-center gap-3 rounded-3 p-4"
              role="alert"
              style={{ backgroundColor: '#fff0f6', border: '1.5px solid #FA448930', color: '#c4145f' }}
            >
              <i className="bi bi-exclamation-circle-fill fs-4" aria-hidden="true" />
              <div>
                <strong>Ups, algo salió mal</strong>
                <p className="mb-1 mt-1" style={{ fontSize: '14px' }}>{error}</p>
                <button
                  className="btn btn-sm rounded-pill fw-bold"
                  style={{ backgroundColor: '#FA4489', color: 'white', fontSize: '12px' }}
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* ── VISTA CUADRÍCULA MENSUAL ── */}
          {!isLoading && !error && viewFilter === 'MES' && viewMode === 'grid' && (
            <div
              className="bg-white rounded-4 p-2 p-sm-3 shadow-sm"
              style={{ border: '1px solid #f3f4f6' }}
            >
              <MonthGridView
                calendarDays={calendarDays}
                emptyDaysBefore={emptyDaysBefore}
                itemsByDay={itemsByDayNum}
                currentMonth={currentMonth}
                currentYear={currentYear}
                onDaySelect={setSelectedDay}
                selectedDay={selectedDay}
              />
            </div>
          )}

          {/* ── POPUP MODAL: eventos del día seleccionado ── */}
          {!isLoading && !error && viewFilter === 'MES' && viewMode === 'grid' && selectedDay && (
            <>
              {/* Overlay */}
              <div
                className="calendar-modal-overlay"
                onClick={() => setSelectedDay(null)}
                aria-hidden="true"
              />
              {/* Modal */}
              <div
                className="calendar-modal-panel"
                role="dialog"
                aria-modal="true"
                aria-label={`Eventos del ${selectedDay} de ${MONTH_NAMES[currentMonth]}`}
                aria-live="polite"
              >
                {/* Header del modal */}
                <div
                  className="d-flex align-items-center justify-content-between px-4 py-3"
                  style={{ borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}
                >
                  <h2
                    className="fw-bold mb-0"
                    style={{ fontSize: 'clamp(16px, 5vw, 22px)', color: '#1f2a37', letterSpacing: '-0.3px' }}
                  >
                    {selectedDay} de {MONTH_NAMES[currentMonth]}
                  </h2>
                  <button
                    className="btn border-0 d-flex align-items-center justify-content-center rounded-circle"
                    onClick={() => setSelectedDay(null)}
                    aria-label="Cerrar"
                    style={{
                      width: '36px', height: '36px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    <i className="bi bi-x" aria-hidden="true" />
                  </button>
                </div>
                {/* Contenido scrollable */}
                <div className="px-4 py-3" style={{ overflowY: 'auto', flex: 1 }}>
                  {selectedDayItems.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {selectedDayItems.map((item, idx) => (
                        <CalendarItemCard key={`${item.id}-${idx}`} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Sin eventos para este día.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── VISTA LISTA (HOY / SEMANA / MES lista) ── */}
          {!isLoading && !error && (viewFilter !== 'MES' || viewMode === 'list') && (
            <ListView groupedItems={groupedByDay} filterLabel={filterLabel} todayRef={todaySectionRef} />
          )}
        </div>
      </main>

      {/* ── ESTILOS INLINE ── */}
      <style>{`
        .calendar-item-card {
          transition: all 0.2s ease;
        }
        .calendar-item-card:hover {
          transform: translateX(3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .calendar-grid-day {
          transition: all 0.15s ease;
        }
        .calendar-grid-day:hover:not(:disabled) {
          transform: scale(1.08);
          z-index: 1;
        }

        /* ── Modal popup del día ── */
        .calendar-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1040;
          backdrop-filter: blur(2px);
          animation: fadeInOverlay 0.2s ease;
        }
        .calendar-modal-panel {
          position: fixed;
          z-index: 1050;
          background: white;
          border-radius: 20px 20px 0 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
          animation: slideUpModal 0.28s cubic-bezier(0.34,1.56,0.64,1);
          /* Mobile: bottom sheet */
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 80vh;
        }
        @media (min-width: 768px) {
          /* Desktop: centrado */
          .calendar-modal-panel {
            bottom: auto;
            left: 50%;
            top: 50%;
            right: auto;
            transform: translate(-50%, -50%);
            width: min(640px, 92vw);
            max-height: 75vh;
            border-radius: 20px;
            animation: popInModal 0.25s cubic-bezier(0.34,1.56,0.64,1);
          }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes popInModal {
          from { transform: translate(-50%, -48%) scale(0.95); opacity: 0; }
          to   { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
