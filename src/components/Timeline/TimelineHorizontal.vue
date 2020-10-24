<template>
  <div class="main-timeline">
    <b-row class="justify-content-md-center row-wrapper-timeline">
      <b-col cols="12" class="cols-wrapper-timeline">
        <transition-group class="timeline-h" name="fade" tag="div">
          <div
            v-for="(itemByYear, indexYear) in itemsOrdered"
            v-if="itemsOrdered.length > 0"
            :key="indexYear"
            class="items-year"
          >
            <div :id="itemByYear.year" class="year-item">
              {{ itemByYear.year }}
            </div>

            <div
              v-for="(month, indexMonth) in itemByYear.months"
              class="items-month"
            >
              <div v-for="(day, indexDay) in month.days" class="items-days">
                <div
                  v-for="(item, indexItem) in day.items"
                  :key="item.index"
                  class="items"
                >
                  <timeline-item-horizontal :item="item" :margin="2" />
                </div>
                <dl class="timeline-dl">
                  <dt class="line-item-h">
                    <div class="date-circle"></div>
                    <div class="day">{{ month.monthName }} {{ day.day }}</div>
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </transition-group>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col cols="4"> </b-col>
      <b-col cols="8" class="timeline-buttons">
        <div class="d-flex justify-content-end">
          <button
            class="button-timeline button-timeline-left"
            @click="prevButtonTimeline"
          >
            <i class="far fa-arrow-alt-circle-left"></i>
          </button>
          <button
            class="button-timeline button-timeline-rigth"
            @click="nextButtonTimeline"
          >
            <i class="far fa-arrow-alt-circle-right"></i>
          </button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TimelineItemHorizontal from './TimelineItemHorizontal';

