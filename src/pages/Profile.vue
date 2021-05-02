<template
  ><div class="profile-wrapper">
    <div v-if="user" class="profile">
      <h1>Hi, {{ user.firstname + ' ' + user.lastname }}</h1>
      <img :src="user.profile" />
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { logout, getUserInfo } from '../services'

export default {
  name: 'Profile',
  setup() {
    const store = useStore()
    if (!store.state.user) {
      getUserInfo()
        .then((res) => {
          store.dispatch('storeUser', res)
        })
        .catch((error) => console.log(error))
    }
    return {
      user: computed(() => store.state.user),
    }
  },
  data() {
    return {
      map: null,
      latLngArray: [],
      activitiesPagination: 1,
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
.profile-wrapper {
  height: 100%;
}
@media only screen and (min-width: 751px) {
  .profile-wrapper {
    height: 100%;
    margin-left: 130px;
  }
}
@media only screen and (max-width: 750px) {
}
h1 {
  margin: 0;
  padding: 20px 0;
  color: #fc4c02;
  font-family: 'Montserrat', sans-serif;
}
img {
  margin-top: 20px;
  border-radius: 50%;
  -webkit-box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
  box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
}
button {
  background-color: #fc4c02;
  border: none;
  color: white;
  border-radius: 5px;
  font-weight: 500;
  padding: 10px 30px;
  display: block;
  margin: 50px auto;
}
</style>
