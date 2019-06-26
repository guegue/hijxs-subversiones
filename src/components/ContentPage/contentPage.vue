<template>
    <b-container fluid id="content-site">
        <div id="sub-content-summary" class="justify-content-center pt-3">
               <!-- si existe descripción en la página mostrar breadCrumb independiente (Sin input filtrar)-->
                <div class="pb-2" style="width:64%;" v-if="hasDescription">
                    <b-breadcrumb :items="currentBreadCrumb"></b-breadcrumb>
                </div>

            <div class="row content-description-page" v-if="hasDescription">
                <div class="col-8 card-text pt-3 d-flex card-body-description" v-html="descripcionPage">
                   <!-- <h5 class="card-title">Descripción</h5> -->
                </div>
                <div class="col-4 img-page" style="margin: auto;">
                     <img :src="imgPage"> <!--width="77px" height="77px"-->
                </div>
            </div>
            <!--  BreadCrumb y barra de búsqueda-->
            <search :callMethod="searchByInput" :currentBreadCrumb="currentBreadCrumb" :hasDescription="hasDescription"></search>
            <!--Alert when do not found data using fiter input-->
            <alertmsg :showAlert="showAlert" :callCloseAlert="closeAlert"></alertmsg>

            <b-row>
                <div v-for="(item,index) in sectionPage" :key="index" class="card mt-5"
                     style="width:45%; height: auto; margin-left: 3%; min-height: 440px;"> <!-- 440px -->
                    <div class="card-body">
                       <!-- item tipo video -->
                        <div v-if="isVideo" class="content-video">
                            <ul id="video-gallery" class="video list-unstyled w-video">
                            <li class="video-square video">
                                <a href="" @click.prevent="showVideo($event, index)" :id="'video-'+index">
                                    <img class="img-responsive"
                                         :src="item.thumb" height="185"/>
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
                                    <img class="img-card" width="77px" height="77px"
                                         :src="item.urlImg">
                            </span>
                        </div>
                        <span style="float: right; width: 70%">
                             <div class="autor" style="padding-top: 60px;">
                                {{item.author}}
                            </div>
                            <div class="autor">
                                {{item.procedencia}}
                            </div>
                        </span>
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
    import Encrypt from '../../mixins/encryptStringMixin';
    import infoPage from '../../mixins/readInfoPageMixin';

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
                relatedVideos:[],
                isVideo:false,
                idMedia:[],
                imgPage:null
            }
        },

        created() {

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

               return new Promise((resolved, reject)=>{

                    this.$axios(this.$domainOmeka + 'api/item_sets?id=' + idItemSet) // Site_id=13 site Contexto
                        .then(async (dataItemSet) => {

                            this.$eventBus.$emit('infoSite',
                                {
                                    title: this.getPropertyValue(dataItemSet.data, 'title'),
                                    subTitle: this.getPropertyValue(dataItemSet.data, 'alternative'),
                                    summaryPage: this.getPropertyValue(dataItemSet.data, 'abstract')
                                });

                             if(dataItemSet.data['o:thumbnail']!==null)
                             {
                                 const assets = await this.$axios(dataItemSet.data['o:thumbnail']['@id']);
                                 this.imgPage = assets.data['o:asset_url'];
                             }

                            this.descripcionPage = this.getPropertyValue(dataItemSet.data, ['description']);
                            this.descripcionPage!==null?this.hasDescription=true:'';

                        }).catch((error) => window.console.error(error + ' error in ItemSet'));

                   resolved();
               });

            },
            getDetailItemSet(idItemSet) {
                console.log(idItemSet);
                this.$axios(this.$domainOmeka + 'api/items?item_set_id=' + idItemSet)
                    .then((items) => this.recorrerItems(items))
                    .then(() => {
                        this.loadContentPage();
                        this.getImgOfItem();
                    })
            },
            loadContentPage() {
                this.itemsShowBySix(6);
                this.totalAmountItems > 6 ? this.btnShowMore = true : '';
                this.$removeLoading('sub-content-summary');
            },
            async getDetailPage(idPage){

                const answer = await this.$axios(this.$domainOmeka + 'api/site_pages/' + idPage);
                // Si la propiedad o:block existe recorrer los items,conjuntos,etc relacionados
                if (answer.data['o:block'] != null) {

                    this.$eventBus.$emit('infoSite',
                        {
                            title: answer.data['o:title'],
                            subTitle: '',
                            summaryPage: ''
                        });

                    for (const detail of answer.data['o:block']) {

                        detail['o:layout'] === 'html' ? this.descripcionPage = detail['o:data'].html : '';//['o:data'];

                        this.descripcionPage!==null?this.hasDescription=true:'';

                        if (detail['o:layout'] === 'itemShowCase') {
                            //Recorrer los items relacionados a una página
                            for (const [index, data] of detail['o:attachment'].entries()) {
                                // Obtener detalles del item
                                console.log(data['o:item']['@id']);
                                const item = await this.$axios(data['o:item']['@id']); // Url item

                                /**** Si existe media guardar id, para luego obtenerlos, una ves cargada la página (esto
                                   para agilizar el cargado de la  página) ****/

                                data['o:media']!== null ? this.idMedia.push({idMed:data['o:media']['o:id'],idItem:index}) : '';

                                this.itemsPage.push({
                                    title: this.getPropertyValue(item.data, 'title'),
                                    contenido: this.getPropertyValue(item.data, 'description'),
                                    urlImg: '',//media !== null ? this.getPropertyValue(media.data, 'thumbnail_urls', 'o:', ['medium']) : '',
                                    subTitle: this.getPropertyValue(item.data, 'alternative'),
                                    date: this.getPropertyValue(item.data, 'date'),
                                    procedencia: this.getPropertyValue(item.data, 'provenance'),
                                    source: this.getPropertyValue(item.data, 'source'),
                                    author: this.getPropertyValue(item.data, 'citedBy', 'bibo:'),
                                });

                                this.totalAmountItems = index + 1;
                                this.totalAmountItems===7? this.loadContentPage():''// Mostrar página con 7 elementos,
                                //mientras terminan de cargarse los demás items
                            }
                        }else
                            if (detail['o:layout'] === 'itemWithMetadata') // Obtener IMG representativa de la página
                        {
                             let long =  Object.keys(detail['o:attachment']).length;

                            let indexRandom = Math.floor((Math.random() * long) + 1) - 1;
                            for (const [indice, obj] of detail['o:attachment'].entries()) {

                                if(indice===indexRandom)
                                {
                                    const media = await this.$axios(obj['o:media']['@id']);
                                     this.imgPage = obj['o:media'] !== null ?media.data['o:original_url']: '';
                                }
                            }
                        }
                    }
                }

                this.totalAmountItems<7? this.loadContentPage():''// si < 7 página impresa ()
                if(this.idMedia.length>0)
                    this.getImgOfItem();
            }, // Una ves cargada la página obtener la img de cada item
            async getImgOfItem(){

                for(const [indice,img] of this.idMedia.entries())
                {
                    const media = await this.$axios(this.$domainOmeka+'api/media/'+img.idMed);

                    if(media !== null)
                    {
                        let propertyItem = {};
                        let typeItem = media.data['o:media_type']!==null?media.data['o:media_type'].split('/')[1]:''; // Tipo de items (img,pdf,video)

                        // Update array principal, Vue se encarga de actualizar sus dependencias (array sectionPage)
                        propertyItem.urlImg =  this.getPropertyValue(media.data, 'thumbnail_urls', 'o:', ['medium']);
                        propertyItem.type=typeItem;

                        if(typeItem==='pdf')
                            propertyItem.urlDocument = media.data['o:original_url'];

                        Object.assign(this.itemsPage[img.idItem], propertyItem);

                        if(this.isVideo) //Agregar propiedades de Video
                        {
                            let propertyVideo = this.getPropertyTypeVideo(media.data);
                            Object.assign(this.itemsPage[img.idItem], propertyVideo);

                            (indice+1<=this.quantiryItemsToShow)? Object.assign(this.sectionPage[img.idItem], propertyVideo):'';
                        }
                    }
                }
            },
            hasClassVideo(items, size) //Validar si el conjunto de item es de Video
            {
                return new Promise((resolved, reject) => {

                    for(let i=0; i<size; i++)
                    {
                        let itemSetClass = items.data[i]['@type']!==undefined?items.data[i]['@type'][1]:'';

                        if(itemSetClass==='bibo:AudioVisualDocument')
                        {
                            this.isVideo=true;
                            resolved();
                        }
                    }
                    resolved();
                });

            },
            async recorrerItems(items) {

                var  sizeItems = items.data.length;
                this.itemsPage=[];
               await this.hasClassVideo(items, sizeItems).then(async ()=>{

                    if (parseInt(sizeItems) > 0) {

                        for (const [index, item] of items.data.entries()) {

                            var propertyItem = {};

                            propertyItem.title = this.getPropertyValue(item, 'title');
                            propertyItem.subTitle = this.getPropertyValue(item, 'alternative');
                            propertyItem.contenido = this.getPropertyValue(item, 'description');
                            propertyItem.procedencia = this.getPropertyValue(item, 'provenance');
                            propertyItem.author = this.getPropertyValue(item, 'citedBy', 'bibo:');
                            propertyItem.urlImg = '';

                            if (item['o:media'].length > 0) //No tienen img
                            {
                                for (const [indexMedia,media] of item['o:media'].entries())
                                {
                                    if(indexMedia===0) //por ahora recorrer solo el primer elemento en el media
                                        this.idMedia.push({idMed:media['o:id'],idItem:index})
                                       /* await this.$axios(media['@id'])
                                            .then((img) => {

                                                propertyItem.urlImg = this.getPropertyValue(img.data, 'thumbnail_urls', 'o:', ['medium']);

                                                if(this.isVideo)
                                                {  let item = img.data;

                                                    let propertyVideo = this.getPropertyTypeVideo(item);
                                                    Object.assign(propertyItem, propertyVideo);
                                                    //exist_video = propertyItem.exist_video!==undefined?true:false;
                                                }
                                            }); */
                                    //else
                                    //propertyTestimonio.urlImg='';
                                }
                            }
                            //Si la seccion es de Videos agregar items con recurso video existente
                           // let isValidItem = (this.isVideo && exist_video)?true:(!this.isVideo?true:false);

                            this.itemsPage.push(propertyItem);//  isValidItem?this.itemsPage.push(propertyItem):''
                            this.totalAmountItems = index + 1; //isValidItem?this.totalAmountItems = index + 1:'';
                        }
                    }
                });
            },
            getPropertyTypeVideo(item)
            {
                if (item['o:ingester'] === 'upload') // Video Mp4
                {
                    if(item['o:media_type'].split('/')[0]==='video')
                    {
                       return {
                            html: '<video class="lg-video-object lg-html5" controls preload="none"><source src="' + item['o:original_url'] + '" type="video/mp4">' + item['o:source'] + '</video>',
                            thumb: 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg',
                            titleShort : item['o:source'].substring(0,39),
                            title : item['o:source'],

                        }
                    }
                }
                else if ((item['o:ingester'] === 'youtube' || item['o:ingester'] === 'oembed') ) // Video youtube or vimeo
                {
                   return {
                        title : item['dcterms:title'][0]['@value'],
                        src: item['o:source'],
                        thumb : item['o:thumbnail_urls'].large,
                        titleShort : item['dcterms:title'][0]['@value'].substring(0, 39),
                    }
                }

                return {title : '',
                    src: 'https://archive.is/nwmyR/50f4441e39f28acc2d4ab83b3914b8bda463234a.jpg',
                    thumb : 'https://archive.is/nwmyR/50f4441e39f28acc2d4ab83b3914b8bda463234a.jpg',
                    titleShort : ''
                   };
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
            async searchRelatedVideos(idMedia){

             await this.isPartOfGetId(idMedia).then((media)=>{
                  if(media===null)
                      return false;

                 let propertyVideo = this.getPropertyTypeVideo(media);

                  if(propertyVideo.title!==null)
                  {
                       if(media.idMed!==undefined)
                       {
                           this.relatedVideos.push(propertyVideo);
                           this.searchRelatedVideos(media.idMed);
                       }
                  }
              });

            },
            showVideo(event, index){
                let targetId = event.currentTarget.id;
                this.relatedVideos=[];
                this.relatedVideos.push(this.sectionPage[index]);

                this.searchRelatedVideos(this.idMedia[index].idMed).then(()=>{

                    window.lightGallery(document.getElementById(targetId), {
                        dynamic: true,
                        dynamicEl:this.relatedVideos,
                        closable: false,
                        cssEasing : 'cubic-bezier(0.25, 0, 0.25, 1)',
                        autoplay:false,
                        videoAutoplay : false,
                        autoplayControls:false,
                        index:0,
                        videojs: true
                    });
                })
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
     .img-page> img{
         width: 100%;
         height: 70%;
         object-fit: cover;
         object-position: center center;
         border-radius: 8px;
     }

    .content-description-page {
        /* border: 1px solid rgba(0, 0, 0, 0.125);
         border-radius: 0.25rem;*/
        padding: 2% 1% 3% 8%;
        min-height: 200px;
        box-shadow: 0 0 0.1em 0.1em rgba(204, 209, 209, 0.5);
    }

    .card-body-description {
        font-family:   "Helvetica Neue", Arial, Helvetica, sans-serif;
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
       /* text-indent: 175px;*/
        font-weight: 600;
        font-size: 1.3em;
    }

    .btn-circle-card {
        width: 100px;
        height: 100px;
        text-align: center;
        padding: 13px 0;
        font-size: 1em;
        line-height: 1.428571429;
        border-radius: 65px;
        position: absolute;
        bottom: 5.1em;
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
        border-radius: 40px;
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
