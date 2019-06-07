import Vue from 'vue';
import App from './App.vue';
import Axios from 'axios';
import Hammer from 'hammerjs';
import Swiper from 'swiper';
import router from './router';
import Moment from 'moment';
import 'moment/locale/es';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import 'lightgallery.js/dist/css/lightgallery.min.css';
import 'lightgallery.js/dist/css/lg-fb-comment-box.min.css';
import 'lightgallery.js/dist/css/lg-transitions.min.css';

import 'lightgallery.js/src/js/lightgallery.js';
import 'lg-video.js/dist/lg-video.js';

import 'lg-thumbnail.js/dist/lg-thumbnail.js';
import 'lg-fullscreen.js/dist/lg-fullscreen.js';


Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
Vue.prototype.$hammer = Hammer;
Vue.prototype.$swiper = Swiper;
Moment.locale('es');
Vue.prototype.$moment = Moment;
//Vue.prototype.$fsLightbox = fsLightbox;
//Vue.prototype.$domainOmeka='https://sub-versiones.hijosdeperu.org/';  http://127.0.0.1:9494/OmekaS/omeka-s/
Vue.prototype.$domainOmeka='https://sub-versiones.hijosdeperu.org/';

Vue.use(BootstrapVue);
//Vue.use(jquery);
//Vue.use(fsLightbox);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');