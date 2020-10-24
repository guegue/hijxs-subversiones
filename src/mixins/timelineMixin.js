import config from '../config';
import ItemMixin from './itemMixin';

export default {
  mixins: [ItemMixin],
  data: () => {
    return {
      config,
      urlSiteBase: null,
      urlItemsBase: null,
      elementViewPort: null,

      idSite: 12, // Rafael
      labelVocabulary: 'linea de tiempo',

      items: [], // Solo los ítems
      itemsDate: [], // Solo las fechas de los ítems
      itemsDateMonth: [], // Solo los meses de las fechas de los ítems
      itemsByDateArray: [], // Para guardar el conjunto de items por mes y fecha

      timelineYearSelected: '', // Año seleccionado en la línea de años

      // Para el filtro por año, en base a 'dcterms:date' de la api de omeka
      propertyDateIn:
        'property[2][property]=7&property[2][type]=in&property[2][text]=',

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
      attributionMap:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      isLoading: false,
      fullPage: true,

      lat: 0,
      lng: 0,
      timelineView: true,
    };
  },
  watch: {
    searchValue() {
      this.$root.$emit('filters');
    },
    tagsCategoriesSelected() {
      this.$root.$emit('filters');
    },
  },
  methods: {
    // Carga todas las páginas con timeline de todos los sitios
    async loadTimelinePages() {
      this.pagesWithTimeline = [];

      this.urlSiteBase = `${this.$domainOmeka}api/sites`;

      const response = await this.$axios(this.urlSiteBase);
      const sites = response.data;

      for (const site of sites) {
        if (site['o:page'] !== undefined) {
          if (site['o:page'].length > 0) {
            for (const page of site['o:page']) {
              const response = await this.$axios(page['@id']);
              const dataPage = response.data;

              // Si encuentra el slug de línea de tiempo
              if (dataPage['o:slug'].search('linea-de-tiempo') !== -1) {
                const pageTimeline = {
                  site: site['@id'],
                  site_id: site['o:id'],
                  page_title: dataPage['o:title'],
                  page: dataPage['@id'],
                  page_id: dataPage['o:id'],
                  page_slug: dataPage['o:slug'],
                };

                this.pagesWithTimeline.push(pageTimeline);
              }
            }
          }
        }
      }
    },
    async getItems(items) {
      this.itemsByDateArray = [];
      this.items = [];
      this.itemsDate = [];
      this.itemsDateMonth = []; // Solo los meses de las fechas de los ítems
      this.itemsByDateArray = []; // Para guardar el conjunto de items por mes y fecha
      this.years = [];
      this.yearsUnique = [];
      this.lat = 0;
      this.lng = 0;

      for (const item of items) {
        // Cada ítem
        const itemObject = {
          id: null,
          title: null,
          summary: null,
          description: null,
          url: null,
          image: null,
          imageLarge: null,
          categories: null,
          date: null,
          month: null,
          year: null,
          marker: null,
        };

        // Solo la fecha del item
        const date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

        const categories = [];
        let imageSquare = null;
        let imageLarge = null;

        let hasMedia = false;

        // Imagen
        await this.getFirstImageFound(item['o:media']).then((imageResponse) => {
          if (imageResponse.square === '') {
            hasMedia = false;

            imageSquare = null;
            imageLarge = null;
          } else {
            hasMedia = true;
            imageSquare = imageResponse.square;
            imageLarge = imageResponse.large;
          }
        });

        // Categorías de cada ítem
        if (item['o-module-folksonomy:tag'] !== undefined) {
          for (const category of item['o-module-folksonomy:tag']) {
            const tempCategory = category['o:id'];
            const categoryFound = tempCategory.search('categoria-');

            // Si la categoría es encontrada
            if (categoryFound !== -1) {
              const result = config.categories_config.filter((o) =>
                o.category.includes(tempCategory)
              );
              let classColorCategory = null;

              classColorCategory =
                result[0].classcolor === undefined
                  ? null
                  : result[0].classcolor;

              const categoryClean = tempCategory.replace('categoria-', '');
              const categoryDash = categoryClean.split('-');

              if (categoryDash.length > 1) {
                const newCategoryString = categoryDash.join(' ');

                const categoryObject = {
                  nameCategory:
                    newCategoryString.charAt(0).toUpperCase() +
                    newCategoryString.slice(1).replace('mrta', 'MRTA'),
                  category: tempCategory,
                  classcolor: classColorCategory,
                };

                categories.push(categoryObject);
              } else {
                const newCategoryString = categoryDash.join('');

                const categoryObject = {
                  nameCategory:
                    newCategoryString.charAt(0).toUpperCase() +
                    newCategoryString.slice(1).replace('mrta', 'MRTA'),
                  category,
                  classcolor: classColorCategory,
                };

                categories.push(categoryObject);
              }
            }
          }
        }

        // Cada ítem
        itemObject.id = item['o:id'];
        itemObject.title = item['dcterms:title'][0]['@value'];
        itemObject.summary = item['dcterms:abstract'][0]['@value'];
        itemObject.description = item['dcterms:description'][0]['@value'];
        itemObject.url = item['@id'];
        itemObject.image = imageSquare;
        itemObject.imageLarge = imageLarge;
        itemObject.categories = categories;
        itemObject.date = date;
        itemObject.month = this.$moment(date).format('MM');
        itemObject.year = this.extractYear(date);

        // Marcador del mapa de cada ítem
        if (item['o-module-mapping:marker'] !== undefined) {
          item['o-module-mapping:marker'].forEach((marker) => {
            this.lat += marker['o-module-mapping:lat'];
            this.lng += marker['o-module-mapping:lng'];

            itemObject.marker = L.latLng(
              marker['o-module-mapping:lat'],
              marker['o-module-mapping:lng']
            );
          });
        } else {
          const address = item['dcterms:provenance'][0]['@value'];

          const geocoder = new google.maps.Geocoder();

          await geocoder.geocode({ address }, (response, status) => {
            if (status === 'OK') {
              const firstResult = response[0];
              const latG = firstResult.geometry.location.lat();
              const lngG = firstResult.geometry.location.lng();

              this.lat += latG;
              this.lng += lngG;

              itemObject.marker = L.latLng(latG, lngG);
            } else {
              console.log(`Google maps no se pudo cargar: ${status}`);
            }
          });
        }

        // Push solo las fechas
        await this.itemsDate.push(date);

        // Push solo los meses
        await this.itemsDateMonth.push(this.$moment(date).format('MM'));

        // Push solo los años
        await this.years.push(this.extractYear(date));

        // Push solo los ítems
        await this.items.push(itemObject);
      }
    },
    async loadAllTagsCategories() {
      this.urlSiteBase = `${this.$domainOmeka}api/tags?per_page=1000`;

      const response = await this.$axios(this.urlSiteBase);
      const dataTagsCategories = response.data;

      dataTagsCategories.forEach((tagCategory) => {
        const tagCategoryFound = tagCategory['o:id'];
        const categoryFound = tagCategoryFound.search('categoria-');

        // Si la categoría es encontrada
        if (categoryFound !== -1) {
          const category = tagCategoryFound;
          const categoryClean = category.replace('categoria-', '');
          const categoryDash = categoryClean.split('-');

          if (categoryDash.length > 1) {
            const newCategoryString = categoryDash.join(' ');

            const categoryObject = {
              nameCategory:
                newCategoryString.charAt(0).toUpperCase() +
                newCategoryString.slice(1),
              category,
            };

            this.categories.push(categoryObject);
          } else {
            const newCategoryString = categoryDash.join('');

            const categoryObject = {
              nameCategory:
                newCategoryString.charAt(0).toUpperCase() +
                newCategoryString.slice(1),
              category,
            };

            this.categories.push(categoryObject);
          }
        } else {
          const tag = tagCategoryFound;
          const tagUnderscore = tag.split('_');

          if (tagUnderscore.length > 1) {
            const newTagString = tagUnderscore.join(' ');

            const tagObject = {
              nameTag:
                newTagString.charAt(0).toUpperCase() + newTagString.slice(1),
              tag,
            };

            this.tags.push(tagObject);
          } else {
            const tagObject = {
              nameTag: tag.charAt(0).toUpperCase() + tag.slice(1),
              tag,
            };

            this.tags.push(tagObject);
          }
        }
      });
    },
    async groupItemsByDate() {
      // Almacena los meses sin repetir los mismos
      const itemsDateMonthUnique = this.itemsDateMonth.filter(this.uniqueDate);
      const itemsDateUnique = this.itemsDate.filter(this.uniqueDate);
      this.yearsUnique = this.years.filter(this.distinctYears).sort();

      for (const year of this.yearsUnique) {
        const itemsByYear = {
          year: null,
          months: [],
        };

        itemsDateMonthUnique.forEach((month) => {
          const itemsByMonth = {
            year: null,
            month: null,
            monthName: null,
            days: [],
          };

          // El mes en número
          itemsByMonth.month = month;
          // El mes en texto
          itemsByMonth.monthName = this.$moment(month, 'MM')
            .format('MMM')
            .toUpperCase();

          itemsDateUnique.forEach((date) => {
            const itemByDays = {
              date: null,
              day: null,
              dayName: null,
              items: [],
            };

            const yearDate = this.extractYear(date);
            const monthDate = this.$moment(date).format('MM');

            this.items.forEach((item) => {
              if (item.date === date) {
                itemByDays.items.push(item);
              }
            });

            if (parseInt(yearDate) === parseInt(year)) {
              if (parseInt(monthDate) === parseInt(month)) {
                // Día
                itemByDays.date = date;
                itemByDays.day = this.$moment(date).format('DD');
                itemByDays.dayName = this.$moment(date).format('dddd');

                // Mes
                itemsByMonth.year = year;
                itemsByMonth.days.push(itemByDays);

                // Año
                itemsByYear.year = year;
                itemsByYear.months.push(itemsByMonth);
              }
            }
          });
        });

        itemsByYear.months = [...new Set(itemsByYear.months)];
        itemsByYear.months.sort((a, b) => a.month - b.month);

        await this.itemsByDateArray.push(itemsByYear);
      }
    },
    isElementInViewport() {
      const rect = this.elementViewPort.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    uniqueDate(value, index, self) {
      return self.indexOf(value) === index;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
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
      return this.$moment(date, 'YYYY-MM-DD').year();
    },
    distinctYears(value, index, self) {
      return self.indexOf(value) === index;
    },
  },
  mounted() {
    if (location.protocol === 'https:') {
      this.urlImageMap = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
      this.attributionMap =
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';
    }
    {
      this.urlImageMap = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
      this.attributionMap =
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    }
  },
};
