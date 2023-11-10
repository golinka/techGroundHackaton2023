<template>
  <div class="top-menu-container">
    <input />
    <button>
      <img :src="filterIcon" />
    </button>
    <button>
      <img :src="directionIcon" />
    </button>

  </div>
  <div ref="mapContainer" class="map-container">
  </div>
  <div v-if="true">
    <Filter/>
  </div>

</template>

<script>

import mapboxgl from "mapbox-gl";
import Filter from './Filter.vue'
import filterIcon from '../assets/icons/filter-icon.svg'
import directionIcon from '../assets/icons/direction-icon.svg'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsYXRzeW5za2FodiIsImEiOiJjbG9za3EwdGEwMTh6MnFxZDl6Z3dpYjFvIn0.UjAVktEuENwTFl7kz9t2tw'

export default {
  components: {
    Filter
  },
  setup() {
    return {
      filterIcon,
      directionIcon
    }
  },

  mounted() {
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
      center: [30.523333, 50.450001],
      zoom: 12,
    });
//Pop up
//     map.on('load', () => {
//       map.addSource('places', {
// This GeoJSON contains features that include an "icon"
// property. The value of the "icon" property corresponds
// to an image in the Mapbox Streets style's sprite.
//         'type': 'geojson',
//         'data': {
//           'type': 'FeatureCollection',
//           'features': [
//             {
//               'type': 'Feature',
//               'properties': {
//                 'description':
//                     '<div class="popup-container"><strong >Make it Mount Pleasant</strong></div>',
//                 'icon': 'theatre'
//               },
//               'geometry': {
//                 'type': 'Point',
//                 'coordinates': [30.523333, 50.450001]
//               }
//             },
//           ]
//         }
//       });
// // Add a layer showing the places.
//       map.addLayer({
//         'id': 'places',
//         'type': 'symbol',
//         'source': 'places',
//         'layout': {
//           'icon-image': ['get', 'icon'],
//           'icon-allow-overlap': true
//         }
//       });
//
// // When a click event occurs on a feature in the places layer, open a popup at the
// // location of the feature, with description HTML from its properties.
//       map.on('click', 'places', (e) => {
// // Copy coordinates array.
//         const coordinates = e.features[0].geometry.coordinates.slice();
//         const description = e.features[0].properties.description;
//
// // Ensure that if the map is zoomed out such that multiple
// // copies of the feature are visible, the popup appears
// // over the copy being pointed to.
//         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//           coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//         }
//
//         new mapboxgl.Popup()
//             .setLngLat(coordinates)
//             .setHTML(description)
//             .addTo(map);
//       });
//
// // Change the cursor to a pointer when the mouse is over the places layer.
//       map.on('mouseenter', 'places', () => {
//         map.getCanvas().style.cursor = 'pointer';
//       });
//
// // Change it back to a pointer when it leaves.
//       map.on('mouseleave', 'places', () => {
//         map.getCanvas().style.cursor = '';
//       });
//     });

    this.map = map;
  },

  unmounted() {
    this.map.remove();
    this.map = null;
  }
};


</script>

<style>
.map-container {
  position: relative;
  flex: 1;
}

.popup-container {
  border: 1px solid orange;
}
</style>