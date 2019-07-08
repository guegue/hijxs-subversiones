<template>
    <div class="nav-fixed">
        <b-navbar>
            <b-col cols="2">
                <b-form-select v-if="months.length > 0" v-model="selected" class="timeline-months">
                    <option v-for="month in months" :disabled="month.disabled" :value="month.value">{{ month.text }}</option>
                </b-form-select>
            </b-col>
            <!-- Right aligned nav items -->
            <!--<b-navbar-nav class="ml-auto">
                <b-nav-form right>
                    <span class="text-white"><i class="fas fa-bars fa-2x"></i></span>
                </b-nav-form>
            </b-navbar-nav>-->
            <b-col>
                <TimelineSettingSidebar/>
                <span class="text-white float-right mr-3"><i class="fas fa-bars fa-2x"></i></span>
                <!--<span class="text-white float-right"><i class="fas fa-bars fa-2x"></i></span>-->
            </b-col>

        </b-navbar>
        <b-navbar>
            <b-col cols="12">
                <span class="text-white float-right"><i class="fas fa-bars fa-2x"></i></span>
            </b-col>
        </b-navbar>
    </div>
</template>

<script>

    import timelineMixin from '../../mixins/timelineMixin';
    import TimelineSettingSidebar from './TimelineSettingSidebar';

    export default {
        name: "TimelineTopBar",
        components: {
            TimelineSettingSidebar
        },
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                selected: null,
                months: [],
            }
        },
        mounted() {
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
        top: 0;
        position: -webkit-sticky;
        position: sticky;
        z-index: 2;
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
</style>