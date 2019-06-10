<template>
    <b-container :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">
        <b-row class="text-white justify-content-center">
            <b-col sm="2" md="2" lg="2" v-for="option in menuSite" :key="option.positionOption" class="p-0">
                <!--<b-link router-tag="a" :to="'/'+option.slugSite+'/page/'+option.slugPage" class="text-left text-no-decoration text-white">-->
                <!--<router-link :to="{ name: 'page', params: { page: option.title.toLowerCase()} /*, query: { debug: true }*/}" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':('/'+option.title.toLowerCase()===currentRoute) || (currentRoute==='/' && option.positionOption===1)}"></b-dropdown-divider>
                    <small>{{option.title}}</small>
                </router-link>-->
                <a  :href="'/'+option.routePage" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':('/'+option.routePage===currentRoute) || (currentRoute==='/' && option.positionOption===1)}"></b-dropdown-divider>
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
                /*  optionsMenu: [],
                     {
                         positionOption: '01',
                         title: 'INICIO',
                         url: ''
                     },
                     {
                         positionOption: '02',
                         title: 'EXHIBICIÓN PRINCIPAL',
                         url: ''
                     },
                     {
                         positionOption: '03',
                         title: 'COLECCIONES',
                         url: ''
                     },
                     {
                         positionOption: '04',
                         title: 'BLOG',
                         url: ''
                     },
                     {
                         positionOption: '05',
                         title: 'VIDEOS',
                         url: ''
                     }

                 ],*/
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
    .topbar {
        z-index: 2;
        top: 35px;
        left: 15%;
        /*margin-left: 150px !important;*/
    }

    .row div {
        width: 170px;
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
</style>
