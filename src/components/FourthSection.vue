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

        <span v-for="(video,indice) in videos" :key="'a'+indice">
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

        <!--Videos Square-->
        <div class="d-flex flex-wrap justify-content-end mr-2" v-for="row in rowVideo" :key="row">

            <ul id="video-gallery" class="video list-unstyled">

                <li class="m-1 video-square video" v-for="(video, index) in videos" :key="index"
                    :data-poster="video.img"
                    :data-sub-html="video.title" :data-html="'#video'+index"
                >
                    <a href="">
                        <img class="img-responsive"
                             :src="video.imgThumbnail"/>
                        <div class="demo-gallery-poster">
                            <img src="http://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png">
                        </div>
                    </a>
                </li>
            </ul>
        </div>

    </b-container>
</template>

<script>
    import SocialNetwork from '../components/SocialNetwoks'

    export default {
        name: "FourthSection",
        components: {
            SocialNetwork
        },
        data: () => {
            return {
                rowVideo: 1,
                videos: [],
                videosUrl: []
                /*  {
                      title: 'titulo 1',
                      video: 'http://www.youtube.com/embed/OpQFFLBMEPI',
                      time: '00:05:05',
                      date: '01,Enero 2012',
                      imgLink: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/eye_color_and_shape_slideshow/493ss_thinkstock_rf_blue_eye.jpg'
                  },
                  {
                      title: 'titulo 2',
                      video: 'https://www.youtube.com/embed/a3dMmafo4OQ',
                      time: '00:05:05',
                      date: '01,Enero 2012',
                      imgLink: 'https://amp.thisisinsider.com/images/5bfec49248eb12058423acf7-750-562.jpg'
                  },
                  {
                      title: 'titulo 3',
                      video: 'https://www.youtube.com/embed/weKJWqw8-3g',
                      time: '00:05:05',
                      date: '01,Enero 2012',
                      imgLink: 'https://img.grouponcdn.com/seocms/b92JihVopSChKJxkT5Jt6b/denver_cooking_classes-1243x746'
                  }
              ]*/
            }
        },
        mounted() {
            this.getClassVideo();
        },
        methods: {
            getClassVideo() {

                this.$axios(this.$domainOmeka + 'api/items?resource_class_id=38')
                    .then((response) => {
                        if (response.data.length > 0) {
                            response.data.forEach((element, indice) => {

                                if (typeof element['o:media'][0]['@id'] !== 'undefined' && indice<6) {
                                    this.videosUrl.push(element['o:media'][0]['@id']);
                                }
                            });

                            this.getVideo();
                        }
                    })
                    .catch((error) => {
                        console.log('Error ' + error);
                    });
            },
            getVideo() {

                if (this.videosUrl.length > 0) {

                    this.videosUrl.forEach((url) => {

                        let propertyVideo = {
                            'url': '',
                            'title': '',
                            'idVideo': '',
                            'type': '',
                            'imgThumbnail': '',
                            'imgVideo': ''
                        };

                        this.$axios(url)
                            .then((response) => {

                                let json = response.data;

                                if (json['o:ingester'] === 'upload') // Video Mp4
                                {
                                    propertyVideo.url = json['o:original_url'];
                                    propertyVideo.title = json['o:source'];
                                    propertyVideo.idVideo = json['o:id'];
                                    propertyVideo.type = 'Mp4';
                                    propertyVideo.imgThumbnail = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                    propertyVideo.imgVideo = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';

                                    this.videos.push(propertyVideo);
                                } else if (json['o:ingester'] === 'youtube') // Video youtube
                                {
                                    propertyVideo.url = propertyVideo.url = '//youtube.com/embed/' + json['data'].id + '?wmode=opaque&amp;enablejsapi=1';
                                    propertyVideo.title = json['dcterms:title'][0]['@value'];
                                    propertyVideo.idVideo = json['o:id'];
                                    propertyVideo.type = 'youtube';
                                    propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                    propertyVideo.imgVideo = json['o:thumbnail_urls'].large;

                                    this.videos.push(propertyVideo);

                                } else if (json['o:ingester'] === 'oembed') // Video Vimeo
                                {
                                    propertyVideo.url = propertyVideo.url = '//player.vimeo.com/video/' + json['data'].id + '?autoplay=1&amp;api=1';
                                    propertyVideo.title = json['dcterms:title'][0]['@value'];
                                    propertyVideo.idVideo = json['o:id'];
                                    propertyVideo.type = 'vimeo';
                                    propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                    propertyVideo.imgVideo = json['o:thumbnail_urls'].large;
                                    this.videos.push(propertyVideo);
                                }
                            })
                            .catch((error) => {
                                console.log('Error ' + error);
                            });
                    });

                    setTimeout(() => {
                        lightGallery(document.getElementById('video-gallery'), {
                            videojs: true
                        });
                    }, 1000);
                }
            }
        }
    }
