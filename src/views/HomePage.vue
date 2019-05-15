<template>
    <div>
        <first-section></first-section>
        <second-section></second-section>
        <third-section></third-section>
        <fourth-section></fourth-section>
        <fifth-section></fifth-section>
        <sixth-section :indexMenu="1"></sixth-section>
    </div>
</template>

<script>
    import FirstSection from '../components/FirstSection'
    import SecondSection from '../components/SecondSection'
    import ThirdSection from '../components/ThirdSection'
    import FourthSection from '../components/FourthSection'
    import FifthSection from '../components/FifthSection'
    import SixthSection from '../components/SixthSection'

    export default {
        name: 'HomePage',
        components: {
            FirstSection,
            SecondSection,
            ThirdSection,
            FourthSection,
            FifthSection,
            SixthSection
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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

    /*Height del Slider*/
    .img-fluid { height: -webkit-fill-available !important;}

    /*Loading page*/
    [v-cloak] > * {
        display: none;
    }

    [v-cloak]::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1000;
        width: 150px;
        height: 150px;
        margin: -75px 0 0 -75px;
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
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

</style>
