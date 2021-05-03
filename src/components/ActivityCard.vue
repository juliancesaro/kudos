<template>
  <div ref="card" class="activity-card-wrapper">
    <div class="card-top">
      <p class="date">
        {{ new Date(activity.start_date_local).toLocaleDateString('en-AU') }}
      </p>
      <p class="location">{{ city + ', ' + state }}</p>
    </div>
    <p class="activity-name">{{ activity.name }}</p>
    <div v-if="activity.map.summary_polyline" class="map-image-wrapper">
      <img
        v-if="cardWidth"
        class="map-image"
        :src="
          `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-5+05445E(${encodeURIComponent(
            activity.map.summary_polyline
          )})/auto/${cardWidth -
            20}x250?access_token=pk.eyJ1IjoianVsaWFuY2VzYXJvIiwiYSI6ImNrbzg4eTN0ZjFsOGwzMXBkbGs2Mmsxc3kifQ.ve_9aEO0qzGV1bDiX1noyA`
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
export default {
  name: 'Activity Card',
  props: {
    activity: Object,
  },
  data() {
    return {
      cardWidth: null,
      city: '',
      state: '',
    }
  },
  methods: {},
  mounted() {
    this.cardWidth = this.$refs.card.clientWidth
    const geocoder = new window.google.maps.Geocoder()
    const latlng = {
      lat: this.activity.start_latlng[0],
      lng: this.activity.start_latlng[1],
    }
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          let suburb = results[0].address_components.filter((comps) =>
            comps.types.includes('locality')
          )
          suburb.length > 0 ? (suburb = suburb[0].long_name) : null
          let city = results[0].address_components.filter((comps) =>
            comps.types.includes('administrative_area_level_2')
          )
          city.length > 0 ? (city = city[0].long_name) : null
          let state = results[0].address_components.filter((comps) =>
            comps.types.includes('administrative_area_level_1')
          )
          state.length > 0 ? (state = state[0].long_name) : null
          let country = results[0].address_components.filter((comps) =>
            comps.types.includes('country')
          )
          country.length > 0 ? (country = country[0].long_name) : null
          this.city = suburb ? suburb : city
          this.state = state ? state : country
        }
      }
    })
  },
}
</script>

<style scoped>
.activity-card-wrapper {
  padding: 10px;
  border-radius: 3px;
  background-color: white;
  -webkit-box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.1);
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
