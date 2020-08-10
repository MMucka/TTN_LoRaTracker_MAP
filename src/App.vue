<template>
  <v-app>
    <v-app-bar
      color="indigo darken-2"
      dark
      max-height="50px"
    >
    </v-app-bar>

    <v-row
      justify="center"
      class="mb-6"
      no-gutters>
      <v-col md="auto">
        <Applications @deviceChanged="deviceChanged"/>
      </v-col>

      <v-col md="auto">
        <v-sheet>
          <DataTable @selectedChanged="selectedChanged" :device="device"/>
          <Map :markers="markers"/>
        </v-sheet>
      </v-col>
    </v-row>

  </v-app>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
import Applications from '@/components/Applications.vue';
import Map from '@/components/Map.vue';

export default {
  components: { DataTable, Applications, Map },
  data() {
    return {
      markers: [],
      device: null,
    };
  },
  methods: {
    selectedChanged(data) {
      this.markers = data;
    },
    deviceChanged(dev) {
      this.device = dev;
    },
  },
};
</script>
