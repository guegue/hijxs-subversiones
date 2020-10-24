export default {
  data() {
    return {
      // para el filtro de ítems relacionados, en base a 'dcterms:isPartOf' de la api de omeka
      propertyIsPartOfIn:
        'api/items?property[5][property]=33&property[5][type]=in&property[5][text]=espartede',

      itemsRelated: [],
    };
  },
  methods: {
    async loadItemsRelatad() {
      this.itemsRelated = [];

      const itemsRelatedUrl = this.$domainOmeka + this.propertyIsPartOfIn;

      const response = await this.$axios(itemsRelatedUrl);
      const itemsRelated = response.data;

      for (const itemRelated of itemsRelated) {
        const media = itemRelated['o:media'];
        let hasMedia = media.length > 0;
        let imageSquare = null;
        let imageLarge = null;

        const itemRelatedId =
          itemRelated['dcterms:isPartOf'][0].value_resource_id;

        await this.getFirstImageFound(media).then((imageResponse) => {
          if (imageResponse.square === '') {
            hasMedia = false;

            imageSquare = null;
            imageLarge = null;
          } else {
            hasMedia = true;
            imageSquare = imageResponse.square;
            imageLarge = imageResponse.large;
          }

          const item = {
            id: itemRelated['o:id'],
            id_item_related: itemRelatedId,
            title: itemRelated['dcterms:title'][0]['@value'],
            hasMedia,
            image: imageSquare,
            imageLarge,
          };

          this.itemsRelated.push(item);
        });
      }
    },
    async getFirstImageFound(mediaItem) {
      let media = {
        square: '',
        large: '',
      };

      for (const dataMedia of mediaItem) {
        const imgData = await this.$axios(dataMedia['@id']);
        media = this.getMediaEmptyOrFilled(imgData.data);
        if (media.square !== '') {
          break;
        }
      }
      // return the url of the first img found
      return media;
    },
    getMediaEmptyOrFilled(objectArray) {
      let mediaSquare = '';
      let mediaLarge = '';
      switch (objectArray['o:media_type']) {
        case 'audio/mpeg':
        case 'image/png':
        case 'image/jpeg':
          mediaSquare = objectArray['o:thumbnail_urls'].square;
          mediaLarge = objectArray['o:thumbnail_urls'].large;
          break;
        case 'application/pdf':
          mediaSquare = objectArray['o:thumbnail_urls'].square;
          mediaLarge = objectArray['o:thumbnail_urls'].large;
          break;
        case 'video/mp4':
        case null:
          if (objectArray['o:thumbnail_urls'].length > 0) {
            mediaSquare = objectArray['o:thumbnail_urls'].square;
            mediaLarge = objectArray['o:thumbnail_urls'].large;
          } else {
            mediaSquare = '';
            mediaLarge = '';
          }
          break;
      }
      return {
        square: mediaSquare,
        large: mediaLarge,
      };
    },
  },
};
