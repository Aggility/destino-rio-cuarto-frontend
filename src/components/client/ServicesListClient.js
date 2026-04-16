'use client';

import React, { useState, useEffect } from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import { getDistance } from '@/utils/geo';

export default function ServicesListClient({ initialServices, leftoverFromFirstPage = [] }) {
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState(initialServices);
  const [leftover, setLeftover] = useState(leftoverFromFirstPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  // Función para formatear datos de la API
  const formatOrg = (org) => ({
    id: org.id,
    title: org.name,
    category: org.categories?.[0]?.name || 'Servicio',
    address: org.addresses?.[0]?.address?.split(',')[0] || 'Río Cuarto',
    phone: org.phone || 'Consultar contacto',
    thumbnail: org.image_url || "/Thumbnail.png",
    lat: org.addresses?.[0]?.latitude,
    lng: org.addresses?.[0]?.longitude,
    distance: null
  })  // Cargar servicios con filtros documentados
  // Cargar servicios con filtros
  const fetchServices = async (page = 1, isNewSearch = false) => {
    setIsLoading(true);
    try {
      // Cargamos 100 resultados para maximizar la probabilidad de encontrar 9
      const perPage = (selectedFilter !== 'Todos' || searchTerm) ? 100 : 9;
      let query = `/api/organizations?page=${page}&per_page=${perPage}`;
      
      let effectiveSearch = searchTerm;
      
      if (selectedFilter !== 'Todos' && selectedFilter !== 'Cercanos') {
          let apiCategory = selectedFilter;
          if (selectedFilter === 'Restaurantes') {
            apiCategory = 'gastronomia';
            // Si no hay búsqueda del usuario, inyectamos 'gastronomia' en el search para forzar resultados
            if (!effectiveSearch) effectiveSearch = 'gastronomia';
          }
          if (selectedFilter === 'Alojamiento') {
            apiCategory = 'alojamiento';
            if (!effectiveSearch) effectiveSearch = 'alojamiento';
          }
          
          query += `&category=${encodeURIComponent(apiCategory)}`;
      }

      if (effectiveSearch) query += `&search=${encodeURIComponent(effectiveSearch)}`;

      console.log("Querying API with forced search:", query);

      const res = await fetch(query);
      if (res.ok) {
        const data = await res.json();
        const apiData = data.data || (Array.isArray(data) ? data : []);
        console.log(`Received ${apiData.length} items from API`);

        let formatted = apiData.map(formatOrg);

        // EXTRA: Filtrado manual ROBUSTO para asegurar que encontramos los 9 resultados
        if (selectedFilter !== 'Todos' && selectedFilter !== 'Cercanos') {
           const lowFilter = selectedFilter.toLowerCase();
           formatted = formatted.filter(s => {
             const lowCat = (s.category || '').toLowerCase();
             const lowTitle = (s.title || '').toLowerCase();
             
             if (lowFilter === 'restaurantes') {
                return lowCat.includes('gastro') || lowCat.includes('restaurante') || lowCat.includes('comer') || 
                       lowCat.includes('parrilla') || lowCat.includes('comida') || lowCat.includes('pizzer') || 
                       lowCat.includes('helader') || lowCat.includes('rapida') || lowCat.includes('patio') || 
                       lowCat.includes('paseo') || lowTitle.includes('restaurante') || lowTitle.includes('parrilla') || 
                       lowTitle.includes('pizza') || lowTitle.includes('comida');
             }
             if (lowFilter === 'alojamiento') {
                return lowCat.includes('aloja') || lowCat.includes('hotel') || lowCat.includes('dormir') || 
                       lowCat.includes('hospedaje') || lowCat.includes('posada') || lowTitle.includes('hotel') || 
                       lowTitle.includes('alojamiento') || lowTitle.includes('departamento');
             }
             return true; 
           });
        }

        if (isNewSearch) {
          setServices(formatted.slice(0, 9));
          setLeftover(formatted.slice(9));
          setCurrentPage(1);
          setHasMore(apiData.length > 0 && (data.last_page ? data.current_page < data.last_page : true));
        } else {
          setServices(prev => [...prev, ...formatted]);
          setCurrentPage(page);
          if (apiData.length === 0 || (data.last_page && data.current_page >= data.last_page)) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };






  // Efecto para buscar cuando cambia el filtro (excepto 'Todos' inicial)
  useEffect(() => {
    if (selectedFilter !== 'Todos') {
       fetchServices(1, true);
    } else if (searchTerm !== '') {
       // Si volvemos a 'Todos' pero hay búsqueda
       fetchServices(1, true);
    } else {
       // Reset case when going back to Todos without search
       // Solo si no estamos en el estado inicial
       if (currentPage > 1 || (services && initialServices && services.length !== initialServices.length)) {
         setServices(initialServices);
         setLeftover(leftoverFromFirstPage);
         setCurrentPage(1);
         setHasMore(true);
       }
    }
  }, [selectedFilter]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    fetchServices(1, true);
  };

  const loadMore = () => {
    if (leftover.length > 0) {
      // Cargamos los siguientes 9 del leftover
      const nextBatch = leftover.slice(0, 9);
      const remainingLeftover = leftover.slice(9);
      
      setServices(prev => [...prev, ...nextBatch]);
      setLeftover(remainingLeftover);
    } else {
      fetchServices(currentPage + 1);
    }
  };


  // Actualizar distancias cuando se tiene la ubicación
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
      
      const hasChanges = updatedServices.some((s, idx) => s.distance !== services[idx].distance);
      if (hasChanges) setServices(updatedServices);
    }
  }, [userLocation, services]);

  const staticFilters = ['Todos', 'Cercanos', 'Restaurantes', 'Alojamiento', 'Disfrutar', 'Viajar', 'Servicios generales o al turista'];

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* 1. Buscador */}
      <form onSubmit={handleSearch} className="bg-white rounded-2 shadow-sm border d-flex align-items-center overflow-hidden mb-2" style={{ height: '60px' }}>
          <div className="px-3 border-end h-100 d-flex align-items-center bg-gray-50">
              <i className="bi bi-search text-muted"></i>
          </div>
          <input 
            type="text" 
            className="form-control border-0 shadow-none font-inter h-100 flex-grow-1" 
            placeholder="¿Qué estás buscando? (Ej: Hotel, Parrilla, Taxi)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="btn btn-primary h-100 px-3 px-md-4 fw-bold border-0 rounded-0" 
            style={{ backgroundColor: '#1a56db' }}
          >
              {isSearching ? '...' : 'BUSCAR'}
          </button>
      </form>

      {/* 2. Selector de Categorías */}
      <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2">
        {staticFilters.map((filter) => {
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
        {(() => {
          let displayServices = [...services];
          if (selectedFilter === 'Cercanos' && userLocation) {
            displayServices = displayServices
              .filter(s => s.distance !== null)
              .sort((a, b) => a.distance - b.distance);
          }
          
          if (displayServices.length > 0) {
            return displayServices.map((service, idx) => (
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
            ));
          }
          
          return (
            <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
              {isLoading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <>
                  <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-muted font-inter">No se encontraron servicios que coincidan con tu búsqueda.</p>
                </>
              )}
            </div>
          );
        })()}
      </div>


      {(hasMore || leftover.length > 0) && (

        <div className="text-center mt-4">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            className="btn btn-load-more-blue shadow-premium" 
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

