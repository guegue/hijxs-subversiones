<template>
  <div class="timeline-v">
    <div
      v-for="(itemByYear, index) in itemsOrdered"
      :key="index"
      class="items-year"
    >
      <div :id="itemByYear.year" class="year-item">
        {{ itemByYear.year }}
      </div>
      <ul v-for="month in itemByYear.months" class="items-month">
        <transition-group name="list">
          <li
            v-for="(day, index) in month.days"
            :key="index"
            class="items-days"
          >
            <label class="day">{{ month.monthName }} {{ day.day }}</label>
            <div v-for="item in day.items" :key="item.index" class="items">
              <timeline-item :key="index" :item="item" />
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>

<script>
import timelineMixin from '../../mixins/timelineMixin';

import TimelineItem from './TimelineItem';

export default {
  name: 'TimelineVertical',
  components: {
    TimelineItem,
  },
  mixins: [timelineMixin],
  props: ['itemsOrdered'],
  data() {
    return {};
  },
  updated() {
    this.initTimeline();
  },
  mounted() {
    this.initTimeline();

    this.$root.$on('timelineYearSelected', (year) => {
      const yearElement = document.getElementById(year);

      yearElement.scrollIntoView({
        block: 'start',
        inline: 'start',
        behavior: 'smooth',
      });
    });
  },
  methods: {
    initTimeline() {
      // Carga los items en la parte visual de la pantalla
      this.loadElementsViewPort();

      // Inicializa el efecto del scroll-swipe
      this.scroll();
    },
    scroll() {
      this.$nextTick(() => {
        window.addEventListener('scroll', () => {
          this.$nextTick(() => {
            this.loadElementsViewPort();
          });
        });
      });
    },
    loadElementsViewPort() {
      this.$nextTick(() => {
        const timelinesItem = document.querySelectorAll('.list-item-v');

        for (let i = 0; i < timelinesItem.length; i++) {
          if (i % 2 === 0) {
            timelinesItem[i].style.left = '10px';
            timelinesItem[i].classList.add('rightTranslate');
          } else {
            timelinesItem[i].style.left = '-325px';
            timelinesItem[i].classList.add('leftTranslate');
          }

          this.elementViewPort = timelinesItem[i];
          if (this.isElementInViewport()) {
            timelinesItem[i].classList.add('in-view');
          } else {
            timelinesItem[i].classList.remove('in-view');
          }
        }
      });
    },
  },
};
</script>

<style scoped>
/*------  TIMELINE  ------ */

.timeline-v {
  /*background: #15304F;*/
  /*overflow-y: hidden;*/
}

.timeline-v ul {
  /*background: #15304F;*/
  /*padding-top: 33px;*/
  /*padding-bottom: 20px;*/
  margin: 0;
  /*cursor: all-scroll;*/
}

.timeline-v ul li {
  list-style-type: none;
  position: relative;
  width: 3px;
  margin: 0 auto;
  padding-top: 70px;
  background: #fff;
  padding-bottom: 30px;
  -webkit-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
}

.year-item {
  position: relative;
  width: 100px;
  left: 47%;
  text-align: center;
  background: #65b32e;
  color: white;
  font-weight: bold;
  font-size: 22px;
  border-radius: 5px;
}

.day {
  color: white;
  position: absolute;
  right: 13px;
  top: 20px;
  width: 75px;
  text-align: center;
  font-style: italic;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 2px 1px 3px #000000;
}

.day::after {
  content: '';
  position: absolute;
  left: 116%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border-style: solid;
  border-color: #65b32e;
  border-width: 3px;
  -webkit-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0 0 8px -1px rgba(0, 0, 0, 0.75);
}

/*Items*/
.list-item::after {
  transition: background 0.4s ease-in-out;
}

.in-view::after {
  background: white;
}

.list-item {
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s ease-in-out;
}

.rightTranslate {
  transform: translate3d(80px, 0, 0);
}

.leftTranslate {
  transform: translate3d(-80px, 0, 0);
}

/*Effect*/
.in-view {
  transform: none;
  visibility: visible;
  opacity: 1;
}
</style>
