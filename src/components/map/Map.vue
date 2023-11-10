<template>
  <div class="map">
    <!-- :maxBounds="bounds" -->
    <MapboxMap
      :zoom="14"
      :accessToken="token"
      :center="[30.618077, 50.439409]"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      @mbCreated="onMapCreated"
    >
      <MapboxGeocoder
        @mbCreated="onGeocoderCreated"
        @mbResult="onSearchResult"
        @mbClear="searchResult = null"
      />
      <MapboxGeolocateControl
        position="bottom-right"
        :positionOptions="{ enableHighAccuracy: true }"
        :trackUserLocation="true"
        :showUserHeading="true"
        :showUserLocation="true"
        @mbTrackuserlocationstart="onUserLocationUpdated"
      />
    </MapboxMap>

    <div class="map__found">
      <SearchResultBlock
        v-if="searchResult"
        :name="searchResult.place_name"
        :coordinates="searchResult.center"
        :location="(searchResult.context || []).map((i) => i.text).join(', ')"
        @direction="onGetDirectionToSearchResult"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css'
import mapboxgl from 'mapbox-gl'
import Poliline from '@mapbox/polyline'
import {
  MapboxMap,
  MapboxGeocoder,
  MapboxGeolocateControl,
} from '@studiometa/vue-mapbox-gl'
import { useMarker } from '../../mixins/map'
import { getMarkerDataByLocation, getDistance } from '../../helpers/map'
import SearchResultBlock from '../map/components/SearchResultBlock.vue'

const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN
const bounds = [
  [30.579776, 50.418376], // Southwest coordinates
  [30.65091, 50.46236], // Northeast coordinates
]
const map = ref()
const control = ref()
const searchResult = ref(null)
const userLocation = ref(null)

const from = [30.616381, 50.438735]
const to = [30.61975, 50.441853]

const places = [
  [30.616152, 50.439357],
  [30.616021, 50.4396],
  [30.614574, 50.441341],
  [30.6169, 50.441986],
  [30.61913, 50.442613],
]

const randomPlaces = [
  [30.611355, 50.442239],
  [30.619494, 50.44477],
  [30.62251, 50.438532],
  [30.627634, 50.439708],
  [30.628366, 50.44205],
]

const redRouteColor = '#f05454'
const greenRouteColor = '#6fba71'

const geojson = {
  type: 'FeatureCollection',
  features: places.map((place) => getMarkerDataByLocation(...place)),
}

const onUserLocationUpdated = (data) => {
  data.target.options.geolocation.getCurrentPosition((dataPostion) => {
    console.log('getCurrentPosition >>>', dataPostion)
    userLocation.value = dataPostion.coords
  })
}

const onGetDirectionToSearchResult = async (to) => {
  const from = [userLocation.value.longitude, userLocation.value.latitude]
  const directions = await getDirection({
    profile: 'walking',
    coordinates: [from, to].map((arr) => arr.join(',')).join(';'),
    // exclude: excludedLocations
    //   .map((location) => `point(${location.lon},${location.lat})`)
    //   .join(';'),
    // waypoints: [from, ...places, to].map((arr) => arr.join(',')).join(';'),
    exclude: 'ferry',
    token: token,
  })

  directions.routes.forEach((route) => {
    addDirectionRoute(directions.uuid, route.geometry, greenRouteColor)
  })
}

const onSearchResult = (response) => {
  searchResult.value = response.result
  window.searchResult = searchResult
}

const onGeocoderCreated = (geocoderInstance) => {
  debugger
  control.value = geocoderInstance
  console.log('geocoderInstance >>', geocoderInstance)
}

