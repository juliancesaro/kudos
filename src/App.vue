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
@font-face {
  font-family: 'MaisonNeue';
  src: local('MaisonNeue-Bold'),
    url(./fonts/MaisonNeue/MaisonNeue-Bold.ttf) format('truetype');
}
@font-face {
  font-family: 'MaisonNeue-Demi';
  src: local('MaisonNeue-Demi'),
    url(./fonts/MaisonNeue/MaisonNeue-Demi.ttf) format('truetype');
}
@font-face {
  font-family: 'MaisonNeue-Book';
  src: local('MaisonNeue-Book'),
    url(./fonts/MaisonNeue/MaisonNeue-Book.ttf) format('truetype');
}
@font-face {
  font-family: 'MaisonNeue-Light';
  src: local('MaisonNeue-Light'),
    url(./fonts/MaisonNeue/MaisonNeue-Light.ttf) format('truetype');
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}
#app {
  font-family: MaisonNeue-Book, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  background-color: #efefef;
}
</style>
