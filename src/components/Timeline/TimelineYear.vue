<template>
    <b-row class="justify-content-md-center timelineBackground"
           style="margin-right: 0 !important; margin-left: 0 !important; padding-right: 50px">
        <b-col cols="8">
            <div class="d-flex">
                <b-col>
                    <button class="arrow arrow__prev disabled" @click="prevYear" ref="prevYearButton" disabled>

                    </button>
                </b-col>
                <b-col>
                    <section class="timeline-years">
                        <ol>
                            <li v-for="(year, index) in yearsUnique" :key="index">
                                <TimelineYearItem :year="year"/>
                            </li>
                            <li></li>
                        </ol>
                    </section>
                </b-col>
                <b-col>
                    <button class="arrow arrow__next" @click="nextYear" ref="nextYearButton">

                    </button>
                </b-col>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    require('@/assets/css/timelineYear.css');

    import timelineMixin from '../../mixins/timelineMixin';

    import TimelineYearItem from './TimelineYearItem';

    export default {
        name: "TimelineYear",
        components: {
            TimelineYearItem
        },
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                timelineMain: null,
                timelineOl: null,
                years: [],
                yearsUnique: [],
                hammer: null,

                arrowPrev: null,
                arrowNext: null,
                xScrolling: 350,
                singDirection: null,
                counter: 0,
                firstItem: null,
                lastItem: null,
            }
        },
        methods: {
            loadYears() {

                this.urlSiteBase = this.$domainOmeka + 'api/item_sets?site_id=' + this.idSite + '&resource_class_label=' + this.labelVocabulary;

                this.$axios(this.urlSiteBase).then((response) => {
                    let data = response.data[0];

                    if (data !== undefined) {
                        let itemsSetUrl = data['o:items']['@id'];

                        this.urlItemsBase = itemsSetUrl + '&search=' + this.searchValue + '&page=' + this.page + '&sort_by=dcterms:date&sort_order=asc';

                        this.$axios(this.urlItemsBase)
                            .then((response) => {
                                if (response.data.length > 0) {
                                    response.data.forEach((year) => {

                                        if ((typeof year['dcterms:date']) !== 'undefined' && (typeof year['dcterms:description']) !== 'undefined') {
                                            this.years.push(
                                                this.extractYear(year['dcterms:date'][0]['@value'])
                                            );
                                        }
                                    });

                                    this.yearsUnique = this.years.filter(this.distinctYears);

                                    this.$nextTick(() => {
                                        this.swipeFnYear();

                                        this.scroll();
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log('Error ' + error);
                            });
                    }
                });
            },
            animateTl() {
                if (this.counter === 0) {
                    this.timelineOl.style.transform = `translateX(-${this.xScrolling}px)`;
                } else {
                    const tlStyle = getComputedStyle(this.timelineOl);
                    const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
                    const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${this.singDirection}${this.xScrolling}`);
                    this.timelineOl.style.transform = `translateX(${values}px)`;
                }

                this.buttonState();

                this.counter++;
            },
            nextYear() {
                this.singDirection = '-';

                this.animateTl();
            },
            prevYear() {
                this.singDirection = '';

                this.animateTl();
            },
            nextYearTrigger() {
                this.$refs.nextYearButton.click();
            },
            prevYearTrigger() {
                this.$refs.prevYearButton.click();
            },
            scroll() {
                this.$nextTick(() => {
                    window.addEventListener('scroll', () => {
                        if (this.yearsLoaded()) {
                            this.buttonState();
                        }
                    });
                });
            },
            swipeFnYear() {
                this.$nextTick(() => {
                        this.timelineMain = document.querySelector(".timeline-years");

                        this.timelineOl = document.querySelector(".timeline-years ol");

                        this.arrowPrev = document.querySelector(".arrow__prev");
                        this.arrowNext = document.querySelector(".arrow__next");

                        this.firstItem = document.querySelector(".timeline-years li:first-child");
                        this.lastItem = document.querySelector(".timeline-years li:last-child");

                        this.hammer = new this.$hammer(this.timelineMain);
                        this.hammer.get('pan').set({
                            direction: this.$hammer.DIRECTION_HORIZONTAL
                        });

                        this.hammer.on("panleft", () => {
                            this.nextYearTrigger();
                        });
                        this.hammer.on("panright", () => {
                            this.prevYearTrigger();
                        });

                        this.firstItem.querySelector('li div.dot').click();

                        if (this.yearsLoaded()) {
                            this.buttonState();
                        }
                    }
                );
            },
            setButtonState(el, flag = true) {
                let disabledClass = "disabled";

                if (flag) {
                    el.classList.add(disabledClass);
                    el.disabled = true;
                } else {
                    if (el.classList.contains(disabledClass)) {
                        el.classList.remove(disabledClass);
                    }
                    el.disabled = false;
                }
            },
            buttonState() {
                this.elementViewPort = this.firstItem;
                this.isElementInViewport() ? this.setButtonState(this.arrowPrev) : this.setButtonState(this.arrowPrev, false);

                this.elementViewPort = this.lastItem;
                this.isElementInViewport() ? this.setButtonState(this.arrowNext) : this.setButtonState(this.arrowNext, false);
            },
            yearsLoaded() {
                return this.years.length > 0;
            },
            extractYear(date) {
                return this.$moment(date, "YYYY-MM-DD").year();
            },
            distinctYears(value, index, self) {
                return self.indexOf(value) === index;
            },
            resetTimelineYear() {
                this.timelineMain = null;
                this.timelineOl = null;
                this.years = [];
                this.yearsUnique = [];
                this.hammer = null;

                this.arrowPrev = null;
                this.arrowNext = null;
                this.xScrolling = 350;
                this.singDirection = null;
                this.counter = 0;
                this.firstItem = null;
                this.lastItem = null;
            }
        },
        mounted() {

            //Catch del clic emitido al buscar
            this.$root.$on('search', (text) => {

                this.searchValue = text;

                this.resetTimelineYear();

                this.loadYears();
            });
        }
    }
</script>

<style scoped>

</style>