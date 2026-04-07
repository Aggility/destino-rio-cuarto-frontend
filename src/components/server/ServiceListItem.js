import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ServiceListItem - Destino Río Cuarto
 * Basado en Figma ID 3640:28534 (Service Data - Desktop)
 * Renderiza una fila de servicio con imagen, info y acciones.
 * Compatible con Server Components.
 */
export default function ServiceListItem({ 
  title = "3G Bebidas S.A.S", 
  category = "Tienda de Bebidas", 
  address = "Hipólito Irigoyen 3076, Río Cuarto", 
  phone = "358 475-4624",
  thumbnail = "/Thumbnail.png"
}) {
  return (
    <div className="service-list-item d-flex align-items-center mb-3">
      
      {/* 1. Thumbnail — Figma ID 3634:21116 (110x108) */}
      <div className="flex-shrink-0" style={{ width: '110px', height: '108px' }}>
        <img 
          src={thumbnail} 
          alt={title} 
          className="rounded-2 object-cover w-100 h-100 border border-light"
        />
      </div>

      {/* 2. Content Header & Info — Figma ID 3634:21117 */}
      <div className="flex-grow-1 ms-3 d-flex flex-column justify-content-between h-100 py-1">
        <div>
          <h3 className="font-inter fw-medium text-gray-900 mb-1" style={{ fontSize: '16px', lineHeight: '1.3' }}>
            {title}
          </h3>
          <span className="badge-primary-custom">
            {category}
          </span>
        </div>

        {/* 3. Data List — Figma ID 3634:21122 */}
        <div className="mt-2">
          <div className="d-flex align-items-start mb-1 gap-2">
            <i className="bi bi-geo-alt text-muted small mt-1"></i>
            <p className="font-inter text-gray-700 mb-0 text-decoration-underline" style={{ fontSize: '14px' }}>
              {address}
            </p>
          </div>
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-telephone text-muted small mt-1"></i>
            <p className="font-inter text-gray-700 mb-0" style={{ fontSize: '14px' }}>
              {phone}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Actions — Figma ID 3634:21126 */}
      <div className="d-flex align-items-center ms-auto gap-2 pe-1">
        <button className="btn btn-sm shadow-premium-subtle bg-white border border-light-subtle rounded-2 font-inter fw-medium" style={{ fontSize: '13px', color: '#0f172a', padding: '8px 12px' }}>
          Contactar <i className="bi bi-telephone-fill ms-1" style={{ fontSize: '11px' }}></i>
        </button>
        <button className="btn btn-sm shadow-premium-subtle bg-white border border-light-subtle rounded-2 font-inter fw-medium" style={{ fontSize: '13px', color: '#0f172a', padding: '8px 12px' }}>
          WhatsApp <i className="bi bi-whatsapp ms-1" style={{ fontSize: '12px' }}></i>
        </button>
        <div className="ms-3 text-muted opacity-50">
          <i className="bi bi-chevron-right" style={{ fontSize: '18px' }}></i>
        </div>
      </div>
    </div>
  );
}
