'use client';

import React, { useState } from 'react';
import EventCard from '@/components/server/EventCard';

export default function EventsListClient({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Helper para formatear eventos nuevos
  const formatEvent = (evt, idx) => {
    const primaryCalendar = evt.calendars?.[0];
    let dateStr = 'Fecha a confirmar';
    if (primaryCalendar) {
      const d = new Date(primaryCalendar.start_date);
      dateStr = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
      if (primaryCalendar.start_time) {
        dateStr += `, ${primaryCalendar.start_time.substring(0, 5)}hs`;
      }
    }
    
    let rawDesc = evt.description || '';
    rawDesc = rawDesc.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    const descStr = rawDesc.length > 100 ? rawDesc.substring(0, 100) + '...' : rawDesc;

    return {
      id: evt.id,
      title: evt.title,
      date: dateStr,
      location: evt.organization?.name || 'Ubicación a confirmar',
      description: descStr,
      thumbnail: evt.image_url || "/Thumbnail.png",
      category: evt.categories?.[0]?.name?.toUpperCase() || (idx % 2 === 0 ? "POP" : "KIDS"),
      typeColor: "#f54286",
      lat: evt.organization?.addresses?.[0]?.latitude,
      lng: evt.organization?.addresses?.[0]?.longitude
    };
  };

  const loadMoreEvents = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    try {
      const res = await fetch(`/api/events?page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        const newApiEvents = Array.isArray(data) ? data : (data.data || []);
        
        if (newApiEvents.length === 0) {
          setHasMore(false);
        } else {
          const formatted = newApiEvents.map((evt, i) => formatEvent(evt, events.length + i));
          setEvents(prev => [...prev, ...formatted]);
          setCurrentPage(nextPage);
          // Si vinieron menos de 10, probablemente no hay más
          if (newApiEvents.length < 10) setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Derive unique categories from event data
  const categories = ['Todos', ...Array.from(new Set(events.map(evt => evt.category)))];

  // Derive filtered events
  const filteredEvents = events.filter((evt) => {
    // text search
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (evt.description && evt.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // category filter
    const matchesCategory = selectedCategory === 'Todos' || evt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const localThumbnail = "/Thumbnail.png";

  return (
    <>
      {/* FILTERS SECTION — Optimizado para Mobile y Cliente */}
      <section className="bg-white border-bottom pt-4 pb-4 pb-md-5 overflow-visible shadow-sm">
        <div className="container-xxl px-lg-5">
          <div className="row g-3 align-items-end">
            
            {/* Search Input */}
            <div className="col-12 col-md-6 col-xl-5">
              <div className="input-group">
                <span className="input-group-text bg-gray-50 border-end-0 py-2 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="form-control bg-gray-50 border-start-0 border-end-0 py-2 shadow-none font-inter" 
                   placeholder="Buscar un evento, artista, teatro..." 
                   style={{ height: '52px' }} 
                />
                <button className="btn btn-primary d-md-none border-0 px-3" style={{ backgroundColor: '#f54286' }}>
                   <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Chips Scrollable Mobile */}
            <div className="col-12 d-md-none mt-3">
                <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
                    {categories.map((cat, idx) => (
                      <button 
                        key={idx} 
                        className={`btn rounded-pill px-4 btn-sm transition-all`} 
                        style={{ 
                          minWidth: 'fit-content',
                          backgroundColor: selectedCategory === cat ? '#f54286' : 'transparent',
                          color: selectedCategory === cat ? '#fff' : '#6b7280',
                          border: `1px solid ${selectedCategory === cat ? '#f54286' : '#d1d5db'}`
                        }}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                </div>
            </div>

            {/* Desktop-only select filters */}
            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Cuándo?</label>
              <select 
                 className="form-select bg-gray-50 py-3 shadow-none border font-inter" 
                 style={{ height: '52px' }}
                 value={selectedDateFilter}
                 onChange={(e) => setSelectedDateFilter(e.target.value)}
              >
                <option value="Todos">Todas las fechas</option>
                <option value="Esta semana">Esta semana</option>
                <option value="Este mes">Este mes</option>
              </select>
            </div>

            <div className="col-6 col-md-3 d-none d-md-block">
              <label className="form-label font-inter fw-medium text-gray-700 small mb-1">Categoría</label>
              <select 
                 className="form-select bg-gray-50 py-3 shadow-none border font-inter" 
                 style={{ height: '52px' }}
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Desktop Search Button */}
            <div className="col-12 col-xl-2 d-none d-md-block">
              <button 
                className="btn btn-primary w-100 fw-bold border-0 font-inter shadow-premium" 
                style={{ height: '52px', backgroundColor: '#f54286' }}
              >
                FILTRAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LISTING GRID SECTION */}
      <section className="py-5 bg-listing-page">
        <div className="container-xxl px-lg-5">
          <h2 className="font-inter fw-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}>
              Descubrí más Eventos
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5 text-muted">
               <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
               <h4>No hay eventos con esos filtros</h4>
               <p>Prueba buscando otras palabras o categorías.</p>
            </div>
          ) : (
            <div className="listing-grid pb-5">
              {filteredEvents.map((event, idx) => (
                <EventCard 
                  key={idx}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  thumbnail={event.thumbnail || localThumbnail}
                  category={event.category}
                  typeColor={event.typeColor}
                  lat={event.lat}
                  lng={event.lng}
                />
              ))}
            </div>
          )}

          {/* LOAD MORE */}
          {hasMore && filteredEvents.length > 0 && (
            <div className="text-center mt-2">
              <button 
                onClick={loadMoreEvents}
                disabled={isLoading}
                className="btn btn-load-more-pink shadow-premium" 
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                {isLoading ? 'CARGANDO...' : 'CARGAR MÁS EVENTOS'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
