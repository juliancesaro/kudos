<template>
  <Login />
</template>

<script>
import Login from './pages/Login.vue'
import { getAccessToken } from './utils'
export default {
  name: 'App',
  components: {
    Login,
  },
  mounted() {
    getAccessToken()
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
#app {
  font-family: MaisonNeue-Book, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
