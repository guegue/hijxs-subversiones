<template>
    <div id="down-section">
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

                                <a :href="card.slug" sm="3" md="3" lg="3" v-for="(card,index) in sitesBySlider"
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
                sitesBySlider: [],
                cantSites: null,
                current: 0,
                indexSlider: 0,
                direction: 1,
                transitionName: "fade",
                show: false,
                slides: [
                    {className: "blue"},
                    {className: "red"}
                ]
            }
        },
        watch: {
            // whenever contentCards changes, this function will run
            contentCards: function (newvalue, oldValue) {
                if (this.contentCards.length === this.cantSites)
                {
                    this.SetSitesSlider();
                }

            }
        },
        updated() {
        },
        created() {
            this.getItemSetSite();
        },
        mounted: function () {
            this.show = true;
        },
        methods: {
            SetSitesSlider() {

                let cantidadpagSlider = Math.ceil(this.cantSites / 4);
                let positionSlider = (this.indexSlider / 4 + 1); //1,2,3
                let maxIndex = null;

                this.sitesBySlider = [];

                if (positionSlider <= cantidadpagSlider) //Puede hacer click a la derecha, existe pag en el slider
                {
                    if (this.indexSlider + 3 > this.cantSites - 1)//Validar si el array posee el indice this.indexSlider+3
                    {
                        maxIndex = (this.cantSites - 1);
                    } else
                        maxIndex = this.indexSlider + 3;
                    try {

                        for (let i = this.indexSlider; i <= maxIndex; i++) {
                            let objSite = {};
                            objSite.title = this.contentCards[i].title;
                            objSite.date = this.contentCards[i].date;
                            objSite.place = this.contentCards[i].place;
                            objSite.slug = this.contentCards[i].slug;
                            objSite.image = this.contentCards[i].image;

                            this.sitesBySlider.push(objSite);
                        }

                        }
                    catch(err) {
                        // eslint-disable-next-line no-console
                          console.log('Error::'+ err);
                    }

                }
            },
            slide(dir) {
                dir === 1
                    ? (this.transitionName = "slide-next")
                    : (this.transitionName = "slide-prev");
                var len = this.slides.length;
                this.current = (this.current + dir % len + len) % len;

                if (dir === 1)
                    (this.indexSlider + 4 >= this.cantSites) ? (this.indexSlider = 0, this.SetSitesSlider()) : (this.indexSlider += 4, this.SetSitesSlider())
                else
                    (this.indexSlider - 4 < 0) ? (this.indexSlider = Math.ceil(this.cantSites / 4) * 4 - 4, this.SetSitesSlider()) : (this.indexSlider -= 4, this.SetSitesSlider())

            },
            getItemSetSite() { // Retorna colecciones o conjunto de items con clase InteractiveResource (id=27) (collection con img de sitio)

                fetch(this.$domainOmeka + 'api/item_sets?resource_class_id=27')
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
                        this.loadSites()
                    });
            },
            loadSites() { // Consulta cantidad de sitios creados
                window.fetch(this.$domainOmeka + 'api/sites')
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                            this.$nextTick(() => {
                                this.searchColectionBySite(json)
                            });
                        }
                    )
            },
            searchColectionBySite(json) {

                let sizeItemsImgSite = this.conjuntoItemId.length; //colecciones con clase InteractiveResource
                let arrayInfoSide = [];

                json.forEach((element, index) => {

                    var propertySite = {
                        'title': element['o:title'],
                        'date': this.$moment(element['o:created']['@value'].slice(0, 10)).format("DD-MM-YYYY"),
                        'place': 'Perú',
                        'slug': this.$domainOmeka + 's/' + element['o:slug'],
                        'image': ''
                    }

                    let size = element['o:item_pool'].item_set_id.length; // Colecciones del sito

                    for (let i = 0; i < size; i++) {
                        for (let j = 0; j < sizeItemsImgSite; j++) {
                            if (this.conjuntoItemId[j].id == element['o:item_pool'].item_set_id[i]) // Sitio posee coleccion (imagen representativa del sitio)
                            {
                                propertySite.url = this.conjuntoItemId[j].url;
                                arrayInfoSide.push(propertySite);
                            }
                        }
                    }
                });
                this.getImgColection(arrayInfoSide).then(() => {
                    }//this.SetSitesSlider()
                );
            },
            getImgColection(propertySite) { // Obtener item (img)  de colection

                return new Promise((resolved, reject) => {
                    let numSite = propertySite.length;
                    propertySite.forEach((element, indice) => {

                        let objSite = {};
                        window.fetch(element.url)
                            .then(response => {
                                return response.json()
                            })
                            .then(json => this.getImgSpecific(json[(Math.floor((Math.random() * json.length) + 1) - 1)]['o:media'][0]['@id'])
                            ).then(async (urlImg) => {
                            objSite.title = element.title;
                            objSite.date = element.date;
                            objSite.place = element.place;
                            objSite.slug = element.slug;
                            objSite.image = urlImg;

                            //  this.$nextTick(function () {
                            this.$set(this.contentCards, indice, objSite);
                            // this.contentCards.push(objSite);
                            if (numSite === indice + 1) {
                                this.cantSites = numSite;
                                resolved();
                            }
                            //  });
                        });
                    });
                });
            },
            getImgSpecific(url) { // Imagen en representación del sitio
                return new Promise((resolved, reject) => {
                    window.fetch(url)
                        .then(response => {
                            return response.json()
                        })
                        .then(json => {
                            resolved(json['o:original_url']);
                        });
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
        margin-bottom: 125px;
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
        top: 40px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 6;
        /* height: 550px;*/
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
