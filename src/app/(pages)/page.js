import React from 'react';
import Link from 'next/link';
import HeroHome from '@/components/server/HeroHome';
import EventCard from '@/components/server/EventCard';
import ActivityCard from '@/components/server/ActivityCard';

import HomeSectionSlider from '@/components/client/HomeSectionSlider';
import { getThumbnail } from '@/utils/image';

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
  // ── 1. Fetch único al endpoint unificado ──────────────────────────────────
  let featuredEvents = [];
  let suggestedExp = [];
  let relevantActivities = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data || {};

      const sortDesc = (arr) => arr;
      //[...arr].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      featuredEvents = sortDesc(Array.isArray(data.featured_events) ? data.featured_events : []);
      suggestedExp = sortDesc(Array.isArray(data.suggested_experiences) ? data.suggested_experiences : []);
      relevantActivities = sortDesc(Array.isArray(data.relevant_activities) ? data.relevant_activities : []);
    }
  } catch (error) {
    console.error('Error fetching /api/v1/home:', error);
  }

  // ── 2. Helpers de formato ─────────────────────────────────────────────────

  /** Parsea "YYYY-MM-DDTHH:MM:SSZ" o "YYYY-MM-DD" como fecha LOCAL (evita off-by-one en UTC-) */
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  /** Formatea la fecha de un evento a partir de su primer calendario */
  const formatEventDate = (evt) => {
    const cal = evt.calendars?.[0];
    if (!cal?.start_date) return 'Fecha a confirmar';
    const d = parseLocalDate(cal.start_date);
    let str = d.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    if (cal.start_time) str += `, ${cal.start_time.substring(0, 5)}hs`;
    return str;
  };

  /** Extrae la mejor imagen de cover + gallery */
  const getCover = (item) => {
    if (item.cover && typeof item.cover === 'object') {
      return item.cover.medium || item.cover.small || item.cover.large || getThumbnail(item.cover, item.gallery);
    }
    return getThumbnail(item.cover, item.gallery);
  };

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
