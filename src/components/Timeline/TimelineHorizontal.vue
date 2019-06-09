<template>
    <b-row class="justify-content-md-center">

        <b-col cols="10">
            <div class="d-flex">
                <!-- <b-col>
                     <button class="arrow arrow__prev disabled" ref="prevYearButton" disabled>

                     </button>
                 </b-col>-->
                <b-col>
                    <div class="swiper-container">
                        <p class="swiper-control">
                            <button type="button" class="btn btn-default btn-sm prev-slide">Prev</button>
                            <button type="button" class="btn btn-default btn-sm next-slide">Next</button>
                        </p>
                        <div class="swiper-wrapper timeline">
                            <div class="swiper-slide" v-for="itemByDate in itemsByDateArray">

                                <div class="timestamp">
                                    {{itemByDate.monthName}}
                                </div>

                                <dl>
                                    <!--<dt v-for="(day, index) in itemByDate.days" :key="index">
                                        <div class="day">{{ itemByDate.monthName }} {{ day.day }}</div>
                                    </dt>
                                        <template v-for="(day, index) in itemByDate.days">
                                            <dd v-for="(item, index) in day.items" :key="item.index">
                                            </dd>
                                        </template>-->
                                    <dt><div class="day">DÍA 1</div></dt>
                                        <dd>Ítem 1</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd><dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>

                                    <dt><div class="day">DÍA 2</div></dt>
                                        <dd>Ítem 1</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd><dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>
                                        <dd>Ítem 2</dd>

                                </dl>

                            </div>
                        </div>
                    </div>

                </b-col>
                <!-- <b-col>
                     <button class="arrow arrow__next" ref="nextYearButton">

                     </button>
                 </b-col>-->
            </div>
        </b-col>
    </b-row>
</template>

<script>
    require('@/assets/css/timelineHorizontal.css');

    import timelineMixin from '../../mixins/timelineMixin';

    import TimelineItemHorizontal from './TimelineItemHorizontal';

    export default {
        name: "TimelineHorizontal",
        components: {
            TimelineItemHorizontal
        },
        mixins: [
            timelineMixin
        ],
        methods: {},
        filters: {
            firstLetterUpperCase: (string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
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
                this.loadItems().then(() => {
                    new this.$swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        grabCursor: true,
                        paginationClickable: true,
                        nextButton: '.next-slide',
                        prevButton: '.prev-slide',
                    });
                });

            });
        }
    }
</script>

<style scoped>

</style>