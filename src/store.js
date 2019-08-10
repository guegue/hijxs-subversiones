import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //Filtros
        searchValue: '',
        tagsCategoriesSelected: ''
    },
    mutations: {
        tagsCategoriesSelected(state, tagsCategoriesSelected) {
            state.tagsCategoriesSelected = tagsCategoriesSelected;
        },
        searchValue(state, searchValue) {
            state.searchValue = searchValue;
        }
    },
    actions: {

    }
});