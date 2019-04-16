<template>
    <!--<div class="container-timeline">-->
    <!--<div class="background-top">-->
    <!--&lt;!&ndash;<p>ssdajkfhsdjkhfsdjh</p>&ndash;&gt;-->

    <!--<div class="timeline">-->
    <!--<ul>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1934</time> At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1937</time> Proin quam velit, efficitur vel neque vitae, rhoncus commodo mi. Suspendisse finibus mauris et bibendum molestie. Aenean ex augue, varius et pulvinar in, pretium non nisi.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1940</time> Proin iaculis, nibh eget efficitur varius, libero tellus porta dolor, at pulvinar tortor ex eget ligula. Integer eu dapibus arcu, sit amet sollicitudin eros.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1943</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1946</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1956</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1957</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1967</time> Aenean condimentum odio a bibendum rhoncus. Ut mauris felis, volutpat eget porta faucibus, euismod quis ante.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1977</time> Vestibulum porttitor lorem sed pharetra dignissim. Nulla maximus, dui a tristique iaculis, quam dolor convallis enim, non dignissim ligula ipsum a turpis.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>1985</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>2000</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div>-->
    <!--<time>2005</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->

    <!--</div>-->

    <!--</div>-->

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
</template>

<script>
    require('@/assets/css/timeline.css');

    import SocialNetwork from '../components/SocialNetwoks'

    export default {
        name: "Timeline",
        components: {
            SocialNetwork
        },
        data: () => {
            return {
                widthSearch: '70px',
                colorDivSearch: '#65B32E',
                inputSearchVisible: false
            }
        },
        methods: {
            hideOrShow: function (width, backgrouncolor) {

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

    .background-top:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(rgba(255, 255, 255, 0), rgba(69, 105, 144, 0.7));
    }

    .list-item {
        display: inline-block;
        margin-right: 10px;
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
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