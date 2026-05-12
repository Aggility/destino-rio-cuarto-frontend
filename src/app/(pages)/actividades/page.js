import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import ActivitiesListClient from '@/components/client/ActivitiesListClient';

/**
 * ActivitiesPage - Destino Río Cuarto
 * Server Component: fetch de la API real de proposals.
 * Delegación del filtrado al Client Component ActivitiesListClient.
 */
export default async function ActivitiesPage() {
  let rawActivities = [];

  try {
    const res = await fetch('https://destbackdev.aggility.io/api/v1/proposals', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      rawActivities = all.filter(p => p.status?.toLowerCase() !== 'inactive');
    }
  } catch (error) {
    console.error('Error fetching proposals API:', error);
  }

  // Formatear datos para los componentes
  const activities = rawActivities.map(p => {
    // La API de proposals no expone address/horario como campos explícitos.
    // Usamos los tags como referencia de lugar/tipo y las categorías como clasificación.
    const categoryName = p.categories?.[0]?.name?.trim() || 'Actividad';
    const tagName = p.tags?.[0]?.name?.trim() || '';

    // Lugar: Nombre del lugar (addressable) + Dirección
    const placeName = p.addresses?.[0]?.addressable?.name;
    const placeAddress = p.addresses?.[0]?.address;
    const address = placeName ? `${placeName}${placeAddress ? ` / ${placeAddress.split(',')[0]}` : ''}` : (placeAddress || 'Río Cuarto, Córdoba');

    // Horario: Observaciones del calendario o fallback
    const schedule = p.calendars?.[0]?.observations || 'Consultar horarios';

    // time (badge en imagen) → Horario resumido
    const startTime = p.calendars?.[0]?.start_time?.substring(0, 5);
    const time = startTime ? `${startTime} hs` : categoryName;

    return {
      id: p.id,
      title: p.title || 'Sin título',
      category: categoryName,
      description: p.description
        ? p.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 110) + '...'
        : 'Actividad turística en Río Cuarto.',
      thumbnail: p.cover?.small || p.cover?.medium || p.gallery?.[0]?.small || '/Thumbnail.png',
      address,
      schedule,
      time,
      lat: p.addresses?.[0]?.latitude,
      lng: p.addresses?.[0]?.longitude,
    };
  });

  // Categorías únicas para los filtros
  const categories = [...new Set(
    rawActivities
      .map(p => p.categories?.[0]?.name?.trim())
      .filter(Boolean)
  )];

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* HERO SECTION */}
      <HeroHome initialSlug="actividades" />

      {/* FILTROS + GRID (Client Component) */}
      <ActivitiesListClient initialActivities={activities} categories={categories} />

      <ChatbotIcon />
    </div>
  );
}
