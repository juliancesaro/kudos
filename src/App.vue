<template>
  <div v-if="loading"></div>
  <Login v-else-if="!loggedIn()" />
  <Profile v-else />
</template>

<script>
import Login from './pages/Login.vue'
import Profile from './pages/Profile.vue'
import { getAccessToken } from './services'
export default {
  name: 'App',
  components: {
    Login,
    Profile,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    loggedIn() {
      return this.$store.state.accessToken
    },
  },
  mounted() {
    if (window.location.pathname === '/exchange_token') {
      this.loading = true
    }
    getAccessToken().then((res) => {
      this.$store.dispatch('storeToken', res)
    })
  },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap');
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  background-color: #efefef;
}
</style>
