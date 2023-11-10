import mapboxgl from 'mapbox-gl'

export function useMarker(marker, map, className = 'marker') {
  const el = document.createElement('div')
  el.className = className

  return new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map)
}
