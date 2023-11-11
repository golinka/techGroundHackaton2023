import Poliline from '@mapbox/polyline'

const EARTH_RADIUS = 6371

// to get distance between locations in km
export function getDistance({ from, to }) {
  const dLat = ((to.lat - from.lat) * Math.PI) / 180
  const dLon = ((to.lon - from.lon) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS * c
}

export function getMarkerDataByLocation({ lat, lon, properties = { title: 'Mapbox', description: 'Stairs' } }) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lat, lon],
    },
    properties,
  }
}

export function mapFlyTo({ map, coordinates }) {
  map.flyTo({
    center: coordinates,
    essential: true,
  })
}

export function getCoordinatesParamValue(coordinates) {
  return coordinates.map((arr) => arr.join(',')).join(';')
}

// Add direction route
export function addRoute({
  id = `route-${Math.random()}`,
  geometry,
  map,
  color = '#03AA46',
  borderWidth = 8,
}) {
  const geometryJSON = Poliline.toGeoJSON(geometry)
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: geometryJSON,
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': borderWidth,
      'line-opacity': 0.75,
    },
  })
  return id
}

// Add route marker
export function addRouteMarker({
  id = `route-id-${Math.random()}`,
  geometry,
  map,
  color = '#03AA46',
  borderWidth = 8,
}) {
  // const geometryJSON = Poliline.toGeoJSON(geometry)
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry,
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': borderWidth,
      'line-opacity': 0.75,
    },
  })
  return id
}

// getMatch(
//   coordinates.map((arr) => arr.join(',')).join(';'),
//   coordinates.map((i) => 5),
//   'walking',
//   token,
// )

// const getMatch = async (coordinates, radius, profile, token) => {
//   // Separate the radiuses with semicolons
//   const radiuses = radius.join(';')
//   // Create the query
//   const query = await fetch(
//     `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${token}`,
//     { method: 'GET' },
//   )
//   const response = await query.json()
//   // Handle errors
//   if (response.code !== 'Ok') {
//     alert(
//       `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`,
//     )
//     return
//   }
//   // Get the coordinates from the response
//   const coords = response.matchings[0].geometry
//   // Draw the route on the map
//   addRoute(coords)
// }

// const addRoute = (coords) => {
//   // If a route is already loaded, remove it
//   if (map.value.getSource('route')) {
//     map.value.removeLayer('route')
//     map.value.removeSource('route')
//   } else {
//     // Add a new layer to the map
//     map.value.addLayer({
//       id: 'route',
//       type: 'line',
//       source: {
//         type: 'geojson',
//         data: {
//           type: 'Feature',
//           properties: {},
//           geometry: coords,
//         },
//       },
//       layout: {
//         'line-join': 'round',
//         'line-cap': 'round',
//       },
//       paint: {
//         'line-color': '#03AA46',
//         'line-width': 8,
//         'line-opacity': 0.8,
//       },
//     })
//   }
// }
