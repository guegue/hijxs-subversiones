<template>
    <div>
        <div class="container-videos">

            <TopBar :indexMenu="-1"></TopBar>
            <!--square floating-->
            <div class="green-square"></div>

            <!--vertical title-->
            <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

            <!--center title with square-->
            <div class="div-title text-center py-4">
                <h1> TESTIMONIOS </h1>
            </div>
            <videos></videos>
            <!--social network-->
            <social-network></social-network>

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
        <sixth-section :indexMenu="-1"> </sixth-section>
    </div>
</template>

<script>

    import SocialNetwork from '../components/SocialNetwoks';
    import TopBar from '../components/TopBar';
    import SixthSection from '../components/SixthSection';

    export default {
        name: "Timeline",
        components: {
            TopBar,
            SocialNetwork,
            SixthSection
        },
        data() {
            return {
                widthSearch: '70px',
                colorDivSearch: '#65B32E',
                inputSearchVisible: false
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

    .container-videos:before {
        height: 100vh;
        position: absolute;
        background-image: linear-gradient(to top, #152f4e 5%, transparent);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 1;
    }

    .container-videos {
        height: 100vh;
        position: relative; /* https://www.revistagenteqroo.com/wp-content/uploads/2018/02/libros-tecnicas-estudio-estudiantes.jpg */
        background-image: url("https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_960,h_580/https://www.tokioschool.com/wp-content/uploads/2018/04/libros-sobre-tecnologia-960x580.jpg"),
        linear-gradient(to bottom right, #152f4e 100%, transparent);
        background-repeat: no-repeat;
        background-size: cover;
    }

    .green-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #65B32E;
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

    .div-title {
        display: table-cell;
        position: absolute;
        top: 13%;
        left: calc(100% - 87%);
        color: #fff;
        width: 87%;
        height: 90px;
        border-top: 3px solid rgba(255, 255, 255, .6);
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


</style>
