import { async } from 'q';

export default {
  data: () => {
    return {
      /* var contentPage ->INICIO */
      itemsPage: [],
      auxItemsPage: [],
      imgPage: null,
      page: 1,
      typePage: 'url',
      descripcionPage: null,
      sectionPage: [],
      quantiryItemsToShow: null,
      btnShowMore: false,
      btnActive: true,
      totalAmountItems: 0,
      showAlert: false,
      detalleByItem: [],
      currentIdItem: 0,
      is_visible_modal: false,
      search: null,
      hasDescription: false,
      relatedVideos: [],
      isVideo: false,
      idMedia: [],
      idItemSet: null,
      thereAreMoreItems: true,
      idItemsPage: [],
      cancelRequest: null,
      noImg: 'https://www.freeiconspng.com/uploads/no-image-icon-4.png',
      currentBreadCrumb: [{ text: 'Inicio', href: '/' }],
      /** FIN * */
    };
  },
  mounted() {},
  methods: {
    readInfoPage(menuSite) {
      const currentRoute = this.$route.path.toLowerCase();

      for (const infoMenu of menuSite) {
        if (currentRoute === `/${infoMenu.routePage.toLowerCase()}`)
          return infoMenu;
      }
    },
    isPartOfGetId(idMedia) {
      return new Promise(async (resolved, reject) => {
        const media = await this.$axios(
          `${this.$domainOmeka}api/media/${idMedia}`
        );

        if (media.data['dcterms:isPartOf'] !== undefined) {
          const item = await this.$axios(
            `${this.$domainOmeka}api/items/${media.data['dcterms:isPartOf'][0].value_resource_id}`
          );

          if (item.data['o:media'] !== undefined) {
            const dataMedia = await this.$axios(item.data['o:media'][0]['@id']);
            // Object.assign(this.itemsPage[img.idItem], propertyVideo)
            const compObj = Object.assign(dataMedia.data, {
              idMed: item.data['o:media'][0]['o:id'],
            });

            resolved(compObj);
          } else return null;
        } else resolved(null);
      });
    },
    getPropertyValue(object, attribName, complementAttrib, isObject) {
      const complement = complementAttrib || 'dcterms:';
      const isAttribInObject = isObject || false;

      if (!isAttribInObject)
        return object[complement + attribName] !== undefined &&
          object[complement + attribName] !== null
          ? object[complement + attribName][0]['@value']
          : '';

      return object[complement + attribName] !== undefined &&
        object[complement + attribName] !== null
        ? object[complement + attribName][isObject[0]]
        : '';
    },
    resetVariables() {
      this.itemsPage = [];
      this.auxItemsPage = [];
      this.imgPage = null;
      this.page = 1;
      this.typePage = 'url';
      this.descripcionPage = null;
      this.sectionPage = [];
      this.quantiryItemsToShow = null;
      this.btnShowMore = false;
      this.btnActive = true;
      this.totalAmountItems = 0;
      this.showAlert = false;
      /* this.detalleByItem=[]; */
      this.currentIdItem = 0;
      this.is_visible_modal = false;
      this.search = null;
      this.hasDescription = false;
      this.relatedVideos = [];
      this.isVideo = false;
      this.idMedia = [];
      this.idItemSet = null;
      this.thereAreMoreItems = true;
      this.idItemsPage = [];
      this.currentBreadCrumb = [{ text: 'Inicio', href: '/' }];
    },
  },
  filters: {
    descriptionShort(description, long) {
      long = long || 135;
      return `${description.substring(0, long)}...`;
    },
    titleShort(title) {
      const size = title.length;
      return size > 46 ? `${title.substring(0, 46)}...` : title;
    },
  },
};
