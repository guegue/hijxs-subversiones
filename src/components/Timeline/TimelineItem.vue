<template>
    <div v-if="item !== null" class="list-item">
        <time>{{ item['dcterms:date'][0]['@value'] }}</time>
        {{ item['dcterms:description'][0]['@value'] }}
    </div>
</template>

<script>
    export default {
        props: ['item'],
        name: "TimelineItem"
    }
</script>

<style scoped>

</style>