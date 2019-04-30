<template>
    <div class="position-relative">

        <top-bar :flag="true"></top-bar>

        <social-networks></social-networks>

        <!--square floating-->
        <div class="blue-square"></div>

        <!--vertical title-->
        <h1 class="title-vertical rotation-270 text-white">HIJXS DEL PER&Uacute;</h1>

        <!--Button two arrows down-->
        <button type="button" class="position-absolute btn-arrows-down">
            <i class="fas fa-angle-double-down fa-2x"></i>
        </button>

        <!-- Vertical Line-->
        <div class="position-absolute vertical-line"></div>

        <!--slider(3 images)-->
        <b-container class="p-0 m-0" fluid>
            <b-carousel
                    class="w-100 h-100"
                    fade
                    :interval="2500"
                    img-width="1024"
                    img-height="480">
                <b-carousel-slide v-for="item in jsonImg" :key="item.idImg" :img-src="item['url']" class="no-border">
                    <div class="d-flex flex-row justify-content-end">
                        <div class="p-2">
                            <hr class="hr-opacity">
                        </div>
                        <div class="p-2">
                            <h3 class="text-right font-italic h3-opacity">Nuestro Nosotros</h3>
                        </div>
                    </div>
                    <p class="text-right p-description ">{{ item['title'] }}</p>
                </b-carousel-slide>
            </b-carousel>
        </b-container>
    </div>
</template>


<script>
    import TopBar from '../components/TopBar'
    import SocialNetworks from '../components/SocialNetwoks'

    export default {
        name: 'Slider',
        components: {
            TopBar,
            SocialNetworks
        },
        data: () => { 
            return {
                sliding: null,
                img:null,
                jsonImg:[]
                   /* {
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
                    } */
                 
            }
        },
         mounted: function () {
        this.loadImgSlider()
        },
        methods: {
            loadImgSlider () { // window.fetch(Vue.config.movues.ENDPOINT + movie) ${movie}
            return window.fetch(this.$domainOmeka+'api/items?item_set_id=422') //49
                .then(response => {
                return response.json()
                })
                .then(json => {
                //this.jsonImg = json
                json.forEach(element => {
                    /*if(element['dcterms:title']!=undefined)
                       console.log(element['dcterms:title'][0]['@value'])*/
                       this.getImg(element['o:media'][0]['@id'])
                   //console.log(element['o:media'][0]['@id'])
                });
                
                });

                
        },
        getImg (api) { // window.fetch(Vue.config.movues.ENDPOINT + movie) ${movie}
            return window.fetch(api)
                .then(response => {
                return response.json()
                })
                .then(json => {    
                  
               var propertyImg = {
                    'url': json['o:original_url'],
                    'title': json['dcterms:title'][0]['@value'],
                    'idImg': json['o:id']
                }
                if(json['o:media_type']!='application/pdf')
                   this.jsonImg.push(propertyImg)
                }); 
        }
  },

    }
</script>

<style>
    .h3-opacity {
        opacity: 0.7;
        font-size: 25px;
        letter-spacing: 4px;
    }

    .blue-square {
        position: absolute;
        z-index: 6;
        top: 50px;
        background-color: #152f4e;
        height: 200px;
        width: 200px;
    }

    .title-vertical {
        position: absolute;
        z-index: 7;
        top: 29.5%;
        left: -70px;
        letter-spacing: 1px;
        font-style: oblique;
        font-weight: 700;
    }

    .no-border {
        border: none;
    }

    .hr-opacity {
        border: 1px solid rgba(255, 255, 255, 0.5);
        width: 35px;
    }

    .p-description {
        /*font-size: 45px;*/
        font-size: 3em;
        font-style: oblique;
        padding-left: 10rem;
        font-weight: 900;
        text-align: right;
        letter-spacing: 2px;
    }

    .btn-arrows-down {
        z-index: 4;
        background-color: transparent;
        border: none;
        bottom: 10px;
        color: #fff;
        left: 170px;
        margin: 0;
        padding: 0;
    }

    .vertical-line {
        height: 100%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        z-index: 5;
        left: 120px;
    }

    .img-fluid{
        height: -webkit-fill-available !important;
    }

    @supports (-moz-appearance:none) {
        .vertical-line {
            height: 100%;
            border: 1px solid rgba(255, 255, 255, 0.5);
            z-index: 5;
            left: 130px;
        }
    }
</style>
