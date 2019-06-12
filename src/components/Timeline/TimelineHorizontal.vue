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
            /*//Catch del clic emitido al seleccionar un año
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



            });*/

            //Carga los items
            //console.log(this.itemsByDateArray);
            new this.$swiper('.swiper-container', {
                slidesPerView: 'auto',
                grabCursor: true,
                paginationClickable: true,
                nextButton: '.next-slide',
                prevButton: '.prev-slide',
            });
        }
    }
</script>

<style scoped>
    .timeline {
        margin: 50px 0;
        list-style-type: none;
        display: flex;
        padding: 0;
        text-align: center;
    }

    .timeline li {
        transition: all 200ms ease-in;
    }

    .swiper-control {
        text-align: right;
    }

    .swiper-container {
        width: auto !important;

        display: flex;

        height: 250px;
        margin: 50px 0;
        overflow: hidden;
        padding: 0 20px 30px 20px;
    }

    .swiper-slide {
        width: auto !important;
        text-align: left;
        display: flex;
        white-space: nowrap;
        overflow-x: hidden;

        height: auto !important;
    }

    .timestamp {
        padding-top: 0.7%;
        margin-right: 1%;
        margin-left: 1%;
        width: 250px;
        text-align: center;
        background: #65B32E;
        color: white;
        border-radius: 5px;
        font-weight: bold;
        font-size: 25px;
    }

    dl {
        margin: auto !important;
    }

    dl dt, dl dd {
        color: white;
        display: inline-block;
        width: 160px;
        height: 3px;
        background: white;
        vertical-align: top;
    }

    dl dt div.day {
        color: #65B32E;
        margin-left: 45%;
        position: relative;

        top: 18px;

        font-size: 25px;
        font-style: italic;
    }

    dl dt::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: white;

        border-style: solid;
        border-color: #65B32E;
        border-width: 3px;
    }

    dl dt:hover::before {

        transform: translateY(-50%);
        border-radius: 50%;
        background: white;

        border-style: solid;
        border-color: red;
        border-width: 3px;
    }

    dl dd::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: white;
    }


</style>