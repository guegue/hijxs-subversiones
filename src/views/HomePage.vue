<template>
    <div>
        <FirstSection/>
        <SummarySite/>
        <ThirdSection :idResourcesSite="idPageSite"/>
        <FourthSection/>
        <FifthSection/>
        <SecondSection/>
        <SixthSection/>
    </div>
</template>

<script>
    import FirstSection from '../components/FirstSection';
    import SummarySite from '../components/SummarySite';
    import SecondSection from '../components/SecondSection';
    import ThirdSection from '../components/ThirdSection';
    import FourthSection from '../components/FourthSection';
    import FifthSection from '../components/FifthSection';
    import SixthSection from '../components/SixthSection';

    import sitesMixin from '../mixins/webSitesMixin';

    export default {
        name: 'HomePage',
        mixins: [sitesMixin],
        components: {
            FirstSection,
            SummarySite,
            SecondSection,
            ThirdSection,
            FourthSection,
            FifthSection,
            SixthSection
        }
    }
</script>

<style>

    .carousel-carousel > .carousel-caption {
        height: 96%;
        width: 93%;
        margin-left: -10%;
    }

    .rotation-270 {
        transform: rotate(270deg);
        -webkit-transform: rotate(270deg); /* Safari */
        -moz-transform: rotate(270deg); /* Firefox */
        -ms-transform: rotate(270deg); /* IE */
        -o-transform: rotate(270deg); /* Opera */
    }

    .share-card-1 {
        z-index: 10;
        position: absolute;
        top: 15px;
        right: 45px;
        color: #fff;
    }

    .share-card-2 {
        z-index: 10;
        position: absolute;
        top: 15px;
        right: 30px;
        color: #fff;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /*
        ===================================
        |        Style Social-Media       |
        ===================================
    */
    .fa-facebook {
        color: #3b5998;
    }

    .fa-google-plus {
        color: #dd4b39;
    }

    .fa-linkedin-in {
        color: #fff;
        border-radius: 50%;
        padding: 7px;
        background-color: #0077b5;
    }

    .fab.fa-twitter {
        color: #fff;
        border-radius: 50%;
        padding: 6px;
        background-color: #1da1f2;
    }

    .fa-whatsapp {
        color: #fff;
        border-radius: 50%;
        padding: 4px;
        background-color: #075e54;
    }

    .fa-reddit {
        color: #ff4500;
    }

    .social-media > span {
        font-size: 40px;
        padding-bottom: 3px;
        transition: .5s;
        display: grid;
    }

</style>
