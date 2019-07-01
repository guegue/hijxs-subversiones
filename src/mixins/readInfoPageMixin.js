import {async} from "q";

export default {

    data: () => {
        return {
            /*var contentPage ->INICIO*/
            itemsPage:[],
            auxItemsPage:[],
            imgPage:null,
            page:1,
            typePage:'url',
            descripcionPage:null,
            sectionPage:[],
            quantiryItemsToShow:null,
            btnShowMore:false,
            btnActive:true,
            totalAmountItems:0,
            showAlert:false,
            detalleByItem:[],
            currentIdItem:0,
            is_visible_modal:false,
            search:null,
            hasDescription:false,
            relatedVideos:[],
            isVideo:false,
            idMedia:[],
            idItemSet:null,
            thereAreMoreItems:true,
            idItemsPage:[],
            cancelRequest:null,
            currentBreadCrumb: [{text: 'Inicio', href: '/'}],
            /** FIN **/
        }
    },
    mounted() {
    },
    methods: {
        readInfoPage(menuSite) {
            let currentRoute = this.$route.path.toLowerCase();

            for (const infoMenu of menuSite) {
                if (currentRoute === '/' + infoMenu.routePage.toLowerCase())
                    return infoMenu;
            }
        },
        isPartOfGetId(idMedia){

           return new Promise(async(resolved, reject)=>{

           const media = await this.$axios(this.$domainOmeka+'api/media/'+idMedia);

            if(media.data['dcterms:isPartOf']!==undefined)
            {
                const item = await this.$axios(this.$domainOmeka+'api/items/'+media.data['dcterms:isPartOf'][0]['value_resource_id']);

                if(item.data['o:media']!==undefined)
                {
                    let dataMedia = await this.$axios(item.data['o:media'][0]['@id']);
                    // Object.assign(this.itemsPage[img.idItem], propertyVideo)
                    let compObj = Object.assign(dataMedia.data,{idMed:item.data['o:media'][0]['o:id']});

                    resolved(compObj);
                }
                else
                    return null;

            }else resolved(null);
           });
        },
        resetVariables()
        {
            this.itemsPage=[];
            this.auxItemsPage=[];
            this.imgPage=null;
            this.page=1;
            this.typePage='url';
            this.descripcionPage=null;
            this.sectionPage=[];
            this.quantiryItemsToShow=null;
            this.btnShowMore=false;
            this.btnActive=true;
            this.totalAmountItems=0;
            this.showAlert=false;
            /* this.detalleByItem=[];*/
            this.currentIdItem=0;
            this.is_visible_modal=false;
            this.search=null;
            this.hasDescription=false
            this.relatedVideos=[];
            this.isVideo=false;
            this.idMedia=[];
            this.idItemSet=null;
            this.thereAreMoreItems=true;
            this.idItemsPage=[];
            this.currentBreadCrumb= [{text: 'Inicio', href: '/'}];
        },
    }
}
