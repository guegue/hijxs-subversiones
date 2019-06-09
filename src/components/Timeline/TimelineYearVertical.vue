<template>
    <div class="list-year-container">
        <div class="ml-4">
            <div class="year-row year-row-up"><i class="fas fa-sort-up fa-lg"></i></div>
            <div class="list-year">
                <ol>
                    <li>1981</li>
                    <li>1982</li>
                    <li>1983</li>
                    <li>1984</li>
                    <li>1985</li>

                    <li>1981</li>
                    <li>1982</li>
                    <li>1983</li>
                    <li>1984</li>
                    <li>1985</li>
                </ol>
            </div>
            <div class="year-row year-row-down"><i class="fas fa-sort-down fa-lg"></i></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimelineYearVertical",
        mounted() {

        }
    }
</script>

<style scoped>

    .list-year-container {
        height: 100vh;
        width: 100%;
    }

    .list-year {
        position: absolute;
        top: 30%;
        overflow: hidden;
        height: 240px;
        padding: 0 25px 0 25px;
        left: 0;
    }

    .year-row {
        position: absolute;
        margin-left: 15px;
        color: white;
    }

    .year-row-up {
        top: 29%;
    }

    .year-row-down {
        top: 60%;
    }

    .year-row {
        cursor: pointer;
    }

    .list-year ol {
        list-style-type: none;
    }

    .list-year ol li {
        margin-top: 15px;
        color: white;
        font-size: 20px;
        transition: transform .2s;
    }

    .list-year ol li:hover {
        color: #65B32E;
        cursor: pointer;
        transform: scale(1.5);
        font-weight: bold;
    }
</style>