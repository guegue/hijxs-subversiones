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
            <!-- <b-col cols="2">
                <b-form-select v-if="months.length > 0" v-model="selected" class="timeline-months">
                    <option v-for="(month, index) in months" :disabled="month.disabled" :value="month.value" :key="index">{{ month.text }}</option>
                </b-form-select>
            </b-col> -->
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
                selected: null,
                months: [],
            }
        },
        methods: {
            toggleMenuBar() {
                document.querySelector(".menu-bar").classList.toggle("collapsed-menu-bar");
            }
        },
        mounted() {

            this.buildMenu(13);

            this.$root.$on('itemsDateMonthUnique', (itemsDateMonthUnique) => {
                this.months = [];

                let defaultOption = {
                    value: null,
                    text: 'SELECCIONE UN MES',
                    disabled: "disabled"
                };

                this.months.push(defaultOption);

                itemsDateMonthUnique.forEach((month) => {
                    this.months.push({
                        value: month,
                        text: this.$moment(month, 'MM').format('MMMM').toUpperCase()
                    })
                });

                this.selected = null;
            });
        }
    }
</script>

<style scoped>
    .nav-fixed {
        /* background: red; 
        width: 20px; */
        top: 0;
        position: -webkit-sticky;
        position: sticky;
        z-index: 2;
        /* float: right; */
    }

    .timeline-months {
        color: white;
        background: rgba(133.1, 143.1, 155.0, 0.7);
        outline: none;
        border: none;
        font-weight: bold;
    }

    .timeline-months option {
        font-weight: bold;
    }

    .toggle-menu-bar:hover {
        cursor: pointer;
    }

    .menu-bar {
        background: #15304F;
        opacity: 0.8;
        position: absolute;
        width: 100%;
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