<template>

        <social-sharing :url="urlShare" inline-template>
            <div class="social-media">
                <network network="facebook"> <i class="fab fa-facebook"></i> </network>
                <network network="whatsapp"> <i style="height: 40px; width: 40px;" class="fab fa-whatsapp"></i> </network>
                <network network="twitter"> <i style="height:40px; width: 40px;" class="fab fa-twitter"></i> </network>
              <!--  <network network="googleplus"> <i class="fab fa-google-plus"></i> </network>-->
                <network network="linkedin"> <i style="height: 40px; width: 40px;" class="fab fa-linkedin-in"></i> </network>
                <network network="pinterest"> <i class="fab fa-pinterest"></i></network>
                <network network="reddit"><i class="fab fa-reddit"></i> </network>

         <!--       <network network="vk"> <i class="fa fa-vk"></i> VKontakte </network>-->

            </div>
        </social-sharing>

</template>

<script>
    export default {
        name: 'social-media',
        props: {urlShare: String},
        data: () => {
            return {}
        },
        methods: {},
        watch: {},
    }
</script>

<style scoped>

</style>