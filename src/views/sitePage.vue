<template>
    <div>
        <div class="container-general">
            <TopBar :indexMenu="-1"></TopBar>
            <!--square floating-->
            <div class="green-square"></div>

            <!--vertical title-->
            <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

            <!--center title with square-->
            <div class="div-title py-4">
                <h1> Testimonios recopilados </h1>
                <div style="color:#65b32e; font-weight: 600; font-size: 2.4rem; margin-top:-15px;">a través del tiempo </div>

                <div class="descripcion-principal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Quis nostrud exercitation ullamco laboris nisi.
                    <a href="#" key="idPage" class="" target="_blank">
                        <u> VER MÁS </u>
                    </a>
                </div>

            </div>

            <!--social network-->
            <social-network> </social-network>

            <!--search input-->
            <div class="search-square pt-2" v-bind:style="{'width':widthSearch,'background-color':colorDivSearch}">
                <div class="text-center text-white" v-on:click="hideOrShow(widthSearch,colorDivSearch)">
                    <b-link router-tag="a" v-if="!inputSearchVisible">
                        <i class="fas fa-search fa-2x"></i>
                    </b-link>
                    <input :type="(!inputSearchVisible)?'hidden':'text'" placeholder="Buscar">
                </div>
            </div>

            <!--search input-->
            <div class="setting-square pt-2">
                <div class="text-center text-white">
                    <b-link router-tag="a">
                        <i class="fas fa-cog fa-2x"></i>
                    </b-link>
                </div>
            </div>
        </div>

        <contentPage> </contentPage>

       <div v-if="componentInclude">
           <sixth-section :indexMenu="-1"> </sixth-section>
       </div>


    </div>
</template>

<script>

    import SocialNetwork from '../components/SocialNetwoks';
    import TopBar from '../components/TopBar';
    import contentPage from '../components/ContentPage/contentPage'
    import SixthSection from '../components/SixthSection';

    export default {
        name: "page",
        components: {
            TopBar,
            contentPage,
            SocialNetwork,
            SixthSection
        },
        data() {
            return {
                widthSearch: '70px',
                colorDivSearch: '#65B32E',
                inputSearchVisible: false,
                componentInclude:true
            }
        },
        methods: {
            hideOrShow(width, backgrouncolor) {
                if (width === '70px') {
                    this.widthSearch = '350px';
                    this.colorDivSearch = '#fff';
                    this.inputSearchVisible = true;
                }
            }
        }
    }
</script>

<style scoped>

    .container-general:before {
        height: 100vh;
        position: absolute;
       /* background-image: linear-gradient(to top, #152f4e 1%, transparent);*/
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 0.3;
    }

    .container-general { /* https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_960,h_580/https://www.tokioschool.com/wp-content/uploads/2018/04/libros-sobre-tecnologia-960x580.jpg */
        height: 88vh;
        position: relative; /* https://www.revistagenteqroo.com/wp-content/uploads/2018/02/libros-tecnicas-estudio-estudiantes.jpg
                              https://vignette.wikia.nocookie.net/reinoanimalia/images/f/f6/Rios.png/revision/latest?cb=20150820071055&path-prefix=es*/
        background-image: url("//az837918.vo.msecnd.net/publishedimages/Listings/1209/en-CA/images/2/moraine-lake-L-10.jpg"),
        linear-gradient(to bottom right, #152f4e 100%, transparent);
        background-repeat: no-repeat;
        background-size: cover;
    }

    .green-square {
        position: absolute;
        z-index: 6;
        top: 80px;
        background-color: #65B32E;
        height: 200px;
        width: 200px;
    }

    .title-vertical {
        position: absolute;
        z-index: 7;
        top: 39.5%;
        left: -70px;
        letter-spacing: 1px;
        font-style: oblique;
        font-weight: 700;
    }

    .div-title {
        display: table-cell;
        position: absolute;
        top: 35%;
       /* left: calc(100% - 87%);*/
        margin-left: 20%;
        color: #fff;
        width: 80%;
        height: 90px;
       /* border-top: 3px solid rgba(255, 255, 255, .6);*/
        vertical-align: middle;
    }

    .search-square {
        display: block;
        position: absolute;
        height: 50px;
        /*width: 70px;*/
        bottom: 70px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
        -webkit-transition: width 1s; /* For Safari 3.1 to 6.0 */
        transition: width 1s;
    }

    .search-square input {
        width: 100%;
        height: 100%;
        padding: 0;
    }

    .setting-square {
        position: absolute;
        height: 50px;
        width: 70px;
        bottom: 10px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
    }

    a, a:hover {
        color: #fff;
        text-decoration: none;
    }

    /* Estilo portada principal Testimonios */

    .descripcion-principal{
        height: auto;
        width: 40%;
        margin:2% 40% 3% 0;
        color: #e8ebef;
        font-weight: 500;
        text-align: justify;
        position: relative;
        line-height: 1.3;
        font-size: 1.2em;
    }


</style>
