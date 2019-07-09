<template>
    <div>
        <span class="setting-square text-white float-right" @click="toggleSettingSidebar"><i class="fas fa-filter fa-lg"></i></span>
        
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
                            <input class="search-input" type="text" placeholder="Buscar">
                            <span class="search-icon"><i class="fas fa-search"></i> </span>
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
                            :show-labels="false"
                            v-model="valueTag" 
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
                            :max-height="80"
                            placeholder="Selecccione las categorías" 
                            :show-labels="false"
                            v-model="valueCategory" 
                            :options="optionsCategories">
                        </multiselect>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="11 mb-4">
                        <b-form-checkbox
                            id="checkbox-1"
                            name="checkbox-1"
                            value="accepted"
                            unchecked-value="not_accepted"
                            >
                            Mostrar todos los años
                        </b-form-checkbox>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';

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
                optionsCategories: []
            }
        },
        methods: {
            toggleSettingSidebar() {
                document.querySelector(".sidebar-filter").classList.toggle("collapsed");
            }
        },
        mounted() {
            this.loadAllTagsCategories().then(() => {
                this.optionsTags = this.tags;
                this.optionsCategories = this.categories;
            });
        }
    }
</script>

<style scoped>
    .setting-square {
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
        width: 50%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        min-height: 320px;
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
