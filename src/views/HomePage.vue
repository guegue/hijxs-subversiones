<template>
    <div>
        <first-section></first-section>
        <second-section></second-section>
        <third-section></third-section>
        <fourth-section></fourth-section>
    </div>
</template>

<script>
    import FirstSection from '../components/FirstSection'
    import SecondSection from '../components/SecondSection'
    import ThirdSection from '../components/ThirdSection'
    import FourthSection from '../components/FourthSection'

    export default {
        name: 'HomePage',
        components: {
            FirstSection,
            SecondSection,
            ThirdSection,
            FourthSection
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
</style>
