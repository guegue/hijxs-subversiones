import {async} from "q";

export default {

    data: () => {
        return {
            itemCoordinate:[],
            itemsPage: [],
            sectionPage: [],
            btnShowMore: false,
            totalAmountItems: 0,
            auxItemsPage: [],
            showAlert: false,
            detalleByItem: [],
            currentIdItem: 0,
            is_visible_modal: false,
            search: null,
            hasDescription:false,
            relatedVideos:[],
            isVideo:false,
            idMedia:[],
            imgPage:null
        }
    },
    created() {},
    mounted: function () {},
    methods: {
       async traverseResourceSite(resources){
            for(const property of resources)
            {
                if(property.type==='pag')
                {
                    let resp = await  this.getDetailPage(property.idPagina);
                    console.log(resp,' Respuesta');
                }

                else
                    console.log('set')//this.getDetailItemSet(property.idItemSet);
            }
        },
        getDetailItemSet(idItemSet) {

            this.$axios(this.$domainOmeka + 'api/items?item_set_id=' + idItemSet)
                .then((items) => this.recorrerItems(items))
                .then(() => {
                    this.loadContentPage();
                    this.getImgOfItem();
                })
        },
        async getDetailPage(idPage){

            const resourcePage = await this.$axios(this.$domainOmeka + 'api/site_pages/' + idPage);
            // Si la propiedad o:block existe recorrer los items,conjuntos,etc relacionados
            if (resourcePage.data['o:block'] != null) {

                for (const detail of resourcePage.data['o:block']) {

                    if (detail['o:layout'] === 'itemShowCase') {
                        //Recorrer los items relacionados a una página
                        for (const data of detail['o:attachment']) {

                            // Obtener detalles del item
                            const item = await this.$axios(data['o:item']['@id']); // Url item
                            console.log(data['o:item']['@id']);
                            if(item.data['o-module-mapping:marker']!==undefined)
                       {
                           for (const coordinate of item.data['o-module-mapping:marker']) {
                              /* let img = '';
                               if (coordinate['o:media'] !== null) {
                                   let media = await this.$axios(coordinate['o:media']['@id']);
                                   img = this.getMediaEmptyOrFilled(media.data);
                               } */

                               this.itemCoordinate.push({
                                   title: this.getPropertyValue(coordinate, 'o-module-mapping:label'),
                                   lng: this.getPropertyValue(coordinate, 'o-module-mapping:lng'),
                                   lat: this.getPropertyValue(coordinate, 'o-module-mapping:lat'),
                               });
                           }
                       }
                        }
                    }
                }
            }

            return this.itemCoordinate;

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
        getPropertyValue(object, attribName) {

            return (object[attribName] !== null) ? object[attribName] : '';

        },
    },

    filters: { },
    computed: { },
}
