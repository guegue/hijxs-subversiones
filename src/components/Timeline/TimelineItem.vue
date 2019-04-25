<template>
    <div v-if="item !== null" class="list-item">
        <h4 class="titleItemTimeline">{{ item['dcterms:title'][0]['@value'] }} </h4>
        <time>{{ item['dcterms:date'][0]['@value'] }}</time>
        {{ item['dcterms:description'][0]['@value'] | truncate}}
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
                return str.substr(0, 200) + '...';
            }
        }
    }
</script>

<style scoped>

</style>