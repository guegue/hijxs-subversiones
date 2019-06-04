<template>
    <b-container fluid id="content-testimonios">
        <div id="sub-content-test" class="justify-content-center">
            <b-row class="mt-4">
                <div class="" style="width:45%; margin-left:3%;">
                    <button type="button" class="btn btn-lg btn-style btn-color">
                      <span style="color:#65b32e !important;  stroke: white; stroke-width: 40;" class="fa fa-filter">
                      </span> FILTRAR
                    </button>
                </div>
                <div class="" style="width:45%; margin-left:3%;">
                    <div class="input-group h-100">
                        <input type="text" class="form-control h-100" v-model="search" v-on:keyup.enter="searchByInput()" placeholder="Search this">
                        <div class="input-group-append">
                            <button class="btn btn-color text-white pr-4 pl-4" style="font-size: 1.9em !important;"
                                    type="button" @click="searchByInput()">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </b-row>

            <b-row class="justify-content-center">
            <div class="alert alert-info alert-dismissible fade show mt-5 w-50 text-center" role="alert">
                <strong>Aviso!</strong> No se ha encontrado ningun resultado.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            </b-row>

            <b-row class="justify-content-center">

                <div v-for="(testimonio,index) in sectionTestimonios" :key="index" class="card mt-5"
                     style="width:45%; margin-right:3%; height: 440px;">
                    <div class="card-body mt-4">
                        <h5 class="card-title">{{testimonio.title}}</h5>
                        <h6 class="card-subtitle color-green mb-2">{{testimonio.subTitle}}</h6>
                        <p class="card-text-test">
                            {{testimonio.contenido|descriptionShort}}
                            <a href="#" key="idcard-content" class="color-green id-card-content" style="white-space: nowrap" target="_blank">
                                VER MÁS
                            </a>
                        </p>
                        <div class="mt-4">
                            <span class="btn-circle-card mt-1">
                                    <img class="img-card" width="60px" height="60px"
                                         :src="testimonio.urlImg">
                            </span>
                            <div class="autor" style="padding-top: 60px;">
                                Alejandro Cortez
                            </div>
                            <div class="autor">
                                {{testimonio.procedencia}}
                            </div>
                        </div>

                    </div>
                </div>
            </b-row>
        </div>
        <div style="height: 50px;"> </div>

        <b-row class="justify-content-center pb-5">
            <button  :disabled='!btnShowMore' v-show="btnShowMore" type="button" class="btn btn-lg btn-style btn-color" @click="testimoniosShowBySix(6)">
                       VER MÁS
            </button>
        </b-row>
    </b-container>

</template>

<script>

    export default {
        name: 'ThirdSection',
        data: () => {
            return {
                resourceClass: [],
                testimonios: [],
                sectionTestimonios: [],
                showTestimonios: null,
                btnShowMore:false,
                cantidadTestimonios:0,
                search:null,
                auxTestimonios:[]

            }
        },
        created() {
            this.getClassCita();
            /* this.example().then(() => {
                 console.log('done');
             })*/
        },
        mounted: function () {
            this.$loading('sub-content-test');
        },

        methods: {
            getClassCita() { // Testimonios Clase (80)
                this.$axios(this.$domainOmeka + 'api/item_sets?site_id=13&&resource_class_id=80') //site_id=13 site Contexto
                    .then((classTestimonio) => this.getTestimonios(classTestimonio))
                    .then(() => {
                        this.$nextTick(() => {

                        });
                    })
            },
            getTestimonios(classTestimonio) {

                if (parseInt(classTestimonio.data.length) > 0) {

                    this.$axios(classTestimonio.data[0]['o:items']['@id'])
                        .then((itemsTestimonio) => this.recorrerTestimonios(itemsTestimonio))
                        .then(() => {this.testimoniosShowBySix(2); this.$removeLoading('sub-content-test'); })
                }
            },
            async recorrerTestimonios(itemsTestimonio){


                if (parseInt(itemsTestimonio.data.length) > 0) {
                    for (const [index,testimonio] of itemsTestimonio.data.entries()) {
                        var propertyTestimonio = {};

                        propertyTestimonio.title = testimonio['dcterms:title'][0]['@value'];

                        propertyTestimonio.subTitle = (typeof testimonio['dcterms:alternative'] !== 'undefined') ?
                            testimonio['dcterms:alternative'][0]['@value'] :
                            '';
                        propertyTestimonio.contenido = testimonio['dcterms:description'][0]['@value'];
                        propertyTestimonio.procedencia = (typeof testimonio['dcterms:provenance'] !== 'undefined') ?
                            testimonio['dcterms:provenance'][0]['@value'] :
                            '';

                        await this.$axios(testimonio['o:media'][0]['@id'])
                            .then((img) => {
                                propertyTestimonio.urlImg = img.data['o:thumbnail_urls'].medium;
                            })

                        this.testimonios.push(propertyTestimonio);

                        this.cantidadTestimonios=index+1;
                    }

                    if(this.cantidadTestimonios>2)
                        this.btnShowMore=true;
                }
            },
            testimoniosShowBySix(plusTestimonios){

                this.showTestimonios+=plusTestimonios;
                this.showTestimonios>=this.cantidadTestimonios?this.btnShowMore=false:'';
                this.sectionTestimonios = this.testimonios.slice(0, this.showTestimonios);
            },
            searchByInput(){
                this.auxTestimonios.length===0?this.auxTestimonios=this.testimonios:'';
                this.testimonios=this.filteredTestimonios;

                this.btnShowMore = this.testimonios.length>2?true:false;
                this.showTestimonios=0;
                this.testimoniosShowBySix(6);


            },
            async example() {
                const nums = [1, 2];
                for (const num of nums) {
                    const result = await this.returnNum(num);
                    console.log(result);
                }
                console.log('after forEach');
            },

            returnNum(x) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(x);
                    }, 500);
                });
            }
        },
        filters: {
            descriptionShort(description) {
                return description.substring(0, 222)+'...';
            }
        },
        computed: {
            filteredTestimonios() {

                if(this.search!==null)
                {
                    return this.auxTestimonios.filter(property => { // Buscar por titulo o procedencia
                         let found = (property.title+' '+property.procedencia).toLowerCase().includes(this.search.toLowerCase());
                         found = found===false?property.subTitle.toLowerCase().includes(this.search.toLowerCase()):true; // Buscar por subtitulo
                         return found;

                    });
                }else return null;
            }
        },
    }

</script>

<style scoped>

    [v-cloak]::before{ top: 150%;}

    #content-testimonios {
        background-color: #f8f8f8;
        min-height: 100vh;
    }

    .color-green {
        color: #65b32e;
    }

    .btn-color {
        background-color: #65b32e;
    }

    #sub-content-test {
        width: 85vw;
        margin: auto;
    }

    .btn-style {
        padding-right: 6rem !important;
        padding-left: 6rem;
        font-size: 1.3em;
        font-weight: 500;
        color: #fff;
    }

    .btn-style:hover {
        color: #fff
    }

    .card-title {
        font-size: 2.1em;
        color: #152f4e;
        margin-bottom: -6px;
    }

    .card-subtitle {
        font-size: 2em;
    }

    .card-text-test {
        color: #5d5d5d;
        font-size: 1.2em;
        font-weight: 400;
        text-align: justify;

    }

    .id-card-content {
        font-weight: 600;
        font-size: 1.1em;
    }

    .autor {
        color: #4a4a4a;
        text-indent: 175px;
        font-weight: 600;
        font-size: 1.3em;
    }

    .btn-circle-card {
        width: 120px;
        height: 120px;
        text-align: center;
        padding: 30px 0;
        font-size: 1em;
        line-height: 1.428571429;
        border-radius: 65px;
        position: absolute;
        font-weight: 500;
       /* background-color: #d0d0d0;
        background: radial-gradient(circle, #fff, #f1ecec, #d0d0d0); */
        background: linear-gradient(217deg, rgba(255, 255, 255, .8), rgba(255, 0, 0, 0) 70.71%),
        linear-gradient(127deg, rgba(0, 255, 0, .8), rgba(0, 255, 0, 0) 70.71%),
        linear-gradient(360deg, rgba(82, 82, 82, .8), rgba(0, 0, 255, 0) 70.71%);/*  background: rgb(255,255,255);
        background: radial-gradient(circle, rgba(230,230,230,0.3) 40%, rgba(82,82,82,0.7) 30%, rgba(90,92,93,.4) 30%);*/

    }

    .btn-circle-card > img { border-radius: 30px; opacity: .8 }

    .btn-circle-card > img:hover {

        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 0 8px 23px #aafbaa;
    }


</style>
