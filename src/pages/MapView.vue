<template>
  <div class="mapview-wrapper">
    <div class="map-nav">
      <div class="map-nav-buttons-wrapper">
        <div class="map-nav-buttons">
          <button
            :class="`switcher${mapView === 'heat' ? ' btn-selected' : ''}`"
            @click="toggleMapView('heat')"
          >
            Heatmap
          </button>
          <button
            :class="`switcher${mapView === 'route' ? ' btn-selected' : ''}`"
            @click="toggleMapView('route')"
          >
            Routemap
          </button>
        </div>
      </div>
      <button class="settings" @click="openModal()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-settings"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#555"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
    <div id="map" class="map" ref="map"></div>
    <div v-if="loading" class="loading-wrapper">
      <loader />
    </div>
  </div>
  <modal :open="modalOpen" @closeModal="closeModal" />
</template>

<script>
import { logout, getActivities } from '../services'
import polylineUtil from '@mapbox/polyline'
import Modal from '../components/Modal.vue'
import Loader from '../components/Loader.vue'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

export default {
  name: 'MapView',
  components: {
    Modal,
    Loader,
  },
  data() {
    return {
      activityNames: [],
      map: null,
      latLngArray: [],
      polylineArray: [],
      markersArray: [],
      heatmap: null,
      mapView: 'heat',
      modalOpen: null,
      firstModal: null,
      loading: false,
    }
  },
  methods: {
    openModal() {
      this.modalOpen = true
    },
    closeModal(mapData) {
      if (mapData) {
        this.polylineArray = []
        this.latLngArray = []
        this.activityNames = []
        this.markersArray = []
        this.$store.dispatch('storeMapData', mapData)
        this.loadMap()
      }
      this.modalOpen = false
    },
    addMarker(name, i) {
      // Create the markers.
      let position = [
        this.polylineArray[i].startCoords.lat,
        this.polylineArray[i].startCoords.lng,
      ]
      var el = document.createElement('div')
      var img = document.createElement('div')
      el.className = 'marker'
      el.appendChild(img)
      let marker = new mapboxgl.Marker(el)
        .setLngLat(position)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<h3 style="margin: 0;">' + name + '</h3>')
        )
        .addTo(this.map)
      this.markersArray.push(marker)
    },
    toggleMapView(view) {
      if (view === 'route') {
        if (this.mapView === 'heat') {
          this.mapView = 'route'
          this.map.removeLayer('heatmap')
          this.buildRouteMap()
        }
      } else {
        if (this.mapView === 'route') {
          this.mapView = 'heat'
          for (let i = 0; i < this.polylineArray.length; i++) {
            this.polylineArray[i].removePoly()
          }
          for (let i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].remove()
          }
          this.addHeatMap()
        }
      }
    },
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
    loadMap() {
      this.loading = true
      let beforeDate = this.$store.state.mapData.beforeDate
      let numActivities = this.$store.state.mapData.numActivities
      getActivities(1, beforeDate, numActivities)
        .then((res) => {
          try {
            res.forEach((activity) =>
              activity.map.summary_polyline
                ? this.activityNames.push(activity.name)
                : null
            )
            this.loading = false
            mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN
            this.map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [res[0].start_latlng[1], res[0].start_latlng[0]],
              zoom: 10,
            })
          } catch (e) {
            console.log(e)
            alert(
              'There was an error loading Mapbox, please refresh your page.'
            )
          }
          if (res) this.$store.dispatch('storeActivities', res)
          this.map.on(
            'load',
            function() {
              this.buildPathArray(res)
            }.bind(this)
          )
        })
        .catch((error) => console.log(error))
    },
    buildPathArray(activities) {
      activities.forEach((activity, i) => {
        activity.map.summary_polyline
          ? this.buildPath(activity.map.summary_polyline, i)
          : null
      })
      let heatMapData = { type: 'FeatureCollection', features: [] }
      this.latLngArray.forEach((coord) => {
        heatMapData.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
        })
      })
      this.map.addSource('heatmap', {
        type: 'geojson',
        data: heatMapData,
      })
      this.mapView === 'heat' ? this.addHeatMap() : this.buildRouteMap()
    },
    buildPath(polyline, i) {
      let latLngArr = []
      let geoJSON = polylineUtil.toGeoJSON(polyline)
      this.map.addSource('route-' + i, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geoJSON,
        },
      })
      this.polylineArray.push({
        setPoly: () => {
          this.map.addLayer({
            id: 'route-' + i,
            type: 'line',
            source: 'route-' + i,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#000000'.replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16)
              }),
              'line-width': 5,
            },
          })
        },
        removePoly: () => this.map.removeLayer('route-' + i),
        startCoords: {
          lat: geoJSON.coordinates[0][0],
          lng: geoJSON.coordinates[0][1],
        },
      })
      geoJSON.coordinates.forEach((coords) => {
        latLngArr.push([coords[0], coords[1]])
      })
      this.latLngArray = [...this.latLngArray, ...latLngArr]
    },
    buildRouteMap() {
      this.activityNames.forEach((name, i) => {
        this.addMarker(name, i)
      })
      for (let i = 0; i < this.polylineArray.length; i++) {
        this.polylineArray[i].setPoly()
      }
    },
    addHeatMap() {
      this.map.addLayer({
        id: 'heatmap',
        type: 'heatmap',
        source: 'heatmap',
        paint: {
          'heatmap-intensity': {
            stops: [
              [11, 0.1],
              [15, 0.1],
            ],
          },
          'heatmap-radius': 8,
        },
      })
    },
  },
  mounted() {
    if (!this.$store.state.mapData) {
      this.openModal()
    } else {
      this.loadMap()
    }
  },
}
</script>

