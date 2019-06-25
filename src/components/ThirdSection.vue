<template>
    <b-container fluid>
        <b-row class="m-1"></b-row>

        <!--<b-row class="m-5 justify-content-center">
            <b-col sm="11" md="11" lg="11" class="text-center">
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
        </b-row>-->

        <b-row id="map-row" class=" mt-3 mb-3 justify-content-center">
            <b-col sm="7" md="7" lg="7" class="text-center">
                <span id="icon-shere">
                   <!-- <ShareFacebook url="http://recruit.istyle.co.jp/career/"/>
                    <ShareTwitter url="http://recruit.istyle.co.jp/career/"/>
                    <ShareGooglePlus url="http://recruit.istyle.co.jp/career/"/>
                    <ShareHatena url="http://recruit.istyle.co.jp/career/"/>
                    <ShareLine url="http://recruit.istyle.co.jp/career/"/>
                     <ShareWhatsapp url="http://recruit.istyle.co.jp/career/"/>-->
                </span>

            </b-col>

            <b-col id="content-map" sm="5" md="5" lg="5" class="text-center">
                <mapa :itemCoordinate="itemCoordinate"> </mapa>
            </b-col>
        </b-row>

    </b-container>

</template>

<script>

    import mapa from '../components/ContentPage/Map';
    import itemMapping from '../mixins/items-mapping-site';

    export default {
        name: 'ThirdSection',
        props:{idResourcesSite:Array},
        mixins: [itemMapping],
        components: {mapa},
        data: () => {
            return {
            }
        },
        mounted() { },
        watch: {
            idResourcesSite: function (newvalue, oldValue){
               let resp = this.traverseResourceSite(newvalue).then();

            }
        },
    }
</script>

<style scoped>

    #icon-shere{display: inline-grid;}
    #icon-shere>a{margin-bottom: 5px;}

   #map-row.row{margin: 0}
   .container-fluid{padding-right: 0px;}

   #content-map{padding-right: 0px;}

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
