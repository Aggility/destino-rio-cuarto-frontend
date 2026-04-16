/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de MapLibre (Spherical Law of Cosines).
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number|null} Distancia en metros o null si los datos son inválidos
 */
export function getDistance(lat1, lon1, lat2, lon2) {
    const l1 = parseFloat(lat1);
    const n1 = parseFloat(lon1);
    const l2 = parseFloat(lat2);
    const n2 = parseFloat(lon2);

    if (isNaN(l1) || isNaN(n1) || isNaN(l2) || isNaN(n2)) return null;

    const R = 6371000; // Radio de la Tierra en metros (Estándar MapLibre)
    const rad = Math.PI / 180;
    
    const lat1Rad = l1 * rad;
    const lat2Rad = l2 * rad;
    
    const a = Math.sin(lat1Rad) * Math.sin(lat2Rad) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos((n2 - n1) * rad);

    // Clamp value between -1 and 1 to avoid NaN from rounding errors in acos
    const maxA = Math.max(-1, Math.min(1, a));
    
    return R * Math.acos(maxA);
}

/**
 * Filtra una lista de ubicaciones basándose en una ubicación central y un radio.
 * @param {Object} center - {lat, lng}
 * @param {Array} locations - Array de objetos que contienen lat y lng
 * @param {number} radiusInMeters - Radio máximo
 * @returns {Array} - Localizaciones dentro del radio, ordenadas por cercanía
 */
export function getNearbyLocations(center, locations, radiusInMeters = 500) {
    if (!center || !center.lat || !center.lng) return [];
    
    return locations
        .map(loc => ({
            ...loc,
            distance: getDistance(center.lat, center.lng, parseFloat(loc.lat), parseFloat(loc.lng))
        }))
        .filter(loc => loc.distance <= radiusInMeters)
        .sort((a, b) => a.distance - b.distance);
}
