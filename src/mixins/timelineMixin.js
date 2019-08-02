export default {
    data: () => {
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

            //para el filtro de ítems relacionados, en base a 'dcterms:isPartOf' de la api de omeka
            propertyIsPartOfIn: 'api/items?property[5][property]=33&property[5][type]=in&property[5][text]=espartede',

            timelinePageData: [],

            years: [],
            yearsUnique: [],

            itemsSetUrl: [],

            itemsDateMonthUnique: null,

            itemsDateMonths: [],

            itemsRelated: [],
            
            tagsCategories: [],
            tags: [],
            categories: [],

            itemsOutstandingCount: 0,

            pagesWithTimeline: [],
            urlImageMap:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attributionMap:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            
        }
    },
    watch: {
        searchValue: function() {
            this.$root.$emit('filters');
        },
        itemsDateMonthUnique: function(itemsDateMonthUnique) {
            this.$root.$emit('itemsDateMonthUnique', itemsDateMonthUnique);
        },
        tagsCategoriesSelected: function() {
            this.$root.$emit('filters');
        }
    },
    methods: {
        async loadTimelinePages() {
            this.pagesWithTimeline = [];

            this.urlSiteBase = this.$domainOmeka + 'api/sites';

            const response = await this.$axios(this.urlSiteBase);
            const sites = response.data;

            for (let site of sites) {
                if(site['o:page'] !== undefined)  {
                    if(site['o:page'].length > 0) {
                        for (let page of site['o:page']) {
                            const response = await this.$axios(page['@id']);
                            const dataPage = response.data;

                            //Si encuentra el slug de línea de tiempo
                            if (dataPage['o:slug'].search('linea-de-tiempo') !== -1) {

                                let pageTimeline = {
                                    site: site['@id'],
                                    site_id: site['o:id'],
                                    page_title: dataPage['o:title'],
                                    page: dataPage['@id'],
                                    page_id: dataPage['o:id'],
                                    page_slug: dataPage['o:slug']
                                };

                                this.pagesWithTimeline.push(pageTimeline);
                            }
                        }
                    }
                }
            }
        },
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

            //Ítems destacados
            for (let itemUrl of itemsOutstandingUrl) {
                const itemResponse = await this.$axios(itemUrl);
                const item = itemResponse.data;
                itemsOutstandingResource.push(item);
            }
            await this.loadOutstandingItems(itemsOutstandingResource);

        },
        async loadItemsResources() {
            let itemsSetUrlLocal = [];

            this.urlSiteBase = this.$domainOmeka + 'api/item_sets?site_id=' + this.idSite + '&resource_class_label=' + this.labelVocabulary;
            const responseItemSet = await this.$axios(this.urlSiteBase);
            const dataItemSet = responseItemSet.data;

            for (let urlSet of dataItemSet) {
                const setItemResponse = await this.$axios(urlSet['@id']);
                const setItem = setItemResponse.data;

                itemsSetUrlLocal.push(setItem['o:items']['@id']);
            }

            this.itemsSetUrl = itemsSetUrlLocal;

        },
        async loadAllItems(itemsSetUrl) {
            let itemsResource = [];

            this.items = []; //Solo los items
            this.itemsDate = []; //Solo las fechas de los items
            this.itemsDateMonth = []; //Solo los meses de las fechas de los items
            this.itemsByDateArray = []; //Para guardar el conjunto de items por mes y fecha

            //Todos los ítems
            for (let itemUrl of itemsSetUrl) {

                let itemSetUrl = itemUrl.split('?');
                let itemSet1 = itemSetUrl[0];
                let itemSet2 = itemSetUrl[1];

                itemSetUrl = itemSet1 + '?' + this.$store.state.tagsCategoriesSelected + itemSet2;

                this.urlItemsBase = itemSetUrl + '&' + this.propertyDateIn + this.timelineYearSelected + '&search=' + this.$store.state.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';
                
                const itemsResponse = await this.$axios(this.urlItemsBase);
                const items = itemsResponse.data;

                items.forEach((item) => {
                    itemsResource.push(item);
                });
            }

            for (let item of itemsResource) {
                await this.getItem(item, 'all');
            }

            /* itemsResource.forEach((item) => {
                this.getItem(item, 'all');
            }); */

            this.groupItemsByDate();
        },
        async loadAllYears(itemsSetUrl) {

            //Solo la lista de años ordenados
            this.years = [];
            this.yearsUnique = [];

            let itemsResource = [];

            //Todos los ítems
            for (let itemUrl of itemsSetUrl) {
                let itemSetUrl = itemUrl.split('?');
                let itemSet1 = itemSetUrl[0];
                let itemSet2 = itemSetUrl[1];

                itemSetUrl = itemSet1 + '?' + this.$store.state.tagsCategoriesSelected + itemSet2;
                
                this.urlItemsBase = itemSetUrl + '&search=' + this.$store.state.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';
                //console.log(this.urlItemsBase);

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
        async loadOutstandingItems(itemsOutstandingResource) {
            this.itemsOutstanding = []; //Solo los ítems destacados
            this.itemsOutstandingCount = 0;

            /* itemsOutstandingResource.forEach((item) => {
                this.getItem(item, 'outstanding');
            }); */
            
            for (let item of itemsOutstandingResource) {
                await this.getItem(item, 'outstanding').then(() => {
                    this.itemsOutstandingCount++;
                });

                if (this.itemsOutstandingCount === 7) break;
            }

            //this.groupItemsByDate();

            //console.log(this.itemsOutstanding);
            
            //Ordenar ítems por fecha
            this.itemsOutstanding.sort(function(a, b) {
                var dateA = new Date(a.date), dateB = new Date(b.date);
                return dateA - dateB;
            });
        },
        async getItem(item, option) {
            //Si el ítem tiene fecha y descripción
            if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined' && (typeof item['dcterms:abstract']) !== 'undefined') {

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

                    let image = null;

                    //Si el item tiene multimedia
                    if (item['o:media'].length > 0) {
                        if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

                            //Se recorre cada recurso para determinar el tipo archivo multimedia
                            for (let mediaItem of item['o:media']) {

                                let urlMediaItem = mediaItem['@id'];

                                const response = await this.$axios(urlMediaItem);
                                
                                let mediaType;
                                let squareThumbnailResource;

                                if (response.data['o:media_type'] !== null) {
                                    mediaType = response.data['o:media_type'].split("/")[0];
                                }

                                if (mediaType === 'image') {
                                    //Thumbnail del recurso
                                    squareThumbnailResource = response.data['o:thumbnail_urls'].square;

                                    if (squareThumbnailResource !== undefined) {

                                        image = squareThumbnailResource;
                                    } else {
                                        image = null
                                    }
                                }

                            }
                        }
                    }

                    //Cada ítem
                    let itemObject = {
                        id: item['o:id'],
                        title: item['dcterms:title'][0]['@value'],
                        date: date,
                        summary: item['dcterms:abstract'][0]['@value'],
                        description: item['dcterms:description'][0]['@value'],
                        url: item['@id'],
                        media: media,
                        image: image
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
        async getYear(item) {
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
        async loadAllTagsCategories() {
            this.urlSiteBase = this.$domainOmeka + 'api/tags?per_page=1000';

            const response = await this.$axios(this.urlSiteBase);
            const dataTagsCategories = response.data;

            dataTagsCategories.forEach((tagCategory) => {
                let tagCategoryFound = tagCategory['o:id'];
                let categoryFound = tagCategoryFound.search('categoria-');
                
                //Si la categoría es encontrada
                if(categoryFound !== -1) {
                    let category = tagCategoryFound;
                    let categoryClean = category.replace('categoria-','');
                    let categoryDash = categoryClean.split('-');

                    if (categoryDash.length > 1) {
                        let newCategoryString = categoryDash.join(' ');

                        let categoryObject = {
                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                            category: category
                        }
                    
                        this.categories.push(categoryObject);
                    } else {
                        let newCategoryString = categoryDash.join('');

                        let categoryObject = {
                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                            category: category
                        }

                        this.categories.push(categoryObject);
                    }
                    
                } else {
                    let tag = tagCategoryFound;
                    let tagUnderscore = tag.split('_');

                    if (tagUnderscore.length > 1) {
                        let newTagString = tagUnderscore.join(' ');
                        
                        let tagObject = {
                            nameTag: newTagString.charAt(0).toUpperCase() + newTagString.slice(1),
                            tag: tag
                        }

                        this.tags.push(tagObject);
                        
                    } else {
                        let tagObject = {
                            nameTag: tag.charAt(0).toUpperCase() + tag.slice(1),
                            tag: tag
                        }

                        this.tags.push(tagObject);
                    }
                }
            });
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
                itemsByDate.monthName = this.$moment(month, 'MM').format('MMM').toUpperCase();

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
        async loadItemsRelatad() {
            this.itemsRelated = [];

            let itemsRelatedUrl = this.$domainOmeka + this.propertyIsPartOfIn;

            const response = await this.$axios(itemsRelatedUrl);
            let itemsRelated = response.data;

            for (let itemRelated of itemsRelated) {

                let media = itemRelated['o:media'];
                let hasMedia = media.length > 0;
                let img = null;
                let itemRelatedId = itemRelated['dcterms:isPartOf'][0]['value_resource_id'];

                await this.getFirstImageFound(media).then((imageResponse) => {

                    if (imageResponse === "") {
                        hasMedia = false;
                        img = null;
                    } else {
                        hasMedia = true;
                        img = imageResponse
                    }

                    let item = {
                        id: itemRelated['o:id'],
                        id_item_related: itemRelatedId,
                        title: itemRelated['dcterms:title'][0]['@value'],
                        hasMedia: hasMedia,
                        image: img
                    };

                    this.itemsRelated.push(item);
                });
            }
        },
        async getFirstImageFound(mediaItem) {
            let media = '';

            for (const dataMedia of mediaItem) {
                let imgData = await this.$axios(dataMedia['@id']);
                media = this.getMediaEmptyOrFilled(imgData.data);
                if (media !== '') {
                    break;
                }
            }
            //return the url of the first img found
            return media;
        },
        getMediaEmptyOrFilled(objectArray) {
            let media = '';
            switch (objectArray['o:media_type']) {
                case 'audio/mpeg':
                case 'image/png':
                case 'image/jpeg':
                    media = objectArray['o:thumbnail_urls']['square'];
                    break;
                case 'application/pdf':
                    media = objectArray['o:thumbnail_urls']['square'];
                    break;
                case 'video/mp4':
                case null:
                    if (objectArray['o:thumbnail_urls'].length > 0) {
                        media = objectArray['o:thumbnail_urls']['square'];
                    } else {
                        media = '';
                    }
                    break;
            }
            return media;
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
    },
    mounted () {
        if (location.protocol === 'https:') {
            this.urlImageMap = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
            this.attributionMap = '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';
        } {
            this.urlImageMap = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
            this.attributionMap = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
        }
    }
}