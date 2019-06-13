<template>
    <b-container fluid id="content-site">
        <div id="sub-content-summary" class="justify-content-center pt-3">
               <!-- si existe descripción en la página mostrar breadCrumb independiente (Sin input filtrar)-->
                <div class="pb-2" style="width:64%;" v-if="hasDescription">
                    <b-breadcrumb :items="currentBreadCrumb"></b-breadcrumb>
                </div>

            <div class="content-description-page" v-if="hasDescription">
                <div>
                    <h5 class="card-title">Descripción</h5>
                    <span class="card-text pt-3 d-flex card-body-description" v-html="descripcionPage"> </span>
                </div>
            </div>

            <!--  BreadCrumb y barra de búsqueda-->
            <search :callMethod="searchByInput" :currentBreadCrumb="currentBreadCrumb" :hasDescription="hasDescription"></search>
            <!--Alert when do not found data using fiter input-->
            <alertmsg :showAlert="showAlert" :callCloseAlert="closeAlert"></alertmsg>

            <b-row>
                <div v-for="(item,index) in sectionPage" :key="index" class="card mt-5"
                     style="width:45%; height: 440px; margin-left: 3%;">
                    <div class="card-body">
                       <!-- item tipo video -->
                        <div class="content-video">
                            <ul id="video-gallery" class="video list-unstyled w-video">
                            <li class="video-square video">
                                <a href="">
                                    <img class="img-responsive"
                                         :src="item.thumb"/>
                                    <div class="demo-gallery-poster">
                                        <img src="http://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png">
                                    </div>
                                    <div class="video_item_section video_item_stats clearfix">
                                        <span class="pb-1"> {{item.titleShort}}</span>

                                    </div>
                                </a>
                            </li>
                            </ul>
                        </div>

                        <!-- Descripcion del item -->
                        <span>
                            <h5 class="card-title">{{item.title|titleShort}}</h5>
                            <h6 class="card-subtitle color-green mb-2">{{item.subTitle}}</h6>
                             <p class="card-text-style">
                            {{item.contenido|descriptionShort}}
                            <span key="idcard-content" class="color-green id-card-content"
                                  style="white-space: nowrap; cursor:pointer"
                                  @click="detalleItemModal(index)">
                                VER MÁS
                            </span>
                        </p>
                        </span>

                        <div v-if="!isVideo" class="mt-4 card-position">
                            <span class="btn-circle-card mt-1">
                                    <img class="img-card" width="60px" height="60px"
                                         :src="item.urlImg">
                            </span>
                            <div class="autor" style="padding-top: 60px;">
                                {{item.author}}
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
        <div> <!-- Modal detalle item -->
            <modal :detalleByItem="detalleByItem" :callDetailItemNext="detailItemNext"></modal>
        </div>
    </b-container>
</template>

