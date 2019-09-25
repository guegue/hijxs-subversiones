<template>
    <div class="position-relative">
        <TopBar/>

        <SocialNetworks/>

        <!--square floating-->
        <div class="blue-square"></div>

        <!--vertical title-->
        <h1 class="title-vertical rotation-270 text-white">HIJXS DE PER&Uacute;</h1>

        <!--Button two arrows down-->
        <button type="button" class="position-absolute btn-arrows-down">
            <a href="#down-section" id="goDown"> <i class="fas fa-angle-double-down fa-2x"></i> </a>
        </button>

        <!-- Vertical Line-->
        <div class="position-absolute vertical-line"></div>

        <!--slider(3 images)-->
        <b-carousel fade controls>
            <b-carousel-slide v-for="item in jsonImg" :key="item.idImg" :img-src="item.url">
                <div class="d-flex flex-row justify-content-end">
                    <div class="p-2">
                        <hr class="hr-opacity">
                    </div>
                    <div class="p-2">
                        <h3 class="text-right font-italic h3-opacity">Nuestro Nosotros</h3>
                    </div>
                </div>
                <p class="text-right p-description ">{{ item.title }}</p>
            </b-carousel-slide>
        </b-carousel>
    </div>
</template>

<script>
    import TopBar from '../components/TopBar';
    import SocialNetworks from '../components/SocialNetwoks';

    export default {
        name: 'Slider',
        components: {
            TopBar,
            SocialNetworks
        },
        data() {
            return {
                jsonImg: [],
            }
        },
        mounted() {
            this.getItemSetClassSlider();
        },
        methods: {
            getItemSetClassSlider() {
                this.$axios(this.$domainOmeka + 'api/item_sets?resource_class_label=slider&site_id=' + this.$idDefauldSite)
                    .then((itemSet) => {

                        if (itemSet.data.length > 0) {
                            this.loadImgSlider(itemSet.data[0]['o:items']['@id']);
                        } else {
                            window.console.log('Sitio no posee Slider');
                        }
                    })
            },
            async loadImgSlider(url) {
                let response = await this.$axios(url);

                for (let reponseImage of response.data) {
                    await this.getImg(reponseImage['o:media'][0]['@id'])
                }
            },
            async getImg(reponseImageUrl) {
                let response = await this.$axios(reponseImageUrl);

                let image = response.data;

                let propertyImg = {
                    url: image['o:original_url'],
                    title: image['dcterms:title'][0]['@value'],
                    idImg: image['o:id']
                };

                if (image['o:media_type'] !== 'application/pdf') {
                    await this.jsonImg.push(propertyImg);
                }
            },
        },
    }
</script>

<style>

    .h3-opacity {
        opacity: 0.7;
        font-size: 25px;
        letter-spacing: 4px;
    }

    .blue-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #152f4e;
        height: 200px;
        width: 200px;
    }

    .title-vertical {
        position: absolute;
        z-index: 7;
        top: 29.5%;
        left: -70px;
        letter-spacing: 1px;
        font-style: oblique;
        font-weight: 700;
    }

    .no-border {
        border: none;
    }

    .hr-opacity {
        border: 1px solid rgba(255, 255, 255, 0.5);
        width: 35px;
    }

    .p-description {
        /*font-size: 45px;*/
        font-size: 3em;
        font-style: oblique;
        padding-left: 10rem;
        font-weight: 900;
        text-align: right;
        letter-spacing: 2px;
    }

    .btn-arrows-down {
        z-index: 4;
        background-color: transparent;
        border: none;
        bottom: 10px;
        color: #fff;
        left: 170px;
        margin: 0;
        padding: 0;
    }

    .vertical-line {
        height: 100%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        z-index: 5;
        left: 120px;
    }

    @supports (-moz-appearance:none) {
        .vertical-line {
            height: 100%;
            border: 1px solid rgba(255, 255, 255, 0.5);
            z-index: 5;
            left: 130px;
        }
    }

    #goDown {
        color: #fff;
    }

</style>

<style>
    .carousel-item {
        max-height: 850px;
        background-size: cover;
        background-position: center center;
    }
</style>
