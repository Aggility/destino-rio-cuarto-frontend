'use client';

import React, { useState, useCallback, useEffect } from 'react';
import EventCard from '@/components/server/EventCard';
import { formatEventDate } from '@/utils/date';
import { getThumbnail } from '@/utils/image';
import { useDebouncedCallback } from 'use-debounce';

function formatEvent(evt) {
  const rawDesc = (evt.description || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ');
  return {
    id:          evt.id,
    slug:        evt.slug,
    title:       evt.title,
    date:        formatEventDate(evt),
    location:    evt.organization?.name || 'A confirmar',
    description: rawDesc.length > 120 ? rawDesc.substring(0, 120) + '...' : rawDesc,
    thumbnail:   getThumbnail(evt.cover, evt.gallery),
    category:    evt.categories?.[0]?.name?.trim() || 'Evento',
    typeColor:   '#f54286',
    lat:         evt.organization?.addresses?.[0]?.latitude,
    lng:         evt.organization?.addresses?.[0]?.longitude,
    rawDate:     evt.calendars?.[0]?.start_date,
  };
}

export default function EventsListClient({ initialEvents, initialHasMore = false }) {
  const [events, setEvents]         = useState(initialEvents);
  const [page, setPage]             = useState(1);
  const [isLoading, setIsLoading]   = useState(false);
  const [hasMore, setHasMore]       = useState(initialHasMore);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate]         = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [categories, setCategories] = useState(() => {
    const seen = new Set(initialEvents.map(e => e.category).filter(Boolean));
    return ['Todos', ...[...seen].sort((a, b) => a.localeCompare(b, 'es'))];
  });

  // Carga las categorías reales del dataset completo al montar
  useEffect(() => {
    fetch('/api/events?per_page=1')
      .then(r => r.json())
      .then(data => {
        if (data.categories?.length) {
          setCategories(['Todos', ...data.categories]);
        }
      })
      .catch(() => {});
  }, []);

  const fetchPage = useCallback(async ({ search, category, date, pageNum, append }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum, per_page: 12 });
      if (search)                        params.set('search', search);
      if (category && category !== 'Todos') params.set('category', category);
      if (date && date !== 'Todos')      params.set('date', date);

      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) return;

      const data      = await res.json();
      const newEvents = (data.data || []).map(formatEvent);

      setEvents(prev => append ? [...prev, ...newEvents] : newEvents);
      setHasMore(data.hasMore ?? false);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Búsqueda con debounce de 400ms
  const debouncedFetch = useDebouncedCallback((search) => {
    fetchPage({ search, category: selectedCategory, date: selectedDate, pageNum: 1, append: false });
  }, 400);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    fetchPage({ search: searchTerm, category: cat, date: selectedDate, pageNum: 1, append: false });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchPage({ search: searchTerm, category: selectedCategory, date, pageNum: 1, append: false });
  };

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    fetchPage({ search: searchTerm, category: selectedCategory, date: selectedDate, pageNum: page + 1, append: true });
  };

  const hasActiveFilters = searchTerm !== '' || selectedDate !== 'Todos' || selectedCategory !== 'Todos';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDate('Todos');
    setSelectedCategory('Todos');
    fetchPage({ search: '', category: 'Todos', date: 'Todos', pageNum: 1, append: false });
  };

  const activeStyle  = { borderColor: '#f54286', borderWidth: '1.5px' };
  const defaultStyle = { borderColor: '#e5e7eb' };

  return (
    <>
      {/* FILTERS SECTION */}
      <section className="bg-white border-bottom py-3 shadow-sm sticky-top-filters">
        <div className="container-xxl px-lg-5">
          <div className="row g-2 align-items-center">

            {/* Buscador — fila completa en mobile, crece en desktop */}
            <div className="col-12 col-lg">
              <div
                className="d-flex align-items-center rounded-3 overflow-hidden bg-white"
                style={{ height: '46px', border: `1.5px solid ${searchTerm ? '#f54286' : '#e5e7eb'}` }}
              >
                <div className="px-3 border-end h-100 d-flex align-items-center">
                  {isLoading
                    ? <span className="spinner-border spinner-border-sm text-muted" role="status" aria-hidden="true" />
                    : <i className="bi bi-search text-muted" />
                  }
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

            {/* Fecha — mitad en mobile, ancho automático en desktop */}
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

            {/* Categoría — mitad en mobile, ancho automático en desktop */}
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

            {/* Botón limpiar — fila completa en mobile, ancho automático en desktop */}
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
          <h2 className="font-inter fw-bold text-gray-900 mb-4"
              style={{ fontSize: 'clamp(28px, 7vw, 36px)', letterSpacing: '-1px', lineHeight: '1.1' }}>
            Descubrí más Eventos
          </h2>

          {events.length === 0 && !isLoading ? (
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
              {events.map((event) => (
                <EventCard
                  key={event.id}
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
                />
              ))}
            </div>
          )}

          {/* LOAD MORE */}
          {hasMore && events.length > 0 && (
            <div className="text-center mt-2">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="btn btn-load-more-pink shadow-premium"
              >
                {isLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />CARGANDO...</>
                  : 'CARGAR MÁS EVENTOS'
                }
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
