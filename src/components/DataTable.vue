<template>
  <v-card class="tableClass">
    <v-card-title>
      <v-menu
        :close-on-content-click="false"
        transition="scale-transition"
        max-width="290px"
      >
        <template v-slot:activator="{ on }">
        <v-text-field
            v-model="dateFrom"
            label="Date From"
            prepend-icon="mdi-calendar-clock"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateFrom"
          scrollable
        >
        </v-date-picker>
      </v-menu>

      <v-menu
        :close-on-content-click="false"
        transition="scale-transition"
        max-width="290px"
      >
        <template v-slot:activator="{ on }">
        <v-text-field
            v-model="dateTo"
            label="Date To"
            prepend-icon="mdi-calendar-clock"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateTo"
          scrollable
        >
        </v-date-picker>
      </v-menu>

      <v-icon 
        @click="filterDate"
        clickable>mdi-magnify
      </v-icon>
    </v-card-title>

    <v-data-table
      @input="selectedCanged"
      :headers="headers"
      :items="tableData"
      item-key="Id"
      show-select
    ></v-data-table>
  </v-card>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import config from '../config';

export default {
  name: 'DataTable',

  props: ['device'],
  watch: {
    device(data) {
      this.deviceChange(data);
    },
  },
  data() {
    return {
      headers: [
        { text: 'Time', align: 'left', value: 'Time' },
        { text: 'Device', value: 'DevId' },
        { text: 'Latitude', value: 'Latitude' },
        { text: 'Longtitude', value: 'Longitude' },
        { text: 'RSSI', value: 'Rssi' },
        { text: 'SNR', value: 'Snr' },
        { text: 'Airtime', value: 'Airtime' },
      ],
      tableData: [],
      devID: '',
      dateFrom: '',
      dateTo: '',
      map: [],
      selected: [],
    };
  },

  methods: {
    selectedCanged(data) {
      this.$emit('selectedChanged', data);
      this.selected = data;
    },
    parseData(data) {
      this.tableData = [];
      if(data.length){
        let last = new Date(data[0].Time);
        let first = new Date(data[data.length-1].Time);
        this.dateFrom = `${first.getFullYear()}-${first.getMonth()+1}-${first.getDate()}` ;
        this.dateTo = `${last.getFullYear()}-${last.getMonth()+1}-${last.getDate()}` ;
      }

      data.forEach(msg => {
        msg.Time = new Date(msg.Time).toLocaleString("cs-CZ");
      });

      this.tableData = data;
    },
    deviceChange(device) {
      axios.get(`${config.messages}${device.id}`)
        .then((response) => {
          this.parseData(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(`Error fetching data: ${err}`);
        }); 
    },
    parseDateToYU(date){
      function pad(number) {
        return (number < 10 ? '0' + number : number);
      }
      return(`${date.getUTCFullYear()}${pad(date.getUTCMonth()+1)}${pad(date.getUTCDate())}T`+
        `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`);
    },
    filterDate(){
      var dateOd = new Date(this.dateFrom);
      var dateDo = new Date(this.dateTo);
      if(!dateOd.getDate() || !dateDo.getDate()){
        console.log('Wrong date selected');
        return;
      }
      if(dateOd > dateDo){
        console.log('Wrong date selected');
        return;
      }

      let url = `${config.messages}${this.device.id}/${this.parseDateToYU(dateOd)}/${this.parseDateToYU(dateDo)}`;
      axios.get(url)
        .then((response) => {
          this.parseData(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(`Error fetching data: ${err}`);
        }); 
      },
    deleteItem(){
      this.selected.forEach(sel => {
        axios.delete(`${config.messages}${sel.Id}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => {
            console.log(`Error fetching data: ${err}`);
          }); 
        }
      );
    },
  },
  mounted() {
    axios.get(config.messages)
      .then((response) => {
        this.parseData(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(`Error fetching data: ${err}`);
      }); 
  },
};
</script>

<style>
.tableClass {
  width: 900px;
  border: 2px solid black;
  margin: auto;
  margin-top: 0px;
}

</style>
