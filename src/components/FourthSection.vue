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

        <!--Videos Square-->
        <div class="d-flex flex-wrap justify-content-end mr-5" v-for="row in 2" :key="row">
            <div class=" m-2 video-square" v-for="(video,index) in videos" :key="index">
                <img :src="video.imgLink" alt="">
                <i class="fas fa-share-alt fa-2x share-icon-square"></i>
                <h4 class="title-square-video pl-2 pr-2">Lorem ipsum viverra</h4>
                <div class="title-square">
                    <p class="p-1"><i class="far fa-clock"></i> {{video.time}} / {{video.date}}</p>
                </div>
            </div>
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
                videos: [
                    {
                        title: 'titulo 1',
                        video: 'https://youtu.be/a5uQMwRMHcs',
                        time: '00:05:05',
                        date: '01,Enero 2012',
                        imgLink: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/eye_color_and_shape_slideshow/493ss_thinkstock_rf_blue_eye.jpg'
                    },
                    {
                        title: 'titulo 2',
                        video: 'https://youtu.be/a5uQMwRMHcs',
                        time: '00:05:05',
                        date: '01,Enero 2012',
                        imgLink: 'https://amp.thisisinsider.com/images/5bfec49248eb12058423acf7-750-562.jpg'
                    },
                    {
                        title: 'titulo 3',
                        video: 'https://youtu.be/a5uQMwRMHcs',
                        time: '00:05:05',
                        date: '01,Enero 2012',
                        imgLink: 'https://img.grouponcdn.com/seocms/b92JihVopSChKJxkT5Jt6b/denver_cooking_classes-1243x746'
                    }
                ]
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
        width: 180px !important;
        height: 180px !important;
        cursor: pointer;
    }

    .video-square img {
        width: 100%;
        z-index: 4;
        height: 100%;
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
</style>