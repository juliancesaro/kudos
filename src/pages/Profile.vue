<template>
  <div class="profile-wrapper">
    <div v-if="user" class="profile">
      <div class="profile-header">
        <img :src="user.profile" />
        <h1>{{ user.firstname + ' ' + user.lastname }}</h1>
        <p>{{ user.bio }}</p>
        <div class="profile-info">
          <div class="follower-count">
            {{ user.follower_count }}
            <p>Followers</p>
          </div>
          <div class="friend-count">
            {{ user.friend_count }}
            <p>Following</p>
          </div>
        </div>
        <button @click="logout">Logout</button>
      </div>
      <div class="profile-recent">
        <h2>Your recent activities</h2>
        <div class="recent-activities">
          <activity-card
            v-for="activity in recentActivities"
            :activity="activity"
            :key="activity.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { logout, getUserInfo, getActivities } from '../services'
import ActivityCard from '../components/ActivityCard.vue'

export default {
  name: 'Profile',
  components: {
    ActivityCard,
  },
  setup() {
    const store = useStore()
    if (!store.state.user) {
      getUserInfo()
        .then((res) => {
          store.dispatch('storeUser', res)
        })
        .catch((error) => console.log(error))
    }
    if (!store.state.recentActivities) {
      const now = new Date()
      const utcMilllisecondsSinceEpoch =
        now.getTime() + now.getTimezoneOffset() * 60 * 1000
      const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000)
      getActivities(utcSecondsSinceEpoch, 5)
        .then((res) => {
          console.log(res)
          store.dispatch('storeRecentActivities', res)
        })
        .catch((error) => console.log(error))
    }
    return {
      user: computed(() => store.state.user),
      recentActivities: computed(() => store.state.recentActivities),
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
  min-width: 220px;
}
.profile-header {
  max-width: 600px;
  margin: 0 auto;
}
.profile-header > p {
  margin-top: 0;
}
.profile-info {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
}
.profile-info > div {
  width: 50%;
  font-weight: 700;
  font-size: 30px;
  color: #fc4c02;
}
.profile-info > div > p {
  font-weight: 500;
  font-size: 16px;
  color: rgb(70, 70, 70);
  margin-top: 5px;
}
h2 {
  margin: 0 auto 30px auto;
  font-size: 20px;
  font-weight: 500;
}
@media only screen and (min-width: 750px) {
  .profile-wrapper {
    margin-left: 110px;
    padding: 0 25px;
  }
  .profile-header {
    margin: 0 auto 30px auto;
  }
  img {
    margin-top: 30px;
    border-radius: 50%;
    -webkit-box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
    box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
  }
  h1 {
    margin: 0;
    padding: 20px 0;
    color: #000;
    font-family: 'Montserrat', sans-serif;
  }
  button {
    background-color: #fc4c02;
    border: none;
    color: white;
    border-radius: 5px;
    font-weight: 500;
    padding: 10px 30px;
    display: block;
    margin: 10px auto;
  }
  .profile-recent {
    max-width: 600px;
    margin: 0 auto;
  }
}
@media only screen and (max-width: 750px) {
  .profile-wrapper {
    padding: 0 25px;
  }
  .profile-header {
    margin: 0 40px 30px 40px;
  }
  img {
    margin-top: 30px;
    border-radius: 50%;
    -webkit-box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
    box-shadow: 0px 8px 24px rgb(13 13 18 / 16%);
  }
  h1 {
    margin: 0;
    padding: 20px 0;
    color: black;
    font-family: 'Montserrat', sans-serif;
  }
  button {
    background-color: #fc4c02;
    border: none;
    color: white;
    border-radius: 5px;
    font-weight: 600;
    padding: 10px 30px;
    display: block;
    margin: 10px auto 0 auto;
  }
  .profile-recent {
    margin-bottom: 100px;
  }
}
@media only screen and (max-width: 400px) {
  .profile-wrapper {
    padding: 0 25px;
  }
  .profile-header {
    margin: 0 20px 30px 20px;
  }
}
</style>
