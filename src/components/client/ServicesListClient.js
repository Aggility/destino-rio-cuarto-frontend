'use client';

import React, { useState, useEffect } from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import { getDistance } from '@/utils/geo';

export default function ServicesListClient({ initialServices }) {
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState(initialServices);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  const loadMoreServices = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    try {
      const res = await fetch(`/api/organizations?page=${nextPage}&per_page=20`);
      if (res.ok) {
        const data = await res.json();
        const newApiOrgs = data.data || (Array.isArray(data) ? data : []);
        
        if (newApiOrgs.length === 0) {
          setHasMore(false);
        } else {
          const formatted = newApiOrgs.map((org) => ({
            id: org.id,
            title: org.name,
            category: org.categories?.[0]?.name || 'Servicio',
            address: org.addresses?.[0]?.address?.split(',')[0] || 'Río Cuarto',
            phone: org.phone || 'Consultar contacto',
            thumbnail: org.image_url || "/Thumbnail.png",
            lat: org.addresses?.[0]?.latitude,
            lng: org.addresses?.[0]?.longitude
          }));
          
          setServices(prev => [...prev, ...formatted]);
          setCurrentPage(nextPage);
          
          // Verificar si hay más páginas
          if (data.current_page >= data.last_page || newApiOrgs.length < 20) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Error loading more services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation && services.length > 0) {
      const updatedServices = services.map(service => {
        if (service.lat && service.lng && !service.distance) {
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
      
      // Solo actualizamos si hay cambios reales en las distancias calculadas
      const hasChanges = updatedServices.some((s, idx) => s.distance !== services[idx].distance);
      if (hasChanges) setServices(updatedServices);
    }
  }, [userLocation, services]);

  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Chips definidos por el usuario + Dinámicos si hay más
  const staticFilters = ['Todos', 'Cercanos', 'Comer', 'Dormir', 'Disfrutar', 'Viajar', 'Servicios generales o al turista'];
  const uniqueApiCategories = Array.from(new Set(services.map(s => s.category))).filter(c => !staticFilters.includes(c));
  const allFilters = [...staticFilters, ...uniqueApiCategories];

  // Aplicar filtrado y ordenamiento dinámico
  const getFilteredServices = () => {
    let result = [...services];
    
    // 1. Filtro por búsqueda de texto
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.category.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term)
      );
    }

    // 2. Filtro por chips
    if (selectedFilter === 'Cercanos') {
      return result
        .filter(s => s.distance !== undefined && s.distance !== null)
        .sort((a, b) => a.distance - b.distance);
    } else if (selectedFilter !== 'Todos') {
      // Mapeo flexible para categorías comunes
      const filterLower = selectedFilter.toLowerCase();
      result = result.filter(s => {
        const catLower = s.category.toLowerCase();
        if (filterLower === 'comer') return catLower.includes('gastro') || catLower.includes('restaurante') || catLower.includes('comer') || catLower.includes('parrilla');
        if (filterLower === 'dormir') return catLower.includes('alojamiento') || catLower.includes('hotel') || catLower.includes('dormir');
        if (filterLower === 'viajar') return catLower.includes('transporte') || catLower.includes('agencia') || catLower.includes('viaje');
        return catLower === filterLower;
      });
    }
    
    return result;
  };

  const filteredServices = getFilteredServices();

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* 1. Buscador (Estilo Foto) */}
      <div className="bg-white rounded-2 shadow-sm border d-flex align-items-center overflow-hidden mb-2" style={{ height: '60px' }}>
          <div className="px-3 border-end h-100 d-flex align-items-center bg-gray-50">
              <i className="bi bi-search text-muted"></i>
          </div>
          <input 
            type="text" 
            className="form-control border-0 shadow-none font-inter h-100" 
            placeholder="¿Qué estás buscando? (Ej: Hotel, Parrilla, Taxi)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary h-100 px-4 fw-bold border-0 rounded-0" style={{ backgroundColor: '#1a56db', minWidth: '130px' }}>
              BUSCAR
          </button>
      </div>

      {/* 2. Selector de Categorías (Chips del diseño) */}
      <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
        {allFilters.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`btn rounded-pill px-4 py-2 font-inter fw-medium transition-all ${
                isActive ? 'btn-primary text-white' : 'btn-outline-secondary bg-white text-muted'
              }`}
              style={{ 
                minWidth: 'fit-content', 
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#1a56db' : 'white',
                borderColor: isActive ? '#1a56db' : '#dee2e6',
                fontSize: '14px',
                borderWidth: '1px'
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* 3. Lista de Resultados */}
      <div className="d-flex flex-column gap-3 mt-2">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, idx) => (
            <ServiceListItem 
              key={service.id || idx}
              id={service.id}
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

      {hasMore && selectedFilter === 'Todos' && searchTerm === '' && (
        <div className="text-center mt-4">
          <button 
            onClick={loadMoreServices}
            disabled={isLoading}
            className="btn btn-outline-primary px-5 py-2 rounded-2 shadow-premium fw-bold" 
            style={{ 
              minWidth: '220px',
              height: '56px',
              borderColor: '#1a56db',
              color: '#1a56db'
            }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {isLoading ? 'CARGANDO...' : 'CARGAR MÁS RESULTADOS'}
          </button>
        </div>
      )}
    </div>
  );
}
