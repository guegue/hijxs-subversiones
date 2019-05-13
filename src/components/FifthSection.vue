<template>
    <!--slider(3 images)-->
    <b-container class="p-0 m-0 position-relative" fluid id="testimonys">

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
            <b-carousel-slide v-for="item in jsonImg" :key="item.name" :img-src="item.image" class="abc">
                <div class="testimony-square">

                    <i class="fas fa-share-alt fa-2x share-icon"></i>
                    <i class="fas fa-quote-right fa-4x fa-flip-horizontal up"></i>

                    <a :href="item.slug" target="_blank">
                        <h1 class="p-1">{{item.name}}</h1>
                    </a>

                    <p class="p-2">{{item.description}}<i class="fas fa-quote-right fa-5x down"></i></p>
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
                ItemsTestimonios: [],
                jsonImg: []
                /*  {
                      name: 'First slide',
                      image: 'https://picsum.photos/1024/480/?image=10',
                      title: 'Nuestro Nosotros',
                      author: 'Fernando Hernandez',
                      place: 'Cusco, Peru',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim est ipsa nemo porro quas voluptatum! Blanditiis, explicabo, harum! Accusantium quas recusandae unde.'
                  },
                  {
                      name: 'Second Slide',
                      image: 'https://picsum.photos/1024/480/?image=12',
                      title: 'Nuestro Nosotros',
                      author: 'Roberto Hernandez',
                      place: 'Lima, Peru',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aspernatur assumenda deleniti dignissimos ex expedita explicabo fugiat fugit hic inventore magni necessitatibus nesciunt odio odit omnis placeat repellendus, suscipit totam.'
                  },
                  {
                      name: 'Third Slide',
                      image: 'https://picsum.photos/1024/480/?image=22',
                      title: 'Nuestro Nosotros',
                      author: 'Adalberto Garcia',
                      place: 'La Libertad, Peru',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium autem, ea enim, eveniet facilis harum illum incidunt libero modi nesciunt numquam omnis placeat quasi sapiente soluta sunt ut velit.'
                  }
              ]*/
            }
        },
        mounted() {
            this.getItemTypeQuote()
        },
        methods: {
            getItemTypeQuote() { // Retorna colecciones o conjunto de items con clase Cita(quote) (id=80) (collection con img de sitio)
                fetch(this.$domainOmeka + 'api/item_sets?resource_class_id=80')
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        json.forEach(element => {
                            var propertyCollection = {
                                'url': element['o:items']['@id'],
                                'id': element['o:id']
                            }
                            this.ItemsTestimonios.push(propertyCollection)
                        });
                        this.loadSites();
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
                                'title': '',
                                'name': '',
                                'place': 'Cusco, Peru',
                                'author': '',
                                'slug': this.$domainOmeka + 's/' + element['o:slug'] + '/page/testimonios',
                                'image': ''
                            }
                            let size = element['o:item_pool'].item_set_id.length; // colecciones del sito
                            let sizeItemsImgSite = this.ItemsTestimonios.length; //colecciones con clase quote

                            for (let i = 0; i < size; i++) {
                                for (let j = 0; j < sizeItemsImgSite; j++) {
                                    if (this.ItemsTestimonios[j].id == element['o:item_pool'].item_set_id[i]) // Sitio posee testimonio
                                    {
                                        this.getImgColection(this.ItemsTestimonios[j].url, propertySite);
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

                        propertySite.title = json[indexRandonUrl]['dcterms:title'][0]['@value'];
                        propertySite.name = json[indexRandonUrl]['dcterms:title'][0]['@value'];
                        propertySite.description = json[indexRandonUrl]['dcterms:description'][0]['@value'];

                        let urlOwner = json[indexRandonUrl]['o:owner']['@id'];

                        this.getImgSpecific(json[indexRandonUrl]['o:media'][0]['@id'], urlOwner, propertySite);

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
                        this.getUser(urlOwner, propertySite);

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
        left: 22%;
        z-index: 20;
        font-style: oblique;
        font-weight: 600;
        color: #6c757d;
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

    .text-testimoniales {
        color: white;
        position: absolute;
        bottom: 15px;
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
        bottom: 0;
        left: 158px;
        /*background: #65B32E;*/
        height: 70px;
        width: 81px;
        z-index: 28;
        -webkit-transform: skewX(var(--angle));
        -moz-transform: skewX(var(--angle));
        -ms-transform: skewX(var(--angle));
        -o-transform: skewX(var(--angle));
        transform: skewX(var(--angle));
    }
</style>