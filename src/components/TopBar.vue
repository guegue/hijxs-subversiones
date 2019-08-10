<!--:style="{'background-color':Your_Variable_Name}">-->

<template>
    <b-container :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">

        <b-row class="text-white justify-content-center main-menu">
            <b-col sm="2" md="2" lg="2" v-for="option in menuSite" :key="option.positionOption" class=""> <!--style="height: 70px; background-color:rgba(27, 27, 27, 0.8);"-->
                <router-link :to="{ name: 'page', params: { page: option.routePage}}" @click.native="navigateTo"
                             class="text-left text-no-decoration text-white">

                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':('/'+option.routePage===currentRoute) || (currentRoute==='/' && option.positionOption===1) || option.active}"></b-dropdown-divider>
                    <small class="menu-title">{{option.title}}</small>
                    <!-- </a>-->
                </router-link>
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
            menuSite: Array
        },
        data: () => {
            return {
                slugSite: null,
                currentRoute: null,
                prevRoute: null,
            }
        },
        mounted() {
            this.prevRoute = this.$route.path.toLowerCase();
            this.currentRoute = this.$route.path.toLowerCase();
        },
        methods: {
            navigateTo() {

                this.$loading('main-content-site');

                this.currentRoute = this.$route.path.toLowerCase();
                if (this.currentRoute === '/')
                    this.$router.go(this.currentRoute);
                else {
                    for (const menu of this.menuSite)
                        if (menu.routePage === this.currentRoute)
                            this.menuSite[menu.active] = true;

                    if (this.prevRoute !== '/')
                        this.$eventBus.$emit('menuChange', true);
                }

            }
        }
    }
</script>

<style scoped>

    /*@media (min-width: 768px)*/
    .col-md-2 {
        -ms-flex: 0 0 16.666667%;
        /* -webkit-box-flex: 0; */
        flex: 0 0 10.666667% !important;
        max-width: 16.666667%;
    }

    .topbar {
        z-index: 2;
        top: 9px;
        left: 10%;
        /*margin-left: 150px !important;*/
    }

    div#idSlider > .topbar > .main-menu {
        max-width: 95% !important;
    }

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

    a > li {
        display: flex;
    }

    .menu-title {
        position: absolute;
    }
</style>
