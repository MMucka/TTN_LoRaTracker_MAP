<template lang="html">
  <div>
    <LMap ref="map" :center="center" style="z-index: 0;">
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LMarkerClusterGroup
        :options="{
          showCoverageOnHover: false
        }">

        <LMarker
          v-for="place in places"
          :key = "place.id"
          :latlng="place.latlng"
          :tooltip="dynamicTooltip(place.time)" />
      </LMarkerClusterGroup>
    </LMap>
  </div>
</template>

<script>
import 'leaflet';
import 'leaflet.markercluster';
import { LMarker } from '@vdcrea/vue-leaflet'

const leaflet = window.L;

export default {
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      center: [49.2126, 19.2286],
      places: [],
      map: [],
    };
  },
  watch: {
    markers(data) {
      this.addMarkers(data);
    },
  },
  methods: {
    dynamicTooltip (time) {
      return 'Time: ' + time;
    },
    addMarkers(markers) {
      this.places = [];
      if(markers.length){
        this.center = [markers[0].Latitude, markers[0].Longitude];
        
        markers.forEach(mark => {
          this.places.push({id: mark.Id, latlng: [mark.Latitude, mark.Longitude], time: mark.Time});
        });
      }
      console.log(this.places);
    },
  },
  mounted() {
  },
};
</script>
