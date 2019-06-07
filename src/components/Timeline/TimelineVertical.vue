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
    /*------  TIMELINE  ------ */

    .timeline {
        background: #15304F;
        overflow-y: hidden;
    }

    .timeline ul {
        background: #15304F;
        padding-top: 90px;
        padding-bottom: 20px;
        margin: 0;
        cursor: all-scroll;
    }

    .timeline ul li {
        list-style-type: none;
        position: relative;
        width: 3px;
        margin: 0 auto;
        padding-top: 130px;
        background: #fff;
        padding-bottom: 50px;
    }

    .list-item {
        position: relative;
        width: 450px;
        height: auto;
        padding-top: 15px;
        padding-left: 35px;
        padding-right: 35px;
        margin-top: -80px;
        color: grey;
        text-align: justify;
        background: white;
        border-radius: 10px;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
    }

    .titleItemTimeline {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        color: black;
        font-style: normal;
    }

    .seeMore {
        font-style: normal;
        font-weight: bold;
        padding-top: 10px;
        text-align: right;
        margin-bottom: 4px;
        padding-bottom: 4px;
        color: #65B32E;
        text-decoration: none !important;
        cursor: pointer;
    }

    .month {
        position: absolute;
        width: 250px;
        left: 42%;
        padding: 5px;
        text-align: center;
        background: #65B32E;
        color: white;
        font-style: normal;
        font-weight: bold;
        font-size: 40px;
        border-radius: 5px;
    }

    .day {
        color: #65B32E;
        position: absolute;
        right: 10px;
        margin-top: 20px;
        margin-right: 20px;
        padding-bottom: 50px;
        top: -22px;
        width: 180px;
        text-align: center;
        font-style: italic;
        font-weight: bold;
        font-size: 25px;
    }

    .day::after {
        content: '';
        position: absolute;
        left: 116%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: white;
        border-style: solid;
        border-color: #65B32E;
        border-width: 5px;
        -webkit-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
    }

    .list-item::before {
        content: '';
        position: absolute;
        bottom: 7px;
        width: 0;
        height: 0;
        border-style: solid;
    }

    .timeline ul li:nth-child(odd) div::before {
        /*left: -15px;
        border-width: 8px 16px 8px 0;*/
        border-color: transparent transparent transparent transparent;
    }

    .timeline ul li:nth-child(even) div::before {
        /*right: -15px;
        border-width: 8px 0 8px 16px;*/
        border-color: transparent transparent transparent transparent;
    }

    time {
        display: block;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 8px;
    }


    /* EFFECTS
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

    /*Timelines*/
    .timelines-ul::after {
        transition: background .4s ease-in-out;
    }

    .timelines-ul {
        visibility: hidden;
        opacity: 0;
        transition: all 1s ease-in-out;
    }

    /*Items*/
    div.list-item::after {
        transition: background .4s ease-in-out;
    }

    div.in-view::after {
        background: white;
    }

    .list-item {
        visibility: hidden;
        opacity: 0;
        transition: all .4s ease-in-out;
    }

    .rightTranslate {
        transform: translate3d(80px, 0, 0);
    }

    .leftTranslate {
        transform: translate3d(-80px, 0, 0);
    }

    /*Effect*/
    .in-view {
        transform: none;
        visibility: visible;
        opacity: 1;
    }

    /* GENERAL MEDIA QUERIES
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

    @media screen and (max-width: 900px) {
        .timeline ul li div {
            width: 250px;
        }

        .timeline ul li:nth-child(even) div {
            left: -289px;
            /*250+45-6*/
        }
    }

    @media screen and (max-width: 600px) {
        .timeline ul li {
            margin-left: 20px;
        }

        .timeline ul li div {
            width: calc(100vw - 91px);
        }

        .timeline ul li:nth-child(even) div {
            left: 45px;
        }

        .timeline ul li:nth-child(even) div::before {
            left: -15px;
            border-width: 8px 16px 8px 0;
            border-color: transparent #F45B69 transparent transparent;
        }
    }

</style>