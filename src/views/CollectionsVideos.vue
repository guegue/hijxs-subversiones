<template>
  <div>
    <div class="container-videos">
      <top-bar :index-menu="5"></top-bar>
      <!--square floating-->
      <div class="green-square"></div>

      <!--vertical title-->
      <h1 class="title-vertical rotation-270 text-white">
        HIJXS DE PER&Uacute;
      </h1>

      <!--center title with square-->
      <div class="div-title text-center py-4">
        <h1>COLECCIÓN DE VIDEOS</h1>
      </div>
      <videos></videos>
      <!--social network-->
      <social-network></social-network>

      <!--search input-->
      <div
        class="search-square pt-2"
        :style="{
          width: widthSearch,
          'background-color': colorDivSearch,
        }"
      >
        <div
          class="text-center text-white"
          @click="hideOrShow(widthSearch, colorDivSearch)"
        >
          <b-link v-if="!inputSearchVisible" router-tag="a">
            <i class="fas fa-search fa-2x"></i>
          </b-link>
          <input
            :type="!inputSearchVisible ? 'hidden' : 'text'"
            placeholder="Buscar"
          />
        </div>
      </div>

      <!--search input-->
      <div class="setting-square pt-2">
        <div class="text-center text-white">
          <b-link router-tag="a">
            <i class="fas fa-cog fa-2x"></i>
          </b-link>
        </div>
      </div>
    </div>
    <sixth-section :index-menu="5"></sixth-section>
  </div>
</template>

<script>
import SocialNetwork from '../components/SocialNetwoks';
import TopBar from '../components/TopBar';
import SixthSection from '../components/SixthSection';
import Videos from '../components/Videos/Videos';

export default {
  name: 'Timeline',
  components: {
    TopBar,
    SocialNetwork,
    SixthSection,
    Videos,
  },
  data() {
    return {
      widthSearch: '70px',
      colorDivSearch: '#65B32E',
      inputSearchVisible: false,
    };
  },
  methods: {
    hideOrShow(width, backgrouncolor) {
      if (width === '70px') {
        this.widthSearch = '350px';
        this.colorDivSearch = '#fff';
        this.inputSearchVisible = true;
      }
    },
  },
};
</script>

<style scoped>
.container-videos:before {
  height: 100vh;
  position: absolute;
  background-image: linear-gradient(to top, #152f4e 5%, transparent);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  opacity: 1;
}

.container-videos {
  /* http://pivotchange.com/wp-content/uploads/2015/12/yellow-flower-in-the-snow_1179256191.jpg https://ibaznycia.lt/wp-content/uploads/2015/02/sniegas_ir_gele.jpg */
  height: 100vh;
  position: relative;
  background-image: url('https://ibaznycia.lt/wp-content/uploads/2015/02/sniegas_ir_gele.jpg'),
    linear-gradient(to bottom right, #152f4e 100%, transparent);
  background-repeat: no-repeat;
  background-size: cover;
}

.green-square {
  position: absolute;
  z-index: 6;
  top: 50px;
  background-color: #65b32e;
  height: 200px;
  width: 200px;
}

.title-vertical {
  position: absolute;
  z-index: 7;
  top: 29.5%;
  left: -70px;
  letter-spacing: 1px;
  font-style: oblique;
  font-weight: 700;
}

.div-title {
  display: table-cell;
  position: absolute;
  top: 13%;
  left: calc(100% - 87%);
  color: #fff;
  width: 87%;
  height: 90px;
  border-top: 3px solid rgba(255, 255, 255, 0.6);
  vertical-align: middle;
}

.search-square {
  display: block;
  position: absolute;
  height: 50px;
  /*width: 70px;*/
  bottom: 70px;
  right: 0;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  background-color: #65b32e;
  border: none;
  -webkit-transition: width 1s; /* For Safari 3.1 to 6.0 */
  transition: width 1s;
}

.search-square input {
  width: 100%;
  height: 100%;
  padding: 0;
}

.setting-square {
  position: absolute;
  height: 50px;
  width: 70px;
  bottom: 10px;
  right: 0;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  background-color: #65b32e;
  border: none;
}

a,
a:hover {
  color: #fff;
  text-decoration: none;
}
</style>