<style>
.marker {
  width: 30px;
  height: 80px;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}
.marker > div {
  background-image: url('../assets/marker.png');
  background-size: cover;
  width: 30px;
  height: 40px;
  border-radius: 50%;
}
.mapboxgl-popup {
  max-width: 200px;
}
.mapboxgl-popup-content {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  padding: 10px 20px;
}
</style>
<style scoped>
.mapview-wrapper {
  height: 100%;
}
.map-nav {
  display: flex;
}
.map-nav-buttons-wrapper {
  display: flex;
  width: 100%;
}
.map-nav-buttons {
  display: flex;
  width: 100%;
}
.switcher {
  width: 50%;
  height: 40px;
  border: none;
  font-weight: 500;
  background-color: #efefef;
}
.map-nav-buttons > .btn-selected {
  color: white;
  background-color: #ff5d17;
}
.map {
  margin: 0 auto;
}
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  background-color: #efefef;
}
@media only screen and (min-width: 751px) {
  .mapview-wrapper {
    height: 100%;
    margin-left: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .map-nav {
    width: 100%;
    margin: 0 auto;
  }
  .map-nav-buttons {
    flex: 9;
    margin: 0 auto;
    width: 100%;

    max-width: 600px;
  }
  .switcher {
    flex: 1;
    width: 50%;
    height: 40px;
    border: none;
    font-weight: 500;
    background-color: #efefef;
  }
  .map {
    height: 100%;
    width: 100%;
  }
  .loading-wrapper {
    position: absolute;
    top: 0;
    left: 80px;
    height: 100%;
    width: calc(100% - 80px);
  }
}
@media only screen and (max-width: 750px) {
  .map-nav {
    width: 100%;
  }
  .map {
    height: calc(100% - 90px);
    width: 100%;
  }
  .loading-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    height: calc(100% - 90px);
    width: 100%;
  }
}
h1 {
  margin: 0;
  color: #fc4c02;
  font-family: 'Montserrat', sans-serif;
}
img {
  border-radius: 50%;
  -webkit-box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
  box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
}
button {
  display: block;
  margin: 0 auto;
}
</style>
