import React from 'react';
import Link from 'next/link';

/**
 * ServiceListItem - Destino Río Cuarto
 * Mismo estilo que la tarjeta "Lugar" en la página individual de experiencias.
 * Color temático: azul (#1a56db). Sin texto resumen.
 */
export default function ServiceListItem({
  id,
  slug,
  title = "Nombre del Servicio",
  category = "Servicio",
  address = "Dirección no especificada",
  phone = "Sin teléfono",
  thumbnail = "/Thumbnail.png",
  lat = null,
  lng = null,
}) {
  const themeColor      = '#1a56db';
  const themeColorLight = '#ebf5ff';

  const hasCoords = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
  const href      = slug ? `/servicio/${slug}` : (id ? `/servicio/${id}` : '#');
  const mapsHref  = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;

  return (
    <div
      className="bg-light-subtle rounded-4 p-4 border border-light-subtle shadow-sm"
      style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}
    >
      <div className="row g-3 align-items-center">

        {/* Imagen */}
        {thumbnail && thumbnail !== '/no-img.webp' && (
          <div className="col-12 col-md-3">
            <img
              src={thumbnail}
              alt={title}
              className="img-fluid rounded-3 w-100"
              style={{ maxHeight: '140px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Contenido */}
        <div className={thumbnail && thumbnail !== '/no-img.webp' ? 'col-12 col-md-9' : 'col-12'}>

          {/* Badge "Servicio" */}
          <span
            className="badge font-inter fw-semibold mb-2"
            style={{ backgroundColor: themeColorLight, color: themeColor }}
          >
            {category}
          </span>

          {/* Título */}
          <h3 className="font-inter fw-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>
            {title}
          </h3>

          {/* Botones */}
          <div className="d-flex align-items-center gap-2 mt-3">
            <Link
              href={href}
              className="btn shadow-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all text-decoration-none"
              style={{ backgroundColor: themeColor, color: '#fff' }}
            >
              <span className="font-inter fw-semibold small">Ver más</span>
              <i className="bi bi-info-circle-fill" />
            </Link>

            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn shadow-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all text-decoration-none"
                style={{ backgroundColor: themeColor, color: '#fff' }}
              >
                <span className="font-inter fw-semibold small">Cómo llegar</span>
                <i className="bi bi-geo-alt-fill" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