</script>

<style scoped>

    .video-section {
        background-image: url("https://www.carbonbrief.org/wp-content/uploads/2018/10/ocean-sunrays-1550x804.jpg");
        height: 600px;
        min-height: 600px;
        max-height: 100%;
        width: 100%;
    }

    .line-top-title {
        border: 2px solid #000;
        width: 7%;
        margin-left: 0.4em;
    }

    .title-video {
        font-style: oblique;
    }

    .video-square {
        background-color: #fff;
        position: relative;
        width: auto !important;
        height: auto !important;
        cursor: pointer;
    }

    .video-square img {
        width: 100%;
        z-index: 4;
        /*height: 100%;*/
        height:150px;
        object-fit: cover;
    }

    .title-square {
        text-align: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        height: 15%;
        z-index: 5;
        color: #fff;
    }

    .title-square p {
        font-size: 13px;
        font-style: oblique;
    }

    .title-square-video {
        position: absolute;
        z-index: 6;
        bottom: 15%;
        width: 100%;
        color: #fff;
        font-style: oblique;
        font-weight: bold;
    }

    .share-icon-square {
        position: absolute;
        right: 15px;
        top: 10px;
        color: #fff;
        z-index: 6;
    }

    ul#video-gallery li {
        display: inline;
        float: right;
    }

    ul#video-gallery > li a > img {
        border: 2px solid #63636359;
        border-color: rgba(26, 0, 0, 0.6);
    }

    ul#video-gallery > li a {
        border: 2px solid #63636359;
        border-color: rgba(26, 0, 0, 0.7);
        border-radius: 3px;
        display: block;
        overflow: hidden;
        position: relative;
    }

    .demo-gallery > ul > li a:hover .demo-gallery-poster {
        background-color: rgba(0, 0, 0, 0.8);
    }

    img {
        vertical-align: middle;
    }

    .demo-gallery-poster > img {
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        opacity: 0;
        position: absolute;
        top: 50%;
        -webkit-transition: opacity 0.3s ease 0s;
        -o-transition: opacity 0.3s ease 0s;
        transition: opacity 0.3s ease 0s;
    }

    .demo-gallery-poster img {
        height: 48px;
        margin-left: -24px;
        margin-top: -24px;
        opacity: 0.8;
        width: 48px;
    }

    ul > li a .demo-gallery-poster {
        background-color: rgba(0, 0, 0, 0.1);
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        -webkit-transition: background-color 0.15s ease 0s;
        -o-transition: background-color 0.15s ease 0s;

    }

    ul > li a:hover > img, ul > li a > img > .demo-gallery-poster img {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1);
    }

    ul > li a:hover > img > .demo-gallery-poster img {
        opacity: 1;
    }

    ul > li a:hover .demo-gallery-poster {
        background-color: rgba(0, 0, 0, 0.7);
    }

    a:hover {
        outline: 0;
    }

</style>