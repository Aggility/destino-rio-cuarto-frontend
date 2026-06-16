'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrado predictivo y por categoría
  const filteredServices = useMemo(() => {
    let result = servicesWithDistance;

    // Filtro por texto (Predictivo)
    if (searchTerm.trim() !== '') {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(s => 
        (s.title && s.title.toLowerCase().includes(lowerTerm)) ||
        (s.category && s.category.toLowerCase().includes(lowerTerm)) ||
        (s.address && s.address.toLowerCase().includes(lowerTerm)) ||
        (s.description && s.description.toLowerCase().includes(lowerTerm))
      );
    }

    // Filtro por categoría
    if (selectedFilter !== 'Todos' && selectedFilter !== 'Cercanos') {
      result = result.filter(s => s.category === selectedFilter);
    }

    // Ordenar por cercanos
    if (selectedFilter === 'Cercanos' && userLocation) {
      result = result
        .filter(s => s.distance !== null && s.distance !== undefined)
        .sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [servicesWithDistance, searchTerm, selectedFilter, userLocation]);

  // Cuando cambia un filtro o búsqueda, reiniciar la cantidad visible
  useEffect(() => {
    setVisibleCount(9);
  }, [searchTerm, selectedFilter]);

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
      
      {/* 1. Buscador Predictivo */}
      <div className="bg-white rounded-2 shadow-sm border d-flex align-items-center overflow-hidden" style={{ height: '60px' }}>
          <div className="px-3 border-end h-100 d-flex align-items-center bg-gray-50">
              <i className="bi bi-search text-muted"></i>
          </div>
          <input 
            type="text" 
            className="form-control border-0 shadow-none font-inter h-100 flex-grow-1" 
            placeholder="Buscar comercios, hoteles, servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* 2. Selector de Categorías (Dropdown) */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column gap-2">
            <label className="font-inter fw-bold text-gray-900 mb-0" style={{ fontSize: '14px' }}>Categoría</label>
            <select
              className="form-select font-inter shadow-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{ height: '48px', borderColor: '#e5e7eb', fontSize: '15px', cursor: 'pointer' }}
            >
              {dynamicCategories.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>
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

