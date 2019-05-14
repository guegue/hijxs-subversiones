<template>
    <div class="timeline">
        <div v-for="(itemByDate, index) in itemsByDateArray" :key="index" class="timelines-ul">
            <div class="month">
                {{ itemByDate.monthName }}
            </div>
            <ul class="timeline-ul">
                <transition-group name="list">
                    <li v-for="(day, index) in itemByDate.days" :key="index" class="in-view">
                        <label class="day">{{ itemByDate.monthName }} {{ day.day }}</label>
                        <TimelineItem v-for="(item, index) in day.items" :item="item" :key="index"/>
                    </li>
                </transition-group>
            </ul>
        </div>
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
                timelineUl: null,
                timelineLi: null,
                hammer: null, //Para instanciar hammer.js
                scrollTranslateY: 0, //Para hacer el efecto de movimiento del mouse en vertical
            }
        },
        methods: {
            initTimeline() {
                //Carga los items en la parte visual de la pantalla
                this.loadElementsViewPort();

                //Inicializa el efecto del scroll-swipe
                this.scroll();
            },
            scroll() {
                this.$nextTick(() => {
                    window.addEventListener('scroll', () => {

                        this.scrollTranslateY = window.scrollY;

                        this.swipeUp();
                    });
                });
            },
            swipeFn() {
                this.$nextTick(() => {
                        this.timelineUl = document.querySelector(".timeline");

                        this.hammer = new this.$hammer(this.timelineUl);
                        this.hammer.get('pan').set({
                            direction: this.$hammer.DIRECTION_VERTICAL
                        });

                        this.hammer.on("panup", () => {
                            console.log('u ' + window.scrollY);
                            this.scrollTranslateY = window.scrollY;

                            this.scrollTranslateY += 3;
                            this.triggerScroll();

                        });
                        this.hammer.on("pandown", () => {
                            console.log('d ' + window.scrollY);
                            this.scrollTranslateY = window.scrollY;

                            this.scrollTranslateY -= 3;
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
                    if (this.itemsLoaded()) {
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
                    let timelinesItem = document.querySelectorAll('.timeline ul.timeline-ul > span li .list-item');

                    let timelinesMonth = document.querySelectorAll('.month');

                    timelinesMonth.forEach((month) => {
                        this.elementViewPort = month;
                        if (this.isElementInViewport()) {

                            setTimeout(() => {
                                let timeline = month.parentNode;

                                timeline.classList.add('in-view');

                            }, 200);

                        }
                    });

                    for (let i = 0; i < timelinesItem.length; i++) {
                        if (i % 2 === 0) {
                            if (timelinesItem[i].style.borderLeftColor === "") {
                                timelinesItem[i].style.borderLeftColor = this.getRandomColor();
                                timelinesItem[i].style.borderLeftStyle = 'solid';
                                timelinesItem[i].style.borderLeftWidth = '13px';
                            }

                            timelinesItem[i].style.left = '25px';
                            timelinesItem[i].classList.add('rightTranslate');

                        } else {
                            if (timelinesItem[i].style.borderRightColor === "") {
                                timelinesItem[i].style.borderRightColor = this.getRandomColor();
                                timelinesItem[i].style.borderRightStyle = 'solid';
                                timelinesItem[i].style.borderRightWidth = '13px';
                            }

                            timelinesItem[i].style.left = '-473px';
                            timelinesItem[i].classList.add('leftTranslate');
                        }

                        this.elementViewPort = timelinesItem[i];
                        if (this.isElementInViewport()) {

                            setTimeout(() => {
                                timelinesItem[i].classList.add('in-view');
                            }, 200);

                        }
                    }
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
            resetTimeline() {
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
                //Para inicializar el scroll a partir de donde se encuentra actualmente al cargar la página
                this.scrollTranslateY = window.scrollY;

                //Carga los items
                this.loadItems();
                //Inicializa el efecto de swipe para el scroll
                this.swipeFn();
            }
        },
        mounted() {

            //Catch del clic emitido al seleccionar un año
            this.$root.$on('selectYear', (year) => {
                //Almacena el año seleccionado
                this.timelineYearSelected = parseInt(year);

                this.resetTimeline();
            });

            //Catch del clic emitido al buscar
            this.$root.$on('search', (text) => {

                this.searchValue = text;

                this.resetTimeline();
            });
        }
    }
</script>

<style scoped>

</style>