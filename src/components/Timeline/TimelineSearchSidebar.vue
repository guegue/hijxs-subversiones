<template>
  <div>
    <!--search input timeline-->
    <div class="search-square pt-2" @click="toggleSearchSidebar">
      <div class="text-center text-white">
        <i class="fas fa-search fa-2x"></i>
      </div>
    </div>

    <div class="sidebar-search collapsed">
      <b-container>
        <b-row>
          <b-col class="mt-2">
            <b-input-group>
              <b-form-input
                ref="inputSearchTimeline"
                type="text"
                placeholder="Buscar"
                @keyup.esc="toggleSearchSidebar"
                @keyup.enter="search"
              ></b-form-input>

              <b-input-group-append>
                <b-button variant="outline-success" @click="search"
                  ><i class="fas fa-search" s></i>
                </b-button>
                <span
                  class="ml-3 mt-1 close-search"
                  @click="toggleSearchSidebar"
                  ><i class="fas fa-chevron-right fa-2x"></i
                ></span>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import timelineMixin from '../../mixins/timelineMixin';

export default {
  name: 'TimelineSearchSidebar',
  mixins: [timelineMixin],
  mounted() {
    this.search();
  },
  methods: {
    toggleSearchSidebar() {
      document.querySelector('.sidebar-search').classList.toggle('collapsed');
    },
    search() {
      const text = this.$refs.inputSearchTimeline.localValue;

      this.$root.$emit('search', text.replace(' ', '&'));
    },
  },
};
</script>

<style scoped>
.search-square {
  display: block;
  position: absolute;
  height: 50px;
  width: 70px;
  bottom: 90px;
  right: 0;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  background-color: #65b32e;
  border: none;
  -webkit-transition: width 1s; /* For Safari 3.1 to 6.0 */
  transition: width 1s;
  cursor: pointer;
}

.sidebar-search {
  height: 100%;
  overflow: auto;
}

.sidebar-search {
  position: absolute;
  right: 0;
  top: 81%;
  z-index: 1;
  background: white;
  width: 30%;
  -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  transition: width 0.35s;
  height: 7%;
  border-radius: 4px 0 0 4px;
}

.sidebar-search.collapsed {
  width: 0;
}

.close-search {
  cursor: pointer;
}
</style>