<script>

    require('@/assets/css/videos.css');

    import search from './Search';
    import alertmsg from './Alert';
    import modal from './DetalleItemModal';
    import Encrypt from '../../mixins/encryptString';
    import infoPage from '../../mixins/readInfoPage';

    export default {
        name: 'ThirdSection',
        props: {menuSite: Array},
        mixins: [Encrypt, infoPage],
        components: {
            search,
            alertmsg,
            modal
        },
        data: () => {
            return {
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
                search: null,
                descripcionPage: null,
                currentBreadCrumb: [{text: 'Inicio', href: '/'}],
                hasDescription:false,
                isVideo:false,
            }
        },

        created() {
            // this.getClassCita();
            /* this.example().then(() => {
                 console.log('done');
             })*/
            let objPage = this.readInfoPage(this.menuSite);

            if ((typeof objPage !== 'undefined')) {
                let typePage = this.decrypt(objPage.type);
                let slugPage = this.decrypt(objPage.slugPage);

                typePage === 'url' ? this.getDescriptionPage(slugPage) : '';
                typePage === 'url' ? this.getDetailItemSet(slugPage) : this.getDetailPage(slugPage);

                this.currentBreadCrumb.push({
                    text: objPage.title,
                    active: true
                });
            } else
                this.$router.push('/');//Route no válido redirect to homepage
        },
        mounted: function () {

            this.$loading('sub-content-summary');
            this.$eventBus.$on('modalIsHidden', (value) => {
                this.is_visible_modal = !value;
            });
        },
        methods: {
            ModalHidden() {
                this.is_visible_modal = false;
            },
            getDescriptionPage(idItemSet) {

                this.$axios(this.$domainOmeka + 'api/item_sets?id=' + idItemSet) //site_id=13 site Contexto
                    .then((dataItemSet) => {

                        this.$eventBus.$emit('infoSite',
                            {
                                title: this.getPropertyValue(dataItemSet.data, 'title'),
                                subTitle: this.getPropertyValue(dataItemSet.data, 'alternative'),
                                summaryPage: this.getPropertyValue(dataItemSet.data, 'abstract')
                            });
                        this.descripcionPage = this.getPropertyValue(dataItemSet.data, ['description']);
                        this.descripcionPage!==null?this.hasDescription=true:'';

                    }).catch((error) => window.console.error(error + ' error in ItemSet'));
            },
            getDetailItemSet(idItemSet) {
               // console.log('id '+idItemSet)
                this.$axios(this.$domainOmeka + 'api/items?item_set_id=' + idItemSet)
                    .then((itemsTestimonio) => this.recorrerItems(itemsTestimonio))
                    .then(() => {
                        this.loadContentPage()
                    })
            },
            loadContentPage() {
                this.itemsShowBySix(6);
                this.totalAmountItems > 6 ? this.btnShowMore = true : '';
                this.$removeLoading('sub-content-summary');
            },
            async getDetailPage(idPage) {
                const answer = await this.$axios(this.$domainOmeka + 'api/site_pages/' + idPage);
                //valido si la propiedad o:block existe para poder recorrer los items,conjuntos,etc relacionados
                if (answer.data['o:block'] != null) {

                    this.$eventBus.$emit('infoSite',
                        {
                            title: answer.data['o:title'],
                            subTitle: '',
                            summaryPage: ''
                        });

                    for (const detail of answer.data['o:block']) {

                        detail['o:layout'] === 'html' ? this.descripcionPage = detail['o:datas'].html : '';//['o:data'];

                        this.descripcionPage!==null?this.hasDescription=true:'';

                        if (detail['o:layout'] === 'itemShowCase') {
                            //Recorrer los items relacionados a una página
                            for (const [index, data] of detail['o:attachment'].entries()) {
                                // Obtener detalles del item
                                const item = await this.$axios(data['o:item']['@id']);

                                //Obtener media (img) del item
                                const media = data['o:media'] !== null ? (await this.$axios(data['o:media']['@id'])) : null;

                                this.itemsPage.push({
                                    title: this.getPropertyValue(item.data, 'title'),
                                    contenido: this.getPropertyValue(item.data, 'description'),
                                    urlImg: media !== null ? this.getPropertyValue(media.data, 'thumbnail_urls', 'o:', ['medium']) : '',
                                    subTitle: this.getPropertyValue(item.data, 'alternative'),
                                    date: this.getPropertyValue(item.data, 'date'),
                                    procedencia: this.getPropertyValue(item.data, 'provenance'),
                                    source: this.getPropertyValue(item.data, 'source'),
                                    author: this.getPropertyValue(item.data, 'citedBy', 'bibo:'),
                                });

                                this.totalAmountItems = index + 1;
                            }
                        }
                    }
                }

                this.loadContentPage();
            },
            async recorrerItems(items) {

                if (parseInt(items.data.length) > 0) {

                   let itemSetClass = items.data[0]!==undefined?items.data[0]['@type'][1]:'';

                   itemSetClass==='bibo:AudioVisualDocument'?this.isVideo=true:'';

                    for (const [index, item] of items.data.entries()) {
                        var propertyItem = {};

                        propertyItem.title = this.getPropertyValue(item, 'title');
                        propertyItem.subTitle = this.getPropertyValue(item, 'alternative');
                        propertyItem.contenido = this.getPropertyValue(item, 'description');
                        propertyItem.procedencia = this.getPropertyValue(item, 'provenance');
                        propertyItem.author = this.getPropertyValue(item, 'citedBy', 'bibo:')

                        if (item['o:media'].length > 0) //No tienen img
                        {
                            for (const [indexMedia,media] of item['o:media'].entries())
                            {
                                if(indexMedia===0) //por ahora recorrer solo el primer elemento en el media
                                await this.$axios(media['@id'])
                                    .then((img) => {

                                            propertyItem.urlImg = this.getPropertyValue(img.data, 'thumbnail_urls', 'o:', ['medium']);

                                            if(this.isVideo)
                                            {  let item = img.data;

                                                if (item['o:ingester'] === 'upload') // Video Mp4
                                                {
                                                    if(item['o:media_type'].split('/')[0]==='video')
                                                    {
                                                        propertyItem.html= '<video class="lg-video-object lg-html5" controls preload="none"><source src="' + item['o:original_url'] + '" type="video/mp4">' + item['o:source'] + '</video>';
                                                        propertyItem.thumb= 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                                        propertyItem.titleShort = item['o:source'].substring(0,39);
                                                        propertyItem.title = item['o:source'];
                                                    }
                                                }
                                              else if ((item['o:ingester'] === 'youtube' || item['o:ingester'] === 'oembed') ) // Video youtube or vimeo
                                              {
                                                  propertyItem.title = item['dcterms:title'][0]['@value'];
                                                  propertyItem.src= item['o:source'];
                                                  propertyItem.thumb = item['o:thumbnail_urls'].square;
                                                  propertyItem.titleShort = item['dcterms:title'][0]['@value'].substring(0, 39);
                                              }

                                            }

                                    });
                                //else
                                //propertyTestimonio.urlImg='';
                            }
                        }

                        this.itemsPage.push(propertyItem);

                        this.totalAmountItems = index + 1;
                    }
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
                    this.itemsShowBySix(6);
                    this.btnShowMore = this.itemsPage.length >= 6 ? true : false;
                    return false;
                }
                this.auxItemsPage.length === 0 ? this.auxItemsPage = this.itemsPage : '';
                this.itemsPage = this.filteredItems;
                this.btnShowMore = this.itemsPage.length >= 6 ? true : false;
                this.quantiryItemsToShow = 0;
                this.itemsShowBySix(6);
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
                if (numberItems === 1)
                    return false;

                if (numberItems - 1 === this.currentIdItem)
                    this.currentIdItem = direction === 1 ? 0 : numberItems - 6;
                else if (this.currentIdItem === 0 && direction === -1)
                    this.currentIdItem = numberItems - 1;
                else
                    this.currentIdItem += direction === 1 ? 1 : -1;

                this.detalleItemModal(this.currentIdItem);
            },
            getPropertyValue(object, attribName, complementAttrib, isObject) {

                let complement = complementAttrib || 'dcterms:';
                let isAttribInObject = isObject || false;

                if (!isAttribInObject)
                    return (object[complement + attribName] !== undefined && object[complement + attribName] !== null) ?
                        object[complement + attribName][0]['@value'] : '';

                return (object[complement + attribName] !== undefined && object[complement + attribName] !== null) ?
                    object[complement + attribName][isObject[0]] : '';

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
            },
            titleShort(title) {
                let size = title.length;
                return size > 46 ? title.substring(0, 46) + '...' : title;
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

    .content-description-page {
        /* border: 1px solid rgba(0, 0, 0, 0.125);
         border-radius: 0.25rem;*/
        padding: 2% 11% 3% 8%;
        min-height: 200px;
        box-shadow: 0 0 0.1em 0.1em rgba(204, 209, 209, 0.5);
    }

    .card-body-description {
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif, "Helvetica Neue";
        color: #5d5d5d;
        font-size: 1.2em;
        font-weight: 400;
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

    .card-position {
        margin-top: inherit !important;
        position: absolute;
        display: contents;
    }

</style>
