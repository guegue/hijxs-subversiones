<template>
    <div class="list-item in-view" :id="'item-' + item.id" @click="selectItem($event, item.id)">
        <h4 class="titleItemTimeline">{{ item.title }}</h4>
        <time>{{ item.date }}</time>

        <div class="mt-2">
            <div v-b-toggle="'collapse-' + item.id" class="button-media" @click="loadMediaItem(item.id)">
                <div class="button-media-icon"><i class="fas fa-photo-video fa-xs"></i></div>
                RECURSOS MULTIMEDIAS
            </div>
            <b-collapse :id="'collapse-' + item.id" class="mt-2">
                <b-card class="icons-media">
                    <b-row>
                        <b-col>
                            <div :id="'videos-' + item.id" v-if="media.video.length > 0"
                                 class="m-1 d-inline-block align-middle videos"
                                 @click="showImagesVideos">
                                <b-button variant="success" v-b-tooltip.hover="" title="Ver videos"><i
                                        class="fas fa-video"></i>
                                </b-button>
                            </div>

                            <div :id="'images-' + item.id" v-if="media.image.length > 0"
                                 class="m-1 d-inline-block align-middle images"
                                 @click="showImagesVideos">
                                <b-button variant="success" v-b-tooltip.hover="" title="Ver imágenes">
                                    <i class="fas fa-images"></i></b-button>
                            </div>

                            <div v-if="media.application.length > 0" class="m-1 d-inline-block align-middle"
                                 @click="showDocuments">
                                <b-button variant="success" v-b-tooltip.hover="" title="Ver documentos"><i
                                        class="fas fa-file-alt"></i></b-button>
                            </div>

                            <div v-if="media.audio.length > 0" class="m-1 d-inline-block align-middle"
                                 @click="showAudios">
                                <b-button variant="success" v-b-tooltip.hover="" title="Escuchar audios"><i
                                        class="fas fa-file-audio"></i></b-button>
                            </div>
                        </b-col>
                    </b-row>
                </b-card>
            </b-collapse>
        </div>

        <div class="m-1">
            {{ item.summary | truncate}}
        </div>

        <b-row>
            <b-col>
                <span class="seeMore float-right" @click="showModalItemDetail(item.id)">VER MÁS</span>
            </b-col>
        </b-row>

        <b-modal no-close-on-backdrop ref="item-detail" size="xl" scrollable :title="itemTitle"
                 modal-class="modal-item-detail"
                 header-text-variant="light" hide-footer>
            <template slot="modal-header" slot-scope="{ close }">
                <span class="modal-button-close float-right" v-b-tooltip.hover title="Cerrar modal"
                      @click="hideModalItemDetail"><i
                        class="far fa-times-circle fa-2x"></i></span>
                <span v-if="modalButtonBack" class="modal-button-back float-right mr-3" v-b-tooltip.hover
                      title="Regresar al elemento anterior" @click="showModalItemDetail(itemId)"><i
                        class="far fa-arrow-alt-circle-left fa-2x"></i></span>
            </template>

            <b-row>
                <b-col cols="8">
                    <div class="ml-1 text-justify">
                        <p>{{ itemSummary }}</p>
                    </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="9">
                    <div class="ml-1 mt-2 text-justify">
                        <p>{{ itemDescription }}</p>
                    </div>
                </b-col>
                <b-col>
                    <b-card-body>
                        <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=Cercado+de+Lima,+Per%C3%BA/@-12.0552073,-77.0627323,14z/data=!3m1!4b1!4m13!1m7!3m6!1s0x9105c850c05914f5:0xf29e011279210648!2zUGVyw7o!3b1!8m2!3d-9.189967!4d-75.015152!3m4!1s0x9105c8db1e539667:0x4f45538aa07bda29!8m2!3d-12.050065!4d-77.0471191"
                                width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>
                    </b-card-body>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" class="tabs-modal">
                    <div>
                        <b-tabs content-class="mt-3" fill>
                            <b-tab active>
                                <template slot="title">
                                    <div class="button-media-icon-modal"><i class="far fa-file-alt"></i></div>
                                    DOCUMENTOS
                                </template>
                                <template v-if="media.application.length > 0">
                                    <b-row>
                                        <b-col cols="6" class="mb-1 mx-auto">
                                            <b-list-group>
                                                <b-list-group-item button v-for="(doc, index) in media.application"
                                                                   :key="index"
                                                                   class="d-flex justify-content-between align-items-center"
                                                                   v-b-tooltip.hover="" title="Clic para ver documento"
                                                                   placement="top"
                                                                   @click="selectDocument(doc.url)">
                                                    {{ doc.name }}
                                                    <b-badge variant="success" pill><i class="fas fa-eye"></i></b-badge>
                                                </b-list-group-item>

                                            </b-list-group>
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col cols="10 mx-auto">
                                            <div>
                                                <b-embed
                                                        :src="documentUrl"
                                                ></b-embed>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </template>
                                <template v-else>
                                    No hay documentos disponibles
                                </template>
                            </b-tab>
                            <b-tab>
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
                                    No hay imágenes disponibles
                                </template>
                            </b-tab>
                            <b-tab>
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
                                                     src="https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiwtP65rpDjAhVls1kKHQ-5CDAQjxx6BAgBEAI&url=http%3A%2F%2Fchittagongit.com%2Fdownload%2F236273&psig=AOvVaw3MXyfd9AygO0hHgsuOxZf-&ust=1561955064804329"
                                                     alt="">
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    No hay videos disponibles
                                </template>
                            </b-tab>
                            <b-tab>
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
                                    No hay audios disponibles
                                </template>
                            </b-tab>
                            <b-tab title="RELACIONADOS">
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
                                    No hay elementos relacionados.
                                </template>
                            </b-tab>
                        </b-tabs>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal no-close-on-backdrop ref="item-document-detail" size="xl" scrollable :title="item.title"
                 modal-class="modal-item-detail"
                 header-text-variant="light" hide-footer>

            <b-row>
                <b-col cols="6" class="mb-1 mx-auto">
                    <b-list-group>
                        <b-list-group-item button v-for="(doc, index) in media.application" :key="index"
                                           class="d-flex justify-content-between align-items-center"
                                           v-b-tooltip.hover="" title="Clic para ver documento" placement="top"
                                           @click="selectDocument(doc.url)">
                            {{ doc.name }}
                            <b-badge variant="success" pill><i class="fas fa-eye"></i></b-badge>
                        </b-list-group-item>

                    </b-list-group>
                </b-col>
            </b-row>

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
    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';
    import timelineHorizontalMixin from '../../mixins/timelineHorizontalMixin';

    export default {
        name: "TimelineItem",
        mixins: [
            timelineMixin,
            timelineHorizontalMixin
        ],
        props: ['item', 'margin'],
        data() {
            return {
                documentUrl: null,
                audioUrl: null,
                itemId: '',
                itemTitle: '',
                itemSummary: '',
                itemDescription: '',
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

                this.modalButtonBack = false;

                if (selectedRelated) {
                    this.modalButtonBack = !this.modalButtonBack;
                }

                let url = await this.$domainOmeka + 'api/items/' + idItem;

                const response = await this.$axios(url);
                const item = response.data;

                this.itemTitle = item['dcterms:title'][0]['@value'];
                this.itemSummary = item['dcterms:abstract'][0]['@value'];
                this.itemDescription = item['dcterms:description'][0]['@value'];

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
            showModalItemDocumentDetail() {
                this.$refs['item-document-detail'].show()
            },
            showModalItemAudioDetail() {
                this.$refs['item-audio-detail'].show()
            },
            selectDocument(url) {
                this.documentUrl = url;
            },
            selectAudio(url) {
                this.audioUrl = url;
            },
            async selectItem(event, idItem) {

                this.$root.$emit('selectItem', idItem);

                if (this.listItemsExist()) {
                    this.clearCircleItemsSelected();

                    this.selectItemCircle(idItem);
                }
            }
        },
        mounted() {
            let currentWidth = this.$el.clientWidth;
            let newWidth = 33 - this.margin;
            this.$el.style.width = newWidth + '%';

            this.$nextTick(() => {
                this.$root.$on('selectItem', (idItem) => {
                    if (document.querySelectorAll('.list-item').length > 0) {
                        let item = document.getElementById('item-' + idItem);

                        if (item !== null) {

                            this.clearItemsSelected();

                            item.style.zIndex = '1';
                            item.style.transform = 'scale(1.1)';
                            item.style.background = 'white';
                            item.style.transition = 'transform 400ms 0ms, z-index 0ms 0ms';

                            item.classList.add('list-item-width');
                        }
                    }
                });
            });
        }
    }
</script>

<style scoped>
    .list-item {
        cursor: pointer;
        position: relative;
        width: 450px;
        height: 250px;
        padding-top: 15px;
        padding-left: 35px;
        padding-right: 35px;
        margin-top: -120px;
        color: #152f4e;
        text-align: justify;
        background: white;
        border-radius: 7px;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        border-left: solid #65B32E;
        border-left-width: 13px;
        transition: z-index;
        overflow-y: hidden;
    }

    .list-item-width {
        width: 450px !important;
    }

    /*.list-item:hover {
        transform: scale(1.1);
        z-index: 1;
        transition: transform 400ms 0ms, z-index 0ms 0ms; !* Remove the z-index transition delay on hover. This is counter-intuitive but works. *!
        background: white !important;
    }*/

    .titleItemTimeline {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        color: #152f4e;
        font-weight: bold;
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

    .fa-photo-video {
        color: rgb(193, 193, 193);
    }

    .button-media:hover {
        cursor: pointer;
    }

    .button-media-icon {
        background: #152f4e;
        border-radius: 50%;
        height: 25px;
        width: 25px;
        display: inline-block;
        padding-left: 5px;
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
</style>

<style>
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
        max-width: 100%;
        margin: 0;
        height: 100vh;
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