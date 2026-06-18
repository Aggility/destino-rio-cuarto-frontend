'use client';

import React, { useState } from 'react';

/**
 * ExpandableDescription - Destino Río Cuarto
 * Renderiza HTML enriquecido proveniente del editor WYSIWYG del admin.
 * Acepta `htmlContent` (string HTML) o `fullDescription` (array de strings HTML, retrocompatible).
 * Muestra truncado a 3 líneas por defecto y permite expandir con "Ver más".
 */
export default function ExpandableDescription({ htmlContent, fullDescription, color = '#1a56db' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compatibilidad con el formato antiguo (array de strings) y el nuevo (string HTML)
  let rawHtml = '';
  if (htmlContent) {
    rawHtml = htmlContent;
  } else if (fullDescription && Array.isArray(fullDescription)) {
    rawHtml = fullDescription.join('');
  } else if (typeof fullDescription === 'string') {
    rawHtml = fullDescription;
  }

  if (!rawHtml || rawHtml.trim() === '') return null;

  return (
    <div className="description-content font-inter text-gray-700 mb-5" style={{ lineHeight: '1.7' }}>
      {/* Estilos prose para el HTML del editor */}
      <style>{`
        .rich-text-content p {
          margin-bottom: 0.85rem;
        }
        .rich-text-content p:last-child {
          margin-bottom: 0;
        }
        .rich-text-content ul,
        .rich-text-content ol {
          padding-left: 1.4rem;
          margin-bottom: 0.85rem;
        }
        .rich-text-content li {
          margin-bottom: 0.3rem;
        }
        .rich-text-content strong,
        .rich-text-content b {
          font-weight: 700;
          color: #1a1a2e;
        }
        .rich-text-content em,
        .rich-text-content i {
          font-style: italic;
        }
        .rich-text-content a {
          color: #1a56db;
          text-decoration: underline;
          word-break: break-all;
        }
        .rich-text-content a:hover {
          opacity: 0.8;
        }
        .rich-text-content h2,
        .rich-text-content h3 {
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .rich-text-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .rich-text-content table td,
        .rich-text-content table th {
          border: 1px solid #e5e7eb;
          padding: 0.4rem 0.6rem;
        }
        .rich-text-content br {
          display: block;
          content: '';
          margin-top: 0.3rem;
        }
        /* Wrapper para truncar */
        .rich-text-collapsed {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rich-text-expanded {
          display: block;
        }
      `}</style>

      <div
        className={`rich-text-content ${isExpanded ? 'rich-text-expanded' : 'rich-text-collapsed'}`}
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-link p-0 fw-bold text-decoration-none mt-3 border-0 shadow-none"
        style={{ color: color }}
        type="button"
      >
        {isExpanded ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  );
}
