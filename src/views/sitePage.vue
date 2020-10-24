<template>
  <div>
    <div>
      <div id="main-content-site" class="container-general">
        <div class="m-auto pl-1" style="width: 85%">
          <top-bar></top-bar>
        </div>

        <!--square floating-->
        <div class="green-square"></div>
        <!--vertical title-->
        <h1 class="title-vertical rotation-270 text-white">
          HIJXS DE PER&Uacute;
        </h1>

        <!--center title with square-->
        <div
          v-for="(info, index) in infoSite"
          :key="'site' + index"
          class="div-title py-4"
        >
          <h1>{{ info.title }}</h1>
          <div
            style="
              color: #65b32e;
              font-weight: 600;
              font-size: 2.4rem;
              margin-top: -15px;
            "
          >
            {{ info.subTitle }}
          </div>

          <div v-if="info.summaryPage" class="descripcion-principal">
            {{ info.summaryPage }}
            <a key="idPage" href="#" class="" @click.prevent="">
              <u> VER MÁS </u>
            </a>
          </div>
        </div>

        <!--social network-->
        <social-network> </social-network>
      </div>

      <contentPage :menu-site="$menuSite"> </contentPage>

      <div v-if="componentInclude">
        <sixth-section :index-menu="-1"> </sixth-section>
      </div>
    </div>
  </div>
</template>

<script>
import SocialNetwork from '../components/SocialNetwoks';
import TopBar from '../components/TopBar';
import contentPage from '../components/ContentPage/contentPage';
import SixthSection from '../components/SixthSection';
import Encrypt from '../mixins/encryptStringMixin';

export default {
  name: 'Page',
  components: {
    TopBar,
    contentPage,
    SocialNetwork,
    SixthSection,
  },
  mixins: [Encrypt],
  data() {
    return {
      widthSearch: '70px',
      colorDivSearch: '#65B32E',
      inputSearchVisible: false,
      componentInclude: true,
      infoSite: [],
    };
  },
  created() {
    if (localStorage.getItem('menuSite') === null) this.$router.push('/');

    this.$menuSite = JSON.parse(localStorage.getItem('menuSite'));
  },
  mounted() {
    this.$loading('main-content-site');

    this.$eventBus.$on('infoSite', (dataSite) => {
      this.infoSite = [];
      this.infoSite.push(dataSite);
    });
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
#main-content-site > [v-cloak]::before {
  top: 150%;
}

.container-general:before {
  height: 100vh;
  position: absolute;
  /* background-image: linear-gradient(to top, #152f4e 1%, transparent);*/
  /* top: 0;*/
  right: 0;
  bottom: 0;
  /*left: 0;*/
  content: '';
  /*opacity: 0.3;*/
}

.container-general {
  height: 77vh;
  position: relative; /*
                              https://vignette.wikia.nocookie.net/reinoanimalia/images/f/f6/Rios.png/revision/latest?cb=20150820071055&path-prefix=es*/
  background-image: url('https://vignette.wikia.nocookie.net/reinoanimalia/images/f/f6/Rios.png/revision/latest?cb=20150820071055&path-prefix=es'),
    linear-gradient(to bottom right, #152f4e 100%, transparent);
  background-repeat: no-repeat;
  background-size: cover;
}

.green-square {
  position: absolute;
  z-index: 6;
  top: 80px;
  background-color: #65b32e;
  height: 200px;
  width: 200px;
}

.title-vertical {
  position: absolute;
  z-index: 7;
  top: 39.5%;
  left: -70px;
  letter-spacing: 1px;
  font-style: oblique;
  font-weight: 700;
}

.div-title {
  display: table-cell;
  position: absolute;
  top: 35%;
  /* left: calc(100% - 87%);*/
  margin-left: 20%;
  color: #fff;
  width: 80%;
  height: 90px;
  /* border-top: 3px solid rgba(255, 255, 255, .6);*/
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

/* Estilo portada principal Testimonios */

.descripcion-principal {
  height: auto;
  width: 40%;
  margin: 2% 40% 3% 0;
  color: #e8ebef;
  font-weight: 500;
  text-align: justify;
  position: relative;
  line-height: 1.3;
  font-size: 1.2em;
}
</style>
