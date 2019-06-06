<template>
    <b-container fluid id="content-site">
        <div id="sub-content-summary" class="justify-content-center">

          <search> </search>

            <b-row v-if="showAlert" class="justify-content-center">
                <div class="alert alert-info alert-dismissible fade show mt-5 w-50 text-center" role="alert">
                    <strong>Aviso!</strong> No se ha encontrado ningun resultado.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="{closeAlert}">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </b-row>

            <b-row>
                <div v-for="(item,index) in sectionPage" :key="index" class="card mt-5"
                     style="width:45%; margin-right:3%; height: 440px;">
                    <div class="card-body">
                        <h5 class="card-title">{{item.title}}</h5>
                        <h6 class="card-subtitle color-green mb-2">{{item.subTitle}}</h6>
                        <p class="card-text-test">
                            {{item.contenido|descriptionShort}}
                            <span key="idcard-content" class="color-green id-card-content"
                                  style="white-space: nowrap; cursor:pointer"
                                  @click="detalleItemModal(index)">
                                VER MÁS
                            </span>
                        </p>
                        <div class="mt-4">
                            <span class="btn-circle-card mt-1">
                                    <img class="img-card" width="60px" height="60px"
                                         :src="item.urlImg">
                            </span>
                            <div class="autor" style="padding-top: 60px;">
                                Alejandro Cortez
                            </div>
                            <div class="autor">
                                {{item.procedencia}}
                            </div>
                        </div>
                    </div>
                </div>
            </b-row>
        </div>
        <div style="height: 50px;"></div>
        <b-row class="justify-content-center pb-5">
            <button :disabled='!btnShowMore' v-show="btnShowMore" type="button" class="btn btn-lg btn-style btn-color"
                    @click="itemsShowBySix(6)">
                VER MÁS
            </button>
        </b-row>
        <div>

            <b-modal ref="detalle-item" size="xl" no-close-on-backdrop @hide="ModalHidden"><!-- title=""-->
                <div v-for="(detail,indexDeta) in detalleByItem" :key="'t'+indexDeta" class="w-mT">

                    <b-row class="content-modal-detalle">
                        <b-col class="pl-3 col-10">
                            <h5 class="card-title">{{detail.title}}</h5>
                            <h6 class="card-subtitle color-green mb-1">{{detail.subTitle}}</h6>
                            <p class="card-text-test mt-5"> {{ detail.contenido }} </p>
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
                    <button type="button" class="btn float-right icon-change" @click="detailItemNext(1)"><i
                        class="icono-arrow icono-arrow1-left"></i></button>
                    <button type="button" class="btn float-right icon-change mr-2" @click="detailItemNext(-1)"><i
                        class="icono-arrow icono-arrow1-right"></i></button>
                </div>
            </b-modal>
        </div>
    </b-container>
</template>

<script>
    import search from './Search'
    export default {
        name: 'ThirdSection',
        components: {
            search
        },
        data: () => {
            return {
                resourceClass: [],
                itemsPage: [],
                sectionPage: [],
                quantiryItemsToShow: null,
                btnShowMore: false,
                totalAmountItems: 0,
                auxItemsPage: [],
                showAlert: false,
                detalleByItem: [],
                currentIdItem: 0,
                is_visible_modal:false,
            }
        },

        created() {
            this.getClassCita();
            /* this.example().then(() => {
                 console.log('done');
             })*/
        },
        mounted: function () {

            this.$loading('sub-content-summary');
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
                            this.itemsShowBySix(2);
                            this.$removeLoading('sub-content-summary');
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

                        this.itemsPage.push(propertyTestimonio);

                        this.totalAmountItems = index + 1;
                    }

                    if (this.totalAmountItems > 2)
                        this.btnShowMore = true;
                }
            },
            itemsShowBySix(plusTestimonios) {
                console.log('-> '+plusTestimonios);
                this.quantiryItemsToShow += plusTestimonios;
                this.quantiryItemsToShow >= this.totalAmountItems ? this.btnShowMore = false : '';
                this.sectionPage = this.itemsPage.slice(0, this.quantiryItemsToShow);
            },

            async detalleItemModal(index) {

                this.detalleByItem = [];
                this.detalleByItem.push(this.sectionPage[index]);
                await this.$nextTick();

                if(this.is_visible_modal!=true)
                {
                    this.is_visible_modal=true
                    this.$refs['detalle-item'].show();
                }
                this.currentIdItem = index;

            }, //recorrer -1 a la izquierda o 1 a la derecha en el array
            detailItemNext(direction) {

               let numberItems=this.sectionPage.length;

                if(numberItems-1===this.currentIdItem)
                    this.currentIdItem= direction===1?0:numberItems-2;
                else
                    if (this.currentIdItem===0 && direction ===-1)
                        this.currentIdItem=numberItems-1;
                    else
                    this.currentIdItem += direction===1?1:-1;

                this.detalleItemModal(this.currentIdItem);
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
                    let response = this.auxItemsPage.filter(property => { // Buscar por titulo o procedencia
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
                this.search='reset';
                this.searchByInput();
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

    #content-site {
        background-color: #f8f8f8;
        min-height: 100vh;
    }

    .color-green {
        color: #65b32e;
    }

    .btn-color {
        background-color: #65b32e;
    }

    #sub-content-summary {
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
