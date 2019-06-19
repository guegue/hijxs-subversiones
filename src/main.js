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

const moment = require('moment');
require('moment/locale/es');


Vue.config.productionTip = false;
Vue.config.silent = false;

Vue.prototype.$axios = Axios;
Vue.prototype.$hammer = Hammer;
Vue.prototype.$swiper = Swiper;
Moment.locale('es');
Vue.prototype.$moment = Moment;

Vue.prototype["$idDefauldSite"] = 13;
Vue.prototype["$menuSite"] = [];
Vue.prototype.$domainOmeka = 'https://sub-versiones.hijosdeperu.org/';
Vue.prototype.$domainLinea ='http://linea.sub-versiones.org/';
Vue.prototype["$loading"] = id => { document.getElementById(id).setAttribute('v-cloak', ''); };
Vue.prototype["$removeLoading"] = id => { document.getElementById(id).removeAttribute('v-cloak'); };
Vue.prototype["$eventBus"] = new Vue();

Vue.use(BootstrapVue);
//Vue.use(jquery);
//Vue.use(fsLightbox);
Vue.use(require('vue-moment'), {
    moment
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');