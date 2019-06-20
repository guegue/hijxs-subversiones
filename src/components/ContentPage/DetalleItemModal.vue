<template>

    <b-modal ref="detalle-item" size="xl" no-close-on-backdrop @hide="ModalHidden"><!-- title=""-->
        <div v-for="(detail,indexDeta) in detalleByItem" :key="'t'+indexDeta" class="w-mT">

            <b-row class="content-modal-detalle">
                <b-col class="pl-3 col-10">
                    <h5 class="card-title">{{detail.title}}</h5>
                    <h6 class="card-subtitle color-green mb-1">{{detail.subTitle}}</h6>
                    <p class="card-text-style mt-5"> {{ detail.contenido }} {{ detail.contenido }} {{ detail.contenido }}</p>
                    <p class="card-text-style mt-5"> {{ detail.contenido }} {{ detail.contenido }} {{ detail.contenido }}</p>
                    <p class="card-text-style mt-5"> {{ detail.contenido }} {{ detail.contenido }} {{ detail.contenido }}</p>
                    <p class="card-text-style mt-5"> {{ detail.contenido }} {{ detail.contenido }} {{ detail.contenido }}</p>

                    <p v-if="detail.type && detail.type==='pdf'">
                        {{detail.title}}
                    </p>

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
            <button type="button" class="btn float-right icon-change" @click="CDetailItemNext(1)"><i
                    class="icono-arrow icono-arrow1-left"></i></button>
            <button type="button" class="btn float-right icon-change mr-2" @click="CDetailItemNext(-1)"><i
                    class="icono-arrow icono-arrow1-right"></i></button>
        </div>
    </b-modal>

</template>

<script>
    export default {
        name: 'modal',
        props: {
            callDetailItemNext: Function,
            detalleByItem: Array
        },
        data: () => {
            return {
                documento:null
            }
        },
        methods: {
            CDetailItemNext(direction) {
                this.callDetailItemNext(direction);
            },
            ModalHidden(){
                this.$eventBus.$emit('modalIsHidden',true);
            }
        },
        watch: {
            detalleByItem: function (newvalue, oldValue){
                this.$refs['detalle-item'].show();
            }
        },
    }
</script>

<style scoped>

    .btn-color { background-color: #65b32e; }

    .card-title {
        font-size: 2.1em;
        color: #152f4e;
        margin-bottom: -6px;
    }
    .color-green {
        color: #65b32e;
    }
    .card-subtitle {
        font-size: 2em;
    }

    .card-text-style {
        color: #5d5d5d;
        font-size: 1.2em;
        font-weight: 400;
        /*text-align: justify;*/
    }

    .icon-change {
        border-radius: 30px;
        height: 53px;
        width: 53px;
        border: 4px solid #65b32e;
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
