<template>
  <div class="login">
    <h1>Strava Profile</h1>
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login() {
      const { VUE_APP_CLIENT_ID } = process.env
      const redirectUrl = 'http://localhost:8080'
      window.location = `http://www.strava.com/oauth/authorize?client_id=${VUE_APP_CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=read`
    },
  },
}
</script>

<style scoped>
h1 {
  color: #fc4c02;
  font-family: MaisonNeue-Bold, sans-serif;
}
</style>
