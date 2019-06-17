<template>
    <b-container fluid class="video-section position-relative">
        <!--horizontal line-->
        <b-row class="ml-5 pl-5">
            <b-col sm="12" md="12" lg="12">
                <hr class="line-top-title">
            </b-col>
        </b-row>
        <!--Title Section-->
        <b-row class="ml-5 pl-5 mb-4">
            <b-col sm="12" md="12" lg="12">
                <h1 class="title-video text-uppercase">VIDEOS</h1>
            </b-col>
        </b-row>
        <!--Social Network-->
        <social-network class="position-absolute"></social-network>

    <!--    <span v-for="(video,indice) in videos" :key="'a'+indice">

        <div v-if="video.type==='Mp4'" style="display:none;" :id="'video'+indice">
            <video class="lg-video-object lg-html5 video-js vjs-default-skin" controls preload="none">
                <source :src="video.url"
                        type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
        </div>

        <div v-else-if="video.type==='vimeo'" style="display:none;" :id="'video'+indice">
            <iframe class="lg-video-object lg-vimeo" width="560" height="315"
                    :src="video.url" frameborder="0"
                    webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="">
            </iframe>
        </div>

            <div v-else-if="video.type==='youtube'" style="display:none;" :id="'video'+indice">
                  <iframe class="lg-video-object lg-youtube" width="560" height="315"
                          :src="video.url"
                          frameborder="0" allowfullscreen=""></iframe>
              </div>
        </span>
-->
        <!--Videos Square-->
        <b-row class="justify-content-center content-video">
            <b-col sm="10" md="10" lg="10" v-for="row in rowVideo" :key="row">
                <ul id="video-gallery" class="video list-unstyled w-video">

                   <!-- <li class="m-1 video-square video" v-for="(video,index) in videos" :key="index"
                        :data-poster="video.img"
                        :data-sub-html="video.title" :data-html="'#video'+index">
                        &lt;!&ndash; {{videos[index].video}} &ndash;&gt;
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
                    </li>-->

                    <li class="m-1 video-square video" v-for="(video,index) in videos" :key="'#video'+index" @click.prevent="showVideo($event, index)" :id="'video-'+index">
                      <!--    {{videos[index].video}} -->
                        <a href="">
                        <img class="img-responsive"
                             :src="video.thumb" height="150px"/>
                        <div class="demo-gallery-poster">
                            <img src="http://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png">
                        </div>
                        <div class="video_item_section video_item_stats clearfix">
                            <span class="pb-1"> {{video.titleShort}}</span>

                        </div>
                    </a>
                    </li>
                </ul>
            </b-col>

        </b-row>

    </b-container>
</template>

<script>
    require('@/assets/css/videos.css');

    import SocialNetwork from '../components/SocialNetwoks';
    import videosMixin from '../mixins/videosMixin';

    export default {
        name: "FourthSection",
        mixins: [videosMixin],
        components: {
            SocialNetwork
        },
        data: () => {
            return {
                rowVideo: 1
            }
        },
        created() {
            this.getClassVideo(1); // 1 página principal mostrar solo 6 videos como máximo
        },
        mounted() {
        },
        methods: {},
        updated() {
            if (this.videos.length === this.cantVideos) {
                /*window.lightGallery(document.getElementById('video-gallery'), {
                    videojs: true
                });*/
            }
        }
    }
</script>

<!-- module -->
<style scoped>

    .video-section {
        background-image: url("https://www.carbonbrief.org/wp-content/uploads/2018/10/ocean-sunrays-1550x804.jpg");
        height: 600px;
        min-height: 600px;
        max-height: 100%;
        width: 100%;
    }

    .content-video {
        width: 60%;
        float: right;
    }

    ul#video-gallery li {
        float: right;}

</style>
