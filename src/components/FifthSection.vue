<template>
    <!--slider(3 images)-->
    <b-container class="p-0 m-0 position-relative" fluid>

        <b-carousel
                class="w-100 "
                style="text-shadow: 0 0 2px #000"
                fade
                controls
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
                img-width="1024"
                img-height="480">
            <b-carousel-slide v-for="item in jsonImg" :key="item.name" :img-src="item.url" class="abc">
                <div class="testimony-square">
                    <h1>{{item.title}}</h1>
                    <p>{{item.description}}</p>
                </div>
            </b-carousel-slide>
        </b-carousel>
    </b-container>
</template>

<script>
    export default {
        name: "FifthSection",
        data: () => {
            return {
                slide: 0,
                sliding: null,
                jsonImg: [
                    {
                        name: 'First slide',
                        url: 'https://picsum.photos/1024/480/?image=10',
                        title: 'Nuestro Nosotros',
                        description: 'Nuestra historia se inicia en medio de una historia de impunidad'
                    },
                    {
                        name: 'Second Slide',
                        url: 'https://picsum.photos/1024/480/?image=12',
                        title: 'Nuestro Nosotros',
                        description: 'sdfsdfs sdfsdfsd '
                    },
                    {
                        name: 'Third Slide',
                        url: 'https://picsum.photos/1024/480/?image=22',
                        title: 'Nuestro Nosotros',
                        description: 'Wiiiiiiii'
                    }
                ]
            }
        },
        methods: {
            onSlideStart(slide) {
                this.sliding = true
            },
            onSlideEnd(slide) {
                this.sliding = false
            }
        }
    }
</script>

<style scoped>


    .own-testimony-div{
        position: relative;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        bottom: 0 !important;
        top: 0 !important;
    }

    .testimony-square {
        height: 100%;
        position: absolute;
        z-index: 3;
        top: 0;
        right: 8%;
        width: 40%;
        color: #000;
        background-color: #fff;
    }


</style>