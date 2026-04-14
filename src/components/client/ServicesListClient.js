'use client';

import React, { useState, useEffect } from 'react';
import ServiceListItem from '@/components/server/ServiceListItem';
import { getDistance } from '@/utils/geo';

export default function ServicesListClient({ initialServices }) {
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState(initialServices);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && initialServices.length > 0) {
      const servicesWithDistance = initialServices.map(service => {
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
      
      // Optional: Sort by distance if location is available
      // servicesWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      
      setServices(servicesWithDistance);
    }
  }, [userLocation, initialServices]);

  return (
    <div className="d-flex flex-column gap-3">
      {services.map((service) => (
        <ServiceListItem 
          key={service.id}
          id={service.id}
          title={service.title}
          category={service.category}
          address={service.address}
          phone={service.phone}
          thumbnail={service.thumbnail}
          distance={service.distance}
        />
      ))}
    </div>
  );
}
