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

    // address → primer tag disponible (describe el tipo/lugar de la actividad)
    // Si no hay tag, usamos "Río Cuarto, Córdoba" como fallback
    const address = tagName || 'Río Cuarto, Córdoba';

    // schedule → categoría (clasifica el tipo de actividad / días)
    const schedule = categoryName;

    // time (badge en imagen) → categoría corta
    const time = categoryName;

    return {
      id: p.id,
      title: p.title || 'Sin título',
      category: categoryName,
      description: p.description
        ? p.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 110) + '...'
        : 'Actividad turística en Río Cuarto.',
      thumbnail: p.cover?.medium || p.cover?.small || p.gallery?.[0]?.medium || '/Thumbnail.png',
      address,
      schedule,
      time,
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
