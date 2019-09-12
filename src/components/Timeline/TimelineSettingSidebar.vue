<template>
    <div>
        <span class="filter-square sidebar-filter-no-close text-white float-right" @click="toggleSettingSidebar"><i class="fas fa-filter fa-lg"></i></span>
        
        <div class="sidebar-filter collapsed">
            <b-container class="mb-3">
                <b-row>
                    <b-col>
                        <span class="float-right mt-1 mr-2 sidebar-filter-close" @click="toggleSettingSidebar"><i
                                class="fas fa-filter fa-lg"></i>
                        </span>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="mt-2 mb-4">
                        <div class="search-container">
                            <input class="search-input" type="text" placeholder="Buscar" ref="inputSearchTimeline" @keyup.enter="search">
                            <span class="search-icon" @click="search"><i class="fas fa-search"></i> </span>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="11 mb-4">
                        <label class="typo__label" for="">Búsqueda por tags</label>
                        <multiselect 
                            class="multiselect-custom multiselect-tags"
                            :multiple="true"
                            label="nameTag"
                            track-by="tag"
                            :searchable="true"
                            :allow-empty="true"
                            :taggable="true"
                            :close-on-select="false"
                            :max-height="170"
                            placeholder="Selecccione los tags"
                            tag-placeholder=""
                            :show-labels="false"
                            v-model="valueTag"
                            @select="selectTag"
                            @remove="removeTag"
                            :options="optionsTags">
                        </multiselect>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="11 mb-4">
                        <label class="typo__label" for="">Búsqueda por categorías</label>
                        <multiselect 
                            class="multiselect-custom multiselect-categories"
                            :multiple="true"
                            label="nameCategory"
                            track-by="category"
                            :searchable="true"
                            :allow-empty="true"
                            :taggable="true"
                            :close-on-select="false"
                            :max-height="170"
                            placeholder="Selecccione las categorías" 
                            tag-placeholder=""
                            :show-labels="false"
                            v-model="valueCategory" 
                            @select="selectCategory"
                            @remove="removeCategory"
                            :options="optionsCategories">
                        </multiselect>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';
    import {mapState} from 'vuex';

    export default {
        name: "TimelineSettingSidebar",
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                valueTag: null,
                valueCategory: null,
                optionsTags: [],
                optionsCategories: [],
                tagsCategoriesSelectedArray: [],
                tagsCategoriesSelectedLocal: ''
            }
        },
        methods: {
            toggleSettingSidebar() {
                document.querySelector(".sidebar-filter").classList.toggle("collapsed");
                
                document.querySelector(".sidebar-compare-timeline").classList.add("collapsed");
            },
            selectTag(selectedOption){
                this.tagsCategoriesSelectedArray.push(selectedOption.tag);

                this.tagsCategoriesParams();
                
            },
            removeTag(removeOption){
                let index = this.tagsCategoriesSelectedArray.indexOf(removeOption.tag);

                if (index !== -1) {
                    this.tagsCategoriesSelectedArray.splice(index, 1);
                }

                this.tagsCategoriesParams();
            },
            selectCategory(selectedOption){
                this.tagsCategoriesSelectedArray.push(selectedOption.category);

                this.tagsCategoriesParams();
                
            },
            removeCategory(removeOption){
                let index = this.tagsCategoriesSelectedArray.indexOf(removeOption.category);

                if (index !== -1) {
                    this.tagsCategoriesSelectedArray.splice(index, 1);
                }

                this.tagsCategoriesParams();
            },
            tagsCategoriesParams() {

                if (this.tagsCategoriesSelectedArray.length === 0) {
                    this.tagsCategoriesSelectedLocal = '';
                } else {
                    this.tagsCategoriesSelectedLocal = "tag=" + this.tagsCategoriesSelectedArray.join('&tag=') + "&";
                }

                this.$store.commit('tagsCategoriesSelected', this.tagsCategoriesSelectedLocal);
            },
            search() {
                let text = this.$refs.inputSearchTimeline.value;
                
                this.$store.commit('searchValue', text.replace(' ', '&'));
            },
        },
        mounted() {
            this.loadAllTagsCategories().then(() => {
                this.optionsTags = this.tags;
                this.optionsCategories = this.categories;
            });
        },
        updated() {
            document.addEventListener('click', (event) =>  {
                let sidebarFilter = document.querySelector('.sidebar-filter');
                let filterSquare = document.querySelector('.filter-square');

                sidebarFilter.querySelectorAll('*').forEach((element) => {
                    element.classList.add('sidebar-filter-no-close');
                });

                filterSquare.querySelectorAll('*').forEach((element) => {
                    element.classList.add('sidebar-filter-no-close');
                });

                if (!sidebarFilter.classList.contains('collapsed')) {
                    if (!event.target.classList.contains('sidebar-filter-no-close')) {
                        sidebarFilter.classList.add('collapsed');
                    }
                }
            });
        },
        computed: {
            ...mapState([
                'searchValue',
                'tagsCategoriesSelected',
            ])
        }
    }
</script>

<style scoped>
    .filter-square {
        padding: 5px 10px 5px 10px;
        right: 0;
        border-radius: 5px;

        background-color: #65B32E;
        border: none;
        cursor: pointer;
    }

    .sidebar-filter {
        overflow: hidden;
    }

    .sidebar-filter {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        background: white;
        width: 600px;
        height: 100%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        min-height: 500px;
        border-radius: 4px 0 0 4px;
    }

    .sidebar-filter.collapsed {
        width: 0;
    }

    .sidebar-filter-close {
        cursor: pointer;
        color: #65B32E;
    }

    .search-input {
        color: #359be0;
        width: 85%;
        border: none;
        padding: 0 5px;
        border-bottom: 2px solid #359be0;
    }

    .search-input:focus, .search-input:active {
        outline: none;
    }

    .search-input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #a5c8f1;
    }
    .search-input::-moz-placeholder { /* Firefox 19+ */
        color: #a5c8f1;
    }
    .search-input:-ms-input-placeholder { /* IE 10+ */
        color: #a5c8f1;
    }
    .search-input:-moz-placeholder { /* Firefox 18- */
        color: #a5c8f1;
    }

    .search-icon {
        color: #359be0;
    }

    .search-icon:hover {
        cursor: pointer;
    }

</style>

<style>
.multiselect-custom .multiselect__tag {
    background: #bbcde1;
}

.multiselect-custom .multiselect__tag .multiselect__tag-icon:hover {
    background: #359be0;
}

.multiselect-custom .multiselect__option--highlight {
    background: #359be0;
}

.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
    background: #bbcde1;
}
</style>
