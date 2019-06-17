<template>
        <slider :menuSite="menuSite"></slider>
</template>

<script>
    import Slider from '../components/Slider'

    export default {
        name: "FirstSection",
        props:{
            menuSite:Array
        },
        components: {
            Slider
        }
    }
</script>

<style scoped>

</style>
