<template>
    <div class="list-item">
        <b-row>
            <b-col>
                <h4 class="titleItemTimeline">{{ item.title }} </h4>
                <time>{{ item.date }}</time>

                <div class="m-1">
                    {{ item.description | truncate}}
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div :id="'videos-' + item.id" v-if="item.media.video.length > 0" class="m-1 d-inline-block align-middle videos"
                     @click="showImagesVideos">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver videos"><i class="fas fa-video"></i>
                    </b-button>
                </div>

                <div :id="'images-' + item.id" v-if="item.media.image.length > 0" class="m-1 d-inline-block align-middle images"
                     @click="showImagesVideos">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver imágenes">
                        <i class="fas fa-images"></i></b-button>
                </div>

                <div v-if="item.media.application.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver documentos"><i
                            class="fas fa-file-alt"></i></b-button>
                </div>

                <div v-if="item.media.audio.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Escuchar audios"><i
                            class="fas fa-file-audio"></i></b-button>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <a class="seeMore float-right" href="#">VER MÁS</a>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "TimelineItem",
        props: ['item'],

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

                /*images = [{
                    src: 'http://sachinchoolur.github.io/lightGallery/static/img/1.jpg',
                    thumb: 'http://sachinchoolur.github.io/lightGallery/static/img/thumb-1.jpg'
                }, {
                    src: 'http://sachinchoolur.github.io/lightGallery/static/img/2.jpg',
                    thumb: 'http://sachinchoolur.github.io/lightGallery/static/img/thumb-2.jpg'
                }, {
                    src: 'http://sachinchoolur.github.io/lightGallery/static/img/3.jpg',
                    thumb: 'http://sachinchoolur.github.io/lightGallery/static/img/thumb-3.jpg'
                }, {
                    src: 'http://sachinchoolur.github.io/lightGallery/static/img/4.jpg',
                    thumb: 'http://sachinchoolur.github.io/lightGallery/static/img/thumb-4.jpg'
                }];*/

                lightGallery(document.getElementById(targetId), {
                    dynamic: true,
                    dynamicEl: imagesVideos
                })
            }
        }
    }
</script>

<style scoped>

</style>