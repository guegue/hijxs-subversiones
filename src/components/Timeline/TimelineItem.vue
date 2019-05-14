<template>
    <div class="list-item">
        <b-row>
            <b-col>
                <h4 class="titleItemTimeline">{{ item.title }}</h4>
                <time>{{ item.date }}</time>

                <div class="m-1">
                    {{ item.description | truncate}}
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div :id="'videos-' + item.id" v-if="item.media.video.length > 0"
                     class="m-1 d-inline-block align-middle videos"
                     @click="showImagesVideos">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver videos"><i class="fas fa-video"></i>
                    </b-button>
                </div>

                <div :id="'images-' + item.id" v-if="item.media.image.length > 0"
                     class="m-1 d-inline-block align-middle images"
                     @click="showImagesVideos">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver imágenes">
                        <i class="fas fa-images"></i></b-button>
                </div>

                <div v-if="item.media.application.length > 0" class="m-1 d-inline-block align-middle"
                     @click="showDocuments">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver documentos"><i
                            class="fas fa-file-alt"></i></b-button>
                </div>

                <div v-if="item.media.audio.length > 0" class="m-1 d-inline-block align-middle" @click="showAudios">
                    <b-button variant="success" v-b-tooltip.hover="" title="Escuchar audios"><i
                            class="fas fa-file-audio"></i></b-button>
                </div>
            </b-col>
        </b-row>
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
                        <b-list-group-item button v-for="(doc, index) in item.media.application" :key="index"
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
    export default {
        name: "TimelineItem",
        props: ['item'],
        data() {
            return {
                documentUrl: null,
                audioUrl: null
            }
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 120) + '...';
            }
        },
        methods: {
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
                    sources = this.item.media.video;

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
                    sources = this.item.media.image;

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
            }
        }
    }
</script>

<style scoped>

</style>