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
        console.log(res)
        store.dispatch('storeUser', res)
      })
      .catch((error) => console.log(error))
    getActivities(10)
      .then((res) => {
        console.log(res)
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
  },
  mounted() {
    console.log(this.$refs.map)
    this.map = new window.google.maps.Map(this.$refs['map'], {
      center: { lat: -25.344, lng: 131.036 },
      zoom: 4,
    })
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
