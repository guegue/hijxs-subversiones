export default {
    data() {
        return {
            //para el filtro de ítems relacionados, en base a 'dcterms:isPartOf' de la api de omeka
            propertyIsPartOfIn: 'api/items?property[5][property]=33&property[5][type]=in&property[5][text]=espartede',

            itemsRelated: [],
        }
    },
    watch: {},
    methods: {
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
    }
}