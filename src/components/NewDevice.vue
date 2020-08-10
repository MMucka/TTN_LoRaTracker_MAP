<template>
<div>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">Add device <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">New device</span>
      </v-card-title>
      <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="DeviceID" v-model="newDevice.DevID" required>
              </v-text-field>
            </v-col>
            <v-col cols="9" sm="9">
              <v-select :items="items" item-text="appId" item-value="id" label="Application"
                v-model="newDevice.ApplicationId" required></v-select>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" dark @click="applicationDialog = true">
                  <v-icon right>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="addDevice">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="applicationDialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">New application</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="ApplicationID" v-model="newApp.AppId" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Application Key" v-model="newApp.AppKey" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="applicationDialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="addApplication">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deviceKey" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">New device</span>
      </v-card-title>
      <v-card-text>
        <v-text-field label="DeviceID" v-model="newDevice.devID"></v-text-field>
        <v-select :items="items" item-text="appId" item-value="id" label="Application"
          v-model="newDevice.applicationId"></v-select>
        <v-text-field label="AES key Base64" v-model="newDevice.aesKey"></v-text-field>
        <v-text-field label="AES IV Base64" v-model="newDevice.aesIv"></v-text-field>

        <v-text-field label="AES key Byte" v-model="newDevice.aesKeyByte"></v-text-field>
        <v-text-field label="AES IV Byte" v-model="newDevice.aesIvByte"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deviceKey = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="addDevice">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</div>
</template>

<script>
import axios from 'axios';
import config from '../config';
export default {
  props: {
    items: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      newDevice: {},
      newApp: {},
      dialog: false,
      applicationDialog: false,
      deviceKey: false,
    };
  },
  methods: {
    async addDevice() {
      this.newDevice.Active = true;
      console.log(this.newDevice);

      axios.post(config.devices, this.newDevice)
        .then(response => {
          console.log(response.data);
          if(response.data.id){
            this.deviceAddedOK(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async addApplication() {
      axios.post(config.applications, this.newApp)
        .then(response => {
          console.log(response.data);
          if(response.data.id){
            this.items.push(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });

      this.applicationDialog = false;
      console.log(this.items);
    },
    deviceAddedOK(device){
      this.dialog = false;
      device.aesKeyByte = this.base64ToHex(device.aesKey);
      device.aesIvByte = this.base64ToHex(device.aesIv);
      this.newDevice = device;
      this.deviceKey = true;
      this.$emit('loadApplications');
    },
    base64ToHex(str) {
      const raw = atob(str);
      let result = '';
      for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
      }
      return result.toUpperCase();
    }

  },
};
</script>
