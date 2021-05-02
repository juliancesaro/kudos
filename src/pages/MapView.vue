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
    <div class="map" ref="map"></div>
  </div>
  <modal :open="modalOpen" @closeModal="closeModal" />
</template>

<script>
import { logout, getActivities } from '../services'
import Modal from '../components/Modal.vue'

export default {
  name: 'MapView',
  components: {
    Modal,
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
      const infoWindow = new window.google.maps.InfoWindow()
      // Create the markers.
      let position = {
        lat: this.polylineArray[i].startCoords.lat,
        lng: this.polylineArray[i].startCoords.lng,
      }
      const marker = new window.google.maps.Marker({
        position,
        title: name,
        label: `${i + 1}`,
        optimized: false,
      })
      this.markersArray.push((map) => marker.setMap(map))
      marker.setMap(this.map)
      // Add a click listener for each marker, and set up the info window.
      marker.addListener('click', () => {
        infoWindow.close()
        infoWindow.setContent(marker.getTitle())
        infoWindow.open(marker.getMap(), marker)
      })
    },
    toggleMapView(view) {
      if (view === 'route') {
        if (this.mapView === 'heat') {
          this.mapView = 'route'
          this.heatmap.setMap(null)
          this.buildRouteMap()
        }
      } else {
        if (this.mapView === 'route') {
          this.mapView = 'heat'
          for (let i = 0; i < this.polylineArray.length; i++) {
            this.polylineArray[i].removePoly()
          }
          for (let i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i](null)
          }
          this.heatmap.setMap(this.map)
        }
      }
    },
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
    loadMap() {
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
            this.map = new window.google.maps.Map(this.$refs['map'], {
              center: {
                lat: res[0].start_latlng[0],
                lng: res[0].start_latlng[1],
              },
              zoom: 12,
            })
          } catch (e) {
            console.log(e)
            alert('You must enable cache for Google Maps')
          }
          if (res) this.$store.dispatch('storeActivities', res)
          this.createLatLngArray(res)
        })
        .catch((error) => console.log(error))
    },
    createLatLngArray(activities) {
      activities.forEach((activity) => {
        activity.map.summary_polyline
          ? this.buildPath(activity.map.summary_polyline)
          : null
      })
      this.mapView === 'heat' ? this.buildHeatMap() : this.buildRouteMap()
    },
    buildPath(polyline) {
      let latLngArr = []
      const activityPath = new window.google.maps.Polyline({
        path: window.google.maps.geometry.encoding.decodePath(polyline),
        geodesic: true,
        strokeColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        strokeOpacity: 1.0,
        strokeWeight: 5,
      })
      this.polylineArray.push({
        setPoly: () => {
          return activityPath.setMap(this.map)
        },
        removePoly: () => {
          return activityPath.setMap(null)
        },
        startCoords: {
          lat: activityPath.latLngs.Nb[0].Nb[0].lat(),
          lng: activityPath.latLngs.Nb[0].Nb[0].lng(),
        },
      })
      activityPath.latLngs.Nb[0].Nb.forEach((coords) => {
        latLngArr.push([coords.lat(), coords.lng()])
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
    buildHeatMap() {
      let heatMapData = []
      this.latLngArray.forEach((coords) => {
        heatMapData.push(new window.google.maps.LatLng(coords[0], coords[1]))
      })
      this.heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        maxIntensity: 50,
        opacity: 1,
      })
      this.heatmap.setMap(this.map)
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
}
@media only screen and (max-width: 750px) {
  .map-nav {
    width: 100%;
  }
  .map {
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
