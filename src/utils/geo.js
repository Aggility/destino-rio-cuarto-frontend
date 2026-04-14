/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine.
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} Distancia en metros
 */
export function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
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
