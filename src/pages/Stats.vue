<template>
  <div class="stats-wrapper">
    <div v-if="!loading" class="stats">
      <h1>Activity Stats</h1>
      <img src="../assets/fitness_stats.svg" />
      <div class="stats-list">
        <div class="kudos">
          <stat-card
            v-for="stat in stats.kudos"
            :stat="stat"
            :key="stat.name"
          />
        </div>
        <div class="total">
          <stat-card
            v-for="stat in stats.total"
            :stat="stat"
            :key="stat.name"
          />
        </div>
        <div class="ytd">
          <stat-card v-for="stat in stats.ytd" :stat="stat" :key="stat.name" />
        </div>
      </div>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import {
  getUserInfo,
  getActivities,
  getUserStats,
  getAllActivities,
} from "../services";
import { getCurrentTime } from "../utils";
import Loader from "../components/Loader.vue";
import StatCard from "../components/StatCard.vue";

export default {
  name: "Stats",
  components: {
    Loader,
    StatCard,
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
      this.fetchUserStats().then((res) => {
        let numKudos = 0;
        let mostKudos = 0;
        let longestRun = 0;
        let numRuns = res.all_run_totals.count;
        let totalDistance = res.all_run_totals.distance;
        let totalElev = res.all_run_totals.elevation_gain;
        let runningTime = res.all_run_totals.moving_time;
        let numRunsYtd = res.ytd_run_totals.count;
        let totalDistanceYtd = res.ytd_run_totals.distance;
        let totalElevYtd = res.ytd_run_totals.elevation_gain;
        let runningTimeYtd = res.ytd_run_totals.moving_time;
        this.allActivities.forEach((activity) => {
          numKudos += activity.kudos_count;
          if (activity.kudos_count > mostKudos) {
            mostKudos = activity.kudos_count;
          }
          if (activity.type === "Run" && activity.distance > longestRun) {
            longestRun = activity.distance;
          }
        });
        this.stats = {
          kudos: [
            { name: "Total Kudos", emoji: "👍", val: numKudos },
            {
              name: "Most Kudos",
              emoji: "👍",
              val: mostKudos,
            },
            {
              name: "Average Kudos",
              emoji: "👍",
              val: (numKudos / this.allActivities.length - 1).toFixed(),
            },
          ],
          total: [
            {
              name: "Longest Run",
              emoji: "🏃",
              val: `${
                longestRun > 1000
                  ? (longestRun / 1000).toFixed(2)
                  : longestRun.toFixed(2)
              }${longestRun > 1000 ? "KM" : "M"}`,
            },
            { name: "Runs (All Time)", emoji: "🏃", val: numRuns },
            {
              name: "Running Distance (All Time)",
              emoji: "🏃",
              val: `${
                totalDistance > 1000
                  ? (totalDistance / 1000).toFixed(2)
                  : totalDistance.toFixed(2)
              }${totalDistance > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Average Running Distance (All Time)",
              emoji: "🏃",
              val: `${
                totalDistance / numRuns > 1000
                  ? (totalDistance / numRuns / 1000).toFixed(2)
                  : (totalDistance / numRuns).toFixed(2)
              }${totalDistance / numRuns > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Running Elevation (All Time)",
              emoji: "🏃",
              val: `${
                totalElev > 1000
                  ? (totalElev / 1000).toFixed(2)
                  : totalElev.toFixed(2)
              }${totalElev > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Average Running Elevation (All Time)",
              emoji: "🏃",
              val: `${
                totalElev / numRuns > 1000
                  ? (totalElev / numRuns / 1000).toFixed(2)
                  : (totalElev / numRuns).toFixed(2)
              }${totalElev / numRuns > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Running Time (All Time)",
              emoji: "🕒",
              val: `${
                runningTime > 3600
                  ? (runningTime / 3600).toFixed(2)
                  : runningTime > 60
                  ? (runningTime / 60).toFixed(2)
                  : runningTime.toFixed(2)
              }${
                runningTime > 3600
                  ? " (hours)"
                  : runningTime > 60
                  ? " (mins)"
                  : runningTime.toFixed(2)
              }`,
            },
          ],
          ytd: [
            { name: "Runs (YTD)", emoji: "🏃", val: numRunsYtd },
            {
              name: "Running Distance (YTD)",
              emoji: "🏃",
              val: `${
                totalDistanceYtd > 1000
                  ? (totalDistanceYtd / 1000).toFixed(2)
                  : totalDistanceYtd.toFixed(2)
              }${totalDistanceYtd > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Average Running Distance (YTD)",
              emoji: "🏃",
              val: `${
                totalDistanceYtd / numRunsYtd > 1000
                  ? (totalDistanceYtd / numRunsYtd / 1000).toFixed(2)
                  : (totalDistanceYtd / numRunsYtd).toFixed(2)
              }${totalDistanceYtd / numRunsYtd > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Running Elevation (YTD)",
              emoji: "🏃",
              val: `${
                totalElevYtd > 1000
                  ? (totalElevYtd / 1000).toFixed(2)
                  : totalElevYtd.toFixed(2)
              }${totalElevYtd > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Average Running Elevation (YTD)",
              emoji: "🏃",
              val: `${
                totalElevYtd / numRunsYtd > 1000
                  ? (totalElevYtd / numRunsYtd / 1000).toFixed(2)
                  : (totalElevYtd / numRunsYtd).toFixed(2)
              }${totalElevYtd / numRunsYtd > 1000 ? "KM" : "M"}`,
            },
            {
              name: "Running Time (YTD)",
              emoji: "🕒",
              val: `${
                runningTimeYtd > 3600
                  ? (runningTimeYtd / 3600).toFixed(2)
                  : runningTimeYtd > 60
                  ? (runningTimeYtd / 60).toFixed(2)
                  : runningTimeYtd.toFixed(2)
              }${
                runningTimeYtd > 3600
                  ? " hours"
                  : runningTimeYtd > 60
                  ? " mins"
                  : runningTimeYtd.toFixed(2)
              }`,
            },
          ],
        };
        this.$store.dispatch("storeUserStats", this.stats);
        this.loading = false;
      });
    },
    fetchAllActivities(time) {
      // Get all activities 200 at a time using pagination
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
    async fetchUserStats() {
      try {
        if (this.$store.state.user) {
          let stats = await getUserStats(this.$store.state.user.id);
          return stats;
        } else {
          let user = await getUserInfo();
          this.$store.dispatch("storeUser", user);
          let stats = await getUserStats(user.id);
          return stats;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    if (!this.$store.state.allActivities) {
      const allActivities = getAllActivities(getCurrentTime());
      this.$store.dispatch("storeAllActivities", allActivities);
      this.createStats();
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
  margin-left: 80px;
  padding: 0 25px;
}
.stats {
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
.stat-text > p {
  max-width: 50%;
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
.stats-list {
  padding: 20px 0 20px 0;
}
/* Mobile only CSS */
@media only screen and (max-width: 750px) {
  .stats-wrapper {
    padding: 0 25px 50px 25px;
    margin-left: 0;
  }
  h1 {
    font-size: 24px;
  }
  .stats-list {
    padding-bottom: 70px;
  }
}
</style>
