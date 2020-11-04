<template>
  <div>
    <span
      id="sidebar-filter-no-close"
      class="filter-square sidebar-filter-no-close text-white float-right"
      @click="toggleSettingSidebar"
    >
      <i id="filter-icon" class="fas fa-filter fa-lg"></i>
    </span>

    <div class="sidebar-filter collapsed">
      <b-container class="mb-3 mt-2">
        <b-row class="w-100">
          <b-col lg="11" md="11" sm="11">
            <b-container class="mt-lg-4 mt-md-3">
              <b-row class="w-100">
                <b-col lg="12" md="12" sm="12" class="mb-1">
                  <div class="search-container">
                    <input
                      ref="inputSearchTimeline"
                      class="search-input"
                      type="text"
                      placeholder="Buscar"
                      @keyup.enter="search"
                    />
                    <span class="search-icon" @click="search"
                      ><i class="fas fa-search"></i>
                    </span>
                  </div>
                </b-col>
                <b-col lg="12" md="12" sm="12" class="mt-2">
                  <label class="typo__label" for="">Búsqueda por tags</label>
                  <multiselect
                    v-model="valueTag"
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
                    :options="optionsTags"
                    @select="selectTag"
                    @remove="removeTag"
                  >
                  </multiselect>
                </b-col>
                <b-col lg="12" md="12" sm="12" class="mt-3">
                  <label class="typo__label" for=""
                    >Búsqueda por categorías</label
                  >
                  <multiselect
                    v-model="valueCategory"
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
                    :options="optionsCategories"
                    @select="selectCategory"
                    @remove="removeCategory"
                  >
                  </multiselect>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col lg="1" md="1" sm="1">
            <span class="sidebar-filter-close" @click="toggleSettingSidebar">
              <i class="fas fa-filter fa-lg"></i>
            </span>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import timelineMixin from '../../mixins/timelineMixin';

export default {
  name: 'TimelineSettingSidebar',
  mixins: [timelineMixin],
  data() {
    return {
      valueTag: null,
      valueCategory: null,
      optionsTags: [],
      optionsCategories: [],
      tagsCategoriesSelectedArray: [],
      tagsCategoriesSelectedLocal: '',
      querySearch: '',
      filter: {
        tagsCategories: '',
        searchValue: '',
      },
    };
  },
  mounted() {
    this.loadAllTagsCategories().then(() => {
      this.optionsTags = this.tags;
      this.optionsCategories = this.categories;
    });
  },
  updated() {
    document.addEventListener('click', (event) => {
      const sidebarFilter = document.querySelector('.sidebar-filter');
      const filterSquare = document.querySelector('.filter-square');

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
  methods: {
    toggleSettingSidebar() {
      document.querySelector('.sidebar-filter').classList.toggle('collapsed');

      document
        .querySelector('.sidebar-compare-timeline')
        .classList.add('collapsed');
    },
    selectTag(selectedOption) {
      this.tagsCategoriesSelectedArray.push(selectedOption.tag);

      this.tagsCategoriesParams();
    },
    removeTag(removeOption) {
      const index = this.tagsCategoriesSelectedArray.indexOf(removeOption.tag);

      if (index !== -1) {
        this.tagsCategoriesSelectedArray.splice(index, 1);
      }

      this.tagsCategoriesParams();
    },
    selectCategory(selectedOption) {
      this.tagsCategoriesSelectedArray.push(selectedOption.category);

      this.tagsCategoriesParams();
    },
    removeCategory(removeOption) {
      const index = this.tagsCategoriesSelectedArray.indexOf(
        removeOption.category
      );

      if (index !== -1) {
        this.tagsCategoriesSelectedArray.splice(index, 1);
      }

      this.tagsCategoriesParams();
    },
    tagsCategoriesParams() {
      if (this.tagsCategoriesSelectedArray.length === 0) {
        this.tagsCategoriesSelectedLocal = '';
      } else {
        this.tagsCategoriesSelectedLocal = this.tagsCategoriesSelectedArray;
      }

      this.querySearch = this.$refs.inputSearchTimeline.value;

      this.filter.searchValue = this.querySearch;
      this.filter.tagsCategories = this.tagsCategoriesSelectedLocal;

      this.$root.$emit('filterTimeline', this.filter);
    },
    search() {
      this.querySearch = this.$refs.inputSearchTimeline.value;

      this.filter.searchValue = this.querySearch;
      this.filter.tagsCategories = this.tagsCategoriesSelectedLocal;

      this.$root.$emit('filterTimeline', this.filter);
    },
  },
  computed: {
    ...mapState(['searchValue', 'tagsCategoriesSelected']),
  },
};
</script>

<style scoped>
.filter-square {
  padding: 5px 10px 5px 10px;
  right: 0;
  border-radius: 5px;

  background-color: #65b32e;
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
  transition: width 0.35s;
  min-height: 500px;
  border-radius: 4px 0 0 4px;
}

.sidebar-filter.collapsed {
  width: 0;
}

.sidebar-filter-close {
  cursor: pointer;
  color: #65b32e;
}

.search-input {
  color: #359be0;
  width: 85%;
  border: none;
  padding: 0 5px;
  border-bottom: 2px solid #359be0;
}

.search-input:focus,
.search-input:active {
  outline: none;
}

.search-input::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: #a5c8f1;
}

.search-input::-moz-placeholder {
  /* Firefox 19+ */
  color: #a5c8f1;
}

.search-input:-ms-input-placeholder {
  /* IE 10+ */
  color: #a5c8f1;
}

.search-input:-moz-placeholder {
  /* Firefox 18- */
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

.multiselect-custom
  .multiselect__option--selected.multiselect__option--highlight {
  background: #bbcde1;
}
</style>
