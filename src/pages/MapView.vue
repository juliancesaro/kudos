<template>
  <div class="mapview-wrapper">
    <div class="map-nav">
      <div class="map-nav-buttons-wrapper">
        <div class="map-nav-buttons">
          <button
            :class="`switcher${mapView === 'heat' ? ' btn-selected' : ''}`"
            @click="toggleMapView('heat')"
          >
            Heatmap
          </button>
          <button
            :class="`switcher${mapView === 'route' ? ' btn-selected' : ''}`"
            @click="toggleMapView('route')"
          >
            Routemap
          </button>
        </div>
      </div>
    </div>
    <div id="map" class="map" ref="map"></div>
    <div v-if="loading" class="loading-wrapper">
      <loader />
    </div>
  </div>
</template>

<script>
import { logout, getAllActivities } from "../services";
import { getCurrentTime } from "../utils";
import polylineUtil from "@mapbox/polyline";
import Loader from "../components/Loader.vue";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

export default {
  name: "MapView",
  components: {
    Loader,
  },
  data() {
    return {
      activityNames: [],
      map: null,
      latLngArray: [],
      polylineArray: [],
      markersArray: [],
      heatmap: null,
      mapView: "heat",
      loading: false,
    };
  },
  methods: {
    addMarker(name, i) {
      // Create the markers
      let position = [
        this.polylineArray[i].startCoords.lat,
        this.polylineArray[i].startCoords.lng,
      ];
      var el = document.createElement("div");
      var img = document.createElement("div");
      el.className = "marker";
      el.appendChild(img);
      let marker = new mapboxgl.Marker(el)
        .setLngLat(position)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<h3 style="margin: 0;">' + name + "</h3>")
        )
        .addTo(this.map);
      this.markersArray.push(marker);
    },
    toggleMapView(view) {
      if (view === "route") {
        if (this.mapView === "heat") {
          this.mapView = "route";
          this.map.removeLayer("heatmap");
          this.buildRouteMap();
        }
      } else {
        if (this.mapView === "route") {
          this.mapView = "heat";
          for (let i = 0; i < this.polylineArray.length; i++) {
            this.polylineArray[i].removePoly();
          }
          for (let i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].remove();
          }
          this.addHeatMap();
        }
      }
    },
    logout() {
      this.$store.dispatch("removeToken");
      logout();
    },
    loadMap() {
      this.loading = true;
      // Fetch activities then initialize new map object
      const activities = this.$store.state.allActivities;
      console.log(activities);
      try {
        activities.forEach((activity) =>
          activity.map.summary_polyline
            ? this.activityNames.push(activity.name)
            : null
        );
        this.loading = false;
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
        this.map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [
            activities[0].start_latlng[1],
            activities[0].start_latlng[0],
          ],
          zoom: 10,
        });
      } catch (e) {
        console.log(e);
        alert("There was an error loading Mapbox, please refresh your page.");
      }
      if (activities) this.$store.dispatch("storeActivities", activities);
      // When the map loads, process the activity data
      this.map.on(
        "load",
        function() {
          this.buildPathArray(activities);
        }.bind(this)
      );
    },
    buildPathArray(activities) {
      // Build polyline array and array of lats and longs for
      // each activity
      activities.forEach((activity, i) => {
        activity.map.summary_polyline
          ? this.buildPath(activity.map.summary_polyline, i)
          : null;
      });
      // Initialize and the heatmap
      let heatMapData = { type: "FeatureCollection", features: [] };
      this.latLngArray.forEach((coord) => {
        heatMapData.features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: coord },
        });
      });
      this.map.addSource("heatmap", {
        type: "geojson",
        data: heatMapData,
      });
      this.mapView === "heat" ? this.addHeatMap() : this.buildRouteMap();
    },
    buildPath(polyline, i) {
      // Decode activity polyline and add it to both the polyline array
      // for the routemap and the lat long array for the heatmap
      let latLngArr = [];
      let geoJSON = polylineUtil.toGeoJSON(polyline);
      this.map.addSource("route-" + i, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: geoJSON,
        },
      });
      this.polylineArray.push({
        setPoly: () => {
          this.map.addLayer({
            id: "route-" + i,
            type: "line",
            source: "route-" + i,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#000000".replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16);
              }),
              "line-width": 5,
            },
          });
        },
        removePoly: () => this.map.removeLayer("route-" + i),
        startCoords: {
          lat: geoJSON.coordinates[0][0],
          lng: geoJSON.coordinates[0][1],
        },
      });
      geoJSON.coordinates.forEach((coords) => {
        latLngArr.push([coords[0], coords[1]]);
      });
      this.latLngArray = [...this.latLngArray, ...latLngArr];
    },
    buildRouteMap() {
      // Add each marker and each polyline
      this.activityNames.forEach((name, i) => {
        this.addMarker(name, i);
      });
      for (let i = 0; i < this.polylineArray.length; i++) {
        this.polylineArray[i].setPoly();
      }
    },
    addHeatMap() {
      // Add the heatmap
      this.map.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "heatmap",
        paint: {
          "heatmap-intensity": {
            stops: [
              [11, 0.1],
              [15, 0.1],
            ],
          },
          "heatmap-radius": 8,
        },
      });
    },
  },
  async mounted() {
    if (!this.$store.state.allActivities) {
      this.loading = true;
      const allActivities = await getAllActivities(getCurrentTime());
      this.$store.dispatch("storeAllActivities", allActivities);
      this.loadMap();
    } else {
      this.loadMap();
    }
  },
};
</script>

<style>
/* Global styles for Mapbox markers */
.marker {
  width: 30px;
  height: 80px;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}
.marker > div {
  background-image: url("../assets/marker.png");
  background-size: cover;
  width: 30px;
  height: 40px;
  border-radius: 50%;
}
.mapboxgl-popup {
  max-width: 200px;
}
.mapboxgl-popup-content {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  padding: 10px 20px;
}
</style>

<style scoped>
.mapview-wrapper {
  height: 100%;
}
.map-nav {
  display: flex;
  width: 100%;
}
.map-nav-buttons-wrapper {
  display: flex;
  width: 100%;
}
.map-nav-buttons {
  display: flex;
  width: 100%;
}
.switcher {
  width: 50%;
  height: 40px;
  border: none;
  font-weight: 500;
  background-color: #efefef;
}
.map-nav-buttons > .btn-selected {
  color: white;
  background-color: #ff5d17;
}
.map {
  margin: 0 auto;
  width: 100%;
}
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  background-color: #efefef;
}
.loading-wrapper {
  position: absolute;
}
/* Desktop only CSS */
@media only screen and (min-width: 751px) {
  .mapview-wrapper {
    height: 100%;
    margin-left: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .map-nav {
    margin: 0 auto;
  }
  .map-nav-buttons {
    flex: 9;
    margin: 0 auto;
    max-width: 600px;
  }
  .switcher {
    flex: 1;
  }
  .map {
    height: 100%;
  }
  .loading-wrapper {
    top: 0;
    left: 80px;
    height: 100%;
    width: calc(100% - 80px);
  }
}
/* Mobile only CSS */
@media only screen and (max-width: 750px) {
  .map {
    height: calc(100% - 90px);
  }
  .loading-wrapper {
    top: 40px;
    left: 0;
    height: calc(100% - 90px);
    width: 100%;
  }
}
</style>
