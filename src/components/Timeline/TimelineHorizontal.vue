<template>
    <div>
        <b-row class="justify-content-md-center">
            <template v-if="itemsShow.length > 0" v-for="itemShow in itemsShow">
                <div class="row justify-content-md-center w-100 timeline-row">
                    <template v-for="item in itemShow.items">
                        <TimelineItemHorizontal :item="item" :margin="itemShow.margin"/>
                    </template>
                </div>
            </template>
        </b-row>
        <b-row class="justify-content-md-center">

            <b-col cols="10">
                <div class="d-flex">
                    <!-- <b-col>
                         <button class="arrow arrow__prev disabled" ref="prevYearButton" disabled>

                         </button>
                     </b-col>-->
                    <b-col>
                        <div class="swiper-container">
                            <!--<p class="swiper-control">
                                <button type="button" class="btn btn-default btn-sm prev-slide">Prev</button>
                                <button type="button" class="btn btn-default btn-sm next-slide">Next</button>
                            </p>-->
                            <div class="swiper-wrapper timeline timeline-items-outstanding">
                                <div v-if="itemsOutstanding.length > 0" class="swiper-slide">
                                    <dl>
                                        <dd v-for="(item, index) in itemsOutstanding" :key="index">
                                            <div class="item-circle" @click="selectItemTimeline($event, item.id)"></div>
                                            <div class="item-date">
                                                {{ item.date | moment("MMMM") }} {{ item.date | moment("DD") }}, {{ item.date | moment('YYYY')}}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                                <!--<div class="swiper-slide" v-for="itemByDate in itemsByDateArray">

                                    <div class="timestamp">
                                        {{itemByDate.monthName}}
                                    </div>

                                    <dl>
                                        &lt;!&ndash;<dt v-for="(day, index) in itemByDate.days" :key="index">
                                            <div class="day">{{ itemByDate.monthName }} {{ day.day }}</div>
                                        </dt>
                                            <template v-for="(day, index) in itemByDate.days">
                                                <dd v-for="(item, index) in day.items" :key="item.index">
                                                </dd>
                                            </template>&ndash;&gt;
                                        &lt;!&ndash;<dt><div class="day">DÍA 1</div></dt>
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
                                            <dd>Ítem 2</dd>&ndash;&gt;

                                    </dl>

                                </div>-->
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
    </div>
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
        data() {
            return {
                itemsShow: []
            }
        },
        methods: {
            selectItemTimeline(event, idItem) {
                this.$root.$emit('selectItem', idItem);

                document.querySelectorAll('.item-circle').forEach((circle) => {
                    circle.style.background = 'transparent';
                    circle.style.border = '2px solid white';
                });

                event.target.style.background = '#65B32E';
                event.target.style.border = 'none';
            }
        },
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

            this.loadResourcesSitePages().then(() => {

                let i, j, tempItemsX3, chunk = 3;
                for (i = 0, j = this.itemsOutstanding.length; i < j; i += chunk) {
                    tempItemsX3 = this.itemsOutstanding.slice(i, i + chunk);

                    this.itemsShow.push({
                        margin: i === 0 ? 1 : i,
                        items: tempItemsX3
                    });
                }

                this.itemsShow.reverse();

                //Carga los items
                new this.$swiper('.swiper-container', {
                    slidesPerView: 'auto',
                    paginationClickable: true,
                    nextButton: '.next-slide',
                    prevButton: '.prev-slide',
                });
            });
        },
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

    .timeline-row {
        margin-top: -70px;
    }

    .swiper-control {
        text-align: right;
    }

    .swiper-container {
        width: auto !important;
        cursor: move;
        display: flex;
        overflow: hidden;

        /*height: 250px;
        margin: 50px 0;
        padding: 0 20px 30px 20px;*/
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

    }

    dl dt, dl dd {
        display: inline-block;
        width: 160px;
        height: 3px;
        background: white;
        vertical-align: top;
        margin: 7px;
        padding-left: -50px;
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
        background: transparent;

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

    dl dd div.item-circle {
        position: absolute;
        width: 16px;
        height: 16px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: transparent;
        margin-top: 1px;
        margin-left: -15px;
        border: 2px solid white;
    }

    dl dd div.item-circle:hover {
        cursor: pointer;
        background: #65B32E !important;
        border: none !important;
    }

    dl dd div.item-date {
        position: absolute;
        margin-left: -15px;
        margin-top: 10px;
        color: white;
        font-style: italic;
        text-transform: uppercase;
        font-size: 18px;
    }


</style>