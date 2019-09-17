import config from '../config';
import ItemMixin from './itemMixin';

export default {
    mixins: [
        ItemMixin
    ],
    data: () => {
        return {
            config: config,
            urlSiteBase: null,
            urlItemsBase: null,
            elementViewPort: null,

            items: [], //Solo los ítems
            itemsOutstanding: [], //Solo los ítems destacados
            itemsDate: [], //Solo las fechas de los ítems
            itemsDateMonth: [], //Solo los meses de las fechas de los ítems
            itemsByDateArray: [], //Para guardar el conjunto de items por mes y fecha

            timelineYearSelected: '', //Año seleccionado en la línea de años  

            //Para el filtro por año, en base a 'dcterms:date' de la api de omeka
            propertyDateIn: 'property[2][property]=7&property[2][type]=in&property[2][text]=',

            timelinePageData: [],

            years: [],
            yearsUnique: [],

            itemsSetUrl: [],

            itemsDateMonthUnique: null,

            itemsDateMonths: [],

            tagsCategories: [],
            tags: [],
            categories: [],

            pagesWithTimeline: [],
            urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attributionMap: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            
            isLoading: false,
            fullPage: true

        }
    },
    watch: {
        searchValue: function () {
            this.$root.$emit('filters');
        },
        tagsCategoriesSelected: function () {
            this.$root.$emit('filters');
        }
    },
    methods: {
        //Carga todas las páginas con timeline de todos los sitios
        async loadTimelinePages() {
            this.pagesWithTimeline = [];

            this.urlSiteBase = this.$domainOmeka + 'api/sites';

            const response = await this.$axios(this.urlSiteBase);
            const sites = response.data;

            for (let site of sites) {
                if (site['o:page'] !== undefined) {
                    if (site['o:page'].length > 0) {
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
        async getItems(items) {
            let i = 0;
            for (let item of items) {
                if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined' && (typeof item['dcterms:abstract']) !== 'undefined') {

                    //Solo la fecha del item
                    let date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

                    //Si el item tiene una fecha con un formato válido
                    if (this.$moment(date, 'YYYY-MM-DD', true).isValid()) {
                        let categories = [];
                        let imageSquare = null;
                        let imageLarge = null;

                        let hasMedia = false;

                        await this.getFirstImageFound(item['o:media']).then((imageResponse) => {
                            if (imageResponse === "") {
                                hasMedia = false;

                                imageSquare = null;
                                imageLarge = null;
                            } else {
                                hasMedia = true;
                                imageSquare = imageResponse.square;
                                imageLarge = imageResponse.large;
                            }
                        });

                        if (item['o-module-folksonomy:tag'] !== undefined) {
                            for (let category of item['o-module-folksonomy:tag']) {
                                let tempCategory = category['o:id'];
                                let categoryFound = tempCategory.search('categoria-');

                                //Si la categoría es encontrada
                                if (categoryFound !== -1) {

                                    let result = config.categories_config.filter(o => o.category.includes(tempCategory));
                                    let classColorCategory = null;

                                    classColorCategory = result[0].classcolor === undefined ? null : result[0].classcolor;

                                    let categoryClean = tempCategory.replace('categoria-', '');
                                    let categoryDash = categoryClean.split('-');

                                    if (categoryDash.length > 1) {
                                        let newCategoryString = categoryDash.join(' ');

                                        let categoryObject = {
                                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                                            category: tempCategory,
                                            classcolor: classColorCategory
                                        };

                                        categories.push(categoryObject);
                                    } else {
                                        let newCategoryString = categoryDash.join('');

                                        let categoryObject = {
                                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                                            category: category,
                                            classcolor: classColorCategory
                                        };

                                        categories.push(categoryObject);
                                    }
                                }
                            }
                        }

                        //Cada ítem
                        let itemObject = {
                            id: item['o:id'],
                            title: item['dcterms:title'][0]['@value'],
                            summary: item['dcterms:abstract'][0]['@value'],
                            description: item['dcterms:description'][0]['@value'],
                            url: item['@id'],
                            image: imageSquare,
                            imageLarge: imageLarge,
                            categories: categories,
                            date: date,
                            month: this.$moment(date).format('MM'),
                            year: this.extractYear(date),
                        };

                        //Push solo las fechas
                        await this.itemsDate.push(date);

                        //Push solo los meses
                        await this.itemsDateMonth.push(this.$moment(date).format('MM'));

                        //Push solo los años
                        await this.years.push(this.extractYear(date));

                        //Push solo los ítems
                        await this.items.push(itemObject);
                    }
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
                if (categoryFound !== -1) {
                    let category = tagCategoryFound;
                    let categoryClean = category.replace('categoria-', '');
                    let categoryDash = categoryClean.split('-');

                    if (categoryDash.length > 1) {
                        let newCategoryString = categoryDash.join(' ');

                        let categoryObject = {
                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                            category: category
                        };

                        this.categories.push(categoryObject);
                    } else {
                        let newCategoryString = categoryDash.join('');

                        let categoryObject = {
                            nameCategory: newCategoryString.charAt(0).toUpperCase() + newCategoryString.slice(1),
                            category: category
                        };

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
                        };

                        this.tags.push(tagObject);

                    } else {
                        let tagObject = {
                            nameTag: tag.charAt(0).toUpperCase() + tag.slice(1),
                            tag: tag
                        };

                        this.tags.push(tagObject);
                    }
                }
            });
        },
        async groupItemsByDate() {
            //Almacena los meses sin repetir los mismos
            let itemsDateMonthUnique = this.itemsDateMonth.filter(this.uniqueDate);
            let itemsDateUnique = this.itemsDate.filter(this.uniqueDate);
            this.yearsUnique = this.years.filter(this.distinctYears).sort();

            for (let year of this.yearsUnique) {

                let itemsByYear = {
                    year: null,
                    months: []
                };

                itemsDateMonthUnique.forEach((month) => {

                    let itemsByMonth = {
                        year: null,
                        month: null,
                        monthName: null,
                        days: []
                    };

                    //El mes en número
                    itemsByMonth.month = month;
                    //El mes en texto
                    itemsByMonth.monthName = this.$moment(month, 'MM').format('MMM').toUpperCase();

                    itemsDateUnique.forEach((date) => {
                        let itemByDays = {
                            date: null,
                            day: null,
                            dayName: null,
                            items: []
                        };

                        let yearDate = this.extractYear(date);
                        let monthDate = this.$moment(date).format('MM');

                        this.items.forEach((item) => {
                            if (item.date === date) {
                                itemByDays.items.push(item)
                            }
                        });

                        if ((parseInt(yearDate) === parseInt(year))) {

                            if (parseInt(monthDate) === parseInt(month)) {
                                //Día
                                itemByDays.date = date;
                                itemByDays.day = this.$moment(date).format('DD');
                                itemByDays.dayName = this.$moment(date).format('dddd');

                                //Mes
                                itemsByMonth.year = year;
                                itemsByMonth.days.push(itemByDays);

                                //Año
                                itemsByYear.year = year;
                                itemsByYear.months.push(itemsByMonth);

                            }
                        }
                    });
                });

                itemsByYear.months = [...new Set(itemsByYear.months)];

                await this.itemsByDateArray.push(itemsByYear);
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
        isItemsLoaded() {
            return this.itemsByDateArray.length > 0;
        },
        extractYear(date) {
            return this.$moment(date, "YYYY-MM-DD").year();
        },
        distinctYears(value, index, self) {
            return self.indexOf(value) === index;
        }
    },
    mounted() {

        if (location.protocol === 'https:') {
            this.urlImageMap = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
            this.attributionMap = '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';
        }
        {
            this.urlImageMap = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
            this.attributionMap = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
        }
    }
}
