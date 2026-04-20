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
      thumbnail: evt.media?.cover || evt.media?.gallery?.[0] || evt.image_url || "/Thumbnail.png",
      category: evt.categories?.[0]?.name?.toUpperCase() || (idx % 2 === 0 ? "POP" : "KIDS"),
      typeColor: "#f54286",
      lat: evt.organization?.addresses?.[0]?.latitude,
      lng: evt.organization?.addresses?.[0]?.longitude,
      rawDate: primaryCalendar?.start_date
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

    // date filter
    let matchesDate = true;
    if (selectedDateFilter !== 'Todos' && evt.rawDate) {
      const eventDate = new Date(evt.rawDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const eventNormalized = new Date(evt.rawDate);
      eventNormalized.setHours(0, 0, 0, 0);

      if (selectedDateFilter === 'HOY') {
        matchesDate = eventNormalized.getTime() === today.getTime();
      } else if (selectedDateFilter === 'Esta semana') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        matchesDate = eventNormalized >= today && eventNormalized <= nextWeek;
      } else if (selectedDateFilter === 'Este mes') {
        matchesDate = eventNormalized.getMonth() === today.getMonth() && eventNormalized.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const localThumbnail = "/Thumbnail.png";

  return (
    <>
      {/* FILTERS SECTION — Diseño Unificado y Optimizado Mobile */}
      <section className="bg-white border-bottom pt-3 pt-md-4 pb-3 shadow-sm sticky-top-filters">
        <div className="container-xxl px-lg-5">
          <div className="d-flex flex-column gap-3">
            
            {/* 1. Buscador con Adaptación Mobile */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit"
                  className="btn h-100 px-3 px-md-4 fw-bold border-0 rounded-0 text-white" 
                  style={{ backgroundColor: '#f54286', fontSize: '14px' }}
                >
                    <span className="d-none d-md-inline">BUSCAR</span>
                    <i className="bi bi-arrow-right d-md-none"></i>
                </button>
            </form>

            <div className="row g-4 mt-1">
              {/* 2. Selector de Fechas (Chips) */}
              <div className="col-12 col-lg-6">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between px-1">
                    <label className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: '14px' }}>¿Cuándo?</label>
                    <span className="text-muted d-lg-none" style={{ fontSize: '11px' }}>Desliza <i className="bi bi-chevron-right"></i></span>
                  </div>
                  <div className="mx-n3 px-3 overflow-auto hide-scrollbar">
                    <div className="d-flex gap-2 pb-1">
                      {['Todos', 'HOY', 'Esta semana', 'Este mes'].map((dateOpt) => {
                        const isActive = selectedDateFilter === dateOpt;
                        const label = dateOpt === 'Todos' ? 'Todas las fechas' : (dateOpt === 'HOY' ? 'Hoy' : dateOpt);
                        return (
                          <button
                            key={dateOpt}
                            onClick={() => setSelectedDateFilter(dateOpt)}
                            className={`btn rounded-pill px-4 py-2 font-inter fw-medium transition-all ${
                              isActive ? 'text-white shadow-sm' : 'bg-white text-gray-600'
                            }`}
                            style={{ 
                              minWidth: 'fit-content', 
                              whiteSpace: 'nowrap',
                              backgroundColor: isActive ? '#f54286' : 'white',
                              borderColor: isActive ? '#f54286' : '#e5e7eb',
                              fontSize: '13px',
                              borderWidth: '1px'
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Selector de Categorías (Chips) */}
              <div className="col-12 col-lg-6">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between px-1">
                    <label className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: '14px' }}>Categoría</label>
                    <span className="text-muted d-lg-none" style={{ fontSize: '11px' }}>Desliza <i className="bi bi-chevron-right"></i></span>
                  </div>
                  <div className="mx-n3 px-3 overflow-auto hide-scrollbar">
                    <div className="d-flex gap-2 pb-1">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`btn rounded-pill px-4 py-2 font-inter fw-medium transition-all ${
                              isActive ? 'text-white shadow-sm' : 'bg-white text-gray-600'
                            }`}
                            style={{ 
                              minWidth: 'fit-content', 
                              whiteSpace: 'nowrap',
                              backgroundColor: isActive ? '#f54286' : 'white',
                              borderColor: isActive ? '#f54286' : '#e5e7eb',
                              fontSize: '13px',
                              borderWidth: '1px'
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
              style={{ 
                fontSize: 'clamp(28px, 7vw, 36px)', 
                letterSpacing: '-1px',
                lineHeight: '1.1'
              }}>
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