const onMapCreated = async (mapboxInstance) => {
  map.value = mapboxInstance

  // markers.value = geojson.features.map((feature) =>
  //   useMarker(feature, map.value),
  // )

  // const coordinates = [
  //   [30.616345, 50.438768],
  //   // [30.617542, 50.437224],
  //   // [30.620653, 50.438097],
  //   // [30.619486, 50.439765],
  //   [30.620735, 50.44015],
  // ]

  const coordinates = [
    [30.616345, 50.438768],
    // [30.617542, 50.437224],
    // [30.620653, 50.438097],
    // [30.619486, 50.439765],
    [30.620494, 50.442593],
  ]
  // getMatch(
  //   coordinates.map((arr) => arr.join(',')).join(';'),
  //   coordinates.map((i) => 5),
  //   'walking',
  //   token,
  // )

  const excludedLocations = [
    // [ 30.616152, 50.439357 ],
    { lat: 30.616152, lon: 50.439357 },
    { lat: 30.618102, lon: 50.439292 },
  ]

  // randomPlaces.forEach((marker) =>
  //   useMarker(getMarkerDataByLocation(...marker), map.value, 'marker-red'),
  // )

  const directions = await getDirection({
    profile: 'walking',
    coordinates: [from, to].map((arr) => arr.join(',')).join(';'),
    // exclude: excludedLocations
    //   .map((location) => `point(${location.lon},${location.lat})`)
    //   .join(';'),
    // waypoints: [from, ...places, to].map((arr) => arr.join(',')).join(';'),
    exclude: 'ferry',
    token: token,
  })

  const routes = directions.routes

  // const filteredWaypoints = directions.waypoints.filter((waypoint) => {
  //   return !excludedLocations.some((excluded) => {
  //     return excluded.lat === waypoint.lat && excluded.lon === waypoint.lon
  //   })
  // })

  // const geomentry = {
  //   coordinates: filteredWaypoints.map((waypoint) => waypoint.location),
  //   type: 'LineString',
  // }

  routes.forEach((route) => {
    filterRoute(route)
    addDirectionRoute('123', route.geometry, greenRouteColor, 15)
  })

  addCurrentLocation()

  async function filterRoute(route) {
    const geometry = Poliline.toGeoJSON(route.geometry)
    const allPlaces = [...places, ...randomPlaces]

    const allValidPlaces = allPlaces.filter((place) => {
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

    allValidPlaces.forEach((marker) =>
      useMarker(getMarkerDataByLocation(...marker), map.value, 'marker-red'),
    )

    console.log('geometry.coordinates >>', geometry.coordinates)
    console.log('allValidPlaces >>', allValidPlaces)

    const newDirections = await getDirection({
      profile: 'walking',
      coordinates: [from, ...allValidPlaces, to]
        .map((arr) => arr.join(','))
        .join(';'),
      exclude: 'ferry',
      token: token,
    })

    const newRoutes = newDirections.routes

    newRoutes.forEach((route) => {
      addDirectionRoute('12345', route.geometry, redRouteColor)
    })
  }
}

const addCurrentLocation = () => {
  map.value.addControl(
    new mapboxgl.NavigationControl({ visualizePitch: true }),
    'bottom-right',
  )
}

function addDirectionRoute(id, geometryString, color = '#03AA46', width = 8) {
  const geometry = Poliline.toGeoJSON(geometryString)
  console.log('geometryString >>>', geometry)
  map.value.addLayer({
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
      'line-width': width,
      'line-opacity': 0.75,
    },
  })
}

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

const getDirection = async ({
  profile,
  coordinates,
  waypoints,
  exclude,
  token,
}) => {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?exclude=${exclude}&access_token=${token}`,
    { method: 'GET' },
  )
  return query.json()
}
</script>

<style lang="sass">
.map
    position: relative
    width: 100%
    height: 100%

    .mapboxgl-map
        width: 100%
        height: 100%

    &__found
      position: absolute
      bottom: 10px
      left: 10px
      z-index: 10

.marker
  background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png')
  background-size: cover
  width: 50px
  height: 50px
  border-radius: 50%
  cursor: pointer

.marker-red
  background-image: url('/marker.png')
  background-size: cover
  width: 50px
  height: 50px
  border-radius: 50%
  cursor: pointer
</style>