export default {
  name: 'TimelineHorizontal',
  components: {
    TimelineItemHorizontal,
  },
  filters: {
    firstLetterUpperCase: (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  props: ['itemsOrdered'],
  data() {
    return {
      itemsShow: [],
      timelineWrapper: null,
      timelineH: null,
      firstItem: null,
      lastItem: null,
      previousToLastItem: null,
      xScrolling: 300,
      buttonTimelineRight: null,
      buttonTimelineLeft: null,
    };
  },
  updated() {
    this.loadItems();

    this.$root.$on('timelineYearSelected', (year) => {
      const yearElement = document.getElementById(year);

      yearElement.scrollIntoView({
        block: 'start',
        inline: 'start',
        behavior: 'smooth',
      });

      this.checkTimelineButtons();
    });
  },
  mounted() {
    if (this.itemsOrdered.length > 0) {
      this.loadItems();

      this.$root.$on('timelineYearSelected', (year) => {
        const yearElement = document.getElementById(year);

        yearElement.scrollIntoView({
          block: 'start',
          inline: 'start',
          behavior: 'smooth',
        });

        this.checkTimelineButtons();
      });
    }
  },
  methods: {
    async loadItems() {
      await this.$nextTick(() => {
        let itemsYears = null;
        let itemsMonth = null;
        let itemsDay = null;
        let items = null;
        let itemIterator = 0;
        let yearsItemsTimeline = null;
        let lastYearItemsTimeline = null;
        let timelineDl = null;
        let lastTimelineDl = null;
        let lastDt = null;

        this.timelineWrapper = document.querySelector('.cols-wrapper-timeline');
        this.timelineH = document.querySelector('.timeline-h');

        itemsYears = document.querySelectorAll('.items-year');
        for (const itemYear of itemsYears) {
          itemsMonth = itemYear.querySelectorAll('.items-month');

          for (const itemMonth of itemsMonth) {
            itemsDay = itemMonth.querySelectorAll('.items-days');

            for (const itemDay of itemsDay) {
              items = itemDay.querySelectorAll('.items');
              for (const item of items) {
                const listItem = item.querySelector('.list-item');

                if (items.length === 1) {
                  if (itemIterator % 2 !== 0) {
                    listItem.classList.remove('list-item-down-line');

                    listItem.classList.add('list-item-up');
                    listItem.classList.add('list-item-up-line');
                  } else {
                    listItem.classList.remove('list-item-up');
                    listItem.classList.remove('list-item-up-line');

                    listItem.classList.add('list-item-down-line');
                  }
                } else {
                  listItem.classList.add('list-item-line');
                  itemIterator = 1;
                }

                itemIterator++;
              }
            }
          }
        }

        this.buttonTimelineRight = document.querySelector(
          '.button-timeline-rigth'
        );
        this.buttonTimelineLeft = document.querySelector(
          '.button-timeline-left'
        );

        setTimeout(() => {
          this.checkScrollBarTimelineHorizontal();
        }, 500);

        this.swipeTimeline();

        /* Para extender la línea en caso que hayan uno o pocos ítems solo si el 'scroll' no existe */
        const hasHorizontalScrollbar =
          this.timelineWrapper.scrollWidth > this.timelineWrapper.clientWidth;
        let widthAllDtVisible = 0;
        let counterDt = 0;

        yearsItemsTimeline = document.querySelectorAll('.year-item');
        lastYearItemsTimeline =
          yearsItemsTimeline[yearsItemsTimeline.length - 1];

        timelineDl = document.querySelectorAll('.timeline-dl');
        lastTimelineDl = timelineDl[timelineDl.length - 1];
        lastDt = lastTimelineDl.querySelector('dt:last-of-type');
        timelineDl.forEach((timelineDl) => {
          counterDt++;
          widthAllDtVisible += timelineDl
            .querySelector('dt')
            .getBoundingClientRect().width;
        });

        if (!hasHorizontalScrollbar) {
          lastDt.classList.remove('line-item-h');

          if (counterDt > 1) {
            lastDt.style.width = `${
              this.timelineWrapper.clientWidth - widthAllDtVisible
            }px`;
          } else {
            lastDt.style.width = `${
              this.timelineWrapper.clientWidth -
              lastYearItemsTimeline.getBoundingClientRect().width -
              15
            }px`;
          }
        } else {
          timelineDl.forEach((timelineDl) => {
            timelineDl.querySelector('dt').classList.add('line-item-h');
          });
        }
      });
    },
    nextButtonTimeline() {
      this.timelineWrapper.scrollTo({
        top: window.scrollY,
        left: parseInt(this.timelineWrapper.scrollLeft + this.xScrolling),
        behavior: 'smooth',
      });

      this.checkTimelineButtons();
    },
    prevButtonTimeline() {
      this.timelineWrapper.scrollTo({
        top: window.scrollY,
        left: parseInt(this.timelineWrapper.scrollLeft - this.xScrolling),
        behavior: 'smooth',
      });

      this.checkTimelineButtons();
    },
    swipeTimeline() {
      this.$nextTick(() => {
        this.hammer = new this.$hammer(this.timelineH);

        this.hammer.on('panright', () => {
          this.buttonTimelineLeft.click();
        });

        this.hammer.on('panleft', () => {
          this.buttonTimelineRight.click();
        });
      });
    },
    checkTimelineButtons() {
      this.timelineWrapper.addEventListener('scroll', () => {
        this.checkScrollBarTimelineHorizontal();
      });
    },
    checkScrollBarTimelineHorizontal() {
      const { scrollLeft } = this.timelineWrapper;
      const { scrollWidth } = this.timelineWrapper;
      const { offsetWidth } = this.timelineWrapper;

      // Inicio del scroll
      if (scrollLeft === 0 || scrollLeft === 15) {
        this.buttonTimelineLeft.disabled = true;
        this.buttonTimelineLeft.classList.add('button-timeline-disabled');
      } else {
        this.buttonTimelineLeft.disabled = false;
        this.buttonTimelineLeft.classList.remove('button-timeline-disabled');
      }

      // Final del scroll
      if (scrollLeft >= scrollWidth - offsetWidth) {
        this.buttonTimelineRight.disabled = true;
        this.buttonTimelineRight.classList.add('button-timeline-disabled');
      } else {
        this.buttonTimelineRight.disabled = false;
        this.buttonTimelineRight.classList.remove('button-timeline-disabled');
      }
    },
  },
};
</script>

<style scoped>
.main-timeline {
  margin-left: 1%;
  margin-bottom: 5%;
  /*background: red;*/
}

.row-wrapper-timeline {
  width: 100%;
  height: 100%;
}

.cols-wrapper-timeline {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  /*background: green;*/
}

.timeline-h {
  display: flex;
  height: 450px;
  /*background: blue;*/
}

.items-year {
  width: auto !important;
  text-align: left;
  display: flex;
  white-space: nowrap;
  height: auto !important;
  align-items: flex-end;
}

.year-item {
  margin-bottom: 10px;
  width: 100px;
  text-align: center;
  background: #65b32e;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  font-size: 22px;
}

dl dt,
dl dd {
  display: inline-block;
  height: 3px;
  background: white;
  vertical-align: top;
  margin-top: 10px;
  margin-bottom: 7px;
  padding-left: 35px;
}

.line-item-h {
  width: 340px !important;
}

dl dt div.day {
  position: absolute;
  margin-left: -15px;
  margin-top: 10px;
  color: white;
  font-style: italic;
  text-transform: uppercase;
  font-size: 18px;
}

dl dt div.date-circle {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translateY(-40%);
  border-radius: 50%;
  background: white;
  margin-left: -20px;
  border-style: solid;
  border-color: #65b32e;
  border-width: 3px;
}

.timeline-dl {
  padding-top: 10px;
  height: 100%;
  transition: transform 0.2s ease;
  cursor: move;
}

.button-timeline {
  border: none;
  background: none;
  color: white;
  font-size: 45px;
  outline: none;
}

.button-timeline-disabled {
  color: #999999;
}

.button-timeline-disabled:hover {
  cursor: no-drop;
}

.button-timeline-rigth {
  margin-left: 15px;
}

.button-timeline:not(.button-timeline-disabled):hover {
  color: #65b32e;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
