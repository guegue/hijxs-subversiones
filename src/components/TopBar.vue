<!--:style="{'background-color':Your_Variable_Name}">-->

<template>
    <b-container :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">
        <b-row class="text-white justify-content-center">
            <b-col sm="2" md="2" lg="2" v-for="option in menuSite" :key="option.positionOption" class="">
                <!--<b-link router-tag="a" :to="'/'+option.slugSite+'/page/'+option.slugPage" class="text-left text-no-decoration text-white">-->
                <!--<router-link :to="{ name: 'page', params: { page: option.title.toLowerCase()} /*, query: { debug: true }*/}" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':('/'+option.title.toLowerCase()===currentRoute) || (currentRoute==='/' && option.positionOption===1)}"></b-dropdown-divider>
                    <small>{{option.title}}</small>
                </router-link>-->
                <a  :href="'/'+option.routePage" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2" :class="{'active':('/'+option.routePage===currentRoute) || (currentRoute==='/' && option.positionOption===1)}"></b-dropdown-divider>
                    <small>{{option.title}}</small>
                </a>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

    export default {
        name: 'TopBar',
        props: {
            flag: Boolean,
            indexMenu: null,
            menuSite:Array
        },
        data: () => {
            return {
                slugSite:null,
                currentRoute:null,
            }
        },
   mounted(){
        this.currentRoute = this.$route.path.toLowerCase();
   }
    }
</script>

<style scoped>

    /*@media (min-width: 768px)*/ .col-md-2 {
-ms-flex: 0 0 16.666667%;
/* -webkit-box-flex: 0; */
flex: 0 0 10.666667% !important;
max-width: 16.666667%;
}
    .topbar {
        z-index: 2;
        top: 30px;
        left: 10%;
        /*margin-left: 150px !important;*/
    }
    div#idSlider> .container{max-width: 95% !important;}

    .row div {
        width: 105px;
    }

    .divider-line-2 {
        border: 2px solid #fff;
        width: 100%;
    }

    .dropdown-divider.active {
        border: 2px solid #6aae40;
    }

    .text-no-decoration {
        text-decoration: none;
    }

    a>li{display: flex;}


</style>
