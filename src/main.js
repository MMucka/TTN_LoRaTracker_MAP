import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import VueLeaflet from '@vdcrea/vue-leaflet'
import '@vdcrea/vue-leaflet/dist/vue-leaflet.css'

Vue.use(VueLeaflet);

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');

