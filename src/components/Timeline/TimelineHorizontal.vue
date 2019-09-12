<template>
    <div>
        <loading :active.sync="isLoading"
                 :can-cancel="false"
                 :is-full-page="fullPage"
        />
        <div v-if="itemsOutstanding.length > 0" class="justify-content-md-center title-items-outstanding">
            ELEMENTOS DESTACADOS
        </div>
        <b-row class="justify-content-md-center row-wrapper">

            <b-col cols="12" class="cols-timeline">
                <div class="d-flex">
                    <b-col>
                        <div class="timeline-h timeline timeline-items-outstanding">

                            <div class="items-year" v-if="itemsOrdered.length > 0"
                                 v-for="(itemByYear) in itemsOrdered">

                                <div :id="itemByYear.year" class="timestamp">
                                    {{itemByYear.year}}
                                </div>

                                <div class="items-month" v-for="(month, indexMonth) in itemByYear.months">
                                    <div class="items-days" v-for="(day, indexDay) in month.days">
                                        <div class="items" v-for="(item, indexItem) in day.items" :key="item.index">
                                            <TimelineItemHorizontal :item="item" :margin="2"/>
                                        </div>
                                        <dl class="timeline-dl">
                                            <dt>
                                                <div class="date-circle"></div>
                                                <div class="day">{{ month.monthName }} {{ day.day }}</div>
                                            </dt>
                                        </dl>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </b-col>
                </div>
            </b-col>
        </b-row>

        <b-row class="mt-5">
            <b-col cols="4">
                <div class="change-view-timeline mt-3">
                    <div class="d-inline">
                        <span class="change-view-timeline-icon"></span>
                        <span class="change-view-timeline-text">VISTA VERTICAL</span>
                    </div>
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
    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';
    import timelineHorizontalMixin from '../../mixins/timelineHorizontalMixin';

    import TimelineItemHorizontal from './TimelineItemHorizontal';

    export default {
        name: "TimelineHorizontal",
        components: {
            TimelineItemHorizontal
        },
        props: ['itemsOrdered'],
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
                previousToLastItem: null,
                xScrolling: 250,
                singDirection: null,
                counter: 0,
                buttonTimelineRight: null,
                buttonTimelineLeft: null
            }
        },
        methods: {
            async loadItems() {
                await this.$nextTick(() => {

                    let itemsCircle = null;
                    let itemsYears = null;
                    let itemsMonth = null;
                    let itemsDay = null;
                    let items = null;
                    let sw = document.querySelector('.timeline-h').getBoundingClientRect().width;
                    let ss = 0;
                    let itemIterator = 0;

                    this.timelineWrapper = document.querySelector('.cols-timeline');
                    this.timelineDl = document.querySelector('.timeline-h');
                    this.timelineDl2 = document.querySelectorAll('.timeline-dl');

                    if (this.itemsOutstanding.length > 0) {
                        itemsCircle = this.timelineDl.querySelectorAll('.item-circle-outstanding');
                    } else if (this.itemsByDateArray.length > 0) {
                        itemsCircle = this.timelineDl.querySelectorAll('.date-circle');
                    }

                    //this.firstItem = itemsCircle[0];
                    this.firstItem = null;

                    //this.lastItem = itemsCircle[itemsCircle.length - 1];
                    this.lastItem = this.timelineDl2[this.timelineDl2.length - 1].querySelector('dd:last-of-type');
                    //this.previousToLastItem = this.lastItem.previousSibling;

                    itemsYears = document.querySelectorAll('.items-year');
                    for (let itemYear of itemsYears) {
                        itemsMonth = itemYear.querySelectorAll('.items-month');

                        for (let itemMonth of itemsMonth) {
                            itemsDay = itemMonth.querySelectorAll('.items-days');

                            for (let itemDay of itemsDay) {
                                items = itemDay.querySelectorAll('.items');
                                for (let item of items) {
                                    let listItem = item.querySelector('.list-item');

                                    if (items.length === 1) {

                                        if (itemIterator % 2 !== 0) {
                                            listItem.classList.add('list-item-up');
                                            listItem.classList.add('list-item-up-line');
                                        } else {
                                            listItem.classList.add('list-item-down-line');
                                        }
                                    } else {
                                        listItem.classList.add('list-item-line');
                                        itemIterator = 1;
                                    }

                                    itemIterator++;
                                }
                            }
                        }
                    }

                    /*if (this.itemsByDateArray.length > 0) {
                        document.querySelector('.date-circle').click();

                        this.timelineDl2.forEach((dl) => {
                            dl.querySelectorAll('dd').forEach((dldd) => {
                                if (dldd.querySelector('.item-circle') === null) {
                                    dldd.style.marginLeft = '0px';
                                    dldd.style.marginRight = '0px';

                                    dldd.previousSibling.style.marginLeft = '0px';
                                    dldd.previousSibling.style.marginRight = '0px';
                                }
                            })
                        });
                    
                        /!* if (this.itemsByDateArray.itemByDate.days.length === 1) {
                            
                            let dt = this.timelineDl2[0].querySelector('dt');
                            let dd = this.timelineDl2[0].querySelector('dd');
                        
                            dt.style.margin = '0px';
                            dd.style.margin = '0px';
                        } *!/
                    }*/

                    /*if (swiperSlides.length > 0) {
                        if (swiperSlides.length === 1) {
                            ss = swiperSlides[0].getBoundingClientRect().width;
                        } else {
                            swiperSlides.forEach((swiperSlide) => {
                                ss +=  swiperSlide.getBoundingClientRect().width;
                            });
                        }
                    }*/
                    /*let ss = document.querySelectorAll('.items-year')[document.querySelectorAll('.items-year').length - 1].getBoundingClientRect().width;*/

                    /*let nw = sw-ss;

                    if (nw > 0) {
                        this.previousToLastItem.style.width = (nw + this.previousToLastItem.getBoundingClientRect().width + this.lastItem.getBoundingClientRect().width) + 'px';
                    }*/

                    this.timelineDl.style.transform = "none";

                    this.buttonTimelineRight = document.querySelector('.button-timeline-rigth');
                    this.buttonTimelineLeft = document.querySelector('.button-timeline-left');

                    //Handler de la animación
                    this.counter = 0;

                    //this.elementViewPort = this.lastItem;
                    //this.checkTimelineButtons();

                    this.swipeTimeline();
                });
            },
            nextButtonTimeline() {
                this.singDirection = '-';

                this.animateTl();

                this.elementViewPort = this.lastItem;
                //this.checkTimelineButtons();

            },
            prevButtonTimeline() {
                this.singDirection = '';

                this.animateTl();

                this.elementViewPort = this.firstItem;
                //this.checkTimelineButtons();

            },
            animateTl() {
                if (this.counter === 0) {
                    this.timelineDl.style.transform = `translateX(${this.singDirection}${this.xScrolling}px)`;
                } else {
                    const tlStyle = getComputedStyle(this.timelineDl);
                    const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
                    const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${this.singDirection}${this.xScrolling}`);
                    this.timelineDl.style.transform = `translateX(${values}px)`;
                }

                this.counter++;

                /*this.buttonTimelineLeft.disabled = true;
                this.buttonTimelineRight.disabled = true;

                this.timelineDl.addEventListener( 'transitionend', ( event ) => {
                    this.buttonTimelineLeft.disabled = true;
                    this.buttonTimelineRight.disabled = true;
                });*/
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
                //this.buttonTimelineRight.disabled = !!this.isItemInScrollView(this.timelineWrapper, this.lastItem);

                /*this.$inView.offset({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 200
                });*/
                setTimeout(() => {
                    if (this.$inView.is(this.firstItem)) {
                        this.buttonTimelineLeft.disabled = true;
                        this.buttonTimelineLeft.classList.add('button-timeline-disabled');
                    } else {
                        this.buttonTimelineLeft.disabled = false;
                        this.buttonTimelineLeft.classList.remove('button-timeline-disabled');
                    }

                    if (this.$inView.is(this.lastItem)) {
                        this.buttonTimelineRight.disabled = true;
                        this.buttonTimelineRight.classList.add('button-timeline-disabled');
                    } else {
                        this.buttonTimelineRight.disabled = false;
                        this.buttonTimelineRight.classList.remove('button-timeline-disabled');
                    }
                }, 550);

                //this.buttonTimelineRight.disabled = !!this.$inView.is(this.lastItem);
                /*console.log(this.$inView.is(this.firstItem));*/

                /*console.clear();
                console.log(this.elementViewPort);
                console.log(": " + this.isElementInViewport());*/
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
        updated() {
            this.loadItems();
            /*this.isLoading = true;
            this.loadResourcesOutstandingSitePages().then(() => {

                this.loadItems();

                this.isLoading = false;
            });

            this.itemsOutstanding = [];

            this.loadItems();

            this.isLoading = false;*/

            //Catch del clic emitido al seleccionar un año
            /*this.$root.$on('timelineYearSelected', (year) => {
                this.isLoading = true;

                this.timelineYearSelected = parseInt(year);

                if (year === 0) {
                    this.loadResourcesOutstandingSitePages().then(() => {

                        this.itemsByDateArray = [];

                        this.loadItems();

                        this.isLoading = false;
                    });

                } else {
                    this.loadItemsResources().then(() => {
                        this.loadAllItems(this.itemsSetUrl).then(() => {

                            this.itemsOutstanding = [];

                            this.loadItems();

                            this.isLoading = false;
                        });
                    });
                }

            });*/

            /*this.$root.$on('itemsByDateArray', () => {
                console.log(this.itemsByDateArray);
            });*/

            this.$root.$on('timelineYearSelected', (year) => {
                document.getElementById(year).scrollIntoView({
                    block: "start",
                    inline: "start",
                    behavior: "smooth"
                });
            });
        }
    }
</script>

<style scoped>
    .change-view-timeline-icon {
        margin-top: -5px;
        content: '';
        width: 50px;
        height: 100%;
        display: block;
        position: absolute;
        background: url("../../assets/img/automatic-rotation-1.png") no-repeat;
    }

    .change-view-timeline-icon:hover {
        cursor: pointer;
    }

    .change-view-timeline-text {
        position: relative;
        color: white;
        font-size: 13px;
        margin-left: 50px;
        margin-top: 10px;
    }

    .change-view-timeline-text:hover {
        cursor: pointer;
        /*color:#65B32E;*/
    }

    .timeline-last-dd {
        background: transparent;
    }

    .timeline-dl dd:nth-of-type(even) .item-vertical-line {
        border-left: 2px dashed white;
        height: 160px;
        position: absolute;
        margin-left: -7px;
        top: -140px;
    }

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
        display: flex;
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

    /*.swiper-container {
        width: auto !important;
        !* display: flex; *!
        !* overflow: hidden; *!

        height: auto;
        margin: 25px 0 5px 0;
        padding: 0 20px 30px 20px;
    }*/

    .button-timeline {
        border: none;
        background: none;
        color: white;
        font-size: 45px;
        outline: none;
    }

    .button-timeline-disabled {
        color: #999999;
    }

    .button-timeline-disabled:hover {
        cursor: no-drop;
    }

    .button-timeline-rigth {
        margin-left: 15px;
    }

    .button-timeline:not(.button-timeline-disabled):hover {
        color: #65B32E;
        cursor: pointer;
    }

    .timeline-h {
        transition: transform 0.2s ease;
    }

    .items-year {
        width: auto !important;
        text-align: left;
        display: flex;
        white-space: nowrap;
        /* overflow: hidden; */
        height: auto !important;
        align-items: flex-end;
    }

    .timestamp {
        /*padding-top: 0.7%;*/
        margin-bottom: 10px;
        width: 100px;
        text-align: center;
        background: #65B32E;
        color: white;
        border-radius: 5px;
        font-weight: bold;
        font-size: 22px;
    }

    /* dl {
        margin-top: 2%;
    } */

    dl dt, dl dd {
        display: inline-block;
        width: 340px;
        height: 3px;
        background: white;
        vertical-align: top;
        margin-top: 10px;
        margin-bottom: 7px;
        padding-left: 35px;
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
        border-style: solid;
        border-color: #65B32E;
        border-width: 3px;
    }

    dl dd div.item-circle-outstanding {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        transform: translateY(-40%);
        border-radius: 50%;
        background: white;
        margin-left: -16px;
        border-style: solid;
        border-color: #65B32E;
        border-width: 3px;
    }

    /*dl dt div.date-circle:hover {
        transform: translateY(-40%);
        cursor: pointer;
        border-style: solid;
        width: 22px;
        height: 22px;
        border-color: #65B32E;
        border-width: 3px;
    }*/

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

    /*dl dd div.item-circle:hover {
        cursor: pointer;
        background: #65B32E !important;
        border: none !important;
    }*/

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
