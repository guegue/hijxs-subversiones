<template>
    <div class="list-item in-view" :id="'item-' + item.id" @mouseenter="hoverItem($event, item.id)">
        <h4 class="titleItemTimeline">{{ item.title }}</h4>
        <time>{{ item.date }}</time>

        <div class="mt-2">
            <div v-b-toggle="'collapse-' + item.id" class="button-media" @click="showMediaIcons($event, item.id)">
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
            {{ item.description | truncate}}
        </div>

        <b-row>
            <b-col>
                <span class="seeMore float-right" @click="showModalItemDetail">VER MÁS</span>
            </b-col>
        </b-row>

        <b-modal no-close-on-backdrop ref="item-detail" size="xl" scrollable :title="item.title"
                 header-bg-variant="success"
                 header-text-variant="light" hide-footer>
            <div class="m-1 text-justify">
                <p class="my-4">{{ item.description}}</p>
            </div>
        </b-modal>

        <b-modal no-close-on-backdrop ref="item-document-detail" size="xl" scrollable :title="item.title"
                 header-bg-variant="success"
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
                 header-bg-variant="success"
                 header-text-variant="light" hide-footer>

            <b-row>
                <b-col cols="6" class="mb-1 mx-auto">
                    <b-list-group>
                        <b-list-group-item button v-for="(audio, index) in item.media.audio" :key="index"
                                           class="d-flex justify-content-between align-items-center"
                                           v-b-tooltip.hover="" title="Clic para ver documento" placement="top"
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
    import timelineHorizontalMixin from '../../mixins/timelineHorizontalMixin';

    export default {
        name: "TimelineItem",
        mixins: [
            timelineHorizontalMixin
        ],
        props: ['item', 'margin'],
        data() {
            return {
                documentUrl: null,
                audioUrl: null,
                media: {
                    image: [],
                    video: [],
                    application: [],
                    audio: []
                }
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 120) + '...';
            }
        },
        methods: {
            async showMediaIcons(event, itemId) {
                const responseItem = await this.$axios(this.$domainOmeka + 'api/items/' + itemId);
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
            showModalItemDetail() {
                this.$refs['item-detail'].show()
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
            hoverItem(event, idItem) {

                this.$root.$emit('selectItem', idItem);

                if (this.listItemsExist()) {
                    this.clearCircleItemsSelected();

                    this.selectItemCircle(idItem);
                }
            }
        },
        mounted() {
            let currentWidth = this.$el.clientWidth;
            let newWidth = currentWidth - (this.margin * 8);
            this.$el.style.width = newWidth + 'px';

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
        position: relative;
        width: 450px;
        height: 250px;
        padding-top: 15px;
        padding-left: 35px;
        padding-right: 35px;
        margin-top: -120px;
        color: #152f4e;
        text-align: justify;
        background: rgb(193, 193, 193);
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

    .card {
        border: 0;
    }

    .card-body {
        padding: 0;
    }
</style>