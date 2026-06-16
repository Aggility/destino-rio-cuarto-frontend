import React from 'react';

/**
 * ContextualInfoBanner - Destino Río Cuarto
 * Muestra información contextual del visitante: clima actual y avisos importantes.
 * Props vienen del campo `contextual_info` del endpoint /api/v1/home.
 */
export default function ContextualInfoBanner({ segment = 'turista', clima = '', avisos = [] }) {
  // Parsear temperatura desde string tipo "Despejado, 24°C"
  const parts = clima ? clima.split(',') : [];
  const condition = parts[0]?.trim() || '';
  const temp = parts[1]?.trim() || '';

  // Icono dinámico según condición climática
  const weatherIcon = () => {
    const lower = condition.toLowerCase();
    if (lower.includes('lluv') || lower.includes('llovi')) return 'bi-cloud-rain-fill';
    if (lower.includes('nublado') || lower.includes('nube')) return 'bi-cloud-fill';
    if (lower.includes('parcial')) return 'bi-cloud-sun-fill';
    if (lower.includes('tormenta')) return 'bi-cloud-lightning-rain-fill';
    if (lower.includes('nieve')) return 'bi-cloud-snow-fill';
    return 'bi-sun-fill'; // despejado por defecto
  };

  const segmentLabel = {
    turista: 'Turista',
    residente: 'Residente',
    visitante: 'Visitante',
  }[segment] || 'Visitante';

  const segmentColor = {
    turista: '#f54286',
    residente: '#8a38f5',
    visitante: '#ff5a1f',
  }[segment] || '#f54286';

  if (!clima && avisos.length === 0) return null;

  return (
    <div
      className="font-inter w-100"
      style={{ marginBottom: '8px' }}
    >
      <div
        className="rounded-4 px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Clima */}
        {clima && (
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '46px',
                height: '46px',
                background: 'rgba(245,66,134,0.15)',
                border: '1px solid rgba(245,66,134,0.3)',
                flexShrink: 0,
              }}
            >
              <i
                className={`bi ${weatherIcon()}`}
                style={{ fontSize: '20px', color: '#f54286' }}
              />
            </div>
            <div>
              <p className="mb-0 text-white fw-bold" style={{ fontSize: '16px', lineHeight: 1.2 }}>
                {temp || condition}
              </p>
              {temp && (
                <p className="mb-0" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                  {condition} · Río Cuarto
                </p>
              )}
            </div>
          </div>
        )}

        {/* Badge segmento + avisos */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Badge segmento */}
          <span
            className="px-3 py-1 rounded-pill fw-semibold"
            style={{
              fontSize: '12px',
              color: segmentColor,
              backgroundColor: `${segmentColor}18`,
              border: `1px solid ${segmentColor}40`,
              letterSpacing: '0.3px',
            }}
          >
            {segmentLabel}
          </span>

          {/* Avisos */}
          {avisos.length > 0 && avisos.map((aviso, idx) => (
            <span
              key={idx}
              className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill"
              style={{
                fontSize: '12px',
                color: '#ff5a1f',
                backgroundColor: 'rgba(255,90,31,0.12)',
                border: '1px solid rgba(255,90,31,0.3)',
              }}
            >
              <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '11px' }} />
              {aviso}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
