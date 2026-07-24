/**
 * Parsea "YYYY-MM-DDTHH:MM:SSZ" o "YYYY-MM-DD" como fecha LOCAL.
 * Evita el desfase de un día que ocurre en zonas UTC- al usar new Date(string) directamente.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Formatea "HH:MM:SS" → "HH:MM" (sin segundos). */
function fmtTime(timeStr) {
  if (!timeStr) return null;
  return timeStr.substring(0, 5);
}

/** Formatea una fecha como "7 jul" (día + mes corto). */
function fmtShort(dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

/** Formatea una fecha como "vie, 7 jul" (día semana + día + mes corto). */
function fmtMed(dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
}

/**
 * Formatea la fecha de un evento a partir de su primer calendario.
 * Retorna string estilo "lun, 7 de mar, 20:00hs" o "Fecha a confirmar".
 */
export function formatEventDate(evt) {
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
}

/**
 * Versión completa del formateo de fecha para tarjetas EventCard.
 * Maneja tres casos:
 *  - 1 calendar, mismo día      → "vie, 24 jul · 23:00hs"
 *  - 1 calendar, multi-día      → "24 – 25 jul · 23:00 – 02:00hs"
 *  - varios calendars           → "26 jul · 2 ago · ..." (primeras 2)
 */
export function formatEventDateFull(evt) {
  const cals = evt.calendars;
  if (!cals || cals.length === 0) return 'Fecha a confirmar';

  // Caso: múltiples funciones (varios calendars)
  if (cals.length > 1) {
    const activeCals = cals.filter(c => c.status !== 0);
    const sourceCals = activeCals.length > 0 ? activeCals : cals;
    const labels = sourceCals.slice(0, 2).map(c => fmtShort(c.start_date));
    if (sourceCals.length > 2) labels.push('...');
    return labels.join(' · ');
  }

  // Caso: un solo calendar
  const cal = cals[0];
  const startStr = cal.start_date?.split('T')[0];
  const endStr   = cal.end_date?.split('T')[0];
  const startTime = fmtTime(cal.start_time);
  const endTime   = fmtTime(cal.end_time);

  // Multi-día: start_date ≠ end_date
  if (endStr && endStr !== startStr) {
    const label = `${fmtShort(startStr)} – ${fmtShort(endStr)}`;
    if (startTime && endTime) return `${label} · ${startTime} – ${endTime}hs`;
    if (startTime)            return `${label} · desde ${startTime}hs`;
    return label;
  }

  // Mismo día
  const d = parseLocalDate(startStr);
  if (!d) return 'Fecha a confirmar';
  let str = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  if (startTime && endTime) str += ` · ${startTime} – ${endTime}hs`;
  else if (startTime)       str += ` · ${startTime}hs`;
  return str;
}

/**
 * Retorna información estructurada sobre la/s fecha/s de un evento
 * para usarla en la página de detalle (sección "Cuando").
 *
 * Retorna un objeto:
 *  {
 *    type: 'single' | 'multiday' | 'multishow',
 *    displayDate: string,          // etiqueta principal para mostrar
 *    endDate: string|null,         // solo en multiday
 *    startTime: string|null,
 *    endTime: string|null,
 *    schedules: Array<{            // solo en multishow
 *      dateLabel: string,
 *      startTime: string|null,
 *      endTime: string|null,
 *      observations: string|null,
 *    }>
 *  }
 */
export function getEventDateInfo(evt) {
  const cals = evt.calendars;
  if (!cals || cals.length === 0) {
    return { type: 'single', displayDate: 'Fecha a confirmar', startTime: null, endTime: null, schedules: [] };
  }

  // Caso multishow: varios calendars
  if (cals.length > 1) {
    const activeCals = cals.filter(c => c.status !== 0);
    const sourceCals = activeCals.length > 0 ? activeCals : cals;
    const schedules = sourceCals.map(c => ({
      dateLabel: fmtMed(c.start_date?.split('T')[0]),
      startTime: fmtTime(c.start_time),
      endTime: fmtTime(c.end_time),
      observations: c.observations || null,
    }));
    return {
      type: 'multishow',
      displayDate: `${sourceCals.length} funciones`,
      startTime: null,
      endTime: null,
      schedules,
    };
  }

  // Caso: un solo calendar
  const cal = cals[0];
  const startStr = cal.start_date?.split('T')[0];
  const endStr   = cal.end_date?.split('T')[0];
  const startTime = fmtTime(cal.start_time);
  const endTime   = fmtTime(cal.end_time);

  // Multi-día
  if (endStr && endStr !== startStr) {
    return {
      type: 'multiday',
      displayDate: fmtMed(startStr),
      endDate: fmtMed(endStr),
      startTime,
      endTime,
      schedules: [],
    };
  }

  // Mismo día (single)
  return {
    type: 'single',
    displayDate: fmtMed(startStr),
    endDate: null,
    startTime,
    endTime,
    schedules: [],
  };
}

