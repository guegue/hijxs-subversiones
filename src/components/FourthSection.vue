<template>
    <b-container fluid class="video-section position-relative">
        <!--horizontal line-->
        <b-row class="ml-5 pl-5">
            <b-col sm="12" md="12" lg="12">
                <hr class="line-top-title">
            </b-col>
        </b-row>
        <!--Title Section-->
        <b-row class="ml-5 pl-5 mb-5">
            <b-col sm="12" md="12" lg="12">
                <h1 class="title-video text-uppercase">VIDEOS</h1>
            </b-col>
        </b-row>
        <!--Social Network-->
        <social-network class="position-absolute"></social-network>


        <!--Videos Square-->
        <div class="d-flex flex-wrap justify-content-end mr-5" v-for="row in 2" :key="row">
            <div class="p-2 m-2 video-square" v-for="(video,index) in videos" :key="index">
                <img :src="video.imgLink" alt="">
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
                        imgLink: 'https://cdn-img.health.com/sites/default/files/styles/master_4_3/public/1501691576/7-things-you-should-never-do-to-your-eyes-video.jpg?itok=Q04OxkAH'
                    },
                    {
                        title: 'titulo 2',
                        video: 'https://youtu.be/a5uQMwRMHcs',
                        time: '00:05:05',
                        date: '01,Enero 2012',
                        imgLink: 'https://g.foolcdn.com/editorial/images/491469/coworkers-collaborating_gettyimages-507753272.jpg'
                    },
                    {
                        title: 'titulo 3',
                        video: 'https://youtu.be/a5uQMwRMHcs',
                        time: '00:05:05',
                        date: '01,Enero 2012',
                        imgLink: 'https://jooinn.com/images/person-on-beach-5.jpg'
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
        width: 200px !important;
        height: 200px !important;
    }

    .video-square img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>