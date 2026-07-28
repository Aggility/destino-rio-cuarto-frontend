'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import EventCard from '@/components/server/EventCard';
import { useDebouncedCallback } from 'use-debounce';

const EVENTS_PER_PAGE = 9;

// ── Helpers ────────────────────────────────────────────────────────────────────
function toMidnight(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

function getEventTimestamp(evt) {
  const raw = evt.rawDate;
  if (!raw) return null;
  return toMidnight(raw.split('T')[0]);
}

function todayTimestamp() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}

function formatDateDisplay(isoStr) {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function EventsListClient({ initialEvents = [] }) {
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [visibleCount, setVisibleCount]         = useState(EVENTS_PER_PAGE);
  const [activeSearch, setActiveSearch]         = useState('');

  // Filtro de fecha
  const [dateMode, setDateMode]     = useState('all');   // 'all' | 'quick' | 'single'
  const [quickDate, setQuickDate]   = useState('');      // 'today' | 'week' | 'month'
  const [singleDate, setSingleDate] = useState('');
  const [dateOpen, setDateOpen]     = useState(false);
  const dateRef = useRef(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Categorías dinámicas ───────────────────────────────────────────────────
  const categories = useMemo(() => {
    const seen = new Set(initialEvents.map(e => e.category).filter(Boolean));
    return ['Todos', ...[...seen].sort((a, b) => a.localeCompare(b, 'es'))];
  }, [initialEvents]);

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    const today = todayTimestamp();
    const weekEnd = today + 7 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const monthYear = { m: now.getMonth(), y: now.getFullYear() };

    return initialEvents.filter(evt => {
      // Texto
      if (activeSearch) {
        const term = activeSearch.toLowerCase();
        if (
          !evt.title?.toLowerCase().includes(term) &&
          !evt.description?.toLowerCase().includes(term) &&
          !evt.location?.toLowerCase().includes(term)
        ) return false;
      }

      // Categoría
      if (selectedCategory !== 'Todos') {
        if (evt.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Fecha
      const evTime = getEventTimestamp(evt);

      if (dateMode === 'quick' && evTime !== null) {
        const raw = evt.rawDate?.split('T')[0];
        const [ey, em] = raw ? raw.split('-').map(Number) : [];
        if (quickDate === 'today' && evTime !== today) return false;
        if (quickDate === 'week' && (evTime < today || evTime > weekEnd)) return false;
        if (quickDate === 'month' && (em - 1 !== monthYear.m || ey !== monthYear.y)) return false;
      }

      if (dateMode === 'single' && singleDate) {
        const target = toMidnight(singleDate);
        if (evTime === null || evTime !== target) return false;
      }

      return true;
    });
  }, [initialEvents, activeSearch, selectedCategory, dateMode, quickDate, singleDate]);

  // ── Slice visible ────────────────────────────────────────────────────────
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore       = visibleCount < filteredEvents.length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const debouncedSearch = useDebouncedCallback((value) => {
    setActiveSearch(value);
    setVisibleCount(EVENTS_PER_PAGE);
  }, 400);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleCount(EVENTS_PER_PAGE);
  };

  const loadMore = () => setVisibleCount(prev => prev + EVENTS_PER_PAGE);

  const hasActiveDateFilter = dateMode !== 'all';
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'Todos' || hasActiveDateFilter;

  const clearFilters = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSelectedCategory('Todos');
    setDateMode('all');
    setQuickDate('');
    setSingleDate('');
    setVisibleCount(EVENTS_PER_PAGE);
    setDateOpen(false);
  };

  const applyQuick = (key) => {
    setDateMode('quick');
    setQuickDate(key);
    setSingleDate('');
    setVisibleCount(EVENTS_PER_PAGE);
    setDateOpen(false);
  };

  const applySingle = (val) => {
    if (!val) return;
    setSingleDate(val);
    setDateMode('single');
    setQuickDate('');
    setVisibleCount(EVENTS_PER_PAGE);
    setDateOpen(false);
  };

  const clearDateFilter = () => {
    setDateMode('all');
    setQuickDate('');
    setSingleDate('');
    setVisibleCount(EVENTS_PER_PAGE);
    setDateOpen(false);
  };

  // Label del botón de fecha
  const dateBtnLabel = (() => {
    if (dateMode === 'all') return 'Fecha';
    if (dateMode === 'quick') {
      if (quickDate === 'today') return 'Hoy';
      if (quickDate === 'week') return 'Esta semana';
      if (quickDate === 'month') return 'Este mes';
    }
    if (dateMode === 'single' && singleDate) return formatDateDisplay(singleDate);
    return 'Fecha';
  })();

  const PINK = '#f54286';

  return (
    <>
      {/* FILTERS SECTION */}
      <section className="bg-white border-bottom shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container-xxl px-3 px-lg-5 py-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">

            {/* Buscador — ocupa todo el ancho en mobile */}
            <div className="flex-grow-1" style={{ minWidth: '160px' }}>
              <div
                className="d-flex align-items-center rounded-3 overflow-hidden bg-white"
                style={{ height: '44px', border: `1.5px solid ${searchTerm ? PINK : '#e5e7eb'}` }}
              >
                <div className="px-3 border-end h-100 d-flex align-items-center">
                  <i className="bi bi-search text-muted" style={{ fontSize: '14px' }} />
                </div>
                <input
                  type="text"
                  className="form-control border-0 shadow-none font-inter h-100"
                  placeholder="Buscar evento, artista..."
                  style={{ fontSize: '14px' }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Fila de filtros secundarios en mobile: Fecha + Categoría + Limpiar */}
            <div className="d-flex gap-2 w-100 w-md-auto flex-nowrap">

              {/* ── FILTRO DE FECHA (dropdown) ── */}
              <div className="position-relative flex-shrink-0" ref={dateRef} style={{ minWidth: 0 }}>
                <button
                  type="button"
                  onClick={() => setDateOpen(prev => !prev)}
                  className="btn font-inter d-flex align-items-center gap-1"
                  style={{
                    height: '44px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    borderRadius: '8px',
                    border: `1.5px solid ${hasActiveDateFilter ? PINK : '#e5e7eb'}`,
                    color: hasActiveDateFilter ? PINK : '#374151',
                    backgroundColor: hasActiveDateFilter ? '#fff5f9' : '#fff',
                    padding: '0 12px',
                    maxWidth: '160px',
                  }}
                >
                  <i className={`bi ${hasActiveDateFilter ? 'bi-calendar-check-fill' : 'bi-calendar3'}`} style={{ fontSize: '13px' }} />
                  <span className="text-truncate" style={{ maxWidth: '100px' }}>{dateBtnLabel}</span>
                  <i className={`bi bi-chevron-${dateOpen ? 'up' : 'down'} ms-1`} style={{ fontSize: '11px' }} />
                </button>

                {/* Dropdown panel — ajustado para no salirse en mobile */}
                {dateOpen && (
                  <div
                    className="position-absolute bg-white rounded-4 shadow-lg p-3"
                    style={{
                      top: '50px',
                      left: 0,
                      width: '270px',
                      border: '1px solid #f3f4f6',
                      zIndex: 200,
                    }}
                  >
                    {/* Atajos rápidos */}
                    <p className="text-muted font-inter mb-2" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Accesos rápidos
                    </p>
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      {[
                        { key: 'today', label: 'Hoy' },
                        { key: 'week',  label: 'Esta semana' },
                        { key: 'month', label: 'Este mes' },
                      ].map(({ key, label }) => {
                        const active = dateMode === 'quick' && quickDate === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => applyQuick(key)}
                            className="btn btn-sm font-inter"
                            style={{
                              borderRadius: '20px',
                              fontSize: '13px',
                              border: `1.5px solid ${active ? PINK : '#e5e7eb'}`,
                              backgroundColor: active ? '#fff5f9' : '#f9fafb',
                              color: active ? PINK : '#374151',
                              fontWeight: active ? 700 : 400,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <hr className="my-2" style={{ borderColor: '#f3f4f6' }} />

                    {/* Fecha específica */}
                    <p className="text-muted font-inter mb-2" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Fecha exacta
                    </p>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="date"
                        className="form-control font-inter"
                        style={{ fontSize: '13px', borderColor: dateMode === 'single' ? PINK : '#e5e7eb', flex: 1 }}
                        value={singleDate}
                        onChange={e => applySingle(e.target.value)}
                      />
                    </div>

                    {/* Quitar filtro */}
                    {hasActiveDateFilter && (
                      <button
                        type="button"
                        onClick={clearDateFilter}
                        className="btn btn-link w-100 text-center font-inter mt-3 p-0"
                        style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
                      >
                        <i className="bi bi-x-circle me-1" />
                        Quitar filtro de fecha
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Categoría */}
              <div className="flex-shrink-0" style={{ minWidth: 0, maxWidth: '160px' }}>
                <select
                  className="form-select font-inter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{
                    height: '44px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    border: `1.5px solid ${selectedCategory !== 'Todos' ? PINK : '#e5e7eb'}`,
                    color: selectedCategory !== 'Todos' ? PINK : '#374151',
                    backgroundColor: selectedCategory !== 'Todos' ? '#fff5f9' : '#fff',
                    borderRadius: '8px',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat === 'Todos' ? 'Categoría' : cat}</option>
                  ))}
                </select>
              </div>

              {/* Limpiar */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn d-flex align-items-center justify-content-center gap-1 font-inter flex-shrink-0"
                  style={{
                    height: '44px',
                    border: `1.5px solid ${PINK}`,
                    color: PINK,
                    backgroundColor: '#fff5f9',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                    padding: '0 12px',
                  }}
                >
                  <i className="bi bi-x-circle-fill" />
                  <span className="d-none d-sm-inline">Limpiar</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* LISTING GRID SECTION */}
      <section className="py-4 py-md-5 bg-listing-page">
        <div className="container-xxl px-3 px-lg-5">
          <h2
            className="font-inter fw-bold text-gray-900 mb-4"
            style={{ fontSize: 'clamp(24px, 6vw, 36px)', letterSpacing: '-1px', lineHeight: '1.1' }}
          >
            Descubrí más Eventos
          </h2>

          {visibleEvents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
              <h4 className="font-inter fw-bold">No hay eventos con esos filtros</h4>
              <p className="font-inter">Prueba con otra fecha o categoría.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-outline-secondary mt-2 font-inter">
                  <i className="bi bi-x-circle me-2" />
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="listing-grid pb-5">
              {visibleEvents.map((event, index) => (
                <EventCard
                  key={`${event.id}-${index}`}
                  id={event.id}
                  slug={event.slug}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  thumbnail={event.thumbnail}
                  category={event.category}
                  typeColor={event.typeColor}
                  lat={event.lat}
                  lng={event.lng}
                  calendars={event.calendars}
                />
              ))}
            </div>
          )}

          {/* LOAD MORE */}
          {hasMore && visibleEvents.length > 0 && (
            <div className="text-center mt-2">
              <button onClick={loadMore} className="btn btn-load-more-pink shadow-premium">
                CARGAR MÁS EVENTOS
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
