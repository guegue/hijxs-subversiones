<template>
    <!--slider(3 images)-->
    <b-container class="p-0 m-0 position-relative" fluid id="testimonys">
        <b-carousel
                class="w-100"
                fade
                :interval="2500"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
                img-width="1024"
                img-height="480">
            <b-carousel-slide v-for="item in jsonImg" :key="item.name" :img-src="item.url" class="abc">
                <div class="testimony-square">
                    <i class="fas fa-share-alt fa-2x share-icon"></i>
                    <i class="fas fa-quote-right fa-4x fa-flip-horizontal up"></i>
                    <h1 class="p-1">{{item.name}}</h1>
                    <p class="p-2">{{item.description}}<i class="fas fa-quote-right fa-3x down"></i></p>
                    <h4 class="author">
                        <b-badge class="color-badge">{{item.author}}</b-badge>
                    </h4>
                    <h5 class="place-author">{{item.place}}</h5>
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
                        author: 'Fernando Hernandez',
                        place: 'Cusco, Peru',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim est ipsa nemo porro quas voluptatum! Blanditiis, explicabo, harum! Accusantium quas recusandae unde.'
                    },
                    {
                        name: 'Second Slide',
                        url: 'https://picsum.photos/1024/480/?image=12',
                        title: 'Nuestro Nosotros',
                        author: 'Roberto Hernandez',
                        place: 'Lima, Peru',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aspernatur assumenda deleniti dignissimos ex expedita explicabo fugiat fugit hic inventore magni necessitatibus nesciunt odio odit omnis placeat repellendus, suscipit totam.'
                    },
                    {
                        name: 'Third Slide',
                        url: 'https://picsum.photos/1024/480/?image=22',
                        title: 'Nuestro Nosotros',
                        author: 'Adalberto Garcia',
                        place: 'La Libertad, Peru',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium autem, ea enim, eveniet facilis harum illum incidunt libero modi nesciunt numquam omnis placeat quasi sapiente soluta sunt ut velit.'
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

<style>

    :root {
        --color-quotes: rgba(0, 0, 0, 0.3) !important;
        --left-position: 35px;
    }

    h1, h3, h4, h5, p {
        font-style: oblique;
    }

    #testimonys .carousel-caption {
        position: static;
        padding-top: 0;
        padding-bottom: 0;
    }

    .own-testimony-div {
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
        background-color: white;
    }

    .testimony-square h1, p {
        text-shadow: none;
    }

    .testimony-square h1 {
        position: absolute;
        top: 23%;
        left: 22%;
        z-index: 20;
        font-style: oblique;
        font-weight: 600;
    }

    .testimony-square p {
        position: absolute;
        top: 38%;
        left: var(--left-position);
        text-align: left;
        font-weight: 500;
    }

    .up {
        z-index: 19;
        position: absolute;
        top: 22%;
        left: 15%;
        color: var(--color-quotes);
    }

    .down {
        position: absolute;
        margin-top: 2px;
        color: var(--color-quotes);
    }

    .share-icon {
        position: absolute;
        top: 15px;
        right: 25px;
        z-index: 15;
    }

    .author {
        position: absolute;
        bottom: 10%;
        left: var(--left-position);
    }

    .badge {
        padding: 0.6em 0.6em;
        border-radius: 0;
        font-style: oblique;
    }

    .color-badge {
        background-color: #65B32E;
    }

    .place-author {
        position: absolute;
        bottom: 5%;
        margin-left: 5px;
        left: var(--left-position);
    }

</style>