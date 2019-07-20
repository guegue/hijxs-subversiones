<template>
    <div>
        <div v-if="itemsOutstanding.length > 0" class="justify-content-md-center title-items-outstanding">
            ELEMENTOS DESTACADOS
        </div>
        <b-row class="justify-content-md-center">
            <template v-if="itemsShow.length > 0" v-for="(itemShow, indexItemShow) in itemsShow">
                <div class="row justify-content-md-center w-100 timeline-row" :key="indexItemShow">
                    <template v-for="item in itemShow.items">
                        <TimelineItemHorizontal :item="item" :margin="itemShow.margin"/>
                    </template>
                </div>
            </template>
        </b-row>
        <b-row class="justify-content-md-center row-wrapper">

            <b-col cols="12" class="cols-timeline">
                <div class="d-flex">
                    <b-col>
                        <div class="swiper-container">
                            <div class="swiper-wrapper timeline timeline-items-outstanding">
                                <div v-if="itemsOutstanding.length > 0" class="swiper-slide">
                                    <dl class="timeline-dl">
                                        <dd v-for="(item, index) in itemsOutstanding" :key="index">
                                            <div class="item-circle" @click="selectItemTimeline($event, item.id)"
                                                 :id="'item-circle-' + item.id"></div>
                                            <div class="item-date">
                                                {{ item.date | moment("MMMM") }} {{ item.date | moment("DD") }}, {{item.date | moment('YYYY')}}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="swiper-slide" v-if="itemsByDateArray.length > 0"
                                     v-for="(itemByDate, indexMonth) in itemsByDateArray">

                                    <!-- <div class="timestamp">
                                        {{itemByDate.monthName}} {{itemByDate.month}}
                                    </div> -->

                                    <dl class="timeline-dl">
                                        <template v-for="(day, indexDay) in itemByDate.days">
                                            <dt>
                                                <div class="date-circle" @click="selectDayTimeline($event, indexMonth, indexDay)"></div>
                                                <div class="day">{{ itemByDate.monthName }} {{ day.day }}</div>
                                            </dt>

                                            <dd v-for="(item) in day.items" :key="item.index">
                                                <div v-if="itemsByDateArray.length > 1" class="item-circle"
                                                     @click="selectItemTimeline($event, item.id)"
                                                     :id="'item-circle-' + item.id"></div>
                                            </dd>
                                        </template>
                                    </dl>

                                </div>
                            </div>
                        </div>

                        <b-row>
                            <b-col cols="4">
                                <div class="change-view-timeline">
                                    <div class="d-inline ml-3 pr-2"><i class="fa fa-eye fa-lg"></i></div>
                                    <div class="d-inline"><u>CAMBIAR VISTA A VERTICAL</u></div>
                                </div>
                            </b-col>
                            <b-col cols="8" class="timeline-buttons">
                                <div class="d-flex justify-content-end">
                                    <button class="button-timeline button-timeline-left" @click="prevButtonTimeline"><i
                                            class="far fa-arrow-alt-circle-left"></i></button>
                                    <button class="button-timeline button-timeline-rigth" @click="nextButtonTimeline"><i
                                            class="far fa-arrow-alt-circle-right"></i></button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    require('@/assets/css/timelineHorizontal.css');

    import timelineMixin from '../../mixins/timelineMixin';
    import timelineHorizontalMixin from '../../mixins/timelineHorizontalMixin';

    import TimelineItemHorizontal from './TimelineItemHorizontal';

    export default {
        name: "TimelineHorizontal",
        components: {
            TimelineItemHorizontal
        },
        mixins: [
            timelineMixin,
            timelineHorizontalMixin
        ],
        data() {
            return {
                itemsShow: [],
                timelineWrapper: null,
                timelineDl: null,
                timelineDl2: null,
                firstItem: null,
                lastItem: null,
                xScrolling: 250,
                singDirection: null,
                counter: 0,
                buttonTimelineRight: null,
                buttonTimelineLeft: null,
            }
        },
        methods: {
            loadItems() {
                this.$nextTick(() => {

                    this.timelineWrapper = document.querySelector('.cols-timeline');
                    this.timelineDl = document.querySelector('.swiper-wrapper');
                    this.timelineDl2 = document.querySelectorAll('.timeline-dl');

                    let itemsCircle = this.timelineDl.querySelectorAll('.item-circle');
                    this.firstItem = itemsCircle[0];
                    //this.lastItem = itemsCircle[itemsCircle.length - 1];
                    this.lastItem = this.timelineDl2[this.timelineDl2.length - 1].querySelector('dd:last-of-type');

                    if (this.itemsByDateArray.length > 0) {
                        document.querySelector('.date-circle').click();

                        if (this.itemsByDateArray.length === 1) {
                            let dt = this.timelineDl2[0].querySelector('dt');
                            let dd = this.timelineDl2[0].querySelector('dd');
                        
                            dt.style.margin = '0px';
                            dd.style.margin = '0px';
                        }
                    }

                    let swc = document.querySelector('.swiper-container').getBoundingClientRect().width;
                    let sw = document.querySelector('.swiper-wrapper').getBoundingClientRect().width;
                    let nw = (swc - sw) + this.lastItem.getBoundingClientRect().width;

                    if (nw > 0) {
                        this.lastItem.style.width = nw + 'px';
                    }

                    this.timelineDl.style.transform = "none";

                    this.buttonTimelineRight = document.querySelector('.button-timeline-rigth');
                    this.buttonTimelineLeft = document.querySelector('.button-timeline-left');

                    this.buttonTimelineRight.disabled = false;
                    this.buttonTimelineLeft.disabled = false;
                    

                    //Handler de la animación
                    this.counter = 0;

                    this.checkTimelineButtons();

                    this.swipeTimeline();
                });
            },
            selectDayTimeline(event, indexMonth, indexDay) {

                this.itemsShow = [];

                this.itemsOutstanding = [];

                this.clearItemsSelected();

                this.clearCircleItemsSelected();

                let days = document.querySelectorAll('.date-circle');
                days.forEach((day) => {
                    day.style.background = 'white';
                    day.style.border = '0';
                });

                event.target.style.background = 'white';
                event.target.style.border = '3px solid #65B32E';

                let items = [];

                items = this.itemsByDateArray[indexMonth].days[indexDay].items;

                let i, j, tempItemsX3, chunk = 3;

                for (i = 0, j = items.length; i < j; i += chunk) {
                    tempItemsX3 = items.slice(i, i + chunk);

                    this.itemsShow.push({
                        margin: i === 0 ? 1 : i,
                        items: tempItemsX3
                    });
                }

                this.itemsShow.reverse();
            },
            selectItemTimeline(event, idItem) {
                this.$root.$emit('selectItem', idItem);

                if (this.listItemsExist()) {
                    this.clearCircleItemsSelected();

                    this.selectItemCircle(idItem);
                }
            },
            nextButtonTimeline() {
                this.singDirection = '-';

                this.animateTl();

                this.checkTimelineButtons();

            },
            prevButtonTimeline() {
                this.singDirection = '';

                this.animateTl();

                this.checkTimelineButtons();

            },
            animateTl() {
                if (this.counter === 0) {
                    this.timelineDl.style.transform = `translateX(-${this.xScrolling}px)`;
                } else {
                    const tlStyle = getComputedStyle(this.timelineDl);
                    const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
                    const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${this.singDirection}${this.xScrolling}`);
                    this.timelineDl.style.transform = `translateX(${values}px)`;
                }

                this.counter++;
            },
            swipeTimeline() {
                this.$nextTick(() => {
                    this.hammer = new this.$hammer(this.timelineDl);

                    this.hammer.on("panright", () => {
                        this.buttonTimelineLeft.click();
                    });

                    this.hammer.on("panleft", () => {
                        this.buttonTimelineRight.click();
                    });
                })
            },
            checkTimelineButtons() {
                this.buttonTimelineRight.disabled = !!this.isItemInScrollView(this.timelineWrapper, this.lastItem);
                this.buttonTimelineLeft.disabled = !!this.isItemInScrollView(this.timelineWrapper, this.firstItem);
            },
            isItemInScrollView(referenceElement, element) {

                let rectReferenceElement = referenceElement.getBoundingClientRect();
                let rectElement = element.getBoundingClientRect();

                return !(rectElement.right < rectReferenceElement.left ||
                    rectElement.left > rectReferenceElement.right ||
                    rectElement.bottom < rectReferenceElement.top ||
                    rectElement.top > rectReferenceElement.bottom);
            }
        },
        filters: {
            firstLetterUpperCase: (string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        },
        mounted() {
            let i, j, tempItemsX3, chunk = 3;

            this.loadResourcesSitePages().then(() => {

                this.itemsByDateArray = [];

                this.itemsShow = [];
                
                for (i = 0, j = this.itemsOutstanding.length; i < j; i += chunk) {
                    tempItemsX3 = this.itemsOutstanding.slice(i, i + chunk);

                    this.itemsShow.push({
                        margin: i === 0 ? 1 : i,
                        items: tempItemsX3
                    });
                }

                this.itemsShow.reverse();

                this.loadItems();
            });

            //Catch del clic emitido al seleccionar un año
            this.$root.$on('timelineYearSelected', (year) => {
                this.timelineYearSelected = year;

                if (year == 0) {
                    this.loadResourcesSitePages().then(() => {

                        this.itemsByDateArray = [];

                        this.itemsShow = [];
                        
                        for (i = 0, j = this.itemsOutstanding.length; i < j; i += chunk) {
                            tempItemsX3 = this.itemsOutstanding.slice(i, i + chunk);

                            this.itemsShow.push({
                                margin: i === 0 ? 1 : i,
                                items: tempItemsX3
                            });
                        }

                        this.itemsShow.reverse();

                        this.loadItems();
                    });

                } else {
                    this.loadItemsResources().then(() => {
                        this.loadAllItems(this.itemsSetUrl).then(() => {
                            this.itemsShow = [];

                            this.itemsOutstanding = [];

                            this.loadItems();
                        });
                    });
                }

            });
        }
    }
</script>

<style scoped>
    .title-items-outstanding {
        position: absolute;
        top: 10%;
        left: 35%;
        color: white;
         -webkit-text-stroke: 0.3px #9b9b9b;
        width: 30%;
        text-align: center;
        vertical-align: middle;
        font-size: 30px;
        font-weight: bold;
        background: #152f4e;
    }

    .row-wrapper {
        overflow: hidden;
    }
    .timeline-dl {
        padding-top: 10px;
        height: 100%;
        transition: transform 0.2s ease;
        cursor: move;
    }

    .timeline {
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
        display: flex;
        overflow: hidden;

        height: auto;
        margin: 25px 0 5px 0;
        padding: 0 20px 30px 20px;
    }

    .button-timeline {
        border: none;
        background: none;
        color: white;
        font-size: 45px;
        outline: none;
    }

    .button-timeline-rigth {
        margin-left: 15px;
    }

    .button-timeline:hover {
        color: #65B32E;
        cursor: pointer;
    }

    .swiper-wrapper {
        transition: transform 0.2s ease;
    }

    .swiper-slide {
        width: auto !important;
        text-align: left;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        height: auto !important;
    }

    .timestamp {
        padding-top: 0.7%;
        margin-right: 3%;
        margin-left: 1%;
        width: 180px;
        text-align: center;
        background: #65B32E;
        color: white;
        border-radius: 5px;
        font-weight: bold;
        font-size: 25px;
    }

    /* dl {
        margin-top: 2%;
    } */

    dl dt, dl dd {
        display: inline-block;
        width: 200px;
        height: 3px;
        background: white;
        vertical-align: top;
        margin: 7px;
        padding-left: -50px;
    }

    dl dt div.day {
        position: absolute;
        margin-left: -15px;
        margin-top: 10px;
        color: white;
        font-style: italic;
        text-transform: uppercase;
        font-size: 18px;
    }

    dl dt div.date-circle {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        transform: translateY(-40%);
        border-radius: 50%;
        background: white;
        margin-left: -20px;
    }

    dl dt div.date-circle:hover {
        transform: translateY(-40%);
        cursor: pointer;
        border-style: solid;
        width: 22px;
        height: 22px;
        border-color: #65B32E;
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

    .change-view-timeline {
        color: white;
        font-size: 20px;
    }
</style>