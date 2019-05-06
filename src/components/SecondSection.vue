<template>
    <div>
        <b-container class="background-degraded" fluid>
            <!--horizontal line-->
            <b-row class="ml-5 pl-5">
                <b-col sm="12" md="12" lg="12">
                    <hr class="line-top-title">
                </b-col>
            </b-row>
            <!--Title Section-->
            <b-row class="ml-5 pl-5  text-white">
                <b-col sm="12" md="12" lg="12">
                    <h1 class="title-exhibition text-uppercase">Nuestras Exhibici&oacute;n</h1>
                </b-col>
            </b-row>

            <!--Slider Images-->
            <b-row>
                <b-col sm="12" md="12" lg="12">
                    <div id="slider">
                        <transition-group tag="div" :name="transitionName" class="slides-group"
                                          style="overflow: hidden">
                            <div v-if="show" :key="current" class="slide" :class="slides[current].className">

                                <a :href="card.slug" sm="3" md="3" lg="3" v-for="(card,index) in contentCards"
                                   :key="index"
                                   class="p-0 div-card opacity-img" target="_blank">
                                    <img :src="card.image" class="w-100 h-100" alt="">
                                    <h4 class="title-card">{{card.title}}</h4>
                                    <h6 class="rotation-270 place-date-card">{{card.place}} | {{card.date}}</h6>
                                    <i class="fas fa-share-alt fa-2x"
                                       :class="{'share-card-1':((index + 1) % 2 === 1),'share-card-2':((index + 1) % 2 === 0)}"></i>
                                </a>
                            </div>
                        </transition-group>
                        <div class="btn btn-prev" aria-label="Previous slide" @click="slide(-1)">
                            &#10094;
                        </div>
                        <div class="btn btn-next" aria-label="Next slide" @click="slide(1)">
                            &#10095;
                        </div>
                    </div>

                </b-col>
            </b-row>
            <!--<b-row class="justify-content-center">-->
            <!--<a :href="card.slug" sm="3" md="3" lg="3" v-for="(card,index) in contentCards" :key="index"-->
            <!--class="p-0 div-card opacity-img" target="_blank">-->
            <!--&lt;!&ndash; <a :href="'//google.com'" target="_blank"> &ndash;&gt;-->
            <!--<img :src="card.image" class="w-100 h-100" alt="">-->
            <!--<h4 class="title-card">{{card.title}}</h4>-->
            <!--<h6 class="rotation-270 place-date-card">{{card.place}} | {{card.date}}</h6>-->
            <!--<i class="fas fa-share-alt fa-2x"-->
            <!--:class="{'share-card-1':((index + 1) % 2 === 1),'share-card-2':((index + 1) % 2 === 0)}"></i>-->
            <!--&lt;!&ndash; </a> &ndash;&gt;-->
            <!--</a>-->

            <!--</b-row>-->
        </b-container>
    </div>

</template>

<script>
    export default {
        name: "SecondSection",
        data: () => {
            return {
                conjuntoItemId: [],
                contentCards: [],
                   /* {
                        title: 'Title',
                        image: 'http://news.princeton.edu/uploads/266/image/2012_b/peru/Peru_Spotlight_MI.jpg',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/02/2018',
                        place: 'Cusco, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://us.123rf.com/450wm/wollertz/wollertz1608/wollertz160800206/64723702-per%C3%BA-11-mayo-vista-a%C3%A9rea-de-las-monta%C3%B1as-de-per%C3%BA-de-un-avi%C3%B3n-que-vuela-de-lima-a-cuzco-11-de-mayo-de-2016-per%C3%BA-.jpg?ver=6',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/10/2020',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'http://coolspotters.com/files/photos/979071/llama-profile.jpg',
                        description: 'This card has supporting text below as a natural lead-in to additional content.',
                        date: '31/12/2000',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://st3.depositphotos.com/1022135/19317/i/450/depositphotos_193177768-stock-photo-detail-urubamba-river-peru.jpg',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
                        date: '10/03/2012',
                        place: 'Arequipa, Peru'
                    }
                ],*/
                current: 0,
                direction: 1,
                transitionName: "fade",
                show: false,
                slides: [
                    {className: "blue"},
                    {className: "red"}
                ]
            }
        },
        mounted: function () {
            this.getItemSetSite()
            this.loadSites()
            this.show = true;
        },
        methods: {
            slide(dir) {
                this.direction = dir;
                dir === 1
                    ? (this.transitionName = "slide-next")
                    : (this.transitionName = "slide-prev");
                var len = this.slides.length;
                this.current = (this.current + dir % len + len) % len;
                console.log(this.current);
            },
            getItemSetSite() { // Retorna colecciones o conjunto de items con clase InteractiveResource (id=27) (collection con img de sitio)
                return window.fetch(this.$domainOmeka + 'api/item_sets?resource_class_id=27')
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        json.forEach(element => {
                            var propertyCollection = {
                                'url': element['o:items']['@id'],
                                'id': element['o:id']
                            }
                            this.conjuntoItemId.push(propertyCollection)
                        });
                    });
            },
            loadSites() { // Consulta cantidad de sitios creados
                return window.fetch(this.$domainOmeka + 'api/sites')
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        json.forEach(element => {

                            var propertySite = {
                                'title': element['o:title'],
                                'date': element['o:created']['@value'].slice(0, 10),
                                'place': 'Perú',
                                'slug': this.$domainOmeka + 's/' + element['o:slug'],
                                'image': ''
                            }
                            let size = element['o:item_pool'].item_set_id.length; // colecciones del sito
                            let sizeItemsImgSite = this.conjuntoItemId.length; //colecciones con clase InteractiveResource

                            for (let i = 0; i < size; i++) {
                                for (let j = 0; j < sizeItemsImgSite; j++) {
                                    if (this.conjuntoItemId[j].id == element['o:item_pool'].item_set_id[i]) // Sitio posee coleccion (imagen representa al sitio)
                                    {
                                        this.getImgColection(this.conjuntoItemId[j].url, propertySite);
                                    }
                                }
                            }

                        });

                    });
            },
            getImgColection(api, propertySite) { // Obtener item (img)  de colection
                return window.fetch(api)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        let long = json.length;
                        let indexRandonUrl = Math.floor((Math.random() * long) + 1) - 1;
                        this.getImgSpecific(json[indexRandonUrl]['o:media'][0]['@id'], propertySite);
                    });
            }
            ,
            getImgSpecific(url, propertySite) { // Imagen en representacion del sitio
                return window.fetch(url, propertySite)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        propertySite.image = json['o:original_url'];
                        this.contentCards.push(propertySite)

                    });
            }
        }
    }
</script>

<style scoped>

    @import url("https://fonts.googleapis.com/css?family=Crimson+Text");

    /* FADE IN */
    .fade-enter-active {
        transition: opacity 1s;
    }

    .fade-enter {
        opacity: 0;
    }

    /* GO TO NEXT SLIDE */
    .slide-next-enter-active,
    .slide-next-leave-active {
        transition: transform 0.5s ease-in-out;
    }

    .slide-next-enter {
        transform: translate(100%);
    }

    .slide-next-leave-to {
        transform: translate(-100%);
    }

    /* GO TO PREVIOUS SLIDE */
    .slide-prev-enter-active,
    .slide-prev-leave-active {
        transition: transform 0.5s ease-in-out;
    }

    .slide-prev-enter {
        transform: translate(-100%);
    }

    .slide-prev-leave-to {
        transform: translate(100%);
    }

    /* SLIDES CLASSES */

    .blue {
        background: transparent;
    }

    .red {
        background: transparent;
    }

    .yellow {
        background: transparent;
    }

    #slider {
        width: 100%;
        height: 100vh;
        position: relative;
    }

    .slide {
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .btn {
        z-index: 10;
        cursor: pointer;
        border: 3px solid transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        position: absolute;
        top: calc(50% - 35px);
        left: -1%;
        transition: transform 0.3s ease-in-out;
        user-select: none;
        color: #fff;
    }

    .btn-next {
        left: auto;
        right: -1%;
    }

    .btn:hover {
        color: #fff;
        transform: scale(1.8);
    }

    /* * * * * * */
    .background-degraded {
        height: 660px;
        background-image: linear-gradient(to right, #152f4e, #65B32E);
    }

    .line-top-title {
        border: 2px solid #fff;
        width: 7%;
        margin-left: 0.4em;
    }

    .title-exhibition {
        font-style: oblique;
    }

    .div-card {
        cursor: pointer;
        height: 520px;
        width: 25% !important;
        min-width: 25% !important;
        max-width: 25% !important;
    }

    .div-card:hover {
        /*top: -10px !important;*/
        /*transform: scale(1.05);*/
    }

    .div-card:nth-child(1) {
        top: 40px;
        left: -40px;
        z-index: 4;
    }

    .div-card:nth-child(2) {
        left: -50px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 5;
    }

    .div-card:nth-child(3) {
        left: -30px;
        top: 60px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 6;
        height: 550px;
    }

    .div-card:nth-child(4) {
        left: -5px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 7;
    }

    .opacity-img {
        position: relative;
        object-fit: cover;
        opacity: 1;
        transition: all 0.5s;
        -webkit-transition: all 0.5s;
    }

    .opacity-img:after {
        object-fit: cover;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 1;
        transition: background 0.5s;
        -webkit-transition: background 0.5s;
    }

    .opacity-img:hover {
        z-index: 100;
        transition: z-index 1s;
        -webkit-transition: z-index 1s;
    }

    .opacity-img:hover:after {
        opacity: 0;
        background: rgba(0, 0, 0, 0);
    }

    .title-card {
        z-index: 10;
        position: absolute;
        top: 40px;
        left: 20px;
        color: #fff;
    }

    .place-date-card {
        z-index: 10;
        position: absolute;
        bottom: 160px;
        left: -80px;
        color: white !important;
        font-style: oblique;
        font-weight: 500;
        letter-spacing: 5px;
    }

</style>