<template>
    <div class="list-item in-view" :id="'item-' + item.id">
        <span class="item-title" @click="showModalItemDetail(item.id)">{{ item.title }}</span>

        <b-row class="mt-1" v-if="item.image !== null">
            <b-col @click="showModalItemDetail(item.id)">
                <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
            </b-col>
            <b-col cols="8" class="item-summary-col" @click="showModalItemDetail(item.id)">
                <div class="mt-1 item-summary">
                    <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary | truncate}}
                </div>
            </b-col>
        </b-row>

        <div class="m-1 item-summary" v-if="item.image === null" @click="showModalItemDetail(item.id)">
            {{ item.summary | truncate}}
        </div>

        <b-modal no-close-on-backdrop ref="item-detail" size="xl" scrollable
                 modal-class="modal-item-detail" no-close-on-esc
                 @shown="modalShown"
                 header-text-variant="light" hide-footer>
            <template slot="modal-header" slot-scope="{ close }">
                <div class="item-title-modal">
                    {{ itemTitle }}
                </div>
                <span class="modal-button-close float-right" v-b-tooltip.hover title="Cerrar modal"
                      @click="hideModalItemDetail"><i
                        class="far fa-times-circle fa-3x"></i></span>
                <span v-if="modalButtonBack" class="modal-button-back float-right mr-3" v-b-tooltip.hover
                      title="Regresar al elemento anterior" @click="showModalItemDetail(itemId)"><i
                        class="far fa-arrow-alt-circle-left fa-2x"></i></span>
            </template>

            <b-row>
                <b-col cols="8">
                    <div class="ml-1 text-justify">
                        <p class="font-italic">{{ itemSummary }}</p>
                    </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="7">
                    <div class="ml-1 mt-2 text-justify">
                        <p>{{ itemDescription }}</p>
                    </div>
                </b-col>
                <b-col>
                    <b-card-body>
                        <div class="map-container">
                            <LMap ref="itemMap">
                                <LTileLayer :url="urlImageMap" :attribution="attributionMap"></LTileLayer>
                                <LMarker v-for="(marker, index) in itemMarkers" :lat-lng="marker" :key="index"></LMarker>
                            </LMap>
                            {{ itemProvenance }}
                        </div>
                    </b-card-body>
                </b-col>
            </b-row>
            <b-row class="mt-5">
                <b-col cols="12" class="tabs-modal">
                    <div>
                        <b-tabs content-class="mt-3" fill>
                            <b-tab v-if="media.image.length > 0" active>
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="fas fa-image"></i></div>
                                    IMÁGENES
                                </template>
                                <template v-if="media.image.length > 0">
                                    <div class="row text-center text-lg-left m-5">
                                        <div class="col-lg-3 col-md-4 col-6" v-for="(image, index) in media.image">
                                            <a :id="'images-' + index" href="javascript:" class="d-block mb-4 images"
                                               :data-index="index" @click="showImagesVideos">
                                                <img class="img-fluid img-thumbnail"
                                                     :src="image.thumbnail" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="text-center m-5">
                                        No hay imágenes disponibles
                                    </div>
                                </template>
                            </b-tab>
                            <b-tab v-if="media.video.length > 0">
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="fas fa-play-circle"></i></div>
                                    VIDEOS
                                </template>
                                <template v-if="media.video.length > 0">
                                    <div class="row text-center text-lg-left m-5">
                                        <div class="col-lg-3 col-md-4 col-6" v-for="(video, index) in media.video">
                                            <a :id="'videos-' + index" href="javascript:" class="d-block mb-4 videos"
                                               :data-index="index" @click="showImagesVideos">
                                                <img v-if="video.thumbnail !== null" class="img-fluid img-thumbnail"
                                                     :src="video.thumbnail" alt="">
                                                <img v-else class="img-fluid img-thumbnail"
                                                     src="../../assets/img/video-thumbnail-not-found.png"
                                                     alt="">
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="text-center m-5">
                                        No hay videos disponibles
                                    </div>
                                </template>
                            </b-tab>
                            <b-tab v-if="media.application.length > 0">
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="far fa-file-alt"></i></div>
                                    DOCUMENTOS
                                </template>
                                <template v-if="media.application.length > 0">
                                    <div class="row text-center text-lg-left m-5">
                                        <div class="col-lg-3 col-md-4 col-6" v-for="(doc, index) in media.application">
                                            <h6>{{ doc.name }}</h6>
                                            <a :id="'doc-' + index" href="javascript:" class="d-block mb-4 doc"
                                            :data-index="index" @click="showModalItemDocumentDetailIndividual(doc.url)">
                                                <img class="img-fluid img-thumbnail"
                                                    :src="doc.thumbnail" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="text-center m-5">
                                        No hay documentos disponibles
                                    </div>
                                </template>
                            </b-tab>
                            <b-tab v-if="media.audio.length > 0">
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="fas fa-file-audio"></i></div>
                                    AUDIOS
                                </template>
                                <template v-if="media.audio.length > 0">
                                    <b-row>
                                        <b-col cols="6" class="mb-1 mx-auto">
                                            <b-list-group>
                                                <b-list-group-item button v-for="(audio, index) in media.audio"
                                                                   :key="index"
                                                                   class="d-flex justify-content-between align-items-center"
                                                                   v-b-tooltip.hover=""
                                                                   title="Clic para reproducir audio" placement="top"
                                                                   @click="selectAudio(audio.url)">
                                                    {{ audio.name }}
                                                    <b-badge variant="success" pill><i class="fas fa-volume-up"></i>
                                                    </b-badge>
                                                </b-list-group-item>

                                            </b-list-group>
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col cols="10 mx-auto">
                                            <div>
                                                <b-embed
                                                        :src="audioUrl"
                                                ></b-embed>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </template>
                                <template v-else>
                                    <div class="text-center m-5">
                                        No hay audios disponibles
                                    </div>
                                </template>
                            </b-tab>
                            <b-tab v-if="itemsRelatedEspecific.length > 0">
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="fab fa-discourse"></i></div>
                                    RELACIONADOS
                                </template>
                                <template v-if="itemsRelatedEspecific.length > 0">
                                    <div class="row text-center m-5">
                                        <div class="col-lg-3 col-md-4 col-6"
                                             v-for="(itemRelated, index) in itemsRelatedEspecific">
                                            <!--<a :id="'videos-' + index" href="javascript:" class="d-block mb-4 videos"
                                               :data-index="index" @click="showImagesVideos">
                                                <img v-if="video.thumbnail !== null" class="img-fluid img-thumbnail"
                                                     :src="video.thumbnail" alt="">
                                                <img v-else class="img-fluid img-thumbnail"
                                                     src="https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiwtP65rpDjAhVls1kKHQ-5CDAQjxx6BAgBEAI&url=http%3A%2F%2Fchittagongit.com%2Fdownload%2F236273&psig=AOvVaw3MXyfd9AygO0hHgsuOxZf-&ust=1561955064804329"
                                                     alt="">
                                            </a>-->

                                            <b-card
                                                    @click="showModalItemDetail(itemRelated.id, selectedRelated = true), itemId = item.id"
                                                    class="card-item-related"
                                                    no-body
                                                    style="max-width: 20rem;"
                                                    :img-src="itemRelated.hasMedia ? itemRelated.image: 'https://placekitten.com/380/200'"
                                                    img-alt="Image"
                                                    img-top
                                                    header-class="card-item-related-header"
                                            >
                                                <h4 slot="header">{{ itemRelated.title }}</h4>
                                            </b-card>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="text-center m-5">
                                        No hay elementos relacionados.
                                    </div>
                                </template>
                            </b-tab>
                        </b-tabs>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal no-close-on-backdrop ref="item-audio-detail" size="xl" scrollable :title="item.title"
                 modal-class="modal-item-detail"
                 header-text-variant="light" hide-footer>

            <b-row>
                <b-col cols="6" class="mb-1 mx-auto">
                    <b-list-group>
                        <b-list-group-item button v-for="(audio, index) in media.audio" :key="index"
                                           class="d-flex justify-content-between align-items-center"
                                           v-b-tooltip.hover="" title="Clic para reproducir audio" placement="top"
                                           @click="selectAudio(audio.url)">
                            {{ audio.name }}
                            <b-badge variant="success" pill><i class="fas fa-volume-up"></i></b-badge>
                        </b-list-group-item>

                    </b-list-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="10 mx-auto">
                    <div>
                        <b-embed
                                :src="audioUrl"
                        ></b-embed>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal no-close-on-backdrop ref="item-document-detail-individual" size="xl" scrollable
                 modal-class="modal-item-detail"
                 header-text-variant="light" hide-footer>
            <template slot="modal-header" slot-scope="{ close }">
                {{ itemTitle }}
                <span class="modal-button-close float-right" v-b-tooltip.hover title="Cerrar modal"
                      @click="hideModalItemDocumentDetailIndividual"><i
                        class="far fa-times-circle fa-3x"></i></span>
            </template>

            <b-row>
                <b-col cols="10 mx-auto">
                    <div>
                        <b-embed
                                :src="documentUrl"
                        ></b-embed>
                    </div>
                </b-col>
            </b-row>
        </b-modal>


    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';
    import timelineHorizontalMixin from '../../mixins/timelineHorizontalMixin';
    
    import { LMap, LTileLayer, LMarker, LIcon} from "vue2-leaflet"

    export default {
        name: "TimelineItem",
        mixins: [
            timelineMixin,
            timelineHorizontalMixin,
        ],
        components:{
            LMap, 
            LTileLayer, 
            LMarker, 
        },
        props: ['item', 'margin'],
        data() {
            return {
                documentUrl: null,
                audioUrl: null,
                itemId: '',
                itemTitle: '',
                itemSummary: '',
                itemDescription: '',
                itemProvenance: '',
                itemMarkers: [],
                itemCenterMarker: '',
                modalButtonBack: false,
                media: {
                    image: [],
                    video: [],
                    application: [],
                    audio: []
                },
                itemsRelatedEspecific: []
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 120) + '...';
            }
        },  
        methods: {
            async loadMediaItem(idItem) {

                this.media = {
                    image: [],
                    video: [],
                    application: [],
                    audio: []
                };

                const responseItem = await this.$axios(this.$domainOmeka + 'api/items/' + idItem);
                const item = responseItem.data;

                //Si el item tiene multimedia
                if (item['o:media'].length > 0) {
                    if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

                        //Se recorre cada recurso para determinar el tipo archivo multimedia
                        for (let mediaItem of item['o:media']) {

                            let urlMediaItem = mediaItem['@id'];

                            const response = await this.$axios(urlMediaItem);

                            let provider;
                            let mediaType;
                            let urlResource;
                            let nameResource;
                            let thumbnailResource;
                            let squareThumbnailResource;
                            let resource;
                            let hasExternalProvider;

                            //El proveedor del arhivo multimedia
                            provider = response.data['o:ingester'];

                            //Url del recurso
                            urlResource = response.data['o:original_url'];

                            //Nombre del recurso
                            nameResource = response.data['o:source'];

                            //Thumbnail del recurso
                            squareThumbnailResource = response.data['o:thumbnail_urls'].square;

                            if (squareThumbnailResource !== undefined) {

                                thumbnailResource = squareThumbnailResource;
                            } else {
                                thumbnailResource = null
                            }

                            //Si es cualquier de estos proveedores entonces se entiende que es video
                            if (provider === 'vimeo' || provider === 'youtube') {
                                mediaType = 'video';

                                urlResource = response.data['o:source'];
                                nameResource = null;

                                hasExternalProvider = true;
                            } else {
                                if (response.data['o:media_type'] !== null) {
                                    mediaType = response.data['o:media_type'].split("/")[0];
                                    hasExternalProvider = false;
                                }
                            }

                            //Cada recurso multimedia
                            resource = {
                                provider: hasExternalProvider,
                                url: urlResource,
                                name: nameResource,
                                thumbnail: thumbnailResource
                            };

                            if (mediaType === 'image') {
                                this.media.image.push(resource);
                            } else if (mediaType === 'video') {
                                this.media.video.push(resource);
                            } else if (mediaType === 'application') {
                                this.media.application.push(resource);
                            } else if (mediaType === 'audio') {
                                this.media.audio.push(resource);
                            } else {

                            }

                        }
                    }
                }
            },
            modalShown() {
                const map = this.$refs.itemMap.mapObject;
                map.invalidateSize();
                
                if (this.itemCenterMarker !== null && this.itemMarkers.length > 0) {
                    const [ ...coordinates ] = this.itemMarkers.map(marker => [marker.lat, marker.lng]);        
                    map.fitBounds([ ...coordinates ]);
                    map.panTo(this.itemCenterMarker);
                }
            },
            showImagesVideos(event) {
                let imagesVideos = [];
                let target, targetId;
                let sources = [];

                let index = event.currentTarget.getAttribute('data-index');

                target = event.currentTarget.classList;
                targetId = event.currentTarget.id;

                /* Si es ver videos se debe validar si son proveidos por app externa o son subidos a omeka
                *  en dependencia de eso es como se deben pasar a lightgallery
                * */
                if (target.contains('videos')) {
                    sources = this.media.video;

                    sources.forEach((video) => {

                        let videoSource = {};

                        //Si el video es de vimeo/youtube
                        if (video.provider) {
                            videoSource = {
                                src: video.url,
                                thumb: video.thumbnail
                            }
                        } else {
                            videoSource = {
                                html: '<video class="lg-video-object lg-html5" controls><source src="' + video.url + '" type="video/mp4">' + video.name + '</video>',
                                thumb: video.thumbnail
                            }
                        }

                        imagesVideos.push(videoSource);
                    });
                }

                if (target.contains('images')) {
                    sources = this.media.image;

                    sources.forEach((image) => {
                        let imageSource = {
                            src: image.url,
                            thumb: image.thumbnail
                        };

                        imagesVideos.push(imageSource);
                    });
                }

                lightGallery(document.getElementById(targetId), {
                    index: parseInt(index, 10),
                    dynamic: true,
                    dynamicEl: imagesVideos
                })
            },
            showDocuments() {
                this.showModalItemDocumentDetail();
            },
            showAudios() {
                this.showModalItemAudioDetail();
            },
            async showModalItemDetail(idItem, selectedRelated) {
                let lat = 0;
                let lng = 0;
                this.itemMarkers = [];

                this.modalButtonBack = false;

                if (selectedRelated) {
                    this.modalButtonBack = !this.modalButtonBack;
                }

                let url = this.$domainOmeka + 'api/items/' + idItem;

                const response = await this.$axios(url);
                const item = response.data;

                this.itemTitle = item['dcterms:title'][0]['@value'];
                this.itemSummary = item['dcterms:abstract'][0]['@value'];
                this.itemDescription = item['dcterms:description'][0]['@value'];
                this.itemProvenance = item['dcterms:provenance'][0]['@value'];
                
                if (item['o-module-mapping:marker'] !== undefined) {
                    item['o-module-mapping:marker'].forEach((marker) => {
                        
                        lat += marker['o-module-mapping:lat'];
                        lng += marker['o-module-mapping:lng'];

                        this.itemMarkers.push(L.latLng(
                            marker['o-module-mapping:lat'],
                            marker['o-module-mapping:lng']
                        ));
                    });

                    this.itemCenterMarker = L.latLng(
                        lat / this.itemMarkers.length,
                        lng / this.itemMarkers.length,
                    );
                    
                } else {
                    const geocoder = new google.maps.Geocoder();
                    let address = this.itemProvenance;

                    await geocoder.geocode({ 'address': address}, (response, status) => {
                        if (status === 'OK') {
                            let firstResult = response[0];
                            let latG = firstResult.geometry.location.lat();
                            let lngG = firstResult.geometry.location.lng();
                            
                            this.itemMarkers.push(L.latLng(latG, lngG));

                            this.itemCenterMarker = L.latLng(latG, lngG);

                            this.loadMapG(); 

                        } else {
                            console.log('Google maps no se pudo cargar: ' + status);
                        }

                    });
                }

                this.loadMediaItem(idItem);

                this.loadItemsRelatad().then(() => {

                    this.itemsRelatedEspecific = [];

                    this.itemsRelated.forEach((itemRelated) => {
                        if (idItem === itemRelated.id_item_related) {
                            this.itemsRelatedEspecific.push(itemRelated);
                        }
                    });
                });

                this.$refs['item-detail'].show();

            },
            hideModalItemDetail() {
                this.$refs['item-detail'].hide();
            },
            showModalItemDocumentDetailIndividual(url) {

                this.selectDocument(url);

                this.$refs['item-document-detail-individual'].show()
            },
            hideModalItemDocumentDetailIndividual() {
                this.$refs['item-document-detail-individual'].hide()
            },
            selectDocument(url) {
                this.documentUrl = url;
            },
            selectAudio(url) {
                this.audioUrl = url;
            },
            loadMapG() {
                const map = this.$refs.itemMap.mapObject;
                            
                map.invalidateSize();

                map.whenReady(() => {
                    const [ ...coordinates ] = this.itemMarkers.map(marker => [marker.lat, marker.lng]);
                    
                    map.fitBounds([ ...coordinates ]);
                    map.panTo(this.itemCenterMarker); 
                });
            }
        },
        mounted() {

        },
        updated() {

            //Cerrar modal luego de quitar el focus de imágenes o videos
            document.addEventListener('keydown', (evt) =>  {
                evt = evt || window.event;
                let isEscape = false;

                if ("key" in evt) {
                    isEscape = (evt.key === "Escape" || evt.key === "Esc");
                } else {
                    isEscape = (evt.keyCode === 27);
                }
                if (isEscape) {
                    let activeElement = this.$refs['item-detail'].getActiveElement();

                    if (activeElement !== null && activeElement.classList.contains('modal')){
                        this.$refs['item-detail'].hide();
                    }
                }
            });
        }
    }
</script>

<style scoped>
    @import "~leaflet/dist/leaflet.css";

    .map-container {
        width: 100%;
        height: 270px;
    }

    .list-item {
        top: -100px;
        cursor: pointer;
        position: absolute;
        width: 19%;
        padding: 6px 10px;
        margin-left: -25px;
        color: #152f4e;
        text-align: justify;
        background: white;
        border-radius: 7px;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        border-left: solid #65B32E;
        border-left-width: 8px;
        transition: z-index;
        /* overflow: hidden; */
        white-space: normal;
        z-index: 1;
    }

    .list-item:hover .item-title {
        color: #65B32E;
    }

    .timeline-dl dd:nth-of-type(odd) .list-item::before {
        content: '';
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        border: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: -1px;
        border-top: 10px solid white;
        bottom: -10px;
    }

    .timeline-dl dd:nth-of-type(even) .list-item::before {
        content: '';
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        border: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 6%;
        border-top: 10px solid white;
        bottom: -10px;
    }

    /* .timeline-dl dd:nth-of-type(odd) .list-item {
        background: green;
    } */

    .timeline-dl dd:nth-of-type(even) .list-item {
        top: -250px;
        margin-left: -40px;
    }

    .list-item-width {
        width: 450px !important;
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

    .item-summary-col {
        padding-left: 0 !important;
    }

    .item-summary {
        font-size: 0.7rem;
        line-height: 1.4;
    }

    .item-summary-selected {
        font-size: 0.8rem;
    }

    .item-date {
        color: #65B32E;
    }

    .seeMore {
        font-style: normal;
        font-weight: bold;
        padding-top: 10px;
        text-align: right;
        margin-bottom: 4px;
        padding-bottom: 4px;
        color: #65B32E;
        text-decoration: none !important;
        cursor: pointer;
    }

    .button-media {
        font-weight: bold;
        color: #152f4e;
    }

    .fa-xs {
        color: rgb(193, 193, 193);
    }

    .button-media:hover {
        cursor: pointer;
    }

    .button-media-icon {
        background: #152f4e;
        border-radius: 50%;
        height: 28px;
        width: 28px;
        padding-left: 8px;
        float: right;
    }

    .button-media-icon-modal {
        color: #152f4e;
        background: white;
        border-radius: 50%;
        height: 25px;
        width: 25px;
        display: inline-block;
        padding-top: 1px;
        padding-left: 1px;
    }

    .card {
        border: 0;
    }

    .card-body {
        padding: 0;
    }

    .tabs-modal {
        padding: 0 !important;
    }

    .img-fluid {
        height: 100% !important;
    }

    .card-item-related:hover {
        cursor: pointer;
        transform: scale(1.1);
        transition: .5s;
        color: #65B32E;
    }

    .card-item-related-header {
        background: #213853;
        min-height: 100px;
    }

    .modal-button-close {
        top: 0;
        position: -webkit-sticky;
        position: sticky;
    }

    .modal-button-close:hover {
        cursor: pointer;
        color: #65B32E;
    }

    .modal-button-back:hover {
        cursor: pointer;
        color: #65B32E;
    }

    .item-title-modal {
        position: absolute;
        font-size: 30px;
        font-weight: bold;
    }

    .item-image {
        width: 100%;
    }
</style>

<style>
    @import "~leaflet/dist/leaflet.css";
    .nav-tabs {
        background: #213853;
        border: 0 !important;
    }

    .nav-tabs .nav-link {
        color: white;
    }

    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
        color: #65B32E !important;
        border: 0;
    }

    .nav-tabs .nav-link.active {
        color: #65B32E !important;
        background: #213853 !important;
        border-color: #65B32E !important;
        border-left: 0;
        border-top: 0;
        border-right: 0;
        border-bottom: 5px solid;
    }

    .modal-item-detail > .modal-dialog {
        
    }

    .modal-item-detail > .modal-dialog > .modal-content {
        color: white;
        background: #152f4e;
        border-radius: 0;
    }

    .modal-item-detail > .modal-dialog > .modal-content > .modal-header {
        display: inline-block !important;
        color: white;
        background: #152f4e;
        border-radius: 0;
        border: 0;
    }

    .modal-item-detail > .modal-dialog > .modal-content > .modal-body {
        color: white;
        background: #152f4e;
    }
</style>