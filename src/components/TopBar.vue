<template>
    <div>
        <Slide right>
            <template v-for="option in optionsMenu">
                <router-link :to="{ name: 'page', params: { page: option.routePage}}" @click.native="navigateTo">
                    <span>{{option.title}}</span>
                </router-link>
            </template>
            <router-link to="lineadetiempo">
                <span>Línea de tiempo</span>
            </router-link>
            <router-link to="mapa">
                <span>Mapa</span>
            </router-link>
            <router-link to="historia">
                <span>Historia</span>
            </router-link>
        </Slide>
    </div>
</template>

<script>
    import sitesMixin from '../mixins/webSitesMixin';
    import Encrypt from '../mixins/encryptStringMixin';

    import {Slide} from 'vue-burger-menu';

    export default {
        name: 'TopBar',
        mixins: [sitesMixin, Encrypt],
        props: {
            indexMenu: null
        },
        components: {
            Slide
        },
        data() {
            return {
                slugSite: null,
                currentRoute: null,
                prevRoute: null,
                baseKeyEncrypt: [],
                description: '',
                menu: []
            }
        },
        mounted() {
            let dataSite = this.getSites(this.$idDefauldSite);

            dataSite.then((data) => {
                this.description = data['o:summary'];
                let slugSite = data['o:slug'];
                this.buildMenu(this.$idDefauldSite, slugSite);
            });

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
                    for (const menu of this.optionsMenu)
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
        top: 30px;
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

<style>
    .bm-menu {
        background: #1F3954 !important;
        opacity: 0.8;
    }

    .bm-burger-button {
        z-index: 110 !important;
        right: 0 !important;
        position: fixed !important;
    }

    .bm-burger-button span {
        background: white;
        border: solid #afafaf 1px;
        -webkit-box-shadow: 10px 10px 24px -16px rgba(175, 175, 175, 1);
        -moz-box-shadow: 10px 10px 24px -16px rgba(175, 175, 175, 1);
        box-shadow: 10px 10px 24px -16px rgba(175, 175, 175, 1);
    }

    nav.bm-item-list a:hover {
        text-decoration: none;
    }

    nav.bm-item-list a span {
        color: white;
    }

    nav.bm-item-list a span:hover {
        color: #6aae40;
    }

    .cross-style {
        left: 30px !important;
    }

    .bm-item-list > * {
        padding-bottom: 0.4em;
    }

</style>
