import React from 'react';
import ChatbotIcon from '@/components/server/ChatbotIcon';
import HeroHome from '@/components/server/HeroHome';
import PlacesListClient from '@/components/client/PlacesListClient';
import { getThumbnail } from '@/utils/image';

export const revalidate = 300;

/**
 * PlacesPage - Destino Río Cuarto
 * Server Component: realiza el fetch de organizaciones de tipo "lugar" (place) desde la API backend.
 * Renderiza los lugares utilizando el componente EventCard a través de PlacesListClient.
 */
export default async function PlacesPage() {
  let rawPlaces = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?per_page=500`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      
      // Filtrar organizaciones inactivas y de tipo "place"
      rawPlaces = list
        .filter(org =>
          org.status?.toLowerCase() !== 'inactive' &&
          org.types?.some(t => t.key === 'place')
        )
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));
    }
  } catch (error) {
    console.error('Error fetching places from organizations API:', error);
  }

  // Formatear datos para el componente de tarjetas
  const formattedPlaces = rawPlaces.map(org => {
    const categoryName = org.categories?.[0]?.name?.trim() || 'Lugar Destacado';
    const address = org.addresses?.[0]?.address?.split(',')[0] || org.addresses?.[0]?.city || 'Río Cuarto';
    const thumbnail = getThumbnail(org.cover, org.gallery);

    return {
      id: org.id,
      slug: org.slug || String(org.id),
      title: org.name || 'Sin nombre',
      category: categoryName,
      location: address,
      date: categoryName.toUpperCase(),
      description: org.excerpt || (org.description
        ? org.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 120) + '...'
        : 'Lugar de interés en Río Cuarto.'),
      thumbnail,
      lat: parseFloat(org.addresses?.[0]?.latitude) || null,
      lng: parseFloat(org.addresses?.[0]?.longitude) || null,
    };
  });

  // Extraer categorías únicas para el filtro
  const categories = [...new Set(
    rawPlaces
      .map(org => org.categories?.[0]?.name?.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'));

  return (
    <div className="bg-listing-page min-vh-100 position-relative">
      
      {/* HERO SECTION */}
      <HeroHome initialSlug="lugares" />

      {/* LISTADO DE LUGARES (Client Component con EventCard) */}
      <PlacesListClient initialPlaces={formattedPlaces} categories={categories} />

      <ChatbotIcon />
    </div>
  );
}
