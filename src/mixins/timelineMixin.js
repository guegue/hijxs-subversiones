export default {
    data() {
        return {
            urlSiteBase: null,
            idSite: 12, //Rafael
            labelVocabulary: 'linea de tiempo',
            urlItemsBase: null,
            page: 1,
            elementViewPort: null,

            items: [], //Solo los ítems
            itemsOutstanding: [], //Solo los ítems destacados
            itemsDate: [], //Solo las fechas de los ítems
            itemsDateMonth: [], //Solo los meses de las fechas de los ítems
            itemsByDateArray: [], //Para guardar el conjunto de items por mes y fecha

            timelineYearSelected: '', //Año seleccionado en la línea de años

            //Para el filtro por año, en base a 'dcterms:date' de la api de omeka
            propertyDateIn: 'property[2][property]=7&property[2][type]=in&property[2][text]=',

            //Para la búsqueda general
            searchValue: '',

            timelinePageData: [],

            years: [],
            yearsUnique: [],

            itemsSetUrl: [],

            itemsDateMonthUnique: null
        }
    },
    methods: {
        async loadResourcesSitePages() {

            let titlePage = null;
            let itemsOutstandingUrl = [];
            let itemsOutstandingResource = [];

            this.urlSiteBase = this.$domainOmeka + 'api/sites/' + this.idSite;

            const response = await this.$axios(this.urlSiteBase);
            const data = response.data;

            //Para los ítems destacados
            for (let page of data['o:page']) {
                const response = await this.$axios(page['@id']);
                const dataPage = response.data;

                //Si encuentra el slug de línea de tiempo
                if (dataPage['o:slug'].search('linea-de-tiempo') !== -1) {

                    titlePage = dataPage['o:title'];

                    dataPage['o:block'].forEach((data) => {
                        if (data['o:layout'] === 'itemShowCase') {

                            data['o:attachment'].forEach((item) => {
                                itemsOutstandingUrl.push(item['o:item']['@id']);
                            });
                        }
                    });
                }
            }

            //Para los conjutos de ítems de la línea
            this.loadItemsResources();

            //Ítems destacados
            for (let itemUrl of itemsOutstandingUrl) {
                const itemResponse = await this.$axios(itemUrl);
                const item = itemResponse.data;
                itemsOutstandingResource.push(item);
            }
            this.loadOutstandingItems(itemsOutstandingResource);

        },
        async loadItemsResources() {
            this.itemsSetUrl = [];

            this.urlSiteBase = this.$domainOmeka + 'api/item_sets?site_id=' + this.idSite + '&resource_class_label=' + this.labelVocabulary;
            const responseItemSet = await this.$axios(this.urlSiteBase);
            const dataItemSet = responseItemSet.data;

            for (let urlSet of dataItemSet) {
                const setItemResponse = await this.$axios(urlSet['@id']);
                const setItem = setItemResponse.data;

                this.itemsSetUrl.push(setItem['o:items']['@id']);
            }
            //this.loadAllItems(itemsSetUrl);

        },
        async loadAllItems(itemsSetUrl) {
            let itemsResource = [];

            this.items = []; //Solo los items
            this.itemsDate = []; //Solo las fechas de los items
            this.itemsDateMonth = []; //Solo los meses de las fechas de los items
            this.itemsByDateArray = []; //Para guardar el conjunto de items por mes y fecha

            //Todos los ítems
            for (let itemUrl of itemsSetUrl) {
                this.urlItemsBase = itemUrl + '&' + this.propertyDateIn + this.timelineYearSelected + '&search=' + this.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';

                const itemsResponse = await this.$axios(this.urlItemsBase);
                const items = itemsResponse.data;

                items.forEach((item) => {
                    itemsResource.push(item);
                });
            }

            itemsResource.forEach((item) => {
                this.getItem(item, 'all');
            });

            this.groupItemsByDate();
        },
        async loadAllYears(itemsSetUrl) {
            let itemsResource = [];

            //Todos los ítems
            for (let itemUrl of itemsSetUrl) {
                this.urlItemsBase = itemUrl + '&search=' + this.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';

                const itemsResponse = await this.$axios(this.urlItemsBase);
                const items = itemsResponse.data;

                items.forEach((item) => {
                    itemsResource.push(item);
                });
            }

            itemsResource.forEach((item) => {
                this.getYear(item);
            });
        },
        loadOutstandingItems(itemsOutstandingResource) {
            this.itemsOutstanding = []; //Solo los ítems destacados

            itemsOutstandingResource.forEach((item) => {
                this.getItem(item, 'outstanding');
            });

            //this.groupItemsByDate();

            //console.log(this.itemsOutstanding);
        },
        getItem(item, option) {
            //Si el ítem tiene fecha y descripción
            if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined') {

                //Solo la fecha del item
                let date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

                if (this.$moment(date, 'YYYY-MM-DD', true).isValid()) {
                    //Se inicializan los valores por cada ítem
                    let media = {
                        image: [],
                        video: [],
                        application: [],
                        audio: []
                    };

                    //Cada ítem
                    let itemObject = {
                        id: item['o:id'],
                        title: item['dcterms:title'][0]['@value'],
                        date: date,
                        description: item['dcterms:description'][0]['@value'],
                        url: item['@id'],
                        media: media
                    };

                    if (option === 'all') {
                        //Push todos los items
                        this.items.push(itemObject);

                        //Push solo las fechas
                        this.itemsDate.push(date);

                        //Push solo los meses
                        this.itemsDateMonth.push(this.$moment(date).format('MM'));
                    } else {
                        this.itemsOutstanding.push(itemObject);
                    }
                }
            }
        },
        getYear(item) {
            //Si el ítem tiene fecha y descripción
            if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined') {

                //Solo la fecha del item
                let date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

                if (this.$moment(date, 'YYYY-MM-DD', true).isValid()) {

                    //Solo la lista de años ordenados
                    this.years.push(this.extractYear(date));

                    this.yearsUnique = this.years.filter(this.distinctYears).sort();
                }
            }
        },
        groupItemsByDate() {
            //Almacena los meses sin repetir los mismo
            this.itemsDateMonthUnique = this.itemsDateMonth.filter(this.uniqueDate);
            let itemsDateUnique = this.itemsDate.filter(this.uniqueDate);

            //Para cada mes sin repetir...
            this.itemsDateMonthUnique.forEach((month) => {
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
                        itemsByDate.date = date;

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
        extractYear(date) {
            return this.$moment(date, "YYYY-MM-DD").year();
        },
        distinctYears(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
}