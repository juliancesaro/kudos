<template>
  <div class="login">
    <img class="powered" src="../assets/powered_by_strava.svg" />
    <h1>Kudos</h1>
    <div class="desc">A web app for visualizing your Strava data.</div>
    <button @click="login">
      <img src="../assets/connect_with_strava.svg" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login() {
      const { VUE_APP_CLIENT_ID } = process.env
      const redirectUrl = 'http://localhost:8080/profile'
      window.location = `http://www.strava.com/oauth/authorize?client_id=${VUE_APP_CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=read,activity:read`
    },
  },
}
</script>

<style scoped>
.login {
  height: 100%;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.powered {
  width: 150px;
  position: absolute;
  top: 0;
  left: calc(100% - 150px);
}
h1 {
  font-size: 38px;
  margin: 0 0 5px 0;
  color: #fc4c02;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
}
.desc {
  margin-bottom: 20px;
  width: 250px;
  font-weight: 500;
}
button {
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
  background-color: #efefef;
  margin-bottom: 70px;
}
</style>
