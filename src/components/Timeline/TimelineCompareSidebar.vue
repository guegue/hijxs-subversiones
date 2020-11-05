<template>
  <div>
    <span
      class="compare-square sidebar-compare-timeline-no-close text-white float-right"
      @click="toggleCompareSidebar"
      ><i class="fas fa-sliders-h fa-lg"></i
    ></span>

    <div class="sidebar-compare-timeline collapsed">
      <b-container class="mb-3">
        <b-row class="w-100">
          <b-col lg="11" md="11" sm="11">
            <b-container class="mt-lg-4 mt-md-3">
              <b-row class="w-100">
                <b-col lg="12" md="12" sm="12" class="mb-1">
                  <label class="typo__label" for="">Líneas de tiempo</label>
                  <multiselect
                    v-model="timelineTag"
                    class="multiselect-custom"
                    :multiple="true"
                    label="page_title"
                    track-by="page_id"
                    :searchable="true"
                    :allow-empty="true"
                    :taggable="true"
                    :close-on-select="false"
                    :max-height="170"
                    placeholder="Selecccione las líneas de tiempo"
                    tag-placeholder=""
                    :show-labels="false"
                    :options="timelines"
                    @select="selectTimeline"
                    @remove="removeTimeline"
                  >
                  </multiselect>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col lg="1" md="1" sm="1">
            <span
              class="float-right mt-1 mr-2 sidebar-compare-timeline-close"
              @click="toggleCompareSidebar"
              ><i class="fas fa-sliders-h fa-lg"></i>
            </span>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import timelineMixin from '../../mixins/timelineMixin';

export default {
  mixins: [timelineMixin],
  data() {
    return {
      timelineTag: null,
      timelines: [],
    };
  },
  mounted() {
    this.loadTimelinePages().then(() => {
      this.timelines = this.pagesWithTimeline;
    });
  },
  updated() {
    document.addEventListener('click', (event) => {
      const sidebarCompareTimeline = document.querySelector(
        '.sidebar-compare-timeline'
      );
      const compareSquare = document.querySelector('.compare-square');

      sidebarCompareTimeline.querySelectorAll('*').forEach((element) => {
        element.classList.add('sidebar-compare-timeline-no-close');
      });

      compareSquare.querySelectorAll('*').forEach((element) => {
        element.classList.add('sidebar-compare-timeline-no-close');
      });

      if (!sidebarCompareTimeline.classList.contains('collapsed')) {
        if (
          !event.target.classList.contains('sidebar-compare-timeline-no-close')
        ) {
          sidebarCompareTimeline.classList.add('collapsed');
        }
      }
    });
  },
  methods: {
    toggleCompareSidebar() {
      document
        .querySelector('.sidebar-compare-timeline')
        .classList.toggle('collapsed');
    },
    selectTimeline(selectedOption) {
      console.log(`Timeline selected: ${selectedOption.page_title}`);
    },
    removeTimeline(removeOption) {
      console.log(`Timeline removed: ${removeOption.page_title}`);
    },
  },
};
</script>

<style scoped>
.compare-square {
  padding: 5px 10px 5px 10px;
  right: 0;
  border-radius: 5px;

  background-color: #65b32e;
  border: none;
  cursor: pointer;
}

.sidebar-compare-timeline {
  overflow: hidden;
}

.sidebar-compare-timeline {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  background: white;
  width: 600px;
  -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
  transition: width 0.35s;
  min-height: 320px;
  border-radius: 4px 0 0 4px;
}

.sidebar-compare-timeline.collapsed {
  width: 0;
}

.sidebar-compare-timeline-close {
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
</style>
