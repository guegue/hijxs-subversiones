export default {

    data: () => {
        return {
            resourceClass: [],
            summarySite:null,
            optionsMenu:[]
        }
    },
    methods: {
        getItemTypeClass(id_class) { // Retorna colecciones o conjunto de items con clase Cita(quote) (id=80) o clase id 38

            return new Promise((resolved, reject) => {
                fetch(this.$domainOmeka + "api/item_sets?resource_class_id=" + id_class)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        var sizeResource = json.length;
                        json.forEach((element, index) => {
                            var propertyCollection = {
                                'url': element['o:items']['@id'],
                                'id': element['o:id']
                            }
                            this.resourceClass.push(propertyCollection);

                            if (parseInt(sizeResource) - 1 === index)
                                resolved();
                        });
                    });
            });
        },
        getSites(idSite) { // Consulta cantidad de sitios creados
            let specificSite = arguments.length === 1 ? '/' + idSite : '';

            return window.fetch(this.$domainOmeka + 'api/sites' + specificSite)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return json;
                });
        },
        async buildMenu(idSite, slugSite) {

            const response = await this.$axios(this.$domainOmeka + 'api/sites/' + idSite);
            let items;
            if (response.data['o:navigation'] !== undefined) {
                let responseData = response.data;
                let pages = responseData['o:navigation'];
                items = responseData['o:item_pool'];

                if (responseData['o:summary'] !== null)
                    this.summarySite = responseData['o:summary'].replace(/\r/g, '').split('\n');

                for (const [index, page] of pages.entries()) {
                    let url = '';
                    if (page.type.toLowerCase() === 'page') {

                        url = this.$domainOmeka + 'api/site_pages/' + page.data['id'];
                        let detailsPage = await this.$axios(url);

                        this.optionsMenu.push({
                            positionOption: index,
                            url: this.encrypt(url),
                            slugSite: this.encrypt(slugSite),
                            type: this.encrypt(page.type),
                            slugPage: this.encrypt(detailsPage.data['o:slug']),
                            title: detailsPage.data['o:title'],
                            routePage:this.formatStringToUrl(detailsPage.data['o:title'])

                        });
                        console.log(url + ' slugSite ' + this.encrypt(slugSite) + ' ' + slugSite + ' typ ' + page.type + ' slugPage ' + detailsPage.data['o:slug'] + ' title ' + detailsPage.data['o:title'])
                    } else if (page.type.toLowerCase() === 'url') {
                        let urlSplit = page.data['url'].split('/');

                        urlSplit[3] = urlSplit[3].toLowerCase();

                        let subOption = (urlSplit[3] === 'item-set') ? 'item_sets' : 'item';
                        let url = this.$domainOmeka + 'api/' + subOption + '/' + urlSplit[4];

                        this.optionsMenu.push({
                            positionOption: index,
                            url: this.encrypt(url),
                            slugSite: this.encrypt(slugSite),
                            type: this.encrypt(page.type),
                            slugPage: this.encrypt(urlSplit[4]),
                            title: page.data['label'],
                            routePage:this.formatStringToUrl(page.data['label'])
                        });
                        console.log(url + ' slugSite ' + slugSite + ' typ ' + page.type + ' slugPage ' + urlSplit[4] + ' title ' + page.data['label'])
                    }


                }

            }
            // return a list of ids items
            return items['item_set_id'];
        },
        formatStringToUrl(str) {

            var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
                to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
                mapping = {};

            for (var i = 0, j = from.length; i < j; i++)
                mapping[from.charAt(i)] = to.charAt(i);

                var ret = [];
                for (var k = 0, l = str.length; k < l; k++) {
                    var c = str.charAt(k);
                    if (mapping.hasOwnProperty(str.charAt(k)))
                        ret.push(mapping[c]);
                    else
                        ret.push(c);
                }
            return ret.join('').replace( /[^-A-Za-z0-9]+/g, '-' ).toLowerCase();

        }
    }
}
