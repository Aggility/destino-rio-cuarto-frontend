'use client';

import React, { useState, useMemo } from 'react';
import EventCard from '@/components/server/EventCard';
import { useDebouncedCallback } from 'use-debounce';

const EVENTS_PER_PAGE = 9;

export default function EventsListClient({ initialEvents = [] }) {
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedDate, setSelectedDate]     = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [visibleCount, setVisibleCount]     = useState(EVENTS_PER_PAGE);
  const [activeSearch, setActiveSearch]     = useState('');

  // ── Categorías dinámicas extraídas de los datos ──────────────────────────────
  const categories = useMemo(() => {
    const seen = new Set(initialEvents.map(e => e.category).filter(Boolean));
    return ['Todos', ...[...seen].sort((a, b) => a.localeCompare(b, 'es'))];
  }, [initialEvents]);

  // ── Filtrado puramente en el frontend ────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDay = now.getDate();
    const todayTime = new Date(todayYear, todayMonth, todayDay).getTime();
    const weekEndTime = todayTime + 7 * 24 * 60 * 60 * 1000;

    return initialEvents.filter(evt => {
      // Filtro de texto
      if (activeSearch) {
        const term = activeSearch.toLowerCase();
        const matchTitle    = evt.title?.toLowerCase().includes(term);
        const matchDesc     = evt.description?.toLowerCase().includes(term);
        const matchLocation = evt.location?.toLowerCase().includes(term);
        if (!matchTitle && !matchDesc && !matchLocation) return false;
      }

      // Filtro de categoría
      if (selectedCategory !== 'Todos') {
        if (evt.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Filtro de fecha
      if (selectedDate !== 'Todos' && evt.rawDate) {
        const raw = evt.rawDate;
        const [y, m, d] = raw.split('T')[0].split('-').map(Number);
        const evDate = new Date(y, m - 1, d);
        const evTime = evDate.getTime();

        if (selectedDate === 'HOY') {
          if (evTime !== todayTime) return false;
        } else if (selectedDate === 'Esta semana') {
          if (evTime < todayTime || evTime > weekEndTime) return false;
        } else if (selectedDate === 'Este mes') {
          if (m - 1 !== todayMonth || y !== todayYear) return false;
        }
      }

      return true;
    });
  }, [initialEvents, activeSearch, selectedCategory, selectedDate]);

  // ── Slice visible ─────────────────────────────────────────────────────────────
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore       = visibleCount < filteredEvents.length;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const debouncedSearch = useDebouncedCallback((value) => {
    setActiveSearch(value);
    setVisibleCount(EVENTS_PER_PAGE); // reset al cambiar búsqueda
  }, 400);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleCount(EVENTS_PER_PAGE);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setVisibleCount(EVENTS_PER_PAGE);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + EVENTS_PER_PAGE);
  };

  const hasActiveFilters = searchTerm !== '' || selectedDate !== 'Todos' || selectedCategory !== 'Todos';

  const clearFilters = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSelectedDate('Todos');
    setSelectedCategory('Todos');
    setVisibleCount(EVENTS_PER_PAGE);
  };

  const activeStyle  = { borderColor: '#f54286', borderWidth: '1.5px' };
  const defaultStyle = { borderColor: '#e5e7eb' };

  return (
    <>
      {/* FILTERS SECTION */}
      <section className="bg-white border-bottom py-3 shadow-sm sticky-top-filters">
        <div className="container-xxl px-lg-5">
          <div className="row g-2 align-items-center">

            {/* Buscador */}
            <div className="col-12 col-lg">
              <div
                className="d-flex align-items-center rounded-3 overflow-hidden bg-white"
                style={{ height: '46px', border: `1.5px solid ${searchTerm ? '#f54286' : '#e5e7eb'}` }}
              >
                <div className="px-3 border-end h-100 d-flex align-items-center">
                  <i className="bi bi-search text-muted" />
                </div>
                <input
                  type="text"
                  className="form-control border-0 shadow-none font-inter h-100"
                  placeholder="Buscar evento, artista..."
                  style={{ fontSize: '15px' }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Fecha */}
            <div className="col-6 col-lg-auto">
              <select
                className="form-select font-inter w-100"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ height: '46px', fontSize: '14px', cursor: 'pointer', ...(selectedDate !== 'Todos' ? activeStyle : defaultStyle) }}
              >
                <option value="Todos">Todas las fechas</option>
                <option value="HOY">Hoy</option>
                <option value="Esta semana">Esta semana</option>
                <option value="Este mes">Este mes</option>
              </select>
            </div>

            {/* Categoría */}
            <div className="col-6 col-lg-auto">
              <select
                className="form-select font-inter w-100"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ height: '46px', fontSize: '14px', cursor: 'pointer', ...(selectedCategory !== 'Todos' ? activeStyle : defaultStyle) }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === 'Todos' ? 'Todas las categorías' : cat}</option>
                ))}
              </select>
            </div>

            {/* Limpiar */}
            <div className="col-12 col-lg-auto">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="btn d-flex align-items-center justify-content-center gap-2 fw-semibold font-inter w-100"
                style={{
                  height: '46px',
                  border: `1.5px solid ${hasActiveFilters ? '#f54286' : '#d1d5db'}`,
                  color: hasActiveFilters ? '#f54286' : '#9ca3af',
                  backgroundColor: hasActiveFilters ? '#fff5f9' : '#f9fafb',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="bi bi-x-circle-fill" />
                Limpiar filtros
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* LISTING GRID SECTION */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <h2
            className="font-inter fw-bold text-gray-900 mb-4"
            style={{ fontSize: 'clamp(28px, 7vw, 36px)', letterSpacing: '-1px', lineHeight: '1.1' }}
          >
            Descubrí más Eventos
          </h2>

          {visibleEvents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
              <h4>No hay eventos con esos filtros</h4>
              <p>Prueba buscando otras palabras o categorías.</p>
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
              <button
                onClick={loadMore}
                className="btn btn-load-more-pink shadow-premium"
              >
                CARGAR MÁS EVENTOS
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
