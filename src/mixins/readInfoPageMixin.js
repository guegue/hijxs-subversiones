import {async} from "q";

export default {

    data: () => {
        return {}
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
        getPropertyValue(object, attribName, complementAttrib, isObject) {

            let complement = complementAttrib || 'dcterms:';
            let isAttribInObject = isObject || false;

            if (!isAttribInObject)
                return (object[complement + attribName] !== undefined && object[complement + attribName] !== null) ?
                    object[complement + attribName][0]['@value'] : '';

            return (object[complement + attribName] !== undefined && object[complement + attribName] !== null) ?
                object[complement + attribName][isObject[0]] : '';

        },
    }
}
