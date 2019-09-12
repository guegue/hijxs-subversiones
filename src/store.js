import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex, axios);

export default new Vuex.Store({
    state: {
        //Filtros
        searchValue: '',
        tagsCategoriesSelected: '',
        itemsLoaded: []
    },
    mutations: {
        tagsCategoriesSelected(state, tagsCategoriesSelected) {
            state.tagsCategoriesSelected = tagsCategoriesSelected;
        },
        searchValue(state, searchValue) {
            state.searchValue = searchValue;
        },
        itemsLoaded(state, itemsLoaded) {
            state.itemsLoaded = itemsLoaded;
        }
    },
    getters:  {

    },
    actions: {
        async itemsLoad({state, commit}, data) {

            let itemsSetUrlLocal = [];
            let itemsResource = [];

            this.urlSiteBase = data.domainOmeka + 'api/item_sets?site_id=' + data.idSite + '&resource_class_label=' + data.labelVocabulary;
            const responseItemSet = await axios.get(this.urlSiteBase);
            const dataItemSet = responseItemSet.data;

            for (let urlSet of dataItemSet) {
                const setItemResponse = await axios.get(urlSet['@id']);
                const setItem = setItemResponse.data;

                itemsSetUrlLocal.push(setItem['o:items']['@id']);
            }

            for (let itemUrl of itemsSetUrlLocal) {

                let itemSetUrl = itemUrl.split('?');
                let itemSet1 = itemSetUrl[0];
                let itemSet2 = itemSetUrl[1];

                itemSetUrl = itemSet1 + '?' + state.tagsCategoriesSelected + itemSet2;

                this.urlItemsBase = itemSetUrl + '&search=' + state.searchValue + '&per_page=10000&sort_by=dcterms:date&sort_order=asc';

                const itemsResponse = await axios.get(this.urlItemsBase);
                const items = itemsResponse.data;

                for (let item of items) {
                    await itemsResource.push(item);
                }
            }

            commit('itemsLoaded', itemsResource);

        }
    }
});