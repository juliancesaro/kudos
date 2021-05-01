<template>
  <div v-if="user" class="profile">
    <h1>Hi, {{ user.firstname + ' ' + user.lastname }}</h1>
    <img :src="user.profile" />
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getUserInfo, logout } from '../services'

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
    return {
      user: computed(() => store.state.user),
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('removeToken')
      logout()
    },
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
</style>
