<template>
    <b-row class="justify-content-md-center timelineBackground"
           style="margin-right: 0 !important; margin-left: 0 !important; padding-right: 50px">
        <b-col cols="11">
            <div class="d-flex">
                <b-col>
                    <button class="arrow arrow__prev disabled" ref="prevYearButton" disabled>

                    </button>
                </b-col>
                <b-col>
                    <div class="timeline-horizontal">
                        <div v-for="(itemByDate, index) in itemsByDateArray" :key="index" class="timeline in-view">
                            <!--<div class="month">
                                {{ itemByDate.monthName }}
                            </div>-->
                            <ol class="timeline-ul">
                                <transition-group name="list">
                                    <li v-for="(day, index) in itemByDate.days" :key="index">
                                        <label class="day">{{ itemByDate.monthName }} {{ day.day }}</label>
                                        <TimelineItem v-for="(item, index) in day.items" :item="item" :key="index"/>
                                    </li>
                                </transition-group>
                            </ol>
                        </div>
                    </div>
                </b-col>
                <b-col>
                    <button class="arrow arrow__next" ref="nextYearButton">

                    </button>
                </b-col>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    require('@/assets/css/timelineHorizontal.css');

    import timelineMixin from '../../mixins/timelineMixin';

    import TimelineItem from './TimelineItem';

    export default {
        name: "TimelineHorizontal",
        components: {
            TimelineItem
        },
        mixins: [
            timelineMixin
        ],
        methods: {

        },
        mounted() {
            //Catch del clic emitido al seleccionar un año
            this.$root.$on('selectYear', (year) => {

                //Almacena el año seleccionado
                this.timelineYearSelected = parseInt(year);
                //Paginado de datos para control de la api
                this.page = 1;
                //Para limpiar el array de items
                this.items = [];
                //Para limpiar el array de fechas
                this.itemsDate = [];
                //Para limpiar el array de meses de fechas
                this.itemsDateMonth = [];
                //Para limpiar el array de items agrupados
                this.itemsByDateArray = [];

                //Carga los items
                this.loadItems();

            });
        }
    }
</script>

<style scoped>

</style>