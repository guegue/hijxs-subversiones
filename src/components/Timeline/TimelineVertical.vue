<template>
    <div class="timeline">
        <div v-for="(itemByDate, index) in itemsByDateArray" :key="index" class="timelines-ul">
            <div class="month">
                {{ itemByDate.monthName }}
            </div>
            <ul class="timeline-ul">
                <transition-group name="list">
                    <li v-for="(day, index) in itemByDate.days" :key="index">
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
                items: [], //Solo los items
                itemsDate: [], //Solo las fechas de los items
                itemsDateMonth: [], //Solo los meses de las fechas de los items
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

                                    //Se inicializan los valores por cada ítem
                                    let media = {
                                        image: [],
                                        video: [],
                                        application: [],
                                        audio: []
                                    };

                                    //Si el item tiene multimedia
                                    if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

                                        //Se recorre cada multimedia para determinar el tipo archivo multimedia
                                        item['o:media'].forEach((mediaItem) => {
                                            let urlMediaItem = mediaItem['@id'];

                                            this.$axios(urlMediaItem).then((response) => {

                                                let provider;
                                                let mediaType;
                                                let urlResource;
                                                let nameResource;
                                                let resource;

                                                //El proveedor del arhivo multimedia
                                                provider = response.data['o:ingester'];

                                                //Url del recurso
                                                urlResource = response.data['o:original_url'];

                                                //Nombre del recurso
                                                nameResource = response.data['o:source'];

                                                //Si es cualquier de estos proveedores entonces se entiende que es video
                                                if (provider === 'vimeo' || provider === 'youtube') {
                                                    mediaType = 'video';
                                                } else {
                                                    mediaType = response.data['o:media_type'].split("/")[0];
                                                }

                                                resource = {
                                                    url: urlResource,
                                                    name: nameResource
                                                };

                                                if (mediaType === 'image') {
                                                    media.image.push(resource);
                                                } else if (mediaType === 'video') {
                                                    media.video.push(resource);
                                                } else if (mediaType === 'application') {
                                                    media.application.push(resource);
                                                } else if (mediaType === 'audio') {
                                                    media.audio.push(resource);
                                                } else {

                                                }
                                            })
                                        });
                                    }

                                    //Solo la fecha del item
                                    let date = item['dcterms:date'][0]['@value'];

                                    //Cada ítem
                                    let itemObject = {
                                        id: item['o:id'],
                                        title: item['dcterms:title'][0]['@value'],
                                        date: date,
                                        description: item['dcterms:description'][0]['@value'],
                                        url: item['@id'],
                                        media: media
                                    };

                                    //Push todos los items
                                    this.items.push(itemObject);

                                    //Push solo las fechas
                                    this.itemsDate.push(date);

                                    //Push solo los meses
                                    this.itemsDateMonth.push(this.$moment(date).format('MM'));
                                }
                            });

                            //Una vez cargados los elementos en el dom
                            this.$nextTick(() => {

                                //Agrupa los items por fecha de cada mes
                                this.groupItemsByDate();

                                //Si el array de ítems agrupados por fechas tiene datos
                                if (this.itemsLoaded()) {

                                    //Carga los items en la parte visual de la pantalla
                                    this.loadElementsViewPort();

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
            getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            },
            itemsLoaded() {
                return this.itemsByDateArray.length > 0;
            },
            uniqueDate(value, index, self) {
                return self.indexOf(value) === index;
            },
            groupItemsByDate() {
                //Almacena los meses sin repetir los mismo
                let itemsDateMonthUnique = this.itemsDateMonth.filter(this.uniqueDate);
                let itemsDateUnique = this.itemsDate.filter(this.uniqueDate);

                //Para cada mes sin repetir...
                itemsDateMonthUnique.forEach((month) => {

                    //Guardar los items por mes-dia
                    let itemsByDate = {
                        date: null,
                        month: null,
                        monthName: null,
                        days: []
                    };

                    //El mes en número
                    itemsByDate.month = month;
                    //El mes en texto
                    itemsByDate.monthName = this.$moment(month, 'MM').format('MMMM').toUpperCase();

                    //Por cada mes se recorren las fechas y así hacer el agrupamiento de las mismas
                    itemsDateUnique.forEach((date) => {

                        itemsByDate.date = date;

                        //Guarda los ítems por día
                        let itemByDateDays = {
                            date: null,
                            day: null,
                            dayName: null,
                            items: []
                        };

                        //El mes de la fecha actual (del each) en números
                        let monthDate = this.$moment(date).format('MM');

                        this.items.forEach((item) => {
                            if (item.date === date) {
                                itemByDateDays.items.push(item)
                            }
                        });

                        //Si el mes de la fecha actual es igual al mes que se está buscando entonces se agrupa
                        if (parseInt(monthDate) === parseInt(month)) {
                            //La fecha completa
                            itemByDateDays.date = date;
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

                //console.log(this.itemsByDateArray);

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