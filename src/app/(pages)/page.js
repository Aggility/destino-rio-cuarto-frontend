import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import ActivityCard from '@/components/server/ActivityCard';

import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import { getThumbnail } from '@/utils/image';
import { formatEventDate } from '@/utils/date';

/**
 * Home - Destino Río Cuarto
 * Usa el endpoint unificado /api/v1/home que devuelve en un solo request:
 *   - featured_events
 *   - suggested_experiences
 *   - relevant_activities
 *   - contextual_info (clima, segmento, avisos)
 */
export const revalidate = 60; // ISR: revalidar c60ada 5 minutos

export default async function Home() {
  // ── 1. Fetch único al endpoint unificado y a organizaciones (lugares) ───────
  let featuredEvents = [];
  let suggestedExp = [];
  let relevantActivities = [];
  let placesToDiscover = [];

  try {
    const [resHome, resOrgs] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
        next: { revalidate: 300 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?per_page=50`, {
        next: { revalidate: 300 },
      }),
    ]);

    if (resHome.ok) {
      const json = await resHome.json();
      const data = json.data || {};

      const sortDesc = (arr) => arr;

      featuredEvents = sortDesc(Array.isArray(data.featured_events) ? data.featured_events : []);
      suggestedExp = sortDesc(Array.isArray(data.suggested_experiences) ? data.suggested_experiences : []);
      relevantActivities = sortDesc(Array.isArray(data.relevant_activities) ? data.relevant_activities : []);
    }

    if (resOrgs.ok) {
      const jsonOrgs = await resOrgs.json();
      const listOrgs = Array.isArray(jsonOrgs) ? jsonOrgs : (jsonOrgs.data || []);
      placesToDiscover = listOrgs
        .filter(org =>
          org.status?.toLowerCase() !== 'inactive' &&
          org.types?.some(t => t.key === 'place')
        )
        .slice(0, 10);
    }
  } catch (error) {
    console.error('Error fetching data for Home:', error);
  }

  // ── 2. Helpers de formato ─────────────────────────────────────────────────

  const getCover = (item) => getThumbnail(item.cover, item.gallery);

  // ── 3. Card builders ──────────────────────────────────────────────────────

  /** Tarjeta "Ver más" genérica */
  const SeeMoreCard = ({ slug, title, color }) => (
    <div className="flex-shrink-0" style={{ width: 'clamp(200px, 50vw, 240px)', scrollSnapAlign: 'start' }}>
      <Link href={`/${slug}`} className="text-decoration-none h-100 d-block">
        <div
          className="rounded-4 d-flex flex-column align-items-center justify-content-center text-white shadow-premium p-4 h-100"
          style={{ backgroundColor: color, transition: 'all 0.3s ease' }}
        >
          <div
            className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center mb-3"
            style={{ width: '54px', height: '54px' }}
          >
            <i className="bi bi-plus-lg fs-3" />
          </div>
          <span className="fw-bold font-inter" style={{ fontSize: '18px' }}>Ver más</span>
          <span className="opacity-80 small text-center mt-1 font-inter">{title}</span>
        </div>
      </Link>
    </div>
  );

  /** Wrapper de ancho para cards en el slider */
  const CardWrapper = ({ children, wide = true }) => (
    <div
      className="flex-shrink-0"
      style={{
        width: wide ? 'clamp(280px, 80vw, 320px)' : 'clamp(200px, 50vw, 240px)',
        scrollSnapAlign: 'start',
      }}
    >
      {children}
    </div>
  );

  // ── 4. Secciones definidas ────────────────────────────────────────────────
  const sections = [
    {
      id: 'featured_events',
      title: 'Eventos Destacados',
      slug: 'eventos',
      color: '#f54286',
      hasData: featuredEvents.length > 0,
      renderItems: () =>
        featuredEvents.map((evt) => (
          <CardWrapper key={evt.id}>
            <EventCard
              id={evt.id}
              slug={evt.slug}
              title={evt.title}
              date={formatEventDate(evt)}
              location={evt.organization?.name || 'A confirmar'}
              category={evt.categories?.[0]?.name?.toUpperCase() || 'EVENTO'}
              typeColor="#f54286"
              thumbnail={getCover(evt)}
            />
          </CardWrapper>
        )),
    },
    {
      id: 'suggested_experiences',
      title: 'Experiencias Sugeridas',
      slug: 'experiencias',
      color: '#ff5a1f',
      hasData: suggestedExp.length > 0,
      renderItems: () =>
        suggestedExp.map((exp) => {
          const category = exp.categories?.[0]?.name?.trim() || 'Experiencia';
          const cal = exp.calendars?.[0];
          let timeBadge = category;
          if (cal?.start_time && cal?.end_time) {
            timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
          } else if (cal?.start_time) {
            timeBadge = `${cal.start_time.substring(0, 5)} hs`;
          }

          return (
            <CardWrapper key={exp.id}>
              <EventCard
                id={exp.id}
                slug={exp.slug}
                title={exp.title || 'Sin título'}
                date={timeBadge}
                location={exp.addresses?.[0]?.organization?.name || exp.organization?.name || 'Río Cuarto'}
                category={category}
                description={cal?.observations || ''}
                thumbnail={getCover(exp)}
                lat={exp.addresses?.[0]?.latitude}
                lng={exp.addresses?.[0]?.longitude}
                basePath="experiencias"
                typeColor="#ff5a1f"
              />
            </CardWrapper>
          );
        }),
    },
    {
      id: 'relevant_activities',
      title: 'Actividades para Disfrutar',
      slug: 'actividades',
      color: '#8a38f5',
      hasData: relevantActivities.length > 0,
      renderItems: () =>
        relevantActivities.map((item) => {
          const cal = item.calendars?.[0];
          const category = item.categories?.[0]?.name?.trim() || 'Actividad';
          let timeBadge = category;
          if (cal?.start_time && cal?.end_time) {
            timeBadge = `${cal.start_time.substring(0, 5)} a ${cal.end_time.substring(0, 5)} hs`;
          } else if (cal?.start_time) {
            timeBadge = `${cal.start_time.substring(0, 5)} hs`;
          }

          const address =
            item.addresses?.[0]?.organization?.name ||
            item.organization?.name ||
            item.addresses?.[0]?.addressable?.name ||
            item.addresses?.[0]?.address ||
            'Río Cuarto';

          return (
            <CardWrapper key={item.id}>
              <ActivityCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                time={timeBadge}
                address={address}
                schedule={cal?.observations || 'Consultar horarios'}
                description=""
                thumbnail={getCover(item)}
                type="actividades"
              />
            </CardWrapper>
          );
        }),
    },
    {
      id: 'places_to_discover',
      title: 'Lugares para Descubrir',
      slug: 'lugares',
      color: '#059669',
      hasData: placesToDiscover.length > 0,
      renderItems: () =>
        placesToDiscover.map((place) => {
          const category = place.categories?.[0]?.name?.trim() || 'Lugar Destacado';
          const address = place.addresses?.[0]?.address?.split(',')[0] || place.addresses?.[0]?.city || 'Río Cuarto';

          return (
            <CardWrapper key={place.id}>
              <EventCard
                id={place.id}
                slug={place.slug}
                title={place.name || 'Sin título'}
                date={category.toUpperCase()}
                location={address}
                category={category}
                description={place.excerpt || ''}
                thumbnail={getCover(place)}
                lat={place.addresses?.[0]?.latitude}
                lng={place.addresses?.[0]?.longitude}
                basePath="lugares"
                typeColor="#059669"
              />
            </CardWrapper>
          );
        }),
    },
  ];

  // ── 5. Render ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white overflow-hidden pb-5 font-inter">
      {/* Hero */}
      <HeroHome />

      {/* Contenido principal */}
      <section className="container-xxl py-4 py-md-5 px-lg-5">

        <div className="d-flex flex-column gap-5 align-items-start position-relative w-100">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="w-100 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <HomeSectionSlider title={section.title}>
                {section.hasData
                  ? [
                    ...section.renderItems(),
                    <SeeMoreCard
                      key={`more-${section.slug}`}
                      slug={section.slug}
                      title={section.title}
                      color={section.color}
                    />,
                  ]
                  : (
                    // Estado vacío inline — no bloquea el render
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 text-muted font-inter"
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#f9fafb',
                        border: '1px dashed #d1d5db',
                        fontSize: '14px',
                      }}
                    >
                      <i className="bi bi-hourglass-split me-2" />
                      Sin contenido disponible por ahora
                    </div>
                  )
                }
              </HomeSectionSlider>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
