<template>
    <b-container>
        <br>
        <b-row class="m-5 p-5">
            <b-col sm="12" md="12" lg="12" class="text-center">
                <div class="div-timeline">
                    <b-link router-tag="a" href="javascript" class="circle-icon">
                        <i class="fas fa-share-alt fa-2x"></i>
                    </b-link>

                    <h4 class="title-video">V&iacute;sita nuestra exhibici&oacute;n interativa</h4>

                    <i class="fas fa-play-circle fa-3x text-white icon-play"></i>

                    <b-link router-tag="a" href="javascript" class="text text-white">
                        Ver l&iacute;nea de tiempo
                    </b-link>

                </div>
            </b-col>
        </b-row>
    </b-container>

</template>


<script>
    export default {
        name: 'ThirdSection'
    }
</script>

<style scoped>

    .div-timeline:before {
        position: absolute;
        background-image: linear-gradient(to right, #152f4e, #65b32e);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: .6;
    }

    .div-timeline {
        border-radius: 5px;
        position: relative;
        background: url("https://img.elcomercio.pe/files/ec_article_multimedia_gallery/uploads/2018/07/27/5b5b9582813ca.jpeg") center no-repeat;
        background-size: cover;
        border: 1px solid;
        height: 500px;
        width: 100%;
    }

    .circle-icon {
        position: absolute;
        top: 15px;
        right: 30px;
        height: 60px;
        width: 60px;
        z-index: 9;
        border-radius: 50%;
        color: #fff;
        padding: 12px 5px 5px 5px;
        background-color: rgba(21, 47, 78, 0.5);
    }

    .title-video {
        position: absolute;
        z-index: 11;
        color: #fff;
        top: 35%;
        left: 40px;
        width: 200px;
        text-align: left;
        font-weight: bold;
    }

    .icon-play {
        position: absolute;
        z-index: 12;
        top: 55%;
        left: 40px;
    }

    .text {
        position: absolute;
        top: 57%;
        left: 100px;
    }
    a {
        text-decoration: underline;
    }
</style>