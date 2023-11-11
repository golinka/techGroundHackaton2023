<template>
  <div class="map">
    <div class="map__search">
      <SearchBlock @choose="onSearchPlaceChoosen" />
    </div>
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
        @mbClear="choosenPlace = null"
      /> -->

      <!-- zoom in / zoom out controls -->
      <MapboxNavigationControl
        position="bottom-right"
        @vue:mounted="onUSerLocationMounted"
      />

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
        v-if="choosenPlace"
        :name="choosenPlace.place_name"
        :coordinates="choosenPlace.center"
        :location="(choosenPlace.context || []).map((i) => i.text).join(', ')"
        @direction="onGetDirectionToSearchResult"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
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
  mapFlyTo,
} from '../../helpers/map'
import SearchResultBlock from '../map/components/SearchResultBlock.vue'
import SearchBlock from '../map/components/SearchBlock.vue'
import { getMapDirection, getMapObjects } from '../../api/map'
import { ACCESSIBILITY_OBJECTS_KEY } from '../../consts'

const BASE_ROUTE_TYPE = 'base'
const SUGGESTED_ROUTE_TYPE = 'suggested'
const SHOW_USER_LOCATION_DELAY = 500

const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN
const map = ref()
const mapObjects = ref([])
const routes = ref([])
const userLocation = ref(null)

const choosenPlace = ref(null)
const choosenPlaceMarker = ref(null)

// const from = [30.619905, 50.437924]
// const to = [30.61975, 50.441853]

const baseRoute = computed(() =>
  routes.value.find((route) => route.type === BASE_ROUTE_TYPE),
)
const suggestedRoute = computed(() =>
  routes.value.find((route) => route.type === SUGGESTED_ROUTE_TYPE),
)
const accessibilityObjects = computed(() =>
  mapObjects.value.filter((obj) => obj.type === ACCESSIBILITY_OBJECTS_KEY),
)

const onUSerLocationMounted = () => {
  setTimeout(() => {
    const userLocationEl = document.querySelector('.mapboxgl-ctrl-geolocate')
    if (userLocationEl) {
      userLocationEl.click()
    }
  }, SHOW_USER_LOCATION_DELAY)
}

const redRouteColor = '#f05454'
const greenRouteColor = '#6fba71'

const onUserLocationUpdated = (data) => {
  data.target.options.geolocation.getCurrentPosition((dataPostion) => {
    userLocation.value = dataPostion.coords
  })
}

const onGetDirectionToSearchResult = async (to) => {
  choosenPlace.value = null
  const from = [userLocation.value.longitude, userLocation.value.latitude]
  mapFlyTo({ map: map.value, coordinates: from })

  renderSmartRoutes(from, to)
}

const onSearchPlaceChoosen = (place) => {
  choosenPlace.value = place

  if (choosenPlaceMarker.value && choosenPlaceMarker.value.remove) {
    choosenPlaceMarker.value.remove()
  }

  choosenPlaceMarker.value = new mapboxgl.Marker({ color: '#5076FE' })
    .setLngLat(place.center)
    .addTo(map.value)

  mapFlyTo({ map: map.value, coordinates: place.center })
}

const onMapCreated = async (mapboxInstance) => {
  map.value = mapboxInstance
}

const renderSmartRoutes = async (from, to) => {
  const directions = await getMapDirection({
    profile: 'walking',
    coordinates: getCoordinatesParamValue([from, to]),
    params: {
      access_token: token,
    },
  })

  directions.routes.forEach(async (route) => {
    const { route: newRoute, places } = await useAccessibilityRoute({
      profile: 'walking',
      route,
      accessibilityPlaces: accessibilityObjects.value,
      thresholdDistance: 200,
    })

    // base route
    if (baseRoute.value) {
      map.value.removeLayer(baseRoute.value.id)
    }

    const baseRouteId = addRoute({
      id: '123',
      map: map.value,
      geometry: route.geometry,
      color: greenRouteColor,
    })
    routes.value.push({
      type: BASE_ROUTE_TYPE,
      id: baseRouteId,
    })

    // suggested route
    if (suggestedRoute.value) {
      map.value.removeLayer(suggestedRoute.value.id)
    }

    const suggestedRouteId = addRoute({
      id: '123123123123',
      map: map.value,
      geometry: newRoute.geometry,
      color: redRouteColor,
    })
    routes.value.push({
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
    mapObjects.value = data

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

    // renderSmartRoute()
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

    &__search
        width: 300px
        position: absolute
        top: 0px
        left: 0px
        padding: 10px
        z-index: 10

        @media screen and (max-width: 767px)
            width: 100%

    &__found
        position: absolute
        bottom: 0
        left: 0
        padding: 10px
        z-index: 10

        @media screen and (max-width: 767px)
            .search-result-block
                width: 100%

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
