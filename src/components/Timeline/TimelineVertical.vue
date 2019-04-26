<template>
    <div class="timeline">
        <ul>
            <transition-group name="list">
                <li v-for="item in items" :key="item['o:id']">
                    <TimelineItem :item="item"/>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script>

    require('@/assets/css/timeline.css');

    import timelineMixin from '../../mixins/timelineMixin';

    import TimelineItem from './TimelineItem';

    export default {
        name: "TimelineVertical",
        components: {
            TimelineItem
        },
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                timelineMain: null,
                timelineUl: null,
                timelineLi: null,
                urlBase: null,
                items: [],
                page: 1,
                perPage: 3,
                hammer: null,
                scrollTranslateY: 0,
                mouseWheelDelta: 0,
                timelineYear: null,

                propertyDateIn: 'property[2][property]=7&property[2][type]=in&property[2][text]=',

            }
        },
        methods: {
            loadItems() {
                this.urlBase =
                    'https://sub-versiones.hijosdeperu.org/api/items?item_set_id=174&' + this.propertyDateIn + this.timelineYear + '&page=' + this.page + '&per_page=' + this.perPage;

                this.$axios(this.urlBase)
                    .then((response) => {
                        if (response.data.length > 0) {
                            response.data.forEach((item) => {

                                if ((typeof item['dcterms:date']) !== 'undefined' && (typeof item['dcterms:description']) !== 'undefined') {
                                    this.items.push(item);
                                }
                            });

                            this.$nextTick(() => {

                                if (this.items.length > 0) {
                                    this.loadElementsViewPort();

                                    this.scroll();
                                }
                            });
                        }

                    })
                    .catch((error) => {
                        alert('Error ' + error);
                    });
            },
            scroll() {
                this.$nextTick(() => {
                    this.timelineMain = document.querySelector('.timeline');

                    window.addEventListener('scroll', () => {

                        this.scrollTranslateY = window.scrollY;

                        this.swipeUp();
                    });
                });
            },
            swipeFn() {
                this.$nextTick(() => {
                        this.timelineUl = document.querySelector(".timeline ul");

                        this.hammer = new this.$hammer(this.timelineUl);
                        this.hammer.get('pan').set({
                            velocity: 0.3,
                            direction: this.$hammer.DIRECTION_VERTICAL
                        });

                        this.hammer.on("panup", () => {

                            this.scrollTranslateY += 2;
                            this.triggerScroll();

                        });
                        this.hammer.on("pandown", () => {

                            this.scrollTranslateY -= 2;
                            this.triggerScroll();

                        });
                    }
                )
                ;
            },
            swipeUp() {

                if (!this.isScrollBottom()) {
                    this.page++;
                    //this.loadItems();

                    //this.scrollTranslateY += 300;

                    //this.debounce(this.triggerScroll(), 300);
                }

                this.$nextTick(() => {
                    if (this.items.length > 0) {
                        this.loadElementsViewPort();
                    }
                });
            },
            swipeDown() {
                /*if (!this.isScrollTop()) {
                    this.scrollTranslateY -= (300 * 2);

                    this.scrollTranslateY = this.scrollTranslateY <= 0 ? this.scrollTranslateY = 0 : this.scrollTranslateY;

                    this.debounce(this.triggerScroll(), 300);
                }*/
            },
            loadElementsViewPort() {
                this.$nextTick(() => {
                    this.timelineLi = document.querySelector('.timeline ul > span').querySelectorAll('li');

                    let itemsLeft = document.querySelectorAll('.timeline ul li:nth-child(even) div');
                    let itemsRight = document.querySelectorAll('.timeline ul li:nth-child(odd) div');

                    itemsLeft.forEach((item) => {
                        if (item.style.borderRightColor === "") {
                            item.style.borderRightColor = this.getRandomColor();
                            item.style.borderRightStyle = 'solid';
                            item.style.borderRightWidth = '13px';
                        }
                    });

                    itemsRight.forEach((item) => {
                        if (item.style.borderLeftColor === "") {
                            item.style.borderLeftColor = this.getRandomColor();
                            item.style.borderLeftStyle = 'solid';
                            item.style.borderLeftWidth = '13px';
                        }
                    });

                    setTimeout(() => {
                        document.querySelector(".timeline li:first-child").classList.add('in-view');
                    }, 200);

                    this.timelineLi.forEach((li) => {
                        this.elementViewPort = li;
                        if (this.isElementInViewport(li)) {
                            setTimeout(() => {
                                li.classList.add('in-view');
                            }, 200);
                        }
                    });
                })
            },
            triggerScroll() {
                window.scrollTo({
                    top: this.scrollTranslateY
                });
            },
            isScrollTop() {
                return (window.scrollY === 0);
            },
            isScrollBottom() {
                return parseInt((window.innerHeight + window.scrollY)) === document.body.offsetHeight;
            },
            getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        },
        mounted() {
            this.$root.$on('selectYear', (year) => {

                this.timelineYear = parseInt(year);
                this.page = 1;
                this.items = [];
                this.scrollTranslateY = window.scrollY;

                this.loadItems();
                this.swipeFn();
            });
        }
    }
</script>

<style scoped>

</style>