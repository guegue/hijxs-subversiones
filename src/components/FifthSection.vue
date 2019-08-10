<template>
    <!--slider(3 images)-->
    <b-container class="p-0 m-0 position-relative" fluid id="testimonys" v-if="hasTestimonios">

        <div class="square-under-text">
            <h3 class="text-testimoniales">TESTIM<span class="py-4">ONIAL</span>ES</h3>
        </div>
        <b-carousel
                class="w-100"
                fade
                controls
                :interval="2500"
                img-width="1024"
                img-height="480">
            <b-carousel-slide v-for="(item, index) in jsonImg" :key="index" :img-src="item.image" class="carousel-carousel">
                <div class="testimony-square">
                    <i class="fas fa-share-alt fa-2x share-icon"></i>
                    <i class="fas fa-quote-right fa-4x fa-flip-horizontal up"></i>

                    <a :href="item.slug" target="_blank">
                        <h1 class="p-1 title-testimony">{{item.name}}</h1>
                    </a>
                    <p class="p-2">{{item.description|descriptionShort(170)}}<i class="fas fa-quote-right fa-5x down"></i></p>
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

    import webSitesMixin from '../mixins/webSitesMixin';
    import infoPage from '../mixins/readInfoPageMixin';

    export default {
        mixins: [webSitesMixin, infoPage],
        name: "FifthSection",
        data: () => {
            return {
                slide: 0,
                sliding: null,
                ItemsTestimonios: [],
                jsonImg: [],
                hasTestimonios: false,
            }
        },
        created() { // Retorna colecciones o conjunto de items con clase Cita(quote) (id=80) (collection con img de sitio)
            this.getItemTypeClass(80).then(() => this.loadSites())
        },
        mounted() {
        },
        methods: {

            loadSites() { // Consulta cantidad de sitios creados

                let result = this.getSites(this.$idDefauldSite); //
                this.ItemsTestimonios = this.resourceClass;

                result.then(async (site) => {

                    //let size = site['o:item_pool'].item_set_id.length; // colecciones del sito
                    let sizeItemsTestimonios = this.ItemsTestimonios.length; //colecciones con clase quote

                    for (const property of site['o:navigation']) { // for (let i = 0; i < size; i++)
                        for (let j = 0; j < sizeItemsTestimonios; j++) {

                            if (property.type === 'url') {
                                if (this.ItemsTestimonios[j].id == property.data.url)
                                    this.getImgColection(this.ItemsTestimonios[j].url, this.formatStringToUrl(property.data.label));
                            } else if (property.type === 'page' && property.data.label === 'testimonios') // this.ItemsTestimonios[j].id == site['o:item_pool'].item_set_id[i] Sitio posee testimonios
                            {
                                const answer = await this.$axios(this.$domainOmeka + 'api/site_pages/' + property.data.id);
                                if (answer.data['o:block'] != null) {
                                    for (const detail of answer.data['o:block']) {

                                        if (detail['o:layout'] === 'itemShowCase' || detail['o:layout'] === 'itemWithMetadata')
                                            for (const data of detail['o:attachment'])// Recorrer los items relacionados a una página
                                                this.getImgColection(data['o:item']['@id'], this.formatStringToUrl(answer.data['o:title']), 'page');
                                    }
                                }
                            }
                        }
                    }
                });
            },
            getImgColection(api, slug, type) { // Obtener item (img)  de colection

                return window.fetch(api)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        let typeResource = type || 'url';
                        /* let long = json.length;
                         let indexRandonUrl = Math.floor((Math.random() * long) + 1) - 1;*/
                        let testimoniosContexto = typeResource === 'page' ? [json] : json;

                        testimoniosContexto.forEach((testimonio) => {
                            let propertySite = {};
                            propertySite.place = this.getPropertyValue(testimonio, 'provenance'); //'Cusco, Peru';
                            propertySite.slug  = slug;
                            propertySite.title = this.getPropertyValue(testimonio, 'title');
                            propertySite.name  =  this.getPropertyValue(testimonio, 'title');
                            propertySite.description = this.getPropertyValue(testimonio, 'description');
                            propertySite.author=this.getPropertyValue(testimonio, 'citedBy', 'bibo:');
                            //citedBy

                            let urlOwner = testimonio['o:owner']['@id'];

                            this.getImgSpecific(testimonio['o:media'][0]['@id'], urlOwner, propertySite);
                        })
                    });
            }
            ,
            getImgSpecific(url, urlOwner, propertySite) { // Imagen en representación del sitio
                return window.fetch(url, propertySite)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        propertySite.image = json['o:original_url'];
                       // this.getUser(urlOwner, propertySite);
                        this.jsonImg.push(propertySite);
                        this.hasTestimonios = true;

                    });
            },
            getUser(url, propertySite) {
                this.$axios(url + '?key_identity=NNoPGm40ilguo7Z5f4pgzwrozDVVdN91&key_credential=KKG0s2QEOUbJNOYzRrqP7xU2w9nWU1Si')
                    .then((response) => {
                        propertySite.author = response.data['o:name'];
                        this.jsonImg.push(propertySite);
                    })
            }
        }
    }
</script>

<style scoped>

    :root {
        --color-quotes: rgba(0, 0, 0, 0.3) !important;
        --left-position: 35px;
        --angle: -21deg;
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
        right: 125px;
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
        left: 15%;
        z-index: 20;
        font-style: oblique;
        font-weight: 600;
        color: #6c757d;
    }

    .testimony-square p {
        position: absolute;
        top: 38%;
        left: var(--left-position);
        /* text-align: left;*/
        font-weight: 500;
    }

    .up {
        z-index: 19;
        position: absolute;
        top: 22%;
        left: 3%;
        color: var(--color-quotes);
    }

    .down {
        position: absolute;
        margin-top: 2px;
        margin-left: 5px;
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
        /*left: var(--left-position);*/
        padding-left: 15%;
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
        margin-left: 15%;
        left: var(--left-position);
        padding-top: 5px;
    }

    .text-testimoniales {
        color: white;
        position: absolute;
        /*  bottom: 15px;*/
        left: 0;
        z-index: 29;
        font-weight: 600;
        letter-spacing: -1px;
    }

    .text-testimoniales span {
        color: #112816;
        background-color: #65B32E;
        height: 150px;
        width: 150px;
        font-style: italic;
    }

    .square-under-text {
        content: 'TESTIMONIALES';
        position: absolute;
        bottom: 2px;
        left: 158px;
        height: 70px;
        width: 81px;
        z-index: 28;
        -webkit-transform: skewX(var(--angle));
        -moz-transform: skewX(var(--angle));
        -ms-transform: skewX(var(--angle));
        -o-transform: skewX(var(--angle));
        transform: skewX(var(--angle));
    }

<<<<<<< HEAD
    @media screen and (max-width: 1208px) {
        .title-testimony {
            font-size: 2.3rem;
        }

        .fa-4x {
            font-size: 3rem !important;
        }

        .fa-5x {
            font-size: 3rem !important;
        }

        .down{
            display: flex;
        }
    }

    @media screen and (max-width: 1113px) {
        .title-testimony {
            font-size: 2.1rem;
        }
    }

    @media screen and (max-width: 983px) {
        .title-testimony {
            font-size: 1.9rem;
        }
    }
</style>
=======
    /* .carousel-control-prev, .carousel-control-next{margin-top: 47% !important;}
     .carousel-control-next-icon{margin-left: 40% !important;}*/

</style>
>>>>>>> master
