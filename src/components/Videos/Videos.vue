<template>

    <div class="video-collection position-relative">
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

                    <li class="m-1 video-square video" v-for="(video,index) in videos" :key="'v'+index"
                        :data-poster="video.img"
                        :data-sub-html="video.title" :data-html="'#galeria-v'+index">
                        <a href="" onclick="return false">
                            <img class="img-responsive"
                                 :src="video.imgThumbnail"/>
                            <div class="demo-gallery-poster">
                                <img src="http://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png">
                            </div>
                        </a>
                    </li>
                </ul>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "VideosSection",
        components: {},
        data: () => {
            return {
                rowVideo: 1,
                videosUrl: [],
                videos: [],
                cantVideos: null,
            }
        },
        created() {
            this.getClassVideo();
        },
        mounted() {
        },
        methods: {
            getClassVideo() {
                this.$axios(this.$domainOmeka + 'api/items?resource_class_id=38')
                    .then((response) => this.getVideo(response))
                    .then(() => {
                        this.$nextTick(() => {
                        });
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log('Error ' + error);
                    });
            },
            getVideo(response) {
                return new Promise((resolved, reject) => {

                    this.cantVideos = response.data.length;
                    if (this.cantVideos > 0) {
                        response.data.forEach((element, indice) => {

                            if (typeof element['o:media'][0]['@id'] !== 'undefined' && indice < 6) {

                                let propertyVideo = {
                                    'url': '',
                                    'title': '',
                                    'idVideo': '',
                                    'type': '',
                                    'imgThumbnail': '',
                                    'imgVideo': ''
                                };

                                this.$axios(element['o:media'][0]['@id'])
                                    .then(async (response) => {

                                        let json = response.data;

                                        if (json['o:ingester'] === 'upload') // Video Mp4
                                        {
                                            propertyVideo.url = json['o:original_url'];
                                            propertyVideo.title = json['o:source'];
                                            propertyVideo.idVideo = json['o:id'];
                                            propertyVideo.type = 'Mp4';
                                            propertyVideo.imgThumbnail = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.imgVideo = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';

                                            await this.videos.push(propertyVideo);
                                        } else if (json['o:ingester'] === 'youtube') // Video youtube
                                        {
                                            propertyVideo.url = propertyVideo.url = '//youtube.com/embed/' + json['data'].id + '?wmode=opaque&amp;enablejsapi=1';
                                            propertyVideo.title = json['dcterms:title'][0]['@value'];
                                            propertyVideo.idVideo = json['o:id'];
                                            propertyVideo.type = 'youtube';
                                            propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                            propertyVideo.imgVideo = json['o:thumbnail_urls'].large;

                                            await this.videos.push(propertyVideo);

                                        } else if (json['o:ingester'] === 'oembed') // Video Vimeo
                                        {
                                            propertyVideo.url = propertyVideo.url = '//player.vimeo.com/video/' + json['data'].id + '?autoplay=1&amp;api=1';
                                            propertyVideo.title = json['dcterms:title'][0]['@value'];
                                            propertyVideo.idVideo = json['o:id'];
                                            propertyVideo.type = 'vimeo';
                                            propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                            propertyVideo.imgVideo = json['o:thumbnail_urls'].large;
                                            await this.videos.push(propertyVideo);

                                        }

                                        if (parseInt(this.cantVideos) - 1 === indice || indice === 5)
                                            resolved()
                                    })
                                    .catch((error) => {
                                        // eslint-disable-next-line no-console
                                        console.log('Error ' + error);
                                    });
                            }
                        });
                    }
                });
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

        .row{margin-left: 0px;}

    .content-video-c {
        margin-top:10%;
        width: 80%;
        padding-right: 5px;
        padding-left: 2px;
        margin-right: auto;
        margin-left: auto;
        margin-left: 14%;
          /*  border: 2px solid #fff;*/
    }

        .col-sm-12, .col-md-12, .col-lg-12{
            padding: 0px;
        }

</style>
