/**
 * Parsea "YYYY-MM-DDTHH:MM:SSZ" o "YYYY-MM-DD" como fecha LOCAL.
 * Evita el desfase de un día que ocurre en zonas UTC- al usar new Date(string) directamente.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
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
