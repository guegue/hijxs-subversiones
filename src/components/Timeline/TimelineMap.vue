<template>
    <div>
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
        <div class="map-container">
            <LMap ref="itemMap">
                <LTileLayer :url="urlImageMap" :attribution="attributionMap"></LTileLayer>
                <MarkerCluster>
                    <template v-for="item in itemsOrdered">
                        <LMarker v-if="item.marker !== null" :lat-lng="item.marker">
                            <LPopup>
                                <span class="item-title" @click="openModalItemDetail(item.id)">{{ item.title }}</span>
                                <b-row class="mt-1" v-if="item.image !== null">
                                    <b-col @click="openModalItemDetail(item.id)">
                                        <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
                                    </b-col>
                                    <b-col cols="8" class="item-summary-col" @click="openModalItemDetail(item.id)">
                                        <div class="item-summary">
                                            <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{
                                            item.summary }}
                                        </div>
                                    </b-col>
                                </b-row>

                                <div class="item-summary" v-if="item.image === null"
                                     @click="openModalItemDetail(item.id)">
                                    <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary
                                    }}
                                </div>
                            </LPopup>
                        </LMarker>
                    </template>
                </MarkerCluster>
            </LMap>
            <ModalItemDetail ref="modalItemDetail"/>
        </div>
    </div>

</template>

<script>
    import TopBar from '../../components/TopBar';
    import Encrypt from '../../mixins/encryptStringMixin';
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
                urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attributionMap: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                showPopup: false,
                fullPage: true,
                itemsOrdered: []
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 1000) + '...';
            }
        },
        methods: {
            loadMapG() {
                const map = this.$refs.itemMap.mapObject;

                map.invalidateSize();

                map.whenReady(() => {
                    const [...coordinates] = this.itemsOrdered.map(item => item.marker !== null ? [item.marker.lat, item.marker.lng] : [0, 0]);

                    map.fitBounds([...coordinates]);
                    map.panTo(this.itemsCenterMarker);
                });
            },
            openModalItemDetail(idItem, selectedRelated) {
                this.$refs.modalItemDetail.showModalItemDetail(idItem, selectedRelated);
            }
        },
        created() {
            /*if (localStorage.getItem("menuSite") === null) {
                this.$router.push('/');
            }*/

            this.$menuSite = JSON.parse(localStorage.getItem("menuSite"));
        },
        mounted() {
            this.isLoading = true;

            this.isLoading = true;
            this.$store.dispatch('itemsLoad', {
                domainOmeka: this.$domainOmeka,
                idSite: this.idSite,
                labelVocabulary: this.labelVocabulary,
                filter: {searchValue: '', tagsCategories: ''}
            }).then(() => {
                this.getItems(this.itemsLoaded).then(() => {
                    this.groupItemsByDate().then(() => {
                        console.log(this.itemsByDateArray);
                        for (let itemByYear of this.itemsByDateArray) {
                            for (let itemByMonth of itemByYear.months) {
                                for (let itemByDay of itemByMonth.days) {
                                    for (let item of itemByDay.items) {
                                        this.itemsOrdered.push(item);
                                    }
                                }
                            }
                        }

                        this.itemsCenterMarker = L.latLng(
                            this.lat / this.itemsOrdered.length,
                            this.lng / this.itemsOrdered.length,
                        );

                        this.loadMapG();

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

    .container-general {
        background: #152f4e;
        padding-bottom: 30px;
    }

    .map-container {
        width: 100%;
        height: 100vh;
    }

    .item-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
        overflow: hidden;

        color: #152f4e;
        font-weight: bold;
        font-size: 0.8rem;
    }

    .item-image {
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
        color: #65B32E;
    }

</style>

<style>
    .leaflet-popup-content-wrapper {
        border-radius: 7px !important;
        border-left: solid white;
        border-left-width: 8px;
        cursor: pointer;
    }

    .leaflet-popup-content-wrapper:hover .item-title {
        color: #65B32E;
    }
</style>