export default {

    data: () => {
        return {
            resourceClass: []
        }
    },
    methods: {
        getItemTypeClass(id_class) { // Retorna colecciones o conjunto de items con clase Cita(quote) (id=80) o clase id 38
            return new Promise((resolved, reject) => {
                fetch(this.$domainOmeka + 'api/item_sets?resource_class_id=' + id_class)
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
        getSites() { // Consulta cantidad de sitios creados
            return window.fetch(this.$domainOmeka + 'api/sites')
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return json;
                });
        }
    }
}