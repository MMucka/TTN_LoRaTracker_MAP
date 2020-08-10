<template>
  <div>
    <v-card width="250px">
      <v-treeview
        dense open-all
        :hoverable="true"
        :open-on-click="true"
        :items="items"
        ref="strom"
      >
        <template v-slot:label="{ item }">
          <div v-if="item.appId">{{item.appId}}</div>
          <div v-if="item.devID" @click="deviceClicked(item)">
            <span class="dot" v-bind:class="{ greenDot: item.active, redDot: !item.active }"></span>
            {{item.devID}}
          </div>
        </template>
      </v-treeview>

      <v-spacer></v-spacer>

      <v-row justify="center">
        <NewDevice @loadApplications='loadApplications' :items="items"/>
        <v-btn @click='loadApplications' max-width="20px"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-row>

    </v-card>
    <v-divider></v-divider>
    <v-card width="250px" v-if="device">
      <div class="deviceName">{{device.devID}}</div>

      <v-btn v-if="device.active === true"
        color="error" @click="deactivateDevice">
        Deactivate
      </v-btn>

      <v-btn v-else color="success"
        @click="activateDevice">
        Activate
      </v-btn>

      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="grey" v-on="on"><v-icon right>mdi-delete</v-icon>Delete
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Delete device</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              Are you sure to delete device with all data?
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="deleteDevice">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :bottom="true"
      color="success"
      :right="true"
      :timeout="5000"
      >
        {{ snackBarText }}<v-btn dark text @click="snackbar = false" >Close</v-btn>
      </v-snackbar>
  </div>
</template>


<script>
/* eslint-disable */
import axios from 'axios';
import config from '../config';
import NewDevice from '@/components/NewDevice.vue';

export default {
  components: { NewDevice },
  data() {
    return {
      device: null,
      dialog: false,
      snackbar: false,
      snackBarText: "",
      items: [],
    };
  },
  methods: {
    deviceClicked(dev) {
      this.device = dev;
      this.$emit('deviceChanged', dev);
    },
    async deleteDevice(){
      axios.get(`${config.devices}${this.device.id}/delete`).then(
        this.$nextTick().then( () => this.loadApplications()));
      this.device = {};
      this.dialog = false;
    },
    
    async deactivateDevice(){
      this.device.activate = false;
      axios.get(`${config.devices}${this.device.id}/deactivate`).then(
        this.$nextTick().then( () => this.loadApplications()));
    },
    async activateDevice(dev){
      this.device.activate = true;
      axios.get(`${config.devices}${this.device.id}/activate`).then(
        this.$nextTick().then( () => this.loadApplications()));
    },
    async loadApplications() {
      this.items = [];
      axios.get(`${config.applications}`).then(applications => {
        applications.data.forEach((app) => {
          this.items.push({ id: app.id, appId: app.appId, children: app.devices });
        })
        console.log(this.items);
        this.$nextTick().then( () => this.$refs.strom.updateAll(true));
      });
    }
  },
  async mounted() {
    this.loadApplications();
  },
};
</script>

<style scoped>
.dot {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  display: inline-block;
}

.redDot{
  background-color: red;
}

.greenDot{
  background-color: green;
}

.deviceName{
  text-align: center;
  padding: 15px;
  font-weight: bold;  
}
</style>