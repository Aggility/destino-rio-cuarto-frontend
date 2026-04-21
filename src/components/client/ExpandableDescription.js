'use client';

import React, { useState } from 'react';

/**
 * ExpandableDescription - Destino Río Cuarto
 * Muestra el texto de descripción truncado a 3 líneas y permite expandirlo.
 */
export default function ExpandableDescription({ fullDescription }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!fullDescription || fullDescription.length === 0) return null;

  return (
    <div className="description-content font-inter text-gray-600 fs-5 mb-5" style={{ lineHeight: '1.6' }}>
      <div 
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out'
        }}
        className="description-text-wrapper"
      >
        {fullDescription.map((para, idx) => (
          <p key={idx} className={idx === 0 ? 'mb-4 text-gray-900 fw-medium' : 'mb-3'}>
            {para}
          </p>
        ))}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-link p-0 fw-medium text-decoration-underline mt-2 border-0 shadow-none"
        style={{ color: '#1a56db' }}
        type="button"
      >
        {isExpanded ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  );
}
