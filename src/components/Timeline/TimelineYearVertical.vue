<template>
    <div class="list-year-container">
        <div class="list-year">
            <dl>
                <template v-if="yearsUnique.length > 0" v-for="year in yearsUnique">
                    <dt><div class="year-line"></div></dt>
                    <dd><div class="year" @click="selectYear">{{ year }}</div></dd>
                </template>
            </dl>
        </div>
        <button class="year-row year-row-up" @click="upYear" ref="upYearButton"><i class="fas fa-sort-up fa-lg"></i>
        </button>
        <button class="year-row year-row-down" @click="downYear" ref="downYearButton"><i
                class="fas fa-sort-down fa-lg"></i></button>
    </div>
</template>

<script>
    import timelineMixin from '../../mixins/timelineMixin';

    export default {
        name: "TimelineYearVertical",
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                arrowPrev: null,
                arrowNext: null,
                xScrolling: 60,
                singDirection: null,
                counter: 0,

                listYear: null,
                listYearDl: null,

                firstYear: null,
                lastYear: null,
                yearDownRow: null,
                yearUpRow: null

            }
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

                this.checkRowYears();
            },
            downYear() {
                this.singDirection = '-';

                this.animateTl();

                this.checkRowYears();

            },
            animateTl() {
                if (this.counter === 0) {
                    this.listYearDl.style.transform = `translateY(${this.singDirection}${this.xScrolling}px)`;
                } else {
                    const tlStyle = getComputedStyle(this.listYearDl);
                    const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
                    const values = parseInt(tlTransform.split(",")[5]) + parseInt(`${this.singDirection}${this.xScrolling}`);
                    this.listYearDl.style.transform = `translateY(${values}px)`;
                }

                this.counter++;
            },
            isYearInScrollView(referenceElement, element, direction) {

                let top = 1, bottom = 0;

                let rectReferenceElement = referenceElement.getBoundingClientRect();
                let rectElement = element.getBoundingClientRect();

                if (direction === top) {
                    return (rectElement.top >= rectReferenceElement.top);
                } else if (direction === bottom) {
                    return (rectElement.bottom <= rectReferenceElement.bottom);
                }
            },
            checkRowYears() {
                this.yearUpRow.disabled = !!this.isYearInScrollView(this.listYear, this.firstYear, 1);

                this.yearDownRow.disabled = !!this.isYearInScrollView(this.listYear, this.lastYear, 0);
            },
            selectYear(event) {
                let years = document.querySelectorAll('.year');
                let lines = document.querySelectorAll('.year-line');
                let target = event.target;
                let dtYear = target.parentNode.previousSibling;
                let year;


                years.forEach((year) => {
                    year.classList.remove('selected-year')
                });

                lines.forEach((line) => {
                    line.classList.remove('selected-year-line');
                });

                dtYear.querySelector('div').classList.add('selected-year-line');

                target.classList.add('selected-year');

                year = target.textContent;

                this.$root.$emit('selectYear', year);
            }
        },
        mounted() {

            this.loadResourcesSitePages().then(() => {
                this.loadYears();
            });
        }
    }
</script>

<style scoped>

    .list-year-container {
        height: 100vh;
    }

    .list-year {
        position: absolute;
        top: 30%;
        overflow: hidden;
        height: 240px;
        left: 0;
    }

    .list-year dl dt, .list-year dl dd {
        margin-top: 15px;
        color: #9b9b9b;
        font-size: 20px;
        transition: transform .1s;
    }

    .list-year dl dd:hover {
        color: #65B32E;
        cursor: pointer;
        transform: scale(1.3);
        font-weight: bold;
    }

    .selected-year {
        color: #65B32E;
        transform: scale(1.3);
        font-weight: bold;
    }

    dt {
        position: relative;
        float: left;
        width: 33px;
        height: 30px;
        padding: 0;
        margin: 0
    }

    .selected-year-line {
        content: '';
        position: absolute;
        width: 45%;
        height: 2px;
        background: white;
        top: 50%;
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
        color: #65B32E;
    }

    .year-row-up {
        outline: none;
        border: none;
        background: none;
        margin-left: 38px;
        padding: 5px 10px 0 10px;
        top: 210px;
    }

    .year-row-down {
        outline: none;
        border: none;
        background: none;
        margin-left: 38px;
        padding: 0 10px 5px 10px;
        top: 460px;
    }

</style>