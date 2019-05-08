<template>
    <div v-if="item !== null" class="list-item in-view">
        <h4 class="titleItemTimeline">{{ item.title }} </h4>
        <time>{{ item.date }}</time>
        {{ item.description | truncate}}
        <p class="seeMore">
            <a href="#">VER MÁS</a>
        </p>
    </div>
</template>

<script>
    export default {
        name: "TimelineItem",
        props: ['item'],

        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 120) + '...';
            }
        }
    }
</script>

<style scoped>

</style>