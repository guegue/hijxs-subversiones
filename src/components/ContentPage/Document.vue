<template>

    <b-modal ref="document-item" size="xl" no-close-on-backdrop >
        <div class="w-mT">

            <b-row class="content-modal-detalle">
                <b-col class="pl-3 col-10">

                    <div class="header-content">
                        <h4>{{titleDocument}}</h4>
                    </div>
                    <div class="body-content">
                        <embed :src="urlDocument">
                    </div>
                </b-col>
            </b-row>

        </div>

        <div slot="modal-footer" class="w-100">
            <!--<button type="button" class="btn float-right icon-change" @click="CDetailItemNext(1)"><i
                    class="icono-arrow icono-arrow1-left"></i></button>
            <button type="button" class="btn float-right icon-change mr-2" @click="CDetailItemNext(-1)"><i
                    class="icono-arrow icono-arrow1-right"></i></button>-->
        </div>
    </b-modal>

</template>

<script>
    export default {
        name: 'modal',
        props: {
            document: Array
        },
        data: () => {
            return {
                documento:null
            }
        },
        methods: { },
        watch: {
            detalleByItem: function (newvalue, oldValue){
                this.$refs['detalle-item'].show();
            }
        },
    }
</script>

<style scoped>

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

</style>
