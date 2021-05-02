<template>
  <div class="mapview-wrapper">
    <div class="map-nav">
      <button
        :class="`${mapView === 'heat' ? 'btn-selected' : ''}`"
        @click="toggleMapView"
      >
        Heatmap
      </button>
      <button
        :class="`${mapView === 'route' ? 'btn-selected' : ''}`"
        @click="toggleMapView"
      >
        Routemap
      </button>
    </div>
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import { logout, getActivities } from '../services'

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      latLngArray: [],
      polylineArray: [],
      heatmap: null,
      activitiesPagination: 1,
      mapView: 'heat',
    }
  },
  methods: {
    toggleMapView() {
      if (this.mapView === 'heat') {
        this.mapView = 'route'
        this.heatmap.setMap(null)
        for (let i = 0; i < this.polylineArray.length; i++) {
          console.log
          this.polylineArray[i].setPoly()
        }
      } else {
        this.mapView = 'heat'
        for (let i = 0; i < this.polylineArray.length; i++) {
          this.polylineArray[i].removePoly()
        }
        this.heatmap.setMap(this.map)
      }
    },
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
    createLatLngArray(activities) {
      activities.forEach((activity) => {
        activity.map.summary_polyline
          ? this.buildPath(activity.map.summary_polyline)
          : null
      })
      this.buildHeatMap()
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
      })
      activityPath.latLngs.Nb[0].Nb.forEach((coords) => {
        latLngArr.push([coords.lat(), coords.lng()])
      })
      this.latLngArray = [...this.latLngArray, ...latLngArr]
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
    try {
      this.map = new window.google.maps.Map(this.$refs['map'], {
        center: { lat: -33.8419, lng: 151.1478 },
        zoom: 12,
      })
    } catch (e) {
      console.log(e)
      alert('You must enable cache for Google Maps')
    }
    if (!this.$store.state.activities) {
      getActivities(this.activitiesPagination, 200)
        .then((res) => {
          if (res) this.$store.dispatch('storeActivities', res)
          this.createLatLngArray(res)
        })
        .catch((error) => console.log(error))
    } else {
      this.createLatLngArray(this.$store.state.activities)
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
.map-nav > button {
  width: 50%;
  height: 40px;
  border: none;
  font-weight: 500;
  background-color: #efefef;
}
.map-nav > .btn-selected {
  color: white;
  background-color: #ff5d17;
}
.map {
  margin: 0 auto;
}
@media only screen and (min-width: 751px) {
  .mapview-wrapper {
    height: 100%;
    margin-left: 130px;
  }
  .map-nav {
    width: 50%;
  }
  .map {
    height: 600px;
    width: 50%;
  }
}
@media only screen and (max-width: 750px) {
  .map-nav {
    width: 100%;
  }
  .map {
    height: calc(100% - 110px);
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
