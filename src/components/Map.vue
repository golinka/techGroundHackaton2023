<template>
  <div class="map">
    <MapboxMap
      :zoom="14"
      :access-token="token"
      :center="[30.618077, 50.439409]"
      :maxBounds="bounds"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      @mbCreated="(mapboxInstance) => (map = mapboxInstance)"
    >
    </MapboxMap>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN
const bounds = [
  [30.579776, 50.418376], // Southwest coordinates
  [30.65091, 50.46236], // Northeast coordinates
]
const map = ref()

// const addCurrentLocation = () => {
//   map.value.addControl(
//     new mapboxgl.GeolocateControl({
//       positionOptions: {
//         enableHighAccuracy: true,
//       },
//       // When active the map will receive updates to the device's location as it changes.
//       trackUserLocation: true,
//       // Draw an arrow next to the location dot to indicate which direction the device is heading.
//       showUserHeading: true,
//     }),
//   )
// }

const addRoute = (coords) => {
  // If a route is already loaded, remove it
  if (map.value.getSource('route')) {
    map.value.removeLayer('route')
    map.value.removeSource('route')
  } else {
    // Add a new layer to the map
    map.value.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: coords,
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#03AA46',
        'line-width': 8,
        'line-opacity': 0.8,
      },
    })
  }
}

const getMatch = async (coordinates, radius, profile, token) => {
  // Separate the radiuses with semicolons
  const radiuses = radius.join(';')
  // Create the query
  const query = await fetch(
    `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${token}`,
    { method: 'GET' },
  )
  const response = await query.json()
  // Handle errors
  if (response.code !== 'Ok') {
    alert(
      `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`,
    )
    return
  }
  // Get the coordinates from the response
  const coords = response.matchings[0].geometry
  // Draw the route on the map
  addRoute(coords)
}

const getDirection = async (profile, coordinates) => {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?access_token=${token}`,
    { method: 'GET' },
  )
  const directions = await query.json()
  map.value.addControl(directions, 'top-left')

  const excludedLocations = [{ lat: 30.617736, lon: 50.439641 }]

  const filteredWaypoints = directions.waypoints.filter((waypoint) => {
    return !excludedLocations.some((excluded) => {
      return excluded.lat === waypoint.lat && excluded.lon === waypoint.lon
    })
  })

  addRoute(filteredWaypoints.map((waypoint) => [waypoint.lon, waypoint.lat]))
}

onMounted(() => {
  const coordinates = [
    [30.616345, 50.438768],
    // [30.617542, 50.437224],
    // [30.620653, 50.438097],
    // [30.619486, 50.439765],
    [30.620735, 50.44015],
  ]
  //   getMatch(
  //     coordinates.map((arr) => arr.join(',')).join(';'),
  //     coordinates.map((i) => 5),
  //     'walking',
  //     token,
  //   )

  //   getDirection('walking', coordinates.map((arr) => arr.join(',')).join(';'))
})
</script>

<style lang="sass">
.map
    width: 100%
    height: 100%

    .mapboxgl-map
        width: 100%
        height: 100%
</style>
