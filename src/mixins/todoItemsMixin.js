export default {
    data() {
        return {
            urlSiteBase: null,
            idSite: 12, //Rafael
            labelVocabulary: 'linea de tiempo',
            urlItemsBase: null,
            items: [],
        }
    },
    methods: {
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

            await this.loadAllItems(itemsSetUrlLocal);

        },
        async loadAllItems(itemsSetUrl) {
            let itemsResource = [];

            this.items = []; //Solo los items

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
                await this.getItem(item);
            }
        },
        async getItem(item) {
            //Si el ítem tiene fecha y descripción
            if ((typeof item['dcterms:date'] !== 'undefined') && (typeof item['dcterms:description']) !== 'undefined' && (typeof item['dcterms:abstract']) !== 'undefined') {

                //Solo la fecha del item
                let date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

                if (this.$moment(date, 'YYYY-MM-DD', true).isValid()) {

                    let imageSquare = null;
                    let imageLarge = null;

                    await this.getFirstImageFound(item['o:media']).then((imageResponse) => {
                        if (imageResponse.square === "") {
                            imageSquare = null;
                            imageLarge = null;
                        } else {
                            imageSquare = imageResponse.square;
                            imageLarge = imageResponse.large;
                        }
                    });

                    if (item['o-module-mapping:marker'] !== undefined) {
                        item['o-module-mapping:marker'].forEach((marker) => {

                            this.lat += marker['o-module-mapping:lat'];
                            this.lng += marker['o-module-mapping:lng'];

                            //Cada ítem
                            let itemObject = {
                                id: item['o:id'],
                                title: item['dcterms:title'][0]['@value'],
                                date: date,
                                summary: item['dcterms:abstract'][0]['@value'],
                                description: item['dcterms:description'][0]['@value'],
                                url: item['@id'],
                                image: imageSquare,
                                imageLarge: imageLarge,
                                marker: L.latLng(marker['o-module-mapping:lat'], marker['o-module-mapping:lng'])
                            };

                            //Push todos los items
                            this.items.push(itemObject);
                        });

                    } else {

                        let address = item['dcterms:provenance'][0]['@value'];

                        const geocoder = new google.maps.Geocoder();

                        await geocoder.geocode({'address': address}, async (response, status) => {
                            if (status === 'OK') {
                                let firstResult = response[0];
                                let latG = firstResult.geometry.location.lat();
                                let lngG = firstResult.geometry.location.lng();

                                this.lat += latG;
                                this.lng += lngG;

                                //Cada ítem
                                let itemObject = {
                                    id: item['o:id'],
                                    title: item['dcterms:title'][0]['@value'],
                                    date: date,
                                    summary: item['dcterms:abstract'][0]['@value'],
                                    description: item['dcterms:description'][0]['@value'],
                                    url: item['@id'],
                                    image: image,
                                    marker: L.latLng(latG, lngG)
                                };

                                //Push todos los items
                                this.items.push(itemObject);

                            } else {
                                console.log('Google maps no se pudo cargar: ' + status);
                            }
                        });


                    }
                }
            }
        },
    }
}