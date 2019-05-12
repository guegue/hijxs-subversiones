<template>
    <div class="list-item">
        <b-row>
            <b-col>
                <h4 class="titleItemTimeline">{{ item.title }} </h4>
                <time>{{ item.date }}</time>

                <div class="m-1">
                    {{ item.description | truncate}}
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div v-if="item.media.video.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver videos"><i class="fas fa-video"></i></b-button>
                </div>

                <div v-if="item.media.image.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver imágenes"><i class="fas fa-images"></i></b-button>
                </div>

                <div v-if="item.media.application.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Ver documentos"><i class="fas fa-file-alt"></i></b-button>
                </div>

                <div v-if="item.media.audio.length > 0" class="m-1 d-inline-block align-middle">
                    <b-button variant="success" v-b-tooltip.hover="" title="Escuchar audios"><i class="fas fa-file-audio"></i></b-button>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <a class="seeMore float-right" href="#">VER MÁS</a>
            </b-col>
        </b-row>
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
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>