<template>
    <div>
        <div class="container-timeline">

            <!--square floating-->
            <div class="green-square"></div>

            <!--vertical title-->
            <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

            <!--center title with square-->
            <div class="div-title text-center py-4">
                <h1>L&Iacute;NEA DE TIEMPO</h1>
            </div>

            <!--social network-->
            <social-network></social-network>

            <!--search input-->
            <div class="search-square pt-2" v-bind:style="{'width':widthSearch,'background-color':colorDivSearch}">
                <div class="text-center text-white" v-on:click="hideOrShow(widthSearch,colorDivSearch)">
                    <b-link router-tag="a" v-if="!inputSearchVisible">
                        <i class="fas fa-search fa-2x"></i>
                    </b-link>
                    <input :type="(!inputSearchVisible)?'hidden':'text'" placeholder="Buscar">
                </div>

            </div>

            <!--search input-->
            <div class="setting-square pt-2">
                <div class="text-center text-white">
                    <b-link router-tag="a">
                        <i class="fas fa-cog fa-2x"></i>
                    </b-link>
                </div>
            </div>

        </div>

        <div class="timeline">
            <ul>
                <transition-group name="list">
                    <li v-for="item in items" :key="item['o:id']">
                        <TimelineItem :item="item"/>
                    </li>
                </transition-group>
            </ul>
        </div>
    </div>
</template>

<script>
    require('@/assets/css/timeline.css');

    import SocialNetwork from '../components/SocialNetwoks'
    import TimelineItem from '../components/Timeline/TimelineItem';

    export default {
        name: "Timeline",
        components: {
            SocialNetwork,
            TimelineItem
        },
        data () {
            return {
                widthSearch: '70px',
                colorDivSearch: '#65B32E',
                inputSearchVisible: false,

                timelineMain: null,
                timelineUl: null,
                timelineLi: null,
                urlBase: null,
                items: [],
                page: 1,
                perPage: 3,
                elementViewPort: null,
                hammer: null,
                scrollTranslateY: 0,
                mouseWheelDelta: 0
            }
        },
        methods: {
            hideOrShow (width, backgrouncolor) {

                if (width === '70px') {
                    this.widthSearch = '350px';
                    this.colorDivSearch = '#fff';
                    this.inputSearchVisible = true;
                }
            },
            cargaItems() {
                //{{ item['dcterms:description'][0]['@value'] }}
                this.urlBase =
                    'https://sub-versiones.hijosdeperu.org/api/items?item_set_id=174&page=' + this.page + '&per_page=' + this.perPage;
                //this.urlBase = 'http://localhost:85/omeka-s/ejemplo';

                this.$axios(this.urlBase)
                    .then((response) => {
                        if (response.data.length > 0) {
                            response.data.forEach((item) => {
                                this.items.push(item);
                            });

                            this.$nextTick(function () {
                                this.loadElementsViewPort();
                            });
                        }

                    })
                    .catch((error) => {
                        alert('Error ' + error);
                    });

                this.$nextTick(function () {
                    if (this.timelineLi !== null) {
                        this.loadElementsViewPort();
                    }
                });
            },
            debounce(func, wait, immediate) {
                let timeout;
                return function () {
                    let context = this, args = arguments;
                    let later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    let callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },
            scroll() {
                this.$nextTick(() => {
                    this.timelineMain = document.querySelector('.timeline');

                    this.timelineMain.addEventListener('mousewheel', (e) => {
                        let delta = null;
                        if (e.wheelDelta) {
                            delta = e.wheelDelta / 60;
                        } else if (e.detail) {
                            delta = -e.detail / 2;
                        }

                        //delta > 0 ? 'up' : 'down';
                        if (delta > 0) {
                            this.swipeDown();
                        } else {
                            this.swipeUp();
                        }
                    });
                });
            },
            swipeFn() {
                this.$nextTick(() => {
                        this.timelineUl = document.querySelector(".timeline ul");

                        this.hammer = new this.$hammer(this.timelineUl);
                        this.hammer.get('swipe').set({
                            velocity: 0.3,
                            direction: this.$hammer.DIRECTION_ALL
                        });

                        this.hammer.on("swipeup", () => {

                            this.mouseWheelDelta = -120;
                            this.triggerScroll();

                        });
                        this.hammer.on("swipedown", () => {

                            this.mouseWheelDelta = 120;
                            this.triggerScroll();

                        });
                    }
                )
                ;
            },
            swipeUp() {
                if (!this.isScrollBottom()) {
                    this.page++;
                    this.cargaItems();

                    this.scrollTranslateY += 300;

                    this.debounce(this.smoothScroll(), 300);
                }
            },
            swipeDown() {
                if (!this.isScrollTop()) {
                    this.scrollTranslateY -= (300 * 2);

                    this.scrollTranslateY = this.scrollTranslateY <= 0 ? this.scrollTranslateY = 0 : this.scrollTranslateY;

                    this.debounce(this.smoothScroll(), 300);
                }
            },
            isElementInViewport() {
                let rect = this.elementViewPort.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },
            loadElementsViewPort() {
                this.timelineLi = document.querySelector('.timeline ul > span').querySelectorAll('li');

                this.timelineLi.forEach((li) => {
                    this.elementViewPort = li;
                    if (this.isElementInViewport(li)) {
                        setTimeout(() => {
                            li.classList.add('in-view');
                        }, 300);
                    }
                });
            },
            triggerScroll() {
                let cEvent = new Event('mousewheel');

                cEvent.wheelDelta = this.mouseWheelDelta;

                this.timelineMain.dispatchEvent(cEvent);
            },
            smoothScroll() {
                window.scrollTo({
                    top: this.scrollTranslateY,
                    behavior: 'smooth'
                });
            },
            isScrollTop() {
                return (window.scrollY === 0);
            },
            isScrollBottom() {
                return parseInt((window.innerHeight + window.scrollY)) === document.body.offsetHeight;
            }
        },
        mounted() {
            this.cargaItems();
            this.swipeFn();
            this.scroll();
        }
    }
</script>

<style scoped>

    .container-timeline:before {
        height: 100vh;
        position: absolute;
        background-image: linear-gradient(to top, #152f4e 5%, transparent);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 1;
    }

    .container-timeline {
        height: 100vh;
        position: relative;
        background-image: url("https://wallup.net/wp-content/uploads/2015/12/234980-nature-landscape-water-rock-trees-forest-lake-mountain-pine_trees-hill-grass-valley.jpg"),
        linear-gradient(to bottom right, #152f4e 100%, transparent);
    }

    .list-item {
        display: inline-block;
        margin-right: 10px;
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }

    .green-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #65B32E;
        height: 200px;
        width: 200px;
    }

    .title-vertical {
        position: absolute;
        z-index: 7;
        top: 29.5%;
        left: -70px;
        letter-spacing: 1px;
        font-style: oblique;
        font-weight: 700;
    }

    .div-title {
        display: table-cell;
        position: absolute;
        top: 50%;
        left: calc(100% - 70%);
        color: #fff;
        width: 40%;
        height: 120px;
        border: 5px solid #fff;
        vertical-align: middle;
    }

    .search-square {
        display: block;
        position: absolute;
        height: 50px;
        /*width: 70px;*/
        bottom: 70px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
        -webkit-transition: width 1s; /* For Safari 3.1 to 6.0 */
        transition: width 1s;
    }

    .search-square input {
        width: 100%;
        height: 100%;
        padding: 0;
    }

    .setting-square {
        position: absolute;
        height: 50px;
        width: 70px;
        bottom: 10px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
    }

    a, a:hover {
        color: #fff;
        text-decoration: none;
    }


</style>