<template>
    <b-container fluid id="content-testimonios">
        <div id="sub-content-test" class="justify-content-center">
            <b-row class="pt-4">
                <div class="" style="width:45%; margin-left:3%;">
                    <button type="button" class="btn btn-lg btn-style btn-color" @click="searchByInput()">
                      <span style="color:#65b32e !important;  stroke: white; stroke-width: 40;" class="fa fa-filter">
                      </span> FILTRAR
                    </button>
                </div>
                <div class="" style="width:45%; margin-left:3%;">
                    <div class="input-group h-100">
                        <input type="text" class="form-control h-100" v-model="search"
                               v-on:keyup.enter="searchByInput()" placeholder="Search this">
                        <div class="input-group-append">
                            <button class="btn btn-color text-white pr-4 pl-4" style="font-size: 1.9em !important;"
                                    type="button" @click="searchByInput()">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </b-row>

            <b-row v-if="showAlert" class="justify-content-center">
                <div class="alert alert-info alert-dismissible fade show mt-5 w-50 text-center" role="alert">
                    <strong>Aviso!</strong> No se ha encontrado ningun resultado.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="{closeAlert}">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </b-row>

            <b-row>

                <div v-for="(testimonio,index) in sectionTestimonios" :key="index" class="card mt-5"
                     style="width:45%; margin-right:3%; height: 440px;">
                    <div class="card-body">
                        <h5 class="card-title">{{testimonio.title}}</h5>
                        <h6 class="card-subtitle color-green mb-2">{{testimonio.subTitle}}</h6>
                        <p class="card-text-test">
                            {{testimonio.contenido|descriptionShort}}
                            <span key="idcard-content" class="color-green id-card-content"
                                  style="white-space: nowrap; cursor:pointer"
                                  @click="detalleTestimonioModal(index)">
                                VER MÁS
                            </span>
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
        <div style="height: 50px;"></div>
        <b-row class="justify-content-center pb-5">
            <button :disabled='!btnShowMore' v-show="btnShowMore" type="button" class="btn btn-lg btn-style btn-color"
                    @click="testimoniosShowBySix(6)">
                VER MÁS
            </button>
        </b-row>

        <div>

            <b-modal ref="detalle-testimonios" size="xl" class="testimonioDetalleModal"
                     no-close-on-backdrop @hide="ModalHidden"><!-- title=""-->
                <div v-for="(detaTestimonio,indexDeta) in detalleTestimonio" :key="'t'+indexDeta" class="w-mT">

                    <b-row class="content-modal-detalle">
                        <b-col class="pl-3 col-10">
                            <h5 class="card-title">{{detaTestimonio.title}}</h5>
                            <h6 class="card-subtitle color-green mb-1">{{detaTestimonio.subTitle}}</h6>
                            <p class="card-text-test mt-5">
                                Lorem ipsum dolor sit amet consectetur adipiscing elit ornare pulvinar inceptos metus
                                nibh mi,
                                aenean accumsan lacus netus massa iaculis posuere est taciti consequat eleifend. In
                                aenean
                                venenatis blandit pulvinar ultrices tellus cubilia vitae, mauris curae ac iaculis cursus
                                molestie luctus orci, ultricies mollis nisl bibendum dui himenaeos donec. Duis non porta
                                in
                                commodo aliquam mollis class auctor aptent conubia, litora cursus nisl parturient
                                maecenas
                                euismod morbi dis nostra dignissim malesuada, sem eros aenean egestas quis mi sapien
                                magnis
                                turpis.
                            </p>
                            <p class="card-text-test mt-5">
                                Leo proin himenaeos dictumst orci vitae eros, tempor lacus tortor potenti mi venenatis,
                                urna
                                faucibus conubia diam duis. Litora quis eros elementum vel arcu fermentum molestie enim
                                vulputate pulvinar rhoncus, convallis facilisi class tristique cras mus suscipit tempor
                                potenti
                                feugiat curae, mi ultrices aliquam natoque luctus vivamus non dictumst curabitur
                                torquent.
                                Torquent taciti montes dui molestie fames himenaeos at curabitur fusce, feugiat dictum
                                risus
                                proin etiam dapibus arcu in venenatis, urna orci velit sagittis netus nec inceptos odio.

                            </p>
                            <p class="card-text-test mt-5">
                                Leo proin himenaeos dictumst orci vitae eros, tempor lacus tortor potenti mi venenatis,
                                urna
                                faucibus conubia diam duis. Litora quis eros elementum vel arcu fermentum molestie enim
                                vulputate pulvinar rhoncus, convallis facilisi class tristique cras mus suscipit tempor
                                potenti
                                feugiat curae, mi ultrices aliquam natoque luctus vivamus non dictumst curabitur
                                torquent.
                                Torquent taciti montes dui molestie fames himenaeos at curabitur fusce, feugiat dictum
                                risus
                                proin etiam dapibus arcu in venenatis, urna orci velit sagittis netus nec inceptos odio.

                            </p>
                            <p class="card-text-test mt-5">
                                Leo proin himenaeos dictumst orci vitae eros, tempor lacus tortor potenti mi venenatis,
                                urna
                                faucibus conubia diam duis. Litora quis eros elementum vel arcu fermentum molestie enim
                                vulputate pulvinar rhoncus, convallis facilisi class tristique cras mus suscipit tempor
                                potenti
                                feugiat curae, mi ultrices aliquam natoque luctus vivamus non dictumst curabitur
                                torquent.
                                Torquent taciti montes dui molestie fames himenaeos at curabitur fusce, feugiat dictum
                                risus
                                proin etiam dapibus arcu in venenatis, urna orci velit sagittis netus nec inceptos odio.

                            </p>
                            <p class="card-text-test mt-5"> {{ detaTestimonio.contenido }} </p>
                        </b-col>
                        <b-col class="pl-3 col-2 align-right">

                            <div class="ml-iconShare-modal">
                                <button type="button" class="btn btn-color">
                                <span style="color:white !important;  stroke: white; stroke-width: 40;"
                                      class="fa fa-heart">
                                </span>
                                </button>
                            </div>
                            <div class="ml-iconShare-modal mt-2">
                                <button type="button" class="btn btn-color text-center">
                                <span style="color:white !important;  stroke: white; stroke-width: 40;"
                                      class="fa fa-share-alt">
                                </span>
                                </button>
                            </div>
                        </b-col>
                    </b-row>
                </div>

                <div slot="modal-footer" class="w-100">
                    <button type="button" class="btn float-right icon-change" @click="TestimonioDetalleNext()"><i
                        class="icono-arrow icono-arrow1-left"></i></button>
                    <button type="button" class="btn float-right icon-change mr-2" @click="TestimonioDetalleNext()"><i
                        class="icono-arrow icono-arrow1-right"></i></button>
                </div>
            </b-modal>


        </div>

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
                btnShowMore: false,
                cantidadTestimonios: 0,
                search: null,
                auxTestimonios: [],
                showAlert: false,
                detalleTestimonio: [],
                currentIdTestimonio: 0,
                is_visible_modal:false

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
            ModalHidden() {
                this.is_visible_modal = false;
            },
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
                        .then(() => {
                            this.testimoniosShowBySix(2);
                            this.$removeLoading('sub-content-test');
                        })
                }
            },
            async recorrerTestimonios(itemsTestimonio) {

                if (parseInt(itemsTestimonio.data.length) > 0) {

                    for (const [index, testimonio] of itemsTestimonio.data.entries()) {
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
                            });

                        this.testimonios.push(propertyTestimonio);

                        this.cantidadTestimonios = index + 1;
                    }

                    if (this.cantidadTestimonios > 2)
                        this.btnShowMore = true;
                }
            },
            testimoniosShowBySix(plusTestimonios) {

                this.showTestimonios += plusTestimonios;
                this.showTestimonios >= this.cantidadTestimonios ? this.btnShowMore = false : '';
                this.sectionTestimonios = this.testimonios.slice(0, this.showTestimonios);
            },
            searchByInput() {

                if (this.search === 'reset') {
                    this.auxTestimonios.length > 0 ? this.testimonios = this.auxTestimonios : '';
                    this.showTestimonios = 0;
                    this.showAlert = false;
                    this.testimoniosShowBySix(2);
                    this.btnShowMore = this.testimonios.length >= 2 ? true : false;
                    return false;
                }
                this.auxTestimonios.length === 0 ? this.auxTestimonios = this.testimonios : '';
                this.testimonios = this.filteredTestimonios;

                this.btnShowMore = this.testimonios.length >= 2 ? true : false;
                this.showTestimonios = 0;
                this.testimoniosShowBySix(2);

            },
            async detalleTestimonioModal(index) {

                this.detalleTestimonio = [];

                this.detalleTestimonio.push(this.sectionTestimonios[index]);

                await this.$nextTick();


                if(this.is_visible_modal!=true)
                {
                    this.is_visible_modal=true
                    this.$refs['detalle-testimonios'].show();
                }

                this.currentIdTestimonio = index;

            },
            TestimonioDetalleNext() {

                this.currentIdTestimonio += 1;
                this.detalleTestimonioModal(this.currentIdTestimonio);

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
                return description.substring(0, 222) + '...';
            }
        },
        computed: {
            filteredTestimonios() {

                if (this.search !== '') {
                    let response = this.auxTestimonios.filter(property => { // Buscar por titulo o procedencia
                        let found = (property.title + ' ' + property.procedencia).toLowerCase().includes(this.search.toLowerCase());
                        found = found === false ? property.subTitle.toLowerCase().includes(this.search.toLowerCase()) : true; // Buscar por subtitulo
                        return found;

                    });
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.showAlert = (response.length === 0) ? true : false;

                    return response;
                } else return [];
            },
            closeAlert: function () {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.showAlert = false;
            }
        },
    }

</script>

<style scoped>

    [v-cloak]::before {
        top: 150%;
    }

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

    .card-body {
        margin: 8% 9% 8% 9%;
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
        /*text-align: justify;*/

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
        linear-gradient(360deg, rgba(82, 82, 82, .8), rgba(0, 0, 255, 0) 70.71%);
        /*  background: rgb(255,255,255);
                background: radial-gradient(circle, rgba(230,230,230,0.3) 40%, rgba(82,82,82,0.7) 30%, rgba(90,92,93,.4) 30%);*/

    }

    .btn-circle-card > img {
        border-radius: 30px;
        opacity: .8
    }

    .icon-change {
        border-radius: 30px;
        height: 53px;
        width: 53px;
        border: 4px solid #65b32e;
    }

    .btn-circle-card > img:hover {

        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 0 8px 23px #aafbaa;
    }

    .w-mT {
        /* width: 80%;*/
        margin: auto;
        min-height: 70vh !important;
        max-height: 70vh !important;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .content-modal-detalle {
        width: 98%;
        margin-left: 1%;
    }

    .ml-iconShare-modal {
        margin-left: 70%;
    }

    ::-webkit-scrollbar {
        width: 23px !important;
        padding-top: 100px;
        margin-top: 100px;
        position: absolute;
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #e5f1ff;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px #f0f5fb;
        background-color: #152f4e; /*007bff */
    }

    :vertical {
        height: 100px
    }

    /*arrow right and left*/

    .icono-arrow {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        color: #152f4e;
        box-sizing: border-box;

    }

    .icono-arrow:after, .icono-arrow:before {
        content: "";
        box-sizing: border-box;

    }

    .icono-arrow1-left, .icono-arrow1-right {
        width: 15px;
        height: 15px;
        border-width: 3px 3px 0 0;
        border-style: solid;
        margin: auto;
    }

    .icono-arrow1-left:before, .icono-arrow1-right:before {
        right: 0;
        top: -3px;
        position: absolute;
        height: 3px;
        box-shadow: inset 0 0 0 32px;
        transform: rotate(-45deg);
        width: 23px;
        transform-origin: right top;
    }

    .icono-arrow1-left {
        transform: rotate(45deg);
    }

    .icono-arrow1-right {
        transform: rotate(-135deg);
    }

</style>
