<template
  ><div class="profile-wrapper">
    <div v-if="user" class="profile">
      <h1>Hi, {{ user.firstname + ' ' + user.lastname }}</h1>
      <img :src="user.profile" />
      <button @click="logout">Logout</button>
    </div>
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { logout, getUserInfo, getActivities } from '../services'

export default {
  name: 'Profile',
  setup() {
    const store = useStore()
    getUserInfo()
      .then((res) => {
        store.dispatch('storeUser', res)
      })
      .catch((error) => console.log(error))
    return {
      user: computed(() => store.state.user),
    }
  },
  data() {
    return {
      map: null,
      latLngArray: [],
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
    createLatLngArray(activities) {
      activities.forEach((activity) => {
        activity.map.summary_polyline
          ? (this.latLngArray = [
              ...this.latLngArray,
              ...this.buildPath(activity.map.summary_polyline),
            ])
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
      activityPath.latLngs.Nb[0].Nb.forEach((coords) => {
        latLngArr.push([coords.lat(), coords.lng()])
      })
      return latLngArr
    },
    buildHeatMap() {
      let heatMapData = []
      console.log(this.latLngArray)
      this.latLngArray.forEach((coords) => {
        heatMapData.push(new window.google.maps.LatLng(coords[0], coords[1]))
      })
      var heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        maxIntensity: 30,
        opacity: 1,
      })
      heatmap.setMap(this.map)
    },
  },
  mounted() {
    this.map = new window.google.maps.Map(this.$refs['map'], {
      center: { lat: -33.8419, lng: 151.1478 },
      zoom: 12,
    })
    getActivities(200)
      .then((res) => {
        this.$store.dispatch('storeActivities', res)
        this.createLatLngArray(res)
      })
      .catch((error) => console.log(error))
  },
}
</script>

<style scoped>
h1 {
  color: #fc4c02;
  font-family: MaisonNeue-Bold, sans-serif;
}
img {
  border-radius: 50%;
}
button {
  display: block;
}
.map {
  height: 600px;
}
</style>
