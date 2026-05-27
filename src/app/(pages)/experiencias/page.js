import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import ExperiencesListClient from '@/components/client/ExperiencesListClient';
import { getThumbnail } from '@/utils/image';

/**
 * ExperiencesPage - Destino Río Cuarto
 * Consume datos dinámicos desde el endpoint /event-frameworks
 */
export default async function ExperiencesPage() {
  let rawExperiences = [];

  try {
    const res = await fetch('https://destbackdev.aggility.io/api/v1/proposals', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      // Filtrar inactivas y que sean tipo "experience"
      rawExperiences = all.filter(p => 
        p.status?.toLowerCase() !== 'inactive' && 
        p.types?.some(t => t.key === 'experience')
      );
    }
  } catch (error) {
    console.error('Error fetching experiences API:', error);
  }

  // Formatear datos para los componentes
  const experiences = rawExperiences.map(p => {
    const categoryName = p.categories?.[0]?.name?.trim() || 'Experiencia';

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

    // Prioridad de imagen: medium -> small -> large -> fallback
    let thumbnail = '/no-img.webp';
    if (p.cover && typeof p.cover === 'object') {
      thumbnail = p.cover.medium || p.cover.small || p.cover.large || p.cover.original || getThumbnail(p.cover, p.gallery);
    } else {
      thumbnail = getThumbnail(p.cover, p.gallery);
    }

    return {
      id: p.id,
      title: p.title || 'Sin título',
      category: categoryName,
      description: p.description
        ? p.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 110) + '...'
        : 'Experiencia turística en Río Cuarto.',
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
    rawExperiences
      .map(p => p.categories?.[0]?.name?.trim())
      .filter(Boolean)
  )];

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* HERO SECTION */}
      <HeroHome initialSlug="experiencias" />

      {/* FILTROS + GRID (Client Component) */}
      <ExperiencesListClient initialActivities={experiences} categories={categories} />

      <ChatbotIcon />
    </div>
  );
}
