'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import EventCard from '@/components/server/EventCard';

const CATEGORY_COLOR = '#8a38f5';

/**
 * ActivitiesListClient - Destino Río Cuarto
 * Componente cliente que maneja búsqueda y filtro por categoría
 * de las actividades (proposals) consumidas desde la API.
 */
export default function ActivitiesListClient({ initialActivities = [], categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered = useMemo(() => {
    let result = initialActivities;

    if (selectedCategory !== 'Todos') {
      result = result.filter(act =>
        act.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(act =>
        act.title?.toLowerCase().includes(q) ||
        act.description?.toLowerCase().includes(q) ||
        act.category?.toLowerCase().includes(q) ||
        act.schedule?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialActivities, selectedCategory, searchTerm]);

  const allCategories = ['Todos', ...categories];

  return (
    <div>
      {/* ── FILTROS ── */}
      <section className="bg-white border-bottom pt-4 pb-4 shadow-sm">
        <div className="container-xxl px-3 px-lg-5">

          {/* Buscador + botón */}
          <div className="row g-3 align-items-center mb-3 mb-md-0">
            <div className="col-12 col-md-7 col-xl-6">
              <div className="input-group shadow-sm" style={{ height: '52px' }}>
                <span className="input-group-text bg-white border-end-0 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 shadow-none font-inter"
                  placeholder="Buscar paseos, parques, museos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ fontSize: '15px' }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearchTerm('')}
                    title="Limpiar"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Select desktop y mobile */}
            <div className="col-12 col-md-3">
              <select
                className="form-select shadow-sm font-inter border"
                style={{ height: '52px', color: selectedCategory !== 'Todos' ? CATEGORY_COLOR : undefined }}
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-2">
              <button
                className="btn w-100 fw-bold border-0 font-inter shadow-sm text-white"
                style={{ height: '52px', backgroundColor: CATEGORY_COLOR }}
                onClick={() => { /* los filtros ya son reactivos */ }}
              >
                FILTRAR
              </button>
            </div>
          </div>

          {/* El selector de escritorio ahora también se muestra en mobile */}

        </div>
      </section>

      {/* ── GRID DE RESULTADOS ── */}
      <section className="py-4 py-md-5 bg-listing-page">
        <div className="container-xxl px-3 px-lg-5">

          {/* Contador + reset */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.5px' }}>
              Todas las Actividades
            </h2>

            {(searchTerm || selectedCategory !== 'Todos') && (
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 font-inter"
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
              >
                <i className="bi bi-x-circle me-1"></i> Limpiar filtros
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="listing-grid pb-5">
              {filtered.map((act) => (
                <EventCard
                  key={act.id}
                  id={act.id}
                  slug={act.slug}
                  title={act.title}
                  date={act.time}
                  location={act.address}
                  description={act.schedule}
                  category={act.category}
                  typeColor="#8a38f5"
                  thumbnail={act.thumbnail}
                  lat={act.lat}
                  lng={act.lng}
                  basePath="actividades"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
              <i className="bi bi-search fs-1 d-block mb-3" style={{ color: CATEGORY_COLOR, opacity: 0.5 }}></i>
              <h5 className="font-inter fw-bold text-gray-800 mb-2">No encontramos actividades</h5>
              <p className="text-muted font-inter small mb-4">Probá con otros términos o eliminá los filtros activos.</p>
              <button
                className="btn rounded-pill px-4 fw-bold text-white font-inter"
                style={{ backgroundColor: CATEGORY_COLOR }}
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
              >
                Ver todas las actividades
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
