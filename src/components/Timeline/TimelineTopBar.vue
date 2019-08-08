<template>
    <div class="nav-fixed">
        <b-navbar class="menu-bar collapsed-menu-bar">
            <b-navbar-nav class="mx-auto">
                <template v-for="option in optionsMenu">
                    <router-link :to="{ name: 'page', params: { page: option.routePage }}" :key="option.positionOption">
                        <b-nav-item class="ml-5 mr-5" :href="option.routePage">{{ option.title.toUpperCase() }}</b-nav-item>
                    </router-link>
                </template>
            </b-navbar-nav>
            <b-col cols="1">
                <span class="text-white float-right mr-5 toggle-menu-bar" @click="toggleMenuBar"><i class="far fa-times-circle fa-3x"></i></span>
            </b-col>
        </b-navbar>
        <b-navbar>
            <b-col>
                <span class="text-white float-right mr-2 toggle-menu-bar" @click="toggleMenuBar"><i class="fas fa-bars fa-2x"></i></span>
            </b-col>
        </b-navbar>
        <b-navbar>
            <b-col>
                <TimelineSettingSidebar/>
            </b-col>
        </b-navbar>
        <b-navbar>
            <b-col cols="12">
                <TimelineCompareSidebar/>
            </b-col>
        </b-navbar>
    </div>
</template>

<script>

    import timelineMixin from '../../mixins/timelineMixin';
    import TimelineSettingSidebar from './TimelineSettingSidebar';
    import TimelineCompareSidebar from './TimelineCompareSidebar';
    import webSitesMixin from '../../mixins/webSitesMixin';
    import encryptStringMixin from '../../mixins/encryptStringMixin';

    export default {
        name: "TimelineTopBar",
        components: {
            TimelineSettingSidebar,
            TimelineCompareSidebar
        },
        mixins: [
            timelineMixin,
            webSitesMixin,
            encryptStringMixin
        ],
        data() {
            return {

            }
        },
        methods: {
            toggleMenuBar() {
                document.querySelector(".menu-bar").classList.toggle("collapsed-menu-bar");
            }
        },
        mounted() {

            this.buildMenu(13);
        }
    }
</script>

<style scoped>
    .nav-fixed {
        top: 0;
        right: 0;
        position: fixed;
        z-index: 2;
    }

    .toggle-menu-bar:hover {
        cursor: pointer;
    }

    .menu-bar {
        background: #15304F;
        opacity: 0.8;
        position: absolute;
        width: 1500px;
        z-index: 2;
        right: 0;
        top: 0;
        transition: top .40s;
    }

    .menu-bar.collapsed-menu-bar {
        top: -50px;
        height: 0;
    }

    .nav-item a {
        color: white !important;
    }
</style>