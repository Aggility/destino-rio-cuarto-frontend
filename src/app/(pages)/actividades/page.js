import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import ActivitiesListClient from '@/components/client/ActivitiesListClient';
import { getThumbnail } from '@/utils/image';

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
      // Filtrar inactivas y también aquellas que son "Experiencias" (se mueven a su propia página)
      rawActivities = all.filter(p => 
        p.status?.toLowerCase() !== 'inactive' && 
        p.types?.some(t => t.key === 'activity')
      );
    }
  } catch (error) {
    console.error('Error fetching proposals API:', error);
  }

  // Formatear datos para los componentes
  const activities = rawActivities.map(p => {
    // Categoría y Tag
    const categoryName = p.categories?.[0]?.name?.trim() || 'Actividad';

    // Lugar: Solo nombre del lugar (priorizando organization dentro de addresses)
    const address = p.addresses?.[0]?.organization?.name || p.organization?.name || p.addresses?.[0]?.addressable?.name || p.addresses?.[0]?.address || 'Río Cuarto';

    // Horario: Extraer de calendars de forma clara y corta
    const cal = p.calendars?.[0];
    let timeBadge = categoryName;
    if (cal) {
      if (cal.start_time && cal.end_time) {
        timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
      } else if (cal.start_time) {
        timeBadge = `${cal.start_time.substring(0, 5)} hs`;
      }
    }

    // Prioridad de imagen: small -> medium -> large -> fallback
    let thumbnail = '/no-img.webp';
    if (p.cover && typeof p.cover === 'object') {
      thumbnail = p.cover.small || p.cover.medium || p.cover.large || p.cover.original || getThumbnail(p.cover, p.gallery);
    } else {
      thumbnail = getThumbnail(p.cover, p.gallery);
    }

    return {
      id: p.id,
      title: p.title || 'Sin título',
      category: categoryName,
      description: p.description
        ? p.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 110) + '...'
        : 'Actividad turística en Río Cuarto.',
      thumbnail,
      address,
      schedule: cal?.observations || 'Consultar horarios',
      time: timeBadge,
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
