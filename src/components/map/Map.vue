<template>
  <div class="map">
    <MapboxMap
      :zoom="14"
      :interactive="true"
      :accessToken="token"
      :center="[30.618077, 50.439409]"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      @mbCreated="onMapCreated"
    >
      <!-- <MapboxGeocoder
        @mbCreated="onGeocoderCreated"
        @mbResult="onSearchResult"
        @mbClear="searchResult = null"
      /> -->

      <!-- zoom in / zoom out controls -->
      <MapboxNavigationControl position="bottom-right" />

      <!-- user location controls -->
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
import { ref, computed, onMounted } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css'
import {
  MapboxMap,
  MapboxGeocoder,
  MapboxGeolocateControl,
  MapboxNavigationControl,
} from '@studiometa/vue-mapbox-gl'
import { useMarker, useAccessibilityRoute } from '../../mixins/map'
import {
  getMarkerDataByLocation,
  addRoute,
  getCoordinatesParamValue,
} from '../../helpers/map'
import SearchResultBlock from '../map/components/SearchResultBlock.vue'
import { getMapDirection, getMapObjects } from '../../api/map'

const BASE_ROUTE_TYPE = 'base'
const SUGGESTED_ROUTE_TYPE = 'suggested'

const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN
const map = ref()
const routes = ref([])
const searchResult = ref(null)
const userLocation = ref(null)

const from = [30.619905, 50.437924]
const to = [30.61975, 50.441853]

const baseRoute = computed(() =>
  routes.value.find((route) => route.type === BASE_ROUTE_TYPE),
)
const suggestedRoute = computed(() =>
  routes.value.find((route) => route.type === SUGGESTED_ROUTE_TYPE),
)

// const onSearchResult = (response) => {
//   searchResult.value = response.result
//   window.searchResult = searchResult
// }

// const onGeocoderCreated = (geocoderInstance) => {
//   debugger
//   control.value = geocoderInstance
//   console.log('geocoderInstance >>', geocoderInstance)
// }

// custom direction
// map.value.addControl(
//   new MapboxDirections({
//     accessToken: token,
//   }),
//   'top-left',
// )

const accessibilityPlaces = [
  [30.616152, 50.439357],
  [30.616021, 50.4396],
  [30.614574, 50.441341],
  [30.6169, 50.441986],
  [30.61913, 50.442613],
]

const redRouteColor = '#f05454'
const greenRouteColor = '#6fba71'

const onUserLocationUpdated = (data) => {
  data.target.options.geolocation.getCurrentPosition((dataPostion) => {
    console.log('getCurrentPosition >>>', dataPostion)
    userLocation.value = dataPostion.coords
  })
}

const onGetDirectionToSearchResult = async (to) => {
  const from = [userLocation.value.longitude, userLocation.value.latitude]
  const directions = await getMapDirection({
    profile: 'walking',
    coordinates: getCoordinatesParamValue([from, to]),
    params: {
      exclude: 'ferry',
      access_token: token,
    },
  })

  directions.routes.forEach((route) => {
    addRoute({
      id: directions.uuid,
      map: map.value,
      geometry: route.geometry,
      color: greenRouteColor,
    })
  })
}

const onMapCreated = async (mapboxInstance) => {
  map.value = mapboxInstance

  const directions = await getMapDirection({
    profile: 'walking',
    coordinates: getCoordinatesParamValue([from, to]),
    params: {
      exclude: 'ferry',
      access_token: token,
    },
  })

  const routes = directions.routes

  routes.forEach(async (route) => {
    const { route: newRoute, places } = await useAccessibilityRoute({
      profile: 'walking',
      route,
      accessibilityPlaces,
      thresholdDistance: 1000
    })

    // base route
    const baseRouteId = addRoute({
      id: '123',
      map: map.value,
      geometry: route.geometry,
      color: greenRouteColor,
    })
    routes.push({
      type: BASE_ROUTE_TYPE,
      id: baseRouteId,
    })

    // suggested route
    const suggestedRouteId = addRoute({
      id: '123123123123',
      map: map.value,
      geometry: newRoute.geometry,
      color: redRouteColor,
    })
    routes.push({
      type: SUGGESTED_ROUTE_TYPE,
      id: suggestedRouteId,
    })

    places.forEach(([lat, lon]) => {
      useMarker({
        marker: getMarkerDataByLocation({ lat, lon }),
        map: map.value,
        className: 'marker-red',
      })
    })
  })
}

const renderMapObjects = async () => {
  try {
    const { data } = await getMapObjects({ limit: 10000 })

    if (!data) {
      throw new Error('Data is not exist')
    }

    window.data = data

    data.forEach((mapObject) => {
      useMarker({
        marker: getMarkerDataByLocation({
          lat: mapObject.longitude,
          lon: mapObject.latitude,
        }),
        popup: {
          title: mapObject.title,
          address: [
            mapObject.street_name,
            mapObject.building,
            mapObject.city,
          ].join(', '),
          attributes: mapObject.attributes,
        },
        map: map.value,
        className: 'marker-red',
      })
    })
  } catch (err) {
    console.error('Map: renderMapObjects - ')
  }
}

// {
//   attributes: []
//   building: '12A'
//   campus: null
//   city: 'Kyiv'
//   id: 1
//   is_default: false
//   latitude: '50.43210162'
//   longitude: '30.62283928'
//   phone: null
//   street_name: 'Березнева'
//   street_type: 'street'
//   title: 'Сільпо'
//   type: 'supermarket'
//   website: null
// }

onMounted(() => {
  renderMapObjects()
})
</script>

<style lang="sass">
.map
    position: relative
    width: 100%
    height: 100%

    .mapboxgl-map
        width: 100%
        height: 100%

    .mapboxgl-ctrl-geocoder
        width: 100%

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
