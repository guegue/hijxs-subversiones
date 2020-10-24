<template>
  <div class="timeline-history">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    />

    <div>
      <div id="main-content-site" class="container-general">
        <div class="m-auto pl-1" style="width: 85%">
          <top-bar :index-menu="-1" :menu-site="$menuSite"></top-bar>
        </div>
      </div>
    </div>
    <b-container class="items-container">
      <template
        v-for="(item, itemIndex) in itemsOrdered"
        v-if="itemsOrdered.length > 0"
      >
        <b-row class="mt-5 mb-50" data-aos="fade-up" data-aos-duration="3000">
          <b-col v-if="itemIndex % 2 === 0" cols="6">
            <div class="image-wrapper" @click="openModalItemDetail(item.id)">
              <b-img
                v-if="item.imageLarge !== null"
                :src="item.imageLarge"
                rounded
                alt="Rounded image"
              ></b-img>
            </div>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                <p class="item-date">{{ item.date }}</p>
                <div class="item-date-line"></div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div
                  class="text-justify item-title"
                  @click="openModalItemDetail(item.id)"
                >
                  {{ item.title }}
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-4">
              <b-col>
                <div
                  class="text-justify item-description"
                  @click="openModalItemDetail(item.id)"
                >
                  <p>{{ item.description | truncate }}</p>
                </div>
                <div class="categories-wrapper">
                  <span
                    v-for="category in item.categories"
                    v-b-tooltip.hover
                    :title="category.nameCategory"
                    :class="['category-pill-history', category.classcolor]"
                    >{{ category.nameCategory }}</span
                  >
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-if="itemIndex % 2 !== 0" cols="6">
            <div class="image-wrapper" @click="openModalItemDetail(item.id)">
              <b-img
                v-if="item.imageLarge !== null"
                :src="item.imageLarge"
                rounded
                alt="Rounded image"
              ></b-img>
            </div>
          </b-col>
        </b-row>
      </template>

      <modal-item-detail ref="modalItemDetail" />
    </b-container>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
import MarkerCluster from 'vue2-leaflet-markercluster';
import { mapState } from 'vuex';
import TopBar from '../../components/TopBar';
import Encrypt from '../../mixins/encryptStringMixin';
import ItemMixin from '../../mixins/itemMixin';
import TimelineMixin from '../../mixins/timelineMixin';

import ModalItemDetail from '../ModalItemDetail';

export default {
  name: 'TimelineMap',
  components: {
    TopBar,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    MarkerCluster,
    ModalItemDetail,
  },
  filters: {
    truncate(str) {
      if (!str) return '';
      return `${str.substr(0, 200)}...`;
    },
  },
  mixins: [Encrypt, ItemMixin, TimelineMixin],
  data() {
    return {
      itemsCenterMarker: null,
      lat: 0,
      lng: 0,
      urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attributionMap:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      showPopup: false,
      isLoading: false,
      fullPage: true,
      itemsOrdered: [],
    };
  },
  created() {
    if (localStorage.getItem('menuSite') === null) {
      this.$router.push('/');
    }

    this.$menuSite = JSON.parse(localStorage.getItem('menuSite'));
  },
  mounted() {
    this.isLoading = true;
    this.$store
      .dispatch('itemsLoad', {
        domainOmeka: this.$domainOmeka,
        idSite: this.idSite,
        labelVocabulary: this.labelVocabulary,
        filter: { searchValue: '', tagsCategories: '' },
      })
      .then(() => {
        this.getItems(this.itemsLoaded).then(() => {
          this.groupItemsByDate().then(() => {
            for (const itemByYear of this.itemsByDateArray) {
              for (const itemByMonth of itemByYear.months) {
                for (const itemByDay of itemByMonth.days) {
                  for (const item of itemByDay.items) {
                    this.itemsOrdered.push(item);
                  }
                }
              }
            }
            this.isLoading = false;
          });
        });
      });
  },
  methods: {
    openModalItemDetail(idItem, selectedRelated) {
      this.$refs.modalItemDetail.showModalItemDetail(idItem, selectedRelated);
    },
  },
  computed: {
    ...mapState(['itemsLoaded']),
  },
};
</script>

<style scoped>
@import '~leaflet/dist/leaflet.css';
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';

.timeline-history {
  background: #152f4e;
}

.item-description {
  color: white;
  font-size: 1.4rem;
}

.item-description {
  cursor: pointer;
}

.list-item:hover .item-title {
  color: #65b32e;
}

.container-general {
  background: #152f4e;
  padding-bottom: 30px;
}

.item-title {
  color: white;
  font-weight: bold;
  font-size: 2.25rem;
}

.item-title:hover {
  cursor: pointer;
}

.item-image {
  height: 100%;
  width: 100%;
}

.item-summary-col {
  padding-left: 0 !important;
}

.item-summary {
  font-size: 0.7rem;
  line-height: 1.4;
}

.item-date {
  color: white;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0;
}

.item-date-line {
  position: absolute;
  top: 13px;
  width: 70px;
  background: #65b32e;
  height: 1px;
  content: '';
  left: 130px;
  right: 0;
}

.category-pill-history {
  color: white;
  display: inline-block;
  padding: 3px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  margin: 0 2px 0;
  border-radius: 3px;
}

.mb-50 {
  margin-bottom: 100px;
}
</style>

<style>
/*.leaflet-popup-content-wrapper {
        border-radius: 7px !important;
        border-left: solid #65B32E;
        border-left-width: 8px;
        cursor: pointer;
    }

    .leaflet-popup-content-wrapper:hover .item-title {
        color: #65B32E;
    }*/
.image-wrapper {
  width: 100%;
  height: 450px;
}

.image-wrapper:hover {
  cursor: pointer;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
