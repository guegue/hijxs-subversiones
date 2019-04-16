import Vue from 'vue';
import App from './App.vue';
import Axios from 'axios';
import Hammer from 'hammerjs';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
Vue.prototype.$hammer = Hammer;

Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
