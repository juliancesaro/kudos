<template>
  <div class="stats-wrapper">
    <div v-if="!loading" class="stats">
      <h1>Your Running Stats</h1>
      <img src="../assets/fitness_stats.svg" />
      <div class="stats-list">
        <div v-for="stat in stats" :key="stat.name" class="stat">
          <p>{{ stat.emoji }}</p>
          <div class="stat-text">
            <p>{{ stat.name }}</p>
            <p>{{ stat.val }}</p>
          </div>
        </div>
      </div>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import { getActivities } from "../services";
import Loader from "../components/Loader.vue";

export default {
  name: "Stats",
  components: {
    Loader,
  },
  data() {
    return {
      loading: true,
      stats: null,
      allActivities: [],
      done: false,
      page: 1,
    };
  },
  methods: {
    createStats() {
      let longestRun = 0;
      let numRuns = 0;
      let numKudos = 0;
      let totalDistance = 0;
      let totalElev = 0;
      this.allActivities.forEach((activity) => {
        if (activity.type === "Run" && activity.distance > longestRun) {
          longestRun = activity.distance;
        }
        if (activity.type === "Run") {
          numRuns++;
        }
        numKudos += activity.kudos_count;
        if (activity.type === "Run") {
          totalDistance += activity.distance;
        }
        if (activity.type === "Run") {
          totalElev += activity.total_elevation_gain;
        }
      });
      this.stats = [
        { name: "Total Kudos", emoji: "👍", val: numKudos },
        {
          name: "Longest Run",
          emoji: "🏃",
          val: `${
            longestRun > 1000
              ? (longestRun / 1000).toFixed(2)
              : longestRun.toFixed(2)
          }${longestRun > 1000 ? "KM" : "M"}`,
        },
        { name: "Runs All Time", emoji: "🕐", val: numRuns },
        {
          name: "Total Running Distance",
          emoji: "📏",
          val: `${
            totalDistance > 1000
              ? (totalDistance / 1000).toFixed(2)
              : totalDistance.toFixed(2)
          }${totalDistance > 1000 ? "KM" : "M"}`,
        },
        {
          name: "Total Running Elevation",
          emoji: "📈",
          val: `${
            totalElev > 1000
              ? (totalElev / 1000).toFixed(2)
              : totalElev.toFixed(2)
          }${totalElev > 1000 ? "KM" : "M"}`,
        },
      ];
      this.$store.dispatch("storeUserStats", this.stats);
      this.loading = false;
    },
    fetchAllActivities(time) {
      getActivities(this.page, time, 200)
        .then((res) => {
          this.allActivities = [...this.allActivities, ...res];
          if (res.length < 200) {
            this.$store.dispatch("storeAllActivities", this.allActivities);
            this.createStats();
            return;
          } else {
            this.page++;
            this.fetchAllActivities();
          }
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    if (!this.$store.state.allActivities) {
      const now = new Date();
      const utcMilllisecondsSinceEpoch =
        now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const utcSecondsSinceEpoch = Math.round(
        utcMilllisecondsSinceEpoch / 1000
      );
      this.fetchAllActivities(utcSecondsSinceEpoch);
    } else {
      this.allActivities = this.$store.state.allActivities;
      this.stats = this.$store.state.userStats;
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.stats-wrapper {
  height: 100%;
}
.stats {
  height: 100%;
  padding-top: 30px;
  max-width: 600px;
  margin: 0 auto;
}
.stats > img {
  width: 50%;
  max-width: 200px;
  padding-top: 10px;
}
.stat-text {
  display: flex;
  justify-content: space-between;
}
.stat > p {
  margin-bottom: 0;
}
p {
  text-align: left;
  font-weight: 600;
}
p:nth-child(2) {
  color: #fc4c02;
}
@media only screen and (min-width: 750px) {
  .stats-wrapper {
    margin-left: 80px;
    padding: 0 25px;
  }
  p {
    font-size: 16px;
  }
}
@media only screen and (max-width: 750px) {
  .stats-wrapper {
    padding: 0 25px 50px 25px;
  }
  h1 {
    font-size: 24px;
  }
  p {
    font-size: 14px;
  }
}
@media only screen and (max-width: 400px) {
  .stats-wrapper {
    padding: 0 25px;
  }
}
</style>
