<template>
    <div class="timeline-history">
        <loading :active.sync="isLoading"
                 :can-cancel="false"
                 :is-full-page="fullPage"
        />

        <div>
            <div class="container-general" id="main-content-site">
                <div class="m-auto pl-1" style="width: 85%;">
                    <TopBar :indexMenu="-1" :menuSite="$menuSite"></TopBar>
                </div>
            </div>
        </div>
        <b-container class="items-container">
            <template v-if="itemsOrdered.length > 0" v-for="(item, itemIndex) in itemsOrdered">

                <!--<div class="list-item in-view" :id="'item-' + item.id">
                        <span class="item-title" @click="openModalItemDetail(item.id)">{{ item.title }}</span>

                        <b-row class="mt-1" v-if="item.image !== null">
                            <b-col @click="openModalItemDetail(item.id)" v-if="itemIndex % 2 === 0">
                                <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
                            </b-col>
                            <b-col cols="10" class="item-summary-col" @click="openModalItemDetail(item.id)">
                                <div class="item-summary">
                                    <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary }}
                                </div>
                            </b-col>
                            <b-col @click="openModalItemDetail(item.id)" v-if="itemIndex % 2 !== 0">
                                <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
                            </b-col>
                        </b-row>

                        <div class="item-summary" v-if="item.image === null" @click="openModalItemDetail(item.id)">
                            <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary }}
                        </div>

                    </div>-->

                <b-row class="mt-5 mb-50" data-aos="fade-up" data-aos-duration="3000">
                    <b-col cols="6" v-if="itemIndex % 2 === 0">
                        <div class="image-wrapper" @click="openModalItemDetail(item.id)">
                            <b-img :src="item.imageLarge" rounded alt="Rounded image"></b-img>
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
                                <div class="text-justify item-title" @click="openModalItemDetail(item.id)">{{ item.title }}</div>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col>
                                <div class="text-justify item-description" @click="openModalItemDetail(item.id)">
                                    <p>{{ item.description | truncate}}</p>
                                </div>
                                <div class="categories-wrapper">
                                    <span v-b-tooltip.hover :title="category.nameCategory"
                                          v-for="category in item.categories"
                                          :class="['category-pill-history', category.classcolor]">{{ category.nameCategory }}</span>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="6" v-if="itemIndex % 2 !== 0">
                        <div class="image-wrapper">
                            <b-img :src="item.imageLarge" rounded alt="Rounded image"></b-img>
                        </div>
                    </b-col>
                </b-row>

            </template>

            <ModalItemDetail ref="modalItemDetail"/>
        </b-container>
    </div>

</template>

<script>
    import TopBar from '../../components/TopBar';
    import Encrypt from '../../mixins/encryptStringMixin';
    import TodoItemsMixin from '../../mixins/todoItemsMixin';
    import ItemMixin from '../../mixins/itemMixin';
    import TimelineMixin from '../../mixins/timelineMixin';

    import {LMap, LTileLayer, LMarker, LPopup} from "vue2-leaflet";
    import MarkerCluster from 'vue2-leaflet-markercluster';
    import ModalItemDetail from "../ModalItemDetail";
    import {mapState} from 'vuex';

    export default {
        name: "TimelineMap",
        mixins: [
            Encrypt,
            TodoItemsMixin,
            ItemMixin,
            TimelineMixin
        ],
        components: {
            TopBar,
            LMap,
            LTileLayer,
            LMarker,
            LPopup,
            MarkerCluster,
            ModalItemDetail
        },
        data() {
            return {
                itemsCenterMarker: null,
                lat: 0,
                lng: 0,
                urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attributionMap: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                showPopup: false,
                isLoading: false,
                fullPage: true,
                itemsOrdered: []
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 200) + '...';
            }
        },
        methods: {
            openModalItemDetail(idItem, selectedRelated) {
                this.$refs.modalItemDetail.showModalItemDetail(idItem, selectedRelated);
            }
        },
        created() {
            if (localStorage.getItem("menuSite") === null) {
                this.$router.push('/');
            }

            this.$menuSite = JSON.parse(localStorage.getItem("menuSite"));
        },
        mounted() {
            this.isLoading = true;
            this.$store.dispatch('itemsLoad', {
                domainOmeka: this.$domainOmeka,
                idSite: this.idSite,
                labelVocabulary: this.labelVocabulary
            }).then(() => {
                this.getItems(this.itemsLoaded).then(() => {
                    this.groupItemsByDate().then(() => {
                        for (let itemByYear of this.itemsByDateArray) {
                            for (let itemByMonth of itemByYear.months) {
                                for (let itemByDay of itemByMonth.days) {
                                    for (let item of itemByDay.items) {
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
        computed: {
            ...mapState([
                'itemsLoaded'
            ])
        }
    }
</script>

<style scoped>
    @import "~leaflet/dist/leaflet.css";
    @import "~leaflet.markercluster/dist/MarkerCluster.css";
    @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

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
        color: #65B32E;
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
        background: #65B32E;
        height: 1px;
        content: "";
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