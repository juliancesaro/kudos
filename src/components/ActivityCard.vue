<template>
  <div ref="card" class="activity-card-wrapper">
    <div class="card-top">
      <p class="date">
        {{ new Date(activity.start_date_local).toLocaleDateString("en-AU") }}
      </p>
      <p class="location">{{ city + ", " + state }}</p>
    </div>
    <p class="activity-name">{{ activity.name }}</p>
    <div v-if="activity.map.summary_polyline" class="map-image-wrapper">
      <img
        v-if="cardWidth"
        class="map-image"
        :src="
          `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-5+05445E-0.7(${encodeURIComponent(
            activity.map.summary_polyline
          )})/auto/${cardWidth - 20}x250?access_token=${mapboxAccessToken}`
        "
      />
    </div>
    <div class="card-bottom">
      <div class="kudos">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-heart"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#2c3e50"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
          />
        </svg>
        <p>{{ activity.kudos_count }}</p>
      </div>
      <a
        :href="`https://www.strava.com/activities/${activity.id}`"
        target="_blank"
        >View on Strava</a
      >
    </div>
  </div>
</template>

<script>
import { reverseGeocode } from "../services";

export default {
  name: "Activity Card",
  props: {
    activity: Object,
  },
  data() {
    return {
      cardWidth: null,
      city: "",
      state: "",
      mapboxAccessToken: process.env.VUE_APP_MAPBOX_TOKEN,
    };
  },
  methods: {
    async getLocation(lat, lng) {
      let geocode = await reverseGeocode(lat, lng);
      // Use suburb if it exists, else use city, and use state
      // if it exists, else use country
      let locality = null;
      let region = null;
      geocode.features.forEach((feature) => {
        if (feature.id.includes("locality")) {
          locality = feature.place_name;
        }
        if (feature.id.includes("region")) {
          region = feature.place_name;
        }
      });
      if (locality) {
        let names = locality.split(", ");
        this.city = names[0];
        this.state = names[1];
      } else if (region) {
        let names = region.split(", ");
        this.city = names[0];
        this.state = names[1];
      }
    },
  },
  mounted() {
    // Get card ref width to fetch static map image of correct size
    this.cardWidth = this.$refs.card.clientWidth;
    this.getLocation(
      this.activity.start_latlng[0],
      this.activity.start_latlng[1]
    );
  },
};
</script>

<style scoped>
.activity-card-wrapper {
  padding: 10px;
  border-radius: 3px;
  background-color: white;
  -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
}
.card-top {
  display: flex;
  justify-content: space-between;
}
.card-top > p {
  margin-top: 0;
  font-size: 10px;
  font-weight: 700;
}
.activity-name {
  margin-top: 0;
  font-weight: 700;
  text-align: left;
}
.location {
  max-width: 100px;
}
.map-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}
.map-image {
  width: 100%;
}
.card-bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 12px;
}
.kudos {
  display: flex;
  align-items: center;
}
.kudos > p {
  margin: 0 0 0 5px;
  font-size: 14px;
  font-weight: 700;
}
.card-bottom > a {
  font-size: 12px;
  font-weight: 700;
  color: #fc4c02;
  text-decoration: none;
}
</style>
