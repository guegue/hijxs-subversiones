import {async} from "q";

export default {

    data: () => {
        return {
            itemCoordinate: [],
        }
    },
    created() {
    },
    mounted: function () {
    },
    methods: {
        async traverseResourceSite(resources) {
            for (const property of resources) {
                if (property.type === 'pag')
                    await this.getDetailPage(property.idPagina);
                else
                    this.getDetailItemSet(property.idItemSet);
            }
        },
        getDetailItemSet(idItemSet) {

            this.$axios(this.$domainOmeka + 'api/items?item_set_id=' + idItemSet)
                .then((items) => this.recorrerItems(items))
                .then(() => {

                })
        },
        async getDetailPage(idPage) {

            const resourcePage = await this.$axios(this.$domainOmeka + 'api/site_pages/' + idPage);
            // Si la propiedad o:block existe recorrer los items,conjuntos,etc relacionados
            if (resourcePage.data['o:block'] != null) {

                for (const detail of resourcePage.data['o:block']) {

                    if (detail['o:layout'] === 'itemShowCase') {
                        //Recorrer los items relacionados a una página
                        for (const data of detail['o:attachment']) {

                            // Obtener detalles del item
                            const item = await this.$axios(data['o:item']['@id']); // Url item

                            if (item.data['o-module-mapping:marker'] !== undefined) {
                                this.getCoordinateItem(item.data['o-module-mapping:marker']);
                            }
                        }
                    }
                }
            }
            return this.itemCoordinate;

        },
      async  getCoordinateItem(marker) {

            for (const coordinate of marker) {

                let img = null;
                 if (coordinate['o:media'] !== null) {
                     let media = await this.$axios(coordinate['o:media']['@id']);
                     img = media.data['o:original_url'];
                 }

                this.itemCoordinate.push({
                    title: this.getPropertyValue(coordinate, 'o-module-mapping:label'),
                    lng: this.getPropertyValue(coordinate, 'o-module-mapping:lng'),
                    lat: this.getPropertyValue(coordinate, 'o-module-mapping:lat'),
                    img:img,
                });
            }

        },
        async recorrerItems(items) {

            var sizeItems = items.data.length;

            if (parseInt(sizeItems) > 0) {

                for (const item of items.data) {

                    if (item['o-module-mapping:marker'] !== undefined) {
                        this.getCoordinateItem(item['o-module-mapping:marker']);
                    }
                }
            }

        },
        getPropertyValue(object, attribName) {

            return (object[attribName] !== null) ? object[attribName] : '';

        },
    },

    filters: {},
    computed: {},
}
