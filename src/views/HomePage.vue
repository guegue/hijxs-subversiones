<template>
    <div>
        <first-section></first-section>
        <second-section></second-section>
        <third-section></third-section>
    </div>
</template>

<script>
    import FirstSection from '../components/FirstSection'
    import SecondSection from '../components/SecondSection'
    import ThirdSection from '../components/ThirdSection'

    export default {
        name: 'HomePage',
        components: {
            FirstSection,
            SecondSection,
            ThirdSection
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
