'use client';

import React, { useState, useMemo, useRef } from 'react';
import EventCard from '@/components/server/EventCard';

const CATEGORY_COLOR = '#059669';
const PLACES_PER_PAGE = 9;

/**
 * PlacesListClient - Destino Río Cuarto
 * Componente cliente que maneja la búsqueda, filtrado por categoría
 * y paginación de lugares utilizando el componente EventCard.
 */
export default function PlacesListClient({ initialPlaces = [], categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(PLACES_PER_PAGE);

  const listTopRef = useRef(null);

  // Filtrado reactivo en el cliente
  const filteredPlaces = useMemo(() => {
    let result = initialPlaces;

    if (selectedCategory !== 'Todos') {
      result = result.filter(place =>
        place.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(place =>
        place.title?.toLowerCase().includes(q) ||
        place.description?.toLowerCase().includes(q) ||
        place.category?.toLowerCase().includes(q) ||
        place.location?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialPlaces, selectedCategory, searchTerm]);

  const visiblePlaces = filteredPlaces.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlaces.length;

  const allCategories = ['Todos', ...categories];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(PLACES_PER_PAGE);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleCount(PLACES_PER_PAGE);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + PLACES_PER_PAGE);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'Todos';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setVisibleCount(PLACES_PER_PAGE);
  };

  return (
    <div ref={listTopRef}>
      {/* ── FILTROS Y BUSCADOR ── */}
      <section className="bg-white border-bottom pt-4 pb-4 shadow-sm">
        <div className="container-xxl px-3 px-lg-5">

          <div className="row g-3 align-items-center mb-3">
            {/* Buscador */}
            <div className="col-12 col-md-7 col-xl-6">
              <div className="input-group shadow-sm" style={{ height: '52px' }}>
                <span className="input-group-text bg-white border-end-0 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 shadow-none font-inter"
                  placeholder="Buscar plazas, parques, museos, anfiteatros..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ fontSize: '15px' }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => { setSearchTerm(''); setVisibleCount(PLACES_PER_PAGE); }}
                    title="Limpiar"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Select por Categoría */}
            <div className="col-12 col-md-3">
              <select
                className="form-select shadow-sm font-inter border"
                style={{
                  height: '52px',
                  color: selectedCategory !== 'Todos' ? CATEGORY_COLOR : undefined,
                  fontWeight: selectedCategory !== 'Todos' ? '600' : 'normal'
                }}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Botón Limpiar o Filtrar */}
            <div className="col-12 col-md-2">
              {hasActiveFilters ? (
                <button
                  className="btn btn-outline-danger w-100 fw-bold font-inter shadow-sm"
                  style={{ height: '52px' }}
                  onClick={clearFilters}
                >
                  LIMPIAR
                </button>
              ) : (
                <button
                  className="btn w-100 fw-bold border-0 font-inter shadow-sm text-white"
                  style={{ height: '52px', backgroundColor: CATEGORY_COLOR }}
                  onClick={() => {}}
                >
                  FILTRAR
                </button>
              )}
            </div>
          </div>

          {/* Estado del filtro / contador */}
          <div className="d-flex align-items-center justify-content-between pt-2">
            <span className="small text-muted font-inter">
              Mostrando <strong>{visiblePlaces.length}</strong> de <strong>{filteredPlaces.length}</strong> lugares
            </span>

            {hasActiveFilters && (
              <span className="badge bg-light text-dark font-inter border px-3 py-2">
                Filtros activos
              </span>
            )}
          </div>

        </div>
      </section>

      {/* ── LISTADO DE TARJETAS (EventCard) ── */}
      <section className="container-xxl py-5 px-3 px-lg-5">
        {visiblePlaces.length > 0 ? (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {visiblePlaces.map((place) => (
                <div key={place.id} className="col d-flex align-items-stretch">
                  <EventCard
                    id={place.id}
                    slug={place.slug}
                    title={place.title}
                    date={place.date || place.category || 'LUGAR'}
                    location={place.location}
                    category={place.category}
                    typeColor={CATEGORY_COLOR}
                    thumbnail={place.thumbnail}
                    lat={place.lat}
                    lng={place.lng}
                    basePath="lugares"
                    description={place.description}
                  />
                </div>
              ))}
            </div>

            {/* Cargar más */}
            {hasMore && (
              <div className="text-center mt-5">
                <button
                  onClick={loadMore}
                  className="btn btn-load-more-green shadow-premium"
                >
                  CARGAR MÁS LUGARES
                </button>
              </div>
            )}
          </>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4 my-4">
            <div className="mb-3 text-muted">
              <i className="bi bi-geo-alt fs-1" style={{ color: CATEGORY_COLOR }}></i>
            </div>
            <h4 className="fw-bold font-inter text-gray-800">No se encontraron lugares</h4>
            <p className="text-muted font-inter max-w-md mx-auto">
              No hallamos ningún lugar que coincida con tus criterios de búsqueda. Intentá limpiando los filtros o cambiando la palabra buscada.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn text-white fw-bold font-inter mt-2 px-4 py-2 rounded-3"
                style={{ backgroundColor: CATEGORY_COLOR }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
