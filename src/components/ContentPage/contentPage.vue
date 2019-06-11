<template>
    <b-container fluid id="content-site">
        <div id="sub-content-summary" class="justify-content-center">
            <!--  BreadCrumb y barra de búsqueda-->
            <search :callMethod="searchByInput"></search>
            <!--Alert when do not found data using fiter input-->
            <alertmsg :showAlert="showAlert" :callCloseAlert="closeAlert"></alertmsg>

            <b-row>
                <div v-for="(item,index) in sectionPage" :key="index" class="card mt-5"
                     style="width:45%; margin-right:3%; height: 440px;">
                    <div class="card-body">
                        <h5 class="card-title">{{item.title}}</h5>
                        <h6 class="card-subtitle color-green mb-2">{{item.subTitle}}</h6>
                        <p class="card-text-style">
                            {{item.contenido|descriptionShort}}
                            <span key="idcard-content" class="color-green id-card-content"
                                  style="white-space: nowrap; cursor:pointer"
                                  @click="detalleItemModal(index)">
                                VER MÁS
                            </span>
                        </p>
                        <div class="mt-4 card-position">
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
                    @click="itemsShowBySix(2)">
                VER MÁS
            </button>
        </b-row>
        <div> <!-- Modal detalle item -->
            <modal :detalleByItem="detalleByItem" :callDetailItemNext="detailItemNext"> </modal>
        </div>
    </b-container>
</template>

<script>

    import search from './Search';
    import alertmsg from './Alert';
    import modal from './DetalleItemModal';
    import Encrypt from '../../mixins/encryptString';
    import infoPage from '../../mixins/readInfoPage';

    export default {
        name: 'ThirdSection',
        props:{menuSite:Array},
        mixins: [Encrypt,infoPage],
        components: {
            search,
            alertmsg,
            modal
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
                is_visible_modal: false,
                search: null
            }
        },

        created() {
           // this.getClassCita();
            /* this.example().then(() => {
                 console.log('done');
             })*/

            let objPage = this.readInfoPage(this.menuSite);

            if((typeof objPage!== 'undefined'))
            {
                let typePage = this.decrypt(objPage.type)
                typePage==='url'?this.getDetailItemSet(this.decrypt(objPage.slugPage)):'';
            }
            else
                this.$router.push('/');//Route no valida redirect to homepage
        },
        mounted: function () {

            this.$loading('sub-content-summary');
            this.$eventBus.$on('modalIsHidden',(value)=>{
             this.is_visible_modal = !value;
           });
        },

        methods: {
            ModalHidden() {
                this.is_visible_modal = false;
            },
            getClassCita() { // Testimonios Clase (80)
                this.$axios(this.$domainOmeka + 'api/item_sets?site_id=13&resource_class_id=80') //site_id=13 site Contexto
                    .then((classTestimonio) => this.getTestimonios(classTestimonio))
                    .then(() => {
                        this.$nextTick(() => {
                        });
                    })
            },
            getDetailItemSet(idItemSet) {

                    this.$axios(this.$domainOmeka +'api/items?item_set_id='+idItemSet)
                        .then((itemsTestimonio) => this.recorrerTestimonios(itemsTestimonio))
                        .then(() => {
                            this.itemsShowBySix(2);
                            this.$removeLoading('sub-content-summary');
                        })
            },
            async recorrerTestimonios(itemsTestimonio) {

                if (parseInt(itemsTestimonio.data.length) > 0) {

                    for (const [index, testimonio] of itemsTestimonio.data.entries()) {
                        var propertyTestimonio = {};
                        console.log('1');
                        propertyTestimonio.title = testimonio['dcterms:title'][0]['@value'];
                        console.log('2');
                        propertyTestimonio.subTitle = (typeof testimonio['dcterms:alternative'] !== 'undefined') ?
                            testimonio['dcterms:alternative'][0]['@value'] :
                            '';
                        console.log('3');
                        propertyTestimonio.contenido = (typeof testimonio['dcterms:description']!== 'undefined') ?
                            testimonio['dcterms:description'][0]['@value'] :
                            'Sin descripción';
                        console.log('4');
                        propertyTestimonio.procedencia = (typeof testimonio['dcterms:provenance'] !== 'undefined') ?
                            testimonio['dcterms:provenance'][0]['@value'] :
                            '';
                        console.log('5 '+index);
                        if(testimonio['o:media'].length>0) //No tienen img
                            await this.$axios(testimonio['o:media'][0]['@id'])
                                .then((img) => {
                                    propertyTestimonio.urlImg = img.data['o:thumbnail_urls'].medium;
                                });
                          //else
                            //propertyTestimonio.urlImg='';

                        this.itemsPage.push(propertyTestimonio);

                        this.totalAmountItems = index + 1;
                    }

                    if (this.totalAmountItems > 2)
                        this.btnShowMore = true;
                }
            },
            itemsShowBySix(plusItem) {

                this.quantiryItemsToShow += plusItem;
                this.quantiryItemsToShow >= this.totalAmountItems ? this.btnShowMore = false : '';
                this.sectionPage = this.itemsPage.slice(0, this.quantiryItemsToShow);
            },
            searchByInput(search) {
                this.search = search;

                if ((this.search || '').trim() === '') return false;
                if (this.search === 'reset') {
                    this.auxItemsPage.length > 0 ? this.itemsPage = this.auxItemsPage : '';
                    this.quantiryItemsToShow = 0;
                    this.showAlert = false;
                    this.itemsShowBySix(2);
                    this.btnShowMore = this.itemsPage.length >= 2 ? true : false;
                    return false;
                }
                this.auxItemsPage.length === 0 ? this.auxItemsPage = this.itemsPage : '';
                this.itemsPage = this.filteredItems;
                this.btnShowMore = this.itemsPage.length >= 2 ? true : false;
                this.quantiryItemsToShow = 0;
                this.itemsShowBySix(2);
            },
            async detalleItemModal(index) {

                this.detalleByItem = [];
                this.detalleByItem.push(this.sectionPage[index]);
                await this.$nextTick();

                if (this.is_visible_modal != true) {
                    this.is_visible_modal = true
                    //this.$refs['detalle-item'].show();
                }
                this.currentIdItem = index;

            }, //recorrer -1 a la izquierda o 1 a la derecha en el array
            detailItemNext(direction) {

                let numberItems = this.sectionPage.length;

                if (numberItems - 1 === this.currentIdItem)
                    this.currentIdItem = direction === 1 ? 0 : numberItems - 2;
                else if (this.currentIdItem === 0 && direction === -1)
                    this.currentIdItem = numberItems - 1;
                else
                    this.currentIdItem += direction === 1 ? 1 : -1;

                this.detalleItemModal(this.currentIdItem);
            },
            closeAlert: function () {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.searchByInput('reset');
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.showAlert = false;
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
                return description.substring(0, 135) + '...';
            }
        },
        computed: {
            filteredItems() {

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
        margin: 6% 8% 6% 8%;
    }

    .card-title {
        font-size: 2.1em;
        color: #152f4e;
        margin-bottom: -6px;
    }

    .card-subtitle {
        font-size: 2em;
    }

    .card-text-style {
        color: #5d5d5d;
        font-size: 1.2em;
        font-weight: 400;
        min-height: 30%;
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
        width: 100px;
        height: 100px;
        text-align: center;
        padding: 20px 0;
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
    .btn-circle-card > img:hover {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 0 8px 23px #aafbaa;
    }

    .card-position{margin-top: inherit!important; position: absolute; display:contents;}

</style>
