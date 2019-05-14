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

        </div>

        <TimelineYear/>

        <!--<TimelineHorizontal/>-->

        <TimelineVertical/>

        <TimelineSearchSidebar/>

        <TimelineSettingSidebar/>

        <sixth-section></sixth-section>
    </div>
</template>

<script>

    import SocialNetwork from '../components/SocialNetwoks';
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
            SocialNetwork,
            SixthSection
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

    a, a:hover {
        color: #fff;
        text-decoration: none;
    }


</style>