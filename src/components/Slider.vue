<template>
    <div class="position-relative">

        <top-bar></top-bar>

        <social-networks></social-networks>

        <!--square floating-->
        <div class="blue-square"></div>

        <!--vertical title-->
        <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

        <!--Button two arrows down-->
        <button type="button" class="position-absolute btn-arrows-down">
            <i class="fas fa-angle-double-down fa-2x"></i>
        </button>

        <!-- Vertical Line-->
        <div class="position-absolute vertical-line"></div>

        <!--slider(3 images)-->
        <b-container class="p-0 m-0" fluid>
            <b-carousel
                    class="w-100"
                    style="text-shadow: 0 0 2px #000"
                    fade

                    img-width="1024"
                    img-height="480">
                <b-carousel-slide v-for="item in jsonImg" :key="item.name" :img-src="item.url" class="no-border">
                    <div class="d-flex flex-row justify-content-end">
                        <div class="p-2">
                            <hr class="hr-opacity">
                        </div>
                        <div class="p-2">
                            <h3 class="text-right font-italic h3-opacity">{{item.title}}</h3>
                        </div>
                    </div>
                    <p class="text-right p-description ">{{item.description}}</p>
                </b-carousel-slide>
            </b-carousel>
        </b-container>
    </div>
</template>


<script>
    import TopBar from '../components/TopBar'
    import SocialNetworks from '../components/SocialNetwoks'

    export default {
        name: 'Slider',
        components: {
            TopBar,
            SocialNetworks
        },
        data: () => {
            return {
                sliding: null,
                jsonImg: [
                    {
                        name: 'First slide',
                        url: 'https://picsum.photos/1024/480/?image=10',
                        title: 'Nuestro Nosotros',
                        description: 'Nuestra historia se inicia en medio de una historia de impunidad'
                    },
                    {
                        name: 'Second Slide',
                        url: 'https://picsum.photos/1024/480/?image=12',
                        title: 'Nuestro Nosotros',
                        description: 'sdfsdfs sdfsdfsd '
                    },
                    {
                        name: 'Third Slide',
                        url: 'https://picsum.photos/1024/480/?image=22',
                        title: 'Nuestro Nosotros',
                        description: 'Wiiiiiiii'
                    }
                ]
            }
        }

    }
</script>

<style scoped>
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
        font-weight: 800;
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

</style>
