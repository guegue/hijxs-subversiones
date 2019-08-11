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
                    <template v-for="item in items">
                        <LMarker :lat-lng="item.marker">
                            <LPopup>
                                <span class="item-title" @click="openModalItemDetail(item.id)">{{ item.title }}</span>
                                <b-row class="mt-1" v-if="item.image !== null">
                                    <b-col @click="openModalItemDetail(item.id)">
                                        <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
                                    </b-col>
                                    <b-col cols="8" class="item-summary-col" @click="openModalItemDetail(item.id)">
                                        <div class="item-summary">
                                            <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary }}
                                        </div>
                                    </b-col>
                                </b-row>

                                <div class="item-summary" v-if="item.image === null" @click="openModalItemDetail(item.id)">
                                    <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary }}
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

    import {LMap, LTileLayer, LMarker, LPopup} from "vue2-leaflet";
    import MarkerCluster from 'vue2-leaflet-markercluster';
    import ModalItemDetail from "../ModalItemDetail";

    export default {
        name: "TimelineMap",
        mixins: [
            Encrypt,
            ItemMixin
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
                urlSiteBase: null,
                idSite: 12, //Rafael
                labelVocabulary: 'linea de tiempo',
                urlItemsBase: null,
                items: [],
                itemsCenterMarker: null,
                lat: 0,
                lng: 0,
                urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attributionMap: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                showPopup: false,
                isLoading: false,
                fullPage: true
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 1000) + '...';
            }
        },
        methods: {
            async loadItemsResources() {
                let itemsSetUrlLocal = [];

                this.urlSiteBase = this.$domainOmeka + 'api/item_sets?site_id=' + this.idSite + '&resource_class_label=' + this.labelVocabulary;
                const responseItemSet = await this.$axios(this.urlSiteBase);
                const dataItemSet = responseItemSet.data;

                for (let urlSet of dataItemSet) {
                    const setItemResponse = await this.$axios(urlSet['@id']);
                    const setItem = setItemResponse.data;

                    itemsSetUrlLocal.push(setItem['o:items']['@id']);
                }

                await this.loadAllItems(itemsSetUrlLocal);

            },
            async loadAllItems(itemsSetUrl) {
                let itemsResource = [];

                this.items = []; //Solo los items

                //Todos los ítems
                for (let itemUrl of itemsSetUrl) {

                    let itemSetUrl = itemUrl.split('?');
                    let itemSet1 = itemSetUrl[0];
                    let itemSet2 = itemSetUrl[1];

                    itemSetUrl = itemSet1 + '?' + this.$store.state.tagsCategoriesSelected + itemSet2;

                    this.urlItemsBase = itemSetUrl + '&' + this.propertyDateIn + this.timelineYearSelected + '&search=' + this.$store.state.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';

                    const itemsResponse = await this.$axios(this.urlItemsBase);
                    const items = itemsResponse.data;

                    items.forEach((item) => {
                        itemsResource.push(item);
                    });
                }

                for (let item of itemsResource) {
                    await this.getItem(item);
                }
            },
            async getItem(item) {
                //Si el ítem tiene fecha y descripción
                if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined' && (typeof item['dcterms:abstract']) !== 'undefined') {

                    //Solo la fecha del item
                    let date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

                    if (this.$moment(date, 'YYYY-MM-DD', true).isValid()) {

                        //Se inicializan los valores por cada ítem
                        let media = {
                            image: [],
                            video: [],
                            application: [],
                            audio: []
                        };

                        let image = null;

                        //Si el item tiene multimedia
                        if (item['o:media'].length > 0) {
                            if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

                                //Se recorre cada recurso para determinar el tipo archivo multimedia
                                for (let mediaItem of item['o:media']) {

                                    let urlMediaItem = mediaItem['@id'];

                                    const response = await this.$axios(urlMediaItem);

                                    let mediaType;
                                    let squareThumbnailResource;

                                    if (response.data['o:media_type'] !== null) {
                                        mediaType = response.data['o:media_type'].split("/")[0];
                                    }

                                    if (mediaType === 'image') {
                                        //Thumbnail del recurso
                                        squareThumbnailResource = response.data['o:thumbnail_urls'].square;

                                        if (squareThumbnailResource !== undefined) {

                                            image = squareThumbnailResource;
                                        } else {
                                            image = null
                                        }
                                    }

                                }
                            }
                        }

                        if (item['o-module-mapping:marker'] !== undefined) {
                            item['o-module-mapping:marker'].forEach((marker) => {

                                this.lat += marker['o-module-mapping:lat'];
                                this.lng += marker['o-module-mapping:lng'];

                                //Cada ítem
                                let itemObject = {
                                    id: item['o:id'],
                                    title: item['dcterms:title'][0]['@value'],
                                    date: date,
                                    summary: item['dcterms:abstract'][0]['@value'],
                                    description: item['dcterms:description'][0]['@value'],
                                    url: item['@id'],
                                    media: media,
                                    image: image,
                                    marker: L.latLng(marker['o-module-mapping:lat'], marker['o-module-mapping:lng'])
                                };

                                //Push todos los items
                                this.items.push(itemObject);
                            });

                        } else {

                            let address = item['dcterms:provenance'][0]['@value'];

                            const geocoder = new google.maps.Geocoder();

                            await geocoder.geocode({'address': address}, async (response, status) => {
                                if (status === 'OK') {
                                    let firstResult = response[0];
                                    let latG = firstResult.geometry.location.lat();
                                    let lngG = firstResult.geometry.location.lng();

                                    this.lat += latG;
                                    this.lng += lngG;

                                    //this.loadMapG();

                                    //Cada ítem
                                    let itemObject = {
                                        id: item['o:id'],
                                        title: item['dcterms:title'][0]['@value'],
                                        date: date,
                                        summary: item['dcterms:abstract'][0]['@value'],
                                        description: item['dcterms:description'][0]['@value'],
                                        url: item['@id'],
                                        media: media,
                                        image: image,
                                        marker: L.latLng(latG, lngG)
                                    };

                                    //Push todos los items
                                    this.items.push(itemObject);

                                } else {
                                    console.log('Google maps no se pudo cargar: ' + status);
                                }
                            });


                        }
                    }
                }
            },
            loadMapG() {
                const map = this.$refs.itemMap.mapObject;

                map.invalidateSize();

                map.whenReady(() => {
                    const [...coordinates] = this.items.map(item => [item.marker.lat, item.marker.lng]);

                    map.fitBounds([...coordinates]);
                    map.panTo(this.itemsCenterMarker);
                });
            },
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

            this.lat = 0;
            this.lng = 0;

            this.loadItemsResources().then(() => {
                this.itemsCenterMarker = L.latLng(
                    this.lat / this.items.length,
                    this.lng / this.items.length,
                );

                this.loadMapG();

                this.isLoading = false;
            });
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
        border-left: solid #65B32E;
        border-left-width: 8px;
        cursor: pointer;
    }

    .leaflet-popup-content-wrapper:hover .item-title {
        color: #65B32E;
    }
</style>