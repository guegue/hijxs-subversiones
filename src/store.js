import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';

Vue.use(Vuex, axios);

export default new Vuex.Store({
  state: {
    // Filtros
    itemsLoaded: [],
  },
  mutations: {
    itemsLoaded(state, itemsLoaded) {
      state.itemsLoaded = itemsLoaded;
    },
  },
  getters: {},
  actions: {
    async itemsLoad({ state, commit }, data) {
      const itemsSetUrlLocal = [];
      const itemsResource = [];

      this.urlSiteBase = `${data.domainOmeka}api/item_sets?site_id=${data.idSite}&resource_class_label=${data.labelVocabulary}`;
      const responseItemSet = await axios.get(this.urlSiteBase);
      const dataItemSet = responseItemSet.data;

      for (const urlSet of dataItemSet) {
        const setItemResponse = await axios.get(urlSet['@id']);
        const setItem = setItemResponse.data;

        itemsSetUrlLocal.push(setItem['o:items']['@id']);
      }

      for (const itemUrl of itemsSetUrlLocal) {
        let itemSetUrl = itemUrl.split('?');
        const itemSet1 = itemSetUrl[0];
        const itemSet2 = itemSetUrl[1];

        itemSetUrl = `${itemSet1}?${data.filter.tagsCategories}${itemSet2}`;

        this.urlItemsBase = `${itemSetUrl}&search=${data.filter.searchValue}&per_page=10000&sort_by=dcterms:date&sort_order=asc`;

        const itemsResponse = await axios.get(this.urlItemsBase);
        const items = itemsResponse.data;

        for (const item of items) {
          if (
            typeof item['dcterms:date'] !== 'undefined' &&
            typeof item['dcterms:description'] !== 'undefined' &&
            typeof item['dcterms:abstract'] !== 'undefined'
          ) {
            // Solo la fecha del item
            const date = item['dcterms:date'][0]['@value'].replace(/\s+/g, '');

            // Si el item tiene una fecha con un formato válido
            if (moment(date, 'YYYY-MM-DD', true).isValid()) {
              await itemsResource.push(item);
            }
          }
        }
      }

      // itemsResource = itemsResource.filter(item => item['dcterms:title'][0]['@value'].toLocaleLowerCase().includes(data.querySearch));

      commit('itemsLoaded', itemsResource);
    },
  },
});
