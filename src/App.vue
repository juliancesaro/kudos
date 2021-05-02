<template>
  <div v-if="loading"></div>
  <Login v-else-if="!loggedIn()" />
  <PageWrapper v-else />
</template>

<script>
import Login from './pages/Login.vue'
import PageWrapper from './pages/PageWrapper.vue'
import { getAccessToken } from './services'
export default {
  name: 'App',
  components: {
    Login,
    PageWrapper,
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
    if (
      window.location.pathname === '/exchange_token' &&
      !window.location.search.includes('error')
    ) {
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
* {
  box-sizing: border-box;
}
html,
body,
#app {
  width: 100%;
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
  min-width: 220px;
  background-color: #efefef;
}
button {
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
}
</style>
