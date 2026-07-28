'use client';

import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import { getDistance } from '@/utils/geo';

export default function ServicesListClient({ initialServices, leftoverFromFirstPage = [] }) {
  const [userLocation, setUserLocation] = useState(null);

  // Como ahora traemos todos los servicios desde el servidor (per_page=500), 
  // podemos hacer el filtrado de forma local, instantánea y predictiva.
  const allServices = useMemo(() => {
    return [...initialServices, ...leftoverFromFirstPage];
  }, [initialServices, leftoverFromFirstPage]);

  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedLetter, setSelectedLetter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const alphabet = useMemo(() => ['Todas', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')], []);

  // Ubicación del usuario
  const fetchLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation && localStorage.getItem('geo_permission_granted') === 'true') {
      if (window._userLocCache) {
        setUserLocation(window._userLocCache);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          window._userLocCache = loc;
          setUserLocation(loc);
        },
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: false, maximumAge: 600000, timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    fetchLocation();
    window.addEventListener('geo_granted_event', fetchLocation);
    return () => window.removeEventListener('geo_granted_event', fetchLocation);
  }, []);

  // Actualizar distancias en memoria si tenemos la ubicación
  const servicesWithDistance = useMemo(() => {
    if (!userLocation) return allServices;
    return allServices.map(service => {
      if (service.lat && service.lng) {
        const dist = getDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(service.lat),
          parseFloat(service.lng)
        );
        return { ...service, distance: dist };
      }
      return service;
    });
  }, [allServices, userLocation]);

  // Filtrado predictivo, por categoría y por letra inicial A-Z
  const filteredServices = useMemo(() => {
    let result = servicesWithDistance;

    // Filtro por texto (Predictivo)
    if (deferredSearchTerm.trim() !== '') {
      const lowerTerm = deferredSearchTerm.toLowerCase();
      result = result.filter(s =>
        (s.title && s.title.toLowerCase().includes(lowerTerm)) ||
        (s.category && s.category.toLowerCase().includes(lowerTerm)) ||
        (s.address && s.address.toLowerCase().includes(lowerTerm))
      );
    }

    // Filtro por categoría
    if (selectedFilter !== 'Todos' && selectedFilter !== 'Cercanos') {
      result = result.filter(s => s.category === selectedFilter);
    }

    // Filtro por letra inicial (A-Z)
    if (selectedLetter !== 'Todas') {
      result = result.filter(s => {
        if (!s.title) return false;
        const firstChar = s.title
          .trim()
          .charAt(0)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        return firstChar === selectedLetter;
      });
    }

    // Ordenar por cercanos
    if (selectedFilter === 'Cercanos' && userLocation) {
      result = result
        .filter(s => s.distance !== null && s.distance !== undefined)
        .sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [servicesWithDistance, deferredSearchTerm, selectedFilter, selectedLetter, userLocation]);

  // Cuando cambia un filtro o búsqueda, reiniciar la cantidad visible
  useEffect(() => {
    setVisibleCount(9);
  }, [deferredSearchTerm, selectedFilter, selectedLetter]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  // ── Extraer categorías dinámicas de la API ────────────────────────────────
  const dynamicCategories = useMemo(() => {
    const cats = allServices.map(s => s.category).filter(Boolean);
    const uniqueCats = Array.from(new Set(cats)).sort();
    return ['Todos', 'Cercanos', ...uniqueCats];
  }, [allServices]);

  const displayedServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  return (
    <div className="d-flex flex-column gap-3">

      {/* ── FILTROS (Buscador + Selector de Categoría + Abecedario A-Z) ── */}
      <div className="bg-white rounded-4 p-3 shadow-sm mb-4" style={{ border: '1px solid #f3f4f6' }}>
        <div className="row g-3 align-items-center">
          {/* Buscador */}
          <div className="col-12 col-md-7 col-xl-6">
            <div className="input-group shadow-sm" style={{ height: '52px' }}>
              <span className="input-group-text bg-white border-end-0 ps-3">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 shadow-none font-inter"
                placeholder="Buscar comercios, hoteles, servicios..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ fontSize: '15px' }}
              />
              {searchTerm && (
                <button
                  className="btn border-start-0"
                  style={{ backgroundColor: 'white', border: '1px solid #dee2e6' }}
                  onClick={() => setSearchTerm('')}
                  title="Limpiar"
                >
                  <i className="bi bi-x-lg text-muted"></i>
                </button>
              )}
            </div>
          </div>

          {/* Select desktop y mobile */}
          <div className="col-12 col-md-3">
            <select
              className="form-select shadow-sm font-inter border"
              style={{ height: '52px', color: selectedFilter !== 'Todos' ? '#1a56db' : undefined, cursor: 'pointer' }}
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
            >
              {dynamicCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Botón Filtrar */}
          <div className="col-12 col-md-2">
            <button
              className="btn w-100 fw-bold border-0 font-inter shadow-sm text-white"
              style={{ height: '52px', backgroundColor: '#1a56db' }}
            >
              FILTRAR
            </button>
          </div>
        </div>

        {/* ── FILTRO A-Z (BARRA DE LETRAS ABECEDARIO) ── */}
        <div className="pt-3 border-top mt-3">
          <div className="d-flex align-items-center gap-1 overflow-auto pb-1 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
            {alphabet.map((letter) => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(letter);
                    setVisibleCount(9);
                  }}
                  className={`btn btn-sm font-inter transition-all flex-shrink-0 d-flex align-items-center justify-content-center ${isActive
                    ? 'text-white fw-bold shadow-sm'
                    : 'text-gray-700 hover-bg-gray-200 border-0'
                    }`}
                  style={{
                    minWidth: letter === 'Todas' ? '56px' : '34px',
                    height: '34px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#1a56db' : '#f3f4f6',
                    color: isActive ? '#ffffff' : '#374151',
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HEADER DE RESULTADOS ── */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <h2 className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.5px' }}>
          Todos los Servicios {selectedLetter !== 'Todas' ? `(${selectedLetter})` : ''}
        </h2>

        {(searchTerm || selectedFilter !== 'Todos' || selectedLetter !== 'Todas') && (
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 font-inter"
            onClick={() => { setSearchTerm(''); setSelectedFilter('Todos'); setSelectedLetter('Todas'); }}
          >
            <i className="bi bi-x-circle me-1"></i> Limpiar filtros
          </button>
        )}
      </div>

      {/* 3. Lista de Resultados */}
      <div className="d-flex flex-column gap-3 mt-3">
        {displayedServices.length > 0 ? (
          displayedServices.map((service, idx) => (
            <ServiceListItem
              key={service.id || idx}
              id={service.id}
              slug={service.slug}
              title={service.title}
              category={service.category}
              address={service.address}
              phone={service.phone}
              thumbnail={service.thumbnail}
              distance={service.distance}
              lat={service.lat}
              lng={service.lng}
            />
          ))
        ) : (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted font-inter">No se encontraron servicios que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="btn btn-load-more-blue shadow-premium"
          >
            CARGAR MÁS RESULTADOS
          </button>
        </div>
      )}
    </div>
  );
}

