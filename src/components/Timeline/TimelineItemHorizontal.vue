<template>
    <div class="list-item in-view" :id="'item-' + item.id">
        <span class="item-title" @click="openModalItemDetail(item.id)">{{ item.title }}</span>

        <b-row class="mt-1" v-if="item.image !== null">
            <b-col @click="openModalItemDetail(item.id)">
                <b-img class="item-image" :src="item.image" rounded alt="Rounded image"></b-img>
            </b-col>
            <b-col cols="8" class="item-summary-col" @click="openModalItemDetail(item.id)">
                <div class="item-summary">
                    <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary |
                    truncate}}
                </div>

                <div class="categories-wrapper">
                        <span v-b-tooltip.hover :title="category.nameCategory" v-for="category in item.categories"
                              :class="['category-pill', category.classcolor]"></span>
                </div>
            </b-col>
        </b-row>

        <div class="item-summary" v-if="item.image === null" @click="openModalItemDetail(item.id)">
            <span class="item-date">{{ item.date | moment('DD-MM-YYYY')}}</span> {{ item.summary | truncate}}
        </div>
        <div v-if="item.image === null" class="categories-wrapper">
                        <span v-b-tooltip.hover :title="category.nameCategory" v-for="category in item.categories"
                              :class="['category-pill', category.classcolor]"></span>
        </div>

        <ModalItemDetail ref="modalItemDetail"/>

    </div>
</template>

<script>
    import ModalItemDetail from "../ModalItemDetail";

    export default {
        name: "TimelineItem",
        components: {
            ModalItemDetail
        },
        props: ['item', 'margin'],
        data() {
            return {}
        },
        filters: {
            truncate(str) {
                if (!str) return '';
                return str.substr(0, 40) + '...';
            }
        },
        methods: {
            openModalItemDetail(idItem, selectedRelated) {
                this.$refs.modalItemDetail.showModalItemDetail(idItem, selectedRelated);
            }
        },
        mounted() {

        }
    }
</script>

<style src="../../../src/assets/css/categories.css"></style>

<style scoped>

    .list-item {
        cursor: pointer;
        position: relative;
        width: 300px;
        padding: 6px 10px;
        margin-bottom: 20px;
        margin-left: 8px;
        color: #152f4e;
        background: white;
        border-radius: 7px;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        border-left: solid white;
        border-left-width: 8px;
        transition: z-index;
        /* overflow: hidden; */
        white-space: normal;
        z-index: 1;
    }

    .list-item:hover .item-title {
        color: #65B32E;
    }

    .list-item-up-line::before {
        content: '';
        width: 0;
        height: 150px;
        display: block;
        position: absolute;
        border: 1px dashed white;
        left: 8px;
        bottom: -150px;
    }

    .list-item-down-line::before {
        content: '';
        width: 0;
        height: 30px;
        display: block;
        position: absolute;
        border: 1px dashed white;
        left: 8px;
        bottom: -30px;
    }

    .list-item-line::before {
        content: '';
        width: 0;
        height: 30px;
        display: block;
        position: absolute;
        border: 1px dashed white;
        left: 8px;
        bottom: -30px;
    }

    .timeline-dl dd:nth-of-type(even) .list-item::before {
        content: '';
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        border: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 6%;
        border-top: 10px solid white;
        bottom: -10px;
    }

    /* .timeline-dl dd:nth-of-type(odd) .list-item {
        background: green;
    } */

    .list-item-up {
        top: -120px;
    }

    .list-item-width {
        width: 450px !important;
    }

    .item-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
        overflow: hidden;

        color: #152f4e;
        font-weight: bold;
        font-size: 0.8rem;
    }

    .item-summary-col {
        padding-left: 0 !important;
    }

    .item-summary {
        font-size: 0.7rem;
        line-height: 1.4;
    }

    .item-summary-selected {
        font-size: 0.8rem;
    }

    .item-date {
        color: #65B32E;
    }

    .item-image {
        width: 100%;
    }
</style>
