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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals?per_page=500`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const all = Array.isArray(data) ? data : (data.data || []);
      // Filtrar inactivas y que sean tipo "experience"
      rawExperiences = all
        .filter(p =>
          p.status?.toLowerCase() !== 'inactive' &&
          p.types?.some(t => t.key === 'experience')
        )
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  } catch (error) {
    console.error('Error fetching experiences API:', error);
  }

  // Formatear datos para los componentes
  const experiences = rawExperiences.map(p => {
    const categoryName = p.categories?.[0]?.name?.trim() || 'Experiencia';

    // Lugar: Mostrar cantidad de lugares incluidos en lugar del primer lugar
    const addressCount = p.addresses?.length || 1;
    const address = `Incluye ${addressCount} Lugar${addressCount !== 1 ? 'es' : ''}`;

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

    const thumbnail = getThumbnail(p.cover, p.gallery);

    return {
      id: p.id,
      slug: p.slug,
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
