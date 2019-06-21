export default {

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
        }
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

                            }
                        }


                        this.itemsPage.push(propertyItem);//  isValidItem?this.itemsPage.push(propertyItem):''
                        this.totalAmountItems = index + 1; //isValidItem?this.totalAmountItems = index + 1:'';
                    }
                }
            });
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
    },

    filters: { },
    computed: { },
}
