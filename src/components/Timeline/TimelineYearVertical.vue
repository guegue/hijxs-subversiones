<template>
  <div class="list-year-container">
    <div class="list-year">
      <dl class="list-year-dl">
        <template v-for="year in yearsOrdered" v-if="yearsOrdered.length > 0">
          <dt>
            <div :id="'year-line' + year" class="year-line"></div>
          </dt>
          <dd>
            <div :id="'year' + year" class="year" @click="selectYear(year)">
              {{ year }}
            </div>
          </dd>
        </template>
      </dl>
    </div>
    <button ref="upYearButton" class="year-row year-row-up" @click="upYear">
      <i class="fas fa-sort-up fa-lg"></i>
    </button>
    <button
      ref="downYearButton"
      class="year-row year-row-down"
      @click="downYear"
    >
      <i class="fas fa-sort-down fa-lg"></i>
    </button>
  </div>
</template>

<script>
import timelineMixin from '../../mixins/timelineMixin';

export default {
  name: 'TimelineYearVertical',
  mixins: [timelineMixin],
  props: ['yearsOrdered'],
  data() {
    return {
      arrowPrev: null,
      arrowNext: null,
      xScrolling: 40,
      singDirection: null,
      counter: 0,

      listYear: null,
      listYearDl: null,

      firstYear: null,
      lastYear: null,
      yearDownRow: null,
      yearUpRow: null,
    };
  },
  updated() {
    this.loadYears();

    this.$root.$on('filters', () => {
      /* this.loadAllYears(this.itemsSetUrl).then(() => {
                    this.loadYears();

                    this.$nextTick(() => {
                        document.querySelectorAll('.year')[1].click();
                    })

                }); */
    });
  },
  methods: {
    loadYears() {
      this.$nextTick(() => {
        this.listYear = document.querySelector('.list-year');
        this.listYearDl = document.querySelector('.list-year dl');

        this.firstYear = this.listYearDl.querySelector('dd:first-of-type');
        this.lastYear = this.listYearDl.querySelector('dd:last-of-type');

        this.yearDownRow = document.querySelector('.year-row-down');
        this.yearUpRow = document.querySelector('.year-row-up');

        this.checkRowYears();
      });
    },
    upYear() {
      this.singDirection = '';

      this.animateTl();
    },
    downYear() {
      this.singDirection = '-';

      this.animateTl();
    },
    animateTl() {
      if (this.counter === 0) {
        this.listYearDl.style.transform = `translateY(${this.singDirection}${this.xScrolling}px)`;
      } else {
        const tlStyle = getComputedStyle(this.listYearDl);
        const tlTransform =
          tlStyle.getPropertyValue('-webkit-transform') ||
          tlStyle.getPropertyValue('transform');
        const values =
          parseInt(tlTransform.split(',')[5]) +
          parseInt(`${this.singDirection}${this.xScrolling}`);
        this.listYearDl.style.transform = `translateY(${values}px)`;
      }

      this.counter++;

      this.yearUpRow.disabled = true;
      this.yearDownRow.disabled = true;

      this.listYearDl.addEventListener('transitionend', (event) => {
        this.yearUpRow.disabled = true;
        this.yearDownRow.disabled = true;

        this.checkRowYears();
      });
    },
    isYearInScrollView(referenceElement, element, direction) {
      const top = 1;
      const bottom = 0;

      const rectReferenceElement = referenceElement.getBoundingClientRect();
      const rectElement = element.getBoundingClientRect();

      if (direction === top) {
        return rectElement.top >= rectReferenceElement.top;
      }
      if (direction === bottom) {
        return rectElement.bottom <= rectReferenceElement.bottom;
      }
    },
    checkRowYears() {
      this.yearUpRow.disabled = !!this.isYearInScrollView(
        this.listYear,
        this.firstYear,
        1
      );

      this.yearDownRow.disabled = !!this.isYearInScrollView(
        this.listYear,
        this.lastYear,
        0
      );
    },
    selectYear(year) {
      const years = document.querySelectorAll('.year');
      const lines = document.querySelectorAll('.year-line');

      years.forEach((year) => {
        year.classList.remove('selected-year');
      });

      lines.forEach((line) => {
        line.classList.remove('selected-year-line');
      });

      document
        .getElementById(`year-line${year}`)
        .classList.add('selected-year-line');

      document.getElementById(`year${year}`).classList.add('selected-year');

      this.$root.$emit('timelineYearSelected', year);
    },
  },
};
</script>

<style scoped>
.list-year-container {
  height: 100vh;
}

.list-year {
  position: absolute;
  top: 30%;
  overflow: hidden;
  height: 35%;
  left: 0;
}

.list-year-dl {
  transition: transform 0.2s ease;
}

.list-year dl dt,
.list-year dl dd {
  margin-top: 12%;
  color: #9b9b9b;
  font-size: 20px;
  transition: transform 0.1s;
}

.list-year dl dd:hover {
  color: #65b32e;
  cursor: pointer;
  transform: scale(1.3);
  font-weight: bold;
}

.selected-year {
  color: #65b32e;
  transform: scale(1.3);
  font-weight: bold;
}

.selected-year-line {
  content: '';
  position: absolute;
  width: 45%;
  height: 2px;
  background: white;
  top: 50%;
}

dt {
  position: relative;
  float: left;
  width: 33px;
  height: 30px;
  padding: 0;
  margin: 0;
}

dd {
  float: left;
  width: 50%;
  padding: 0;
  margin: 0;
}

.year-row {
  position: absolute;
  color: #9b9b9b;
  cursor: pointer;
}

.year-row:hover {
  color: #65b32e;
}

.year-row-up {
  outline: none;
  border: none;
  background: none;
  margin-left: 38px;
  padding: 5px 10px 0 10px;
  top: 27%;
}

.year-row-down {
  outline: none;
  border: none;
  background: none;
  margin-left: 38px;
  padding: 0 10px 5px 10px;
  top: 65%;
}
</style>
