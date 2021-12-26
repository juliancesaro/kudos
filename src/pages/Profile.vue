<template>
  <div class="profile-wrapper">
    <div v-if="!loading" class="profile">
      <div class="profile-header">
        <img :src="user.profile" />
        <h1>{{ user.firstname + " " + user.lastname }}</h1>
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
    <loader v-else />
  </div>
</template>

<script>
import { logout, getUserInfo, getActivities } from "../services";
import ActivityCard from "../components/ActivityCard.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "Profile",
  components: {
    ActivityCard,
    Loader,
  },
  data() {
    return {
      map: null,
      latLngArray: [],
      activitiesPagination: 1,
      loading: true,
      user: null,
      recentActivities: null,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("removeToken");
      logout();
    },
  },
  mounted() {
    if (!this.$store.state.user) {
      getUserInfo()
        .then((res) => {
          this.user = res;
          this.$store.dispatch("storeUser", res);
        })
        .catch((error) => console.log(error));
    } else {
      this.user = this.$store.state.user;
      this.loading = false;
    }
    if (!this.$store.state.recentActivities) {
      const now = new Date();
      const utcMilllisecondsSinceEpoch =
        now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const utcSecondsSinceEpoch = Math.round(
        utcMilllisecondsSinceEpoch / 1000
      );
      getActivities(1, utcSecondsSinceEpoch, 5)
        .then((res) => {
          this.recentActivities = res;
          this.$store.dispatch("storeRecentActivities", res);
          this.loading = false;
        })
        .catch((error) => console.log(error));
    } else {
      this.recentActivities = this.$store.state.recentActivities;
      this.loading = false;
    }
  },
};
</script>

<style scoped>
h1 {
  margin: 0;
  padding: 20px 0;
}
h2 {
  margin: 0 auto 30px auto;
  font-size: 20px;
  font-weight: 500;
}
img {
  max-width: 130px;
  margin-top: 30px;
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
  margin: 10px auto;
}
.profile-wrapper {
  height: 100%;
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
/* Desktop only CSS */
@media only screen and (min-width: 750px) {
  .profile-wrapper {
    margin-left: 80px;
    padding: 0 25px;
  }
  .profile-header {
    margin: 0 auto 30px auto;
  }
  .profile-recent {
    padding-bottom: 50px;
    max-width: 600px;
    margin: 0 auto;
  }
}
/* Mobile only CSS */
@media only screen and (max-width: 750px) {
  .profile-wrapper {
    padding: 0 10px 50px 10px;
  }
  .profile-header {
    margin: 0 40px 30px 40px;
  }
  .profile-recent {
    padding-bottom: 70px;
  }
}
/* Small mobile only CSS */
@media only screen and (max-width: 400px) {
  .profile-wrapper {
    padding: 0 10px 50px 10px;
  }
  .profile-header {
    margin: 0 20px 30px 20px;
  }
}
</style>
