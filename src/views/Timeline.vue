<template>
    <div>
        <div class="container-timeline">

            <!--square floating-->
            <div class="green-square"></div>

            <!--vertical title-->
            <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

            <!--center title with square-->
            <div class="div-title text-center py-4">
                <h1>L&Iacute;NEA DE TIEMPO</h1>
            </div>

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

        <TimelineYear/>

        <TimelineVertical/>

        <sixth-section></sixth-section>
    </div>
</template>

<script>

    import SocialNetwork from '../components/SocialNetwoks';
    import SixthSection from '../components/SixthSection';
    import TimelineYear from '../components/Timeline/TimelineYear';
    import TimelineVertical from '../components/Timeline/TimelineVertical';

    export default {
        name: "Timeline",
        components: {
            TimelineYear,
            TimelineVertical,
            SocialNetwork,
            SixthSection
        },
        data() {
            return {
                widthSearch: '70px',
                colorDivSearch: '#65B32E',
                inputSearchVisible: false,
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

    .timelineBackground{
        background: #15304F;
    }

    .container-timeline:before {
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

    .container-timeline {
        height: 100vh;
        position: relative;
        background-image: url("https://wallup.net/wp-content/uploads/2015/12/234980-nature-landscape-water-rock-trees-forest-lake-mountain-pine_trees-hill-grass-valley.jpg"),
        linear-gradient(to bottom right, #152f4e 100%, transparent);
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
        top: 50%;
        left: calc(100% - 70%);
        color: #fff;
        width: 40%;
        height: 120px;
        border: 5px solid #fff;
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