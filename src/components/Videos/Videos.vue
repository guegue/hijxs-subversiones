<template>
    <div class="video-collection position-relative">
        <span v-for="(vid,indice) in 2" :key="'vid'+indice">
        <span v-for="(video,indice) in videos" :key="'v'+indice">

        <div v-if="video.type==='Mp4'" style="display:none;" :id="'galeria-v'+indice">
            <video class="lg-video-object lg-html5 video-js vjs-default-skin" controls preload="none">
                <source :src="video.url"
                        type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
        </div>

        <div v-else-if="video.type==='vimeo'" style="display:none;" :id="'galeria-v'+indice">
            <iframe class="lg-video-object lg-vimeo" width="560" height="315"
                    :src="video.url" frameborder="0"
                    webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="">
            </iframe>
        </div>

            <div v-else-if="video.type==='youtube'" style="display:none;" :id="'galeria-v'+indice">
                  <iframe class="lg-video-object lg-youtube" width="560" height="315"
                          :src="video.url"
                          frameborder="0" allowfullscreen=""></iframe>
              </div>

        </span>

            <!--Videos Square-->
        <b-row class="justify-content-center content-video-c">
            <b-col sm="12" md="12" lg="12" v-for="row in rowVideo" :key="row">
                <ul id="video-gallery" class="video list-unstyled">
                    <li class="m-v video-square video" v-for="(video,index) in videos" :key="'v'+index"
                        :data-poster="video.img"
                        :data-sub-html="video.title" :data-html="'#galeria-v'+index">
                        <a href="" onclick="return false">
                            <img class="img-responsive"
                                 :src="video.imgThumbnail"/>
                            <div class="demo-gallery-poster">
                                <img src="http://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png">
                            </div>
                            <div class="video_item_section video_item_stats clearfix">
                                <span class="pb-1"> {{video.titleShort}}</span>

                            </div>
                        </a>
                        <span class="btn btn-info btn-circle mt-1" @click="itemDescription(video.description,$event)">
                            <!--<i class="fa fa-check"></i>-->
                                <i>{{video.char}}</i>
                        </span>
                        <div class="description" @click="itemDescription(video.description,$event)">
                            {{video.description}}
                        </div>
                    </li>

                </ul>
            </b-col>
        </b-row>
     </span>
    </div>
</template>
<script>

    import videosMixin from '../../mixins/videosMixin';

    export default {

        name: "VideosSection",
        mixins: [videosMixin],
        components: {},
        data: () => {
            return {
                rowVideo: 1
            }
        },
        created() {
            this.getClassVideo(2); // 2 Galeria de videos (Mostrar todos los videos)
        },
        mounted() {
        },
        methods: {
            itemDescription(description, event) {
                event.stopPropagation();
            }
        },
        updated() {
            if (this.videos.length === this.cantVideos) {
                window.lightGallery(document.getElementById('video-gallery'), {
                    videojs: true
                })
            }
        }
    }
</script>

<style scoped>

    .row {
        margin-left: 0px;
    }

    .video-collection {
        margin-top: 10%;
    }

    .content-video-c {
        /* width: 92%;*/
        padding-right: 5px;
        padding-left: 2px;
        margin: 0% 8% 0% 8%;
        /*  border: 2px solid #fff;*/
    }

    .col-sm-12, .col-md-12, .col-lg-12 {
        padding: 0px;
    }


    ul.video > li.video-square {
        width: 20% !important;
    }

    li.m-v {
        margin: 0% 1% 1% 1%
    }

    .description {
        margin-top: 5px;
        text-align: justify;
        color: white;
        padding: 3px;
        text-indent: 33px;
    }

    .btn-circle {
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 3px 0;
        font-size: 1em;
        line-height: 1.428571429;
        border-radius: 15px;
        position: absolute;
        font-weight: 500;
    }

</style>
