const EARTH_RADIUS = 6371

// to get distance between locations in km
export function getDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS * c
}

export function getMarkerDataByLocation(
  lat,
  lon,
  properties = { title: 'Mapbox', description: 'Stairs' },
) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lat, lon],
    },
    properties,
  }
}
