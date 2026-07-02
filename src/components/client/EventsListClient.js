'use client';

import React, { useState, useCallback, useRef } from 'react';
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
    category:    evt.categories?.[0]?.name?.toUpperCase() || 'EVENTO',
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

  // Acumula las categorías vistas para que el selector no se vacíe al filtrar
  const seenCategories = useRef(new Set(initialEvents.map(e => e.category)));
  const categories = ['Todos', ...Array.from(seenCategories.current)];

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

      newEvents.forEach(e => seenCategories.current.add(e.category));

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

  return (
    <>
      {/* FILTERS SECTION */}
      <section className="bg-white border-bottom pt-3 pt-md-4 pb-3 shadow-sm sticky-top-filters">
        <div className="container-xxl px-lg-5">
          <div className="d-flex flex-column gap-3">

            {/* Buscador */}
            <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-3 border d-flex align-items-center overflow-hidden"
                  style={{ height: '56px', border: '1px solid #e5e7eb' }}>
              <div className="px-3 border-end h-100 d-flex align-items-center bg-gray-50">
                <i className="bi bi-search text-muted"></i>
              </div>
              <input
                type="text"
                className="form-control border-0 shadow-none font-inter h-100 flex-grow-1"
                placeholder="Buscar evento, artista..."
                style={{ fontSize: '15px' }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {isLoading && (
                <div className="px-3 h-100 d-flex align-items-center">
                  <span className="spinner-border spinner-border-sm text-muted" role="status" aria-hidden="true" />
                </div>
              )}
            </form>

            <div className="row g-3 mt-1">
              {/* Fecha */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column gap-2">
                  <label className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: '14px' }}>¿Cuándo?</label>
                  <select
                    className="form-select font-inter shadow-sm"
                    value={selectedDate}
                    onChange={handleDateChange}
                    style={{ height: '48px', borderColor: '#e5e7eb', fontSize: '15px', cursor: 'pointer' }}
                  >
                    <option value="Todos">Todas las fechas</option>
                    <option value="HOY">Hoy</option>
                    <option value="Esta semana">Esta semana</option>
                    <option value="Este mes">Este mes</option>
                  </select>
                </div>
              </div>

              {/* Categoría */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column gap-2">
                  <label className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: '14px' }}>Categoría</label>
                  <select
                    className="form-select font-inter shadow-sm"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{ height: '48px', borderColor: '#e5e7eb', fontSize: '15px', cursor: 'pointer' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat === 'Todos' ? 'Todas las categorías' : cat}</option>
                    ))}
                  </select>
                </div>
              </div>
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
