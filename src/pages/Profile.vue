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
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
    showRoute(polyline) {
      const flightPath = new window.google.maps.Polyline({
        path: window.google.maps.geometry.encoding.decodePath(polyline),
        geodesic: true,
        strokeColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        strokeOpacity: 1.0,
        strokeWeight: 5,
      })
      flightPath.setMap(this.map)
    },
  },
  mounted() {
    this.map = new window.google.maps.Map(this.$refs['map'], {
      center: { lat: -25.344, lng: 131.036 },
      zoom: 4,
    })
    getActivities(200)
      .then((res) => {
        this.$store.dispatch('storeActivities', res)
        res.forEach((route) => {
          route.map.summary_polyline
            ? this.showRoute(route.map.summary_polyline)
            : null
        })
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
