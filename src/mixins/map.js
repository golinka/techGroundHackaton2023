import mapboxgl from 'mapbox-gl'
import Poliline from '@mapbox/polyline'
import { getMapDirection } from '../api/map'
import { getCoordinatesParamValue, getDistance } from '../helpers/map'

const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN

export function useMarker({ marker, map, popup, className = 'marker' }) {
  const el = document.createElement('div')
  el.className = className

  const popupAttributes = (popup?.attributes || []).map((attr) => attr.type)
  const popupContent = `
    <div class="h6">${popup?.title}</div>
    <p>${popup?.address}</p>
    <div>Елементи доступності:</div>
    <div class="text-capitalize">${popupAttributes.join(', ')}</div>
  `

  const mapPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

  const mapMarker = new mapboxgl.Marker(el).setLngLat(
    marker.geometry.coordinates,
  )

  if (popup) {
    mapMarker.setPopup(mapPopup)
  }

  return mapMarker.addTo(map)
}

export async function useAccessibilityRoute({
  profile = 'walking',
  route,
  accessibilityPlaces,
}) {
  const geometry = Poliline.toGeoJSON(route.geometry)
  const from = geometry.coordinates[0]
  const to = geometry.coordinates[geometry.coordinates.length - 1]

  const validAccessibilityPlaces = accessibilityPlaces.filter((place) => {
    let isNearToRoute = false
    for (let i = 0; i < geometry.coordinates.length; i++) {
      const routePlace = geometry.coordinates[i]
      const distanceBetweenInMeters =
        (getDistance(...place, ...routePlace) || 0) * 1000
      if (distanceBetweenInMeters < 200) {
        isNearToRoute = true
        break
      }
    }
    return isNearToRoute
  })

  // accessibilityPlacesOnTheRoad.forEach((marker) =>
  //   useMarker(getMarkerDataByLocation(...marker), map.value, 'marker-red'),
  // )

  const newDirection = await getMapDirection({
    profile,
    coordinates: getCoordinatesParamValue([
      from,
      ...validAccessibilityPlaces,
      to,
    ]),
    params: {
      exclude: 'ferry',
      access_token: token,
    },
  })

  return {
    route: (newDirection.routes || [])[0],
    places: validAccessibilityPlaces,
  }
}
