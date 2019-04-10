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
    </b-container>
</template>

<script>
    import SocialNetwork from '../components/SocialNetwoks'
    export default {
        name: "FourthSection",
        components:{
            SocialNetwork
        }
    }
</script>

<style scoped>
    .video-section{
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
</style>