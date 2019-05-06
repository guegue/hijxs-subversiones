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
                timelineUl: null,
                timelineLi: null,
                items: [], //Solo los items
                itemsDate: [], //Solo las fechas de los items
                itemsDateMonth: [], //Solo los meses de las fechas de los items
                itemsDateMonthUnique: null, //Para almacenar los meses sin repetirse
                itemsByDateArray: [], //Para guardar el conjunto de items por mes y fecha
                hammer: null, //Para instanciar hammer.js
                scrollTranslateY: 0, //Para hacer el efecto de movimiento del mouse en vertical
                timelineYearSelected: null, //Año seleccionado en la línea de años

                //Para el filtro por año, en base a 'dcterms:date' de la api de omeka
                propertyDateIn: 'property[2][property]=7&property[2][type]=in&property[2][text]=',

            }
        },
        methods: {
            loadItems() {
                this.urlBase =
                    'https://sub-versiones.hijosdeperu.org/api/items?item_set_id=174&' + this.propertyDateIn + this.timelineYearSelected + '&page=' + this.page + '&sort_by=dcterms:date&sort_order=asc';

                this.$axios(this.urlBase)
                    .then((response) => {
                        if (response.data.length > 0) {
                            response.data.forEach((item) => {

                                //Si el ítem tiene fecha y descripción
                                if ((typeof item['dcterms:date']) !== 'undefined' && (typeof item['dcterms:description']) !== 'undefined') {

                                    //Solo la fecha del item
                                    let date = item['dcterms:date'][0]['@value'];

                                    //Push todos los items
                                    this.items.push(item);

                                    //Push solo las fechas
                                    this.itemsDate.push(date);

                                    //Push solo los meses
                                    this.itemsDateMonth.push(this.$moment(date).format('MM'));
                                }
                            });

                            //Una vez cargados los elementos en el dom
                            this.$nextTick(() => {

                                //Si el array de ítems tiene datos
                                if (this.itemsLoaded()) {

                                    //Carga los items en la parte visual de la pantalla
                                    this.loadElementsViewPort();

                                    //Agrupa los items por fecha de cada mes
                                    this.groupItemsByDate();

                                    //Inicializa el efecto del scroll-swipe
                                    this.scroll();
                                }
                            });
                        }

                    })
                    .catch((error) => {
                        console.log('Error ' + error);
                    });
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
                        this.timelineUl = document.querySelector(".timeline ul");

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

                    if (this.itemsLoaded()) {
                        setTimeout(() => {
                            document.querySelector(".timeline li:first-child").classList.add('in-view');
                        }, 200);
                    }

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
            },
            itemsLoaded() {
                return this.items.length > 0;
            },
            uniqueDate(value, index, self) {
                return self.indexOf(value) === index;
            },
            groupItemsByDate() {
                //Almacena los meses sin repetir los mismo
                this.itemsDateMonthUnique = this.itemsDateMonth.filter(this.uniqueDate);

                //Para cada mes sin repetir...
                this.itemsDateMonthUnique.forEach((month) => {

                    //Guardar los items por mes-dia
                    let itemsByDate = {
                        month: null,
                        monthName: null,
                        days: []
                    };

                    //El mes en número
                    itemsByDate.month = month;
                    //El mes en texto
                    itemsByDate.monthName = this.$moment(month, 'MM').format('MMMM').toUpperCase();

                    //Por cada mes se recorren las fechas y así hacer el agrupamiento de las mismas
                    this.itemsDate.forEach((date) => {

                        //Guarda los ítems por día
                        let itemByDateDays = {
                            day: null,
                            dayName: null
                        };

                        //El mes de la fecha actual (del each) en números
                        let monthDate = this.$moment(date).format('MM');

                        //Si el mes de la fecha actual es igual al mes que se está buscando entonces se agrupa
                        if (parseInt(monthDate) === parseInt(month)) {

                            //El día en números
                            itemByDateDays.day = this.$moment(date).format('DD');
                            //El día en letras
                            itemByDateDays.dayName = this.$moment(date).format('dddd');

                            itemsByDate.days.push(itemByDateDays);
                        }

                    });

                    //Agrupación final
                    this.itemsByDateArray.push(itemsByDate);

                });

                console.log(this.itemsByDateArray);
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
                //Para inicializar el scroll a partir de donde se encuentra actualmente al cargar la página
                this.scrollTranslateY = window.scrollY;

                //Carga los items
                this.loadItems();
                //Inicializa el efecto de swipe para el scroll
                this.swipeFn();
            });
        }
    }
</script>

<style scoped>

</style>