export default {
    data() {
        return {
            urlBase: null,
            page: 1,
            elementViewPort: null,

            items: [], //Solo los items
            itemsDate: [], //Solo las fechas de los items
            itemsDateMonth: [], //Solo los meses de las fechas de los items
            itemsByDateArray: [], //Para guardar el conjunto de items por mes y fecha

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
                                if (item['o:media'].length > 0) {
                                    if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

                                        //Se recorre cada recurso para determinar el tipo archivo multimedia
                                        item['o:media'].forEach((mediaItem) => {
                                            let urlMediaItem = mediaItem['@id'];

                                            this.$axios(urlMediaItem).then((response) => {

                                                let provider;
                                                let mediaType;
                                                let urlResource;
                                                let nameResource;
                                                let thumbnailResource;
                                                let squareThumbnailResource;
                                                let resource;
                                                let hasExternalProvider;

                                                //El proveedor del arhivo multimedia
                                                provider = response.data['o:ingester'];

                                                //Url del recurso
                                                urlResource = response.data['o:original_url'];

                                                //Nombre del recurso
                                                nameResource = response.data['o:source'];

                                                //Thumbnail del recurso
                                                squareThumbnailResource = response.data['o:thumbnail_urls'].square;

                                                if (squareThumbnailResource !== undefined) {

                                                    thumbnailResource = squareThumbnailResource;
                                                } else {
                                                    thumbnailResource = null
                                                }

                                                //Si es cualquier de estos proveedores entonces se entiende que es video
                                                if (provider === 'vimeo' || provider === 'youtube') {
                                                    mediaType = 'video';

                                                    urlResource = response.data['o:source'];
                                                    nameResource = null;

                                                    hasExternalProvider = true;
                                                } else {
                                                    mediaType = response.data['o:media_type'].split("/")[0];
                                                    hasExternalProvider = false;
                                                }

                                                //Cada recurso multimedia
                                                resource = {
                                                    provider: hasExternalProvider,
                                                    url: urlResource,
                                                    name: nameResource,
                                                    thumbnail: thumbnailResource
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

                        //Agrupa los items por fecha de cada mes
                        this.groupItemsByDate();

                        //Si el array de ítems agrupados por fechas tiene datos
                        if (this.itemsLoaded()) {
                            this.initTimeline();
                        }
                    }

                })
                .catch((error) => {
                    console.log('Error response: ' + error);
                });
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
        uniqueDate(value, index, self) {
            return self.indexOf(value) === index;
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
    }
}