<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    />
    <b-container fluid class="timeline-background">
      <!--vertical title-->
      <b-row>
        <b-col cols="1" class="sidebar-container timeline-background p-0">
          <div class="sidebar">
            <timeline-year-vertical :years-ordered="yearsOrdered" />
          </div>
        </b-col>
        <b-col cols="11" class="main-container">
          <timeline-top-bar />
          <div class="main">
            <!--<h1 class="title-vertical rotation-270 text-white">HIJXS DE PER&Uacute;</h1>-->

            <!--<TimelineYear/>-->
            <!--<TimelineHorizontal :itemsOrdered="itemsOrdered"/>-->
            <transition name="component-fade" mode="out-in">
              <component
                :is="componentName"
                :items-ordered="itemsOrdered"
              ></component>
            </transition>
            <!--<TimelineVertical :itemsOrdered="itemsOrdered"/>-->

            <!--<TimelineHorizontal :itemsOrdered="itemsOrdered"/>-->
          </div>
        </b-col>
      </b-row>
      <b-row> </b-row>
    </b-container>

    <sixth-section></sixth-section>

    <!--<TimelineSearchSidebar/>-->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SixthSection from '../components/SixthSection';
import TimelineTopBar from '../components/Timeline/TimelineTopBar';
import TimelineYear from '../components/Timeline/TimelineYear';
import TimelineYearVertical from '../components/Timeline/TimelineYearVertical';
import TimelineVertical from '../components/Timeline/TimelineVertical';
import TimelineHorizontal from '../components/Timeline/TimelineHorizontal';
import TimelineSearchSidebar from '../components/Timeline/TimelineSearchSidebar';
import timelineMixin from '../mixins/timelineMixin';

export default {
  name: 'Timeline',
  components: {
    TimelineTopBar,
    TimelineYear,
    TimelineYearVertical,
    TimelineVertical,
    TimelineHorizontal,
    TimelineSearchSidebar,
    SixthSection,
  },
  mixins: [timelineMixin],
  data() {
    return {
      // Línea de tiempo
      idSite: 12, // Rafael
      labelVocabulary: 'linea de tiempo',
      yearsOrdered: [],
      itemsOrdered: [],
      componentName: 'TimelineHorizontal',
    };
  },
  mounted() {
    this.isLoading = true;

    this.$store
      .dispatch('itemsLoad', {
        domainOmeka: this.$domainOmeka,
        idSite: this.idSite,
        labelVocabulary: this.labelVocabulary,
        filter: { searchValue: '', tagsCategories: '' },
      })
      .then(() => {
        this.getItems(this.itemsLoaded).then(() => {
          this.groupItemsByDate().then(() => {
            this.yearsOrdered = this.yearsUnique;
            this.itemsOrdered = this.itemsByDateArray;

            this.isLoading = false;
          });
        });
      });

    this.$root.$on('filterTimeline', (filter) => {
      this.isLoading = true;
      this.$store
        .dispatch('itemsLoad', {
          domainOmeka: this.$domainOmeka,
          idSite: this.idSite,
          labelVocabulary: this.labelVocabulary,
          filter,
        })
        .then(() => {
          this.getItems(this.itemsLoaded).then(() => {
            this.groupItemsByDate().then(() => {
              this.yearsOrdered = this.yearsUnique;
              this.itemsOrdered = this.itemsByDateArray;
              console.log(this.yearsOrdered);

              this.isLoading = false;
            });
          });
        });
    });

    this.$root.$on('changeViewTimeline', () => {
      this.timelineView = !this.timelineView;

      if (this.timelineView) {
        this.componentName = 'TimelineHorizontal';
      } else {
        this.componentName = 'TimelineVertical';
      }
    });
  },
  computed: {
    ...mapState(['itemsLoaded']),
  },
};
</script>

<style scoped>
.main-container {
  background-image: url('../assets/img/timeline-background.jpg'),
    linear-gradient(to bottom right, #152f4e 100%, transparent);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  height: 100%;
}

.main-container:before {
  position: absolute;
  background-image: linear-gradient(to top, #152f4e 5%, transparent);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  opacity: 1;
}

/*.main-container:before {
        position: absolute;content-map
        background: #152f4e;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 0.6;
    }*/

.main {
  margin-top: 200px;
}

.timeline-background {
  background: #15304f;
}

.sidebar-container {
  position: relative;
  z-index: 1;
  -webkit-box-shadow: 10px 0px 11px -10px rgba(0, 0, 0, 0.9);
  -moz-box-shadow: 10px 0px 11px -10px rgba(0, 0, 0, 0.9);
  box-shadow: 10px 0px 11px -10px rgba(0, 0, 0, 0.9);
}

.sidebar {
  top: 0;
  position: -webkit-sticky;
  position: sticky;
}

/*.container-timeline:before {
        height: 100vh;
        position: absolute;
        background-image: linear-gradient(to top, #152f4e 5%, transparent);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        opacity: 1;
    }*/

/* .container-timeline {
         height: 100vh;
         position: relative;
         !*background-image: url("https://wallup.net/wp-content/uploads/2015/12/234980-nature-landscape-water-rock-trees-forest-lake-mountain-pine_trees-hill-grass-valley.jpg"),
         linear-gradient(to bottom right, #152f4e 100%, transparent);*!
     }*/

/*.green-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #65B32E;
        height: 200px;
        width: 200px;
    }*/

.title-vertical {
  position: absolute;
  z-index: 7;
  top: 29.5%;
  left: -70px;
  letter-spacing: 1px;
  font-style: oblique;
  font-weight: 700;
}

/*.div-title {
        display: table-cell;
        position: absolute;
        top: 50%;
        left: calc(100% - 70%);
        color: #fff;
        width: 40%;
        height: 120px;
        border: 5px solid #fff;
        vertical-align: middle;
    }*/

/*a, a:hover {
        color: #fff;
        text-decoration: none;
    }*/

/*.main {
        width: 92%;
        height: auto;
        display: flex;
        flex-direction: column;
    }*/

/*.sidebar {
        border: 5px solid #222;
        background-color: white;
        border-radius: 10px;
        color: #222;
    }*/

/*.wrapper {
        background-color: #15304F;
        display: flex;
        justify-content: flex-end;
    }*/

/*body {
        padding: 3%;
        background-color: #ccc;
        font-size: 20px;
        box-sizing: border-box;
        font-family: Lato, sans-serif;
    }

    code,
    pre {
        background-color: #ccc;
        padding: 0 3px;
        border-radius: 5px;
    }

    .bottom {
        justify-self: bottom;
    }*/

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
