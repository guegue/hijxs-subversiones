<template>
    <div class="list-year-container">
        <div class="list-year">
            <dl>
                <dt></dt>
                <dd>1981</dd>
                <dt></dt>
                <dd>1982</dd>
                <dt></dt>
                <dd>1983</dd>
                <dt></dt>
                <dd>1984</dd>
                <dt></dt>
                <dd>1985</dd>
                <dt></dt>
                <dd>1986</dd>
                <dt></dt>
                <dd>1987</dd>
                <dt></dt>
                <dd>1988</dd>
                <dt></dt>
                <dd>1989</dd>
                <dt></dt>
                <dd>1990</dd>
            </dl>
        </div>
        <button class="year-row year-row-up" @click="upYear" ref="upYearButton"><i class="fas fa-sort-up fa-lg"></i>
        </button>
        <button class="year-row year-row-down" @click="downYear" ref="downYearButton"><i
                class="fas fa-sort-down fa-lg"></i></button>
    </div>
</template>

<script>
    export default {
        name: "TimelineYearVertical",
        data() {
            return {
                arrowPrev: null,
                arrowNext: null,
                xScrolling: 60,
                singDirection: null,
                counter: 0,

                listYear: null,
                listYearDl: null,

                firstYear: null
            }
        },
        methods: {
            loadYears() {

                this.listYear = document.querySelector('.list-year');
                this.listYearDl = document.querySelector('.list-year dl');

                this.firstYear = this.listYearDl.querySelector('dd:first-of-type');

                this.checkRowYears();
            },
            upYear() {
                this.singDirection = '-';

                this.animateTl();

                let lastYear = this.listYearDl.querySelector('dd:last-of-type');
                console.log(this.isYearInScrollView(this.listYear, lastYear, 0));
            },
            downYear() {
                this.singDirection = '';

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
                if (this.isYearInScrollView(this.listYear, this.firstYear, 1)) {
                    let yearDownRow = document.querySelector('.year-row-down');
                    yearDownRow.disabled = true;
                }
            }
        },
        mounted() {
            this.loadYears();
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
        color: white;
        font-size: 20px;
        transition: transform .1s;
    }

    .list-year dl dd:hover {
        color: #65B32E;
        cursor: pointer;
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

    dd {
        float: left;
        width: 50%;
        padding: 0;
        margin: 0;
    }

    dt::before {
        display: none;
        content: '';
        position: absolute;
        width: 60%;
        height: 2px;
        background: white;
        top: 50%;
    }

    .year-row {
        position: absolute;
        color: white;
        cursor: pointer;
    }

    .year-row:hover {
        color: #65B32E;
    }

    .year-row-up {
        border: none;
        background: none;
        margin-left: 38px;
        padding: 5px 10px 0 10px;
        top: 210px;
    }

    .year-row-down {
        border: none;
        background: none;
        margin-left: 38px;
        padding: 0 10px 5px 10px;
        top: 460px;
    }

</style>