<template>
    <div>

        <div class="wrapper">
            <div class="sidebar">
                <h3>Sticky sidebar</h3>
                <p>I will follow you!</p>
                <p><a href="https://caniuse.com/#search=sticky">caniuse stats</a></p>
            </div>

            <div class="main">

                <!--<div class="container-timeline">

                    &lt;!&ndash;&lt;!&ndash;square floating&ndash;&gt;
                    <div class="green-square"></div>

                    &lt;!&ndash;vertical title&ndash;&gt;
                    <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>&ndash;&gt;

                    &lt;!&ndash;center title with square&ndash;&gt;
                    &lt;!&ndash;<div class="div-title text-center py-4">
                        <h1>L&Iacute;NEA DE TIEMPO</h1>
                    </div>&ndash;&gt;

                </div>-->

                <TimelineYear/>

                <TimelineHorizontal/>
                <TimelineHorizontal/>
                <TimelineHorizontal/>

                <!--<TimelineVertical/>-->
            </div>
        </div>

        <TimelineSearchSidebar/>

        <TimelineSettingSidebar/>

        <sixth-section></sixth-section>
    </div>
</template>

<script>

    import SixthSection from '../components/SixthSection';
    import TimelineYear from '../components/Timeline/TimelineYear';
    import TimelineVertical from '../components/Timeline/TimelineVertical';
    import TimelineHorizontal from '../components/Timeline/TimelineHorizontal';
    import TimelineSearchSidebar from '../components/Timeline/TimelineSearchSidebar';
    import TimelineSettingSidebar from '../components/Timeline/TimelineSettingSidebar';

    export default {
        name: "Timeline",
        components: {
            TimelineYear,
            TimelineVertical,
            TimelineHorizontal,
            TimelineSearchSidebar,
            TimelineSettingSidebar,
            SixthSection
        }
    }
</script>

<style scoped>

    .timelineBackground{
        background: #15304F;
    }

    /*.container-timeline:before {
        height: 100vh;
        position: absolute;
        background-image: linear-gradient(to top, #152f4e 5%, transparent);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 1;
    }*/

    .container-timeline {
        height: 100vh;
        position: relative;
        /*background-image: url("https://wallup.net/wp-content/uploads/2015/12/234980-nature-landscape-water-rock-trees-forest-lake-mountain-pine_trees-hill-grass-valley.jpg"),
        linear-gradient(to bottom right, #152f4e 100%, transparent);*/
    }

    /*.green-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #65B32E;
        height: 200px;
        width: 200px;
    }*/

    /*.title-vertical {
        position: absolute;
        z-index: 7;
        top: 29.5%;
        left: -70px;
        letter-spacing: 1px;
        font-style: oblique;
        font-weight: 700;
    }*/

    /*.div-title {
        display: table-cell;
        position: absolute;
        top: 50%;
        left: calc(100% - 70%);
        color: #fff;
        width: 40%;
        height: 120px;
        border: 5px solid #fff;
        vertical-align: middle;
    }*/

    a, a:hover {
        color: #fff;
        text-decoration: none;
    }

    .sidebar {
        width: 25%;
        height: 100vh;
        overflow: auto;
        position: -webkit-sticky;
        position: sticky;
        top: 0.1%;
        background-color: #15304F;

        -webkit-box-shadow: 3px 0px 5px 0px rgba(0,0,0,0.24);
        -moz-box-shadow: 3px 0px 5px 0px rgba(0,0,0,0.24);
        box-shadow: 3px 0px 5px 0px rgba(0,0,0,0.24);
    }

    .main {
        width: 92%;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    /*.sidebar {
        border: 5px solid #222;
        background-color: white;
        border-radius: 10px;
        color: #222;
    }*/

    .wrapper {
        background-color: #15304F;
        display: flex;
        justify-content: flex-end;
    }

    body {
        padding: 3%;
        background-color: #ccc;
        font-size: 20px;
        box-sizing: border-box;
        font-family: Lato, sans-serif;
    }

    code,
    pre {
        background-color: #ccc;
        padding: 0 3px;
        border-radius: 5px;
    }

    .bottom {
        justify-self: bottom;
    }


</style>