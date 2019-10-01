<template>
    <div class="nav-fixed">
        <b-navbar>
        </b-navbar>
        <b-navbar>
        </b-navbar>
        <b-navbar>
        </b-navbar>
        <b-navbar>
        </b-navbar>
        <b-navbar>
        </b-navbar>
        <b-navbar>
            <b-col>
                <TimelineSettingSidebar/>
            </b-col>
        </b-navbar>
        <b-navbar>
            <b-col>
                <TimelineCompareSidebar/>
            </b-col>
        </b-navbar>
        <b-navbar>
            <b-col>
                <TimelineChangeView/>
            </b-col>
        </b-navbar>
    </div>
</template>

<script>

    import timelineMixin from '../../mixins/timelineMixin';
    import TimelineSettingSidebar from './TimelineSettingSidebar';
    import TimelineCompareSidebar from './TimelineCompareSidebar';
    import TimelineChangeView from './TimelineChangeView';
    import webSitesMixin from '../../mixins/webSitesMixin';
    import encryptStringMixin from '../../mixins/encryptStringMixin';

    export default {
        name: "TimelineTopBar",
        components: {
            TimelineSettingSidebar,
            TimelineCompareSidebar,
            TimelineChangeView
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