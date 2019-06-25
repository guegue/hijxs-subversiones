<template>
    <div id="map">

    </div>
</template>

<script>
    import 'leaflet/dist/leaflet.css'

    export default {
        name: "items-map",
        props: ['itemCoordinate'],
        components: {},
        data() {
            return {
                zoom: 4,
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                marker: [],
                isShowMap:false,
                map:null,
            }
        },
        mounted() {},
        watch: {
            itemCoordinate: function (){

                var latitud = 0, longitud = 0;

               if(!this.isShowMap)
               {
                   this.map = new window.L.Map('map');

                   window.L.tileLayer(this.url, {
                       attribution: this.attribution,
                       maxZoom: 13,
                   }).addTo(this.map);

                   this.isShowMap=true;
               }


                for (const coordinate of this.itemCoordinate) {
                    latitud = latitud + coordinate.lat;
                    longitud = longitud + coordinate.lng;

                    //posicion del marcador latitud, longitud
                    let marker_location = new window.L.LatLng(coordinate.lat, coordinate.lng);
                    //creamos un marcador  y le establecemos su posicion
                    let marker = new window.L.Marker(marker_location);
                    //agregamos el marcador al mapa
                    this.map.addLayer(marker);
                    //agregamos un popup al marcador que contiene el titulo
                  //  marker.bindPopup(coordinate.title);
                    let img='';
                   if(coordinate.img!=null)
                       img=coordinate.img;

                    var customPopup = "<p>"+coordinate.title+"</p> <img src='"+img+"' alt='' width='190px'/>"+
                                      "<p><b>Place: </b> Fray Bentos, Perú</b></p>";


                    // specify popup options
                    var customOptions =
                        {
                            'maxWidth': '500',
                            'className' : 'custom'
                        };

                    window.L.marker([coordinate.lat, coordinate.lng]).bindPopup(customPopup,customOptions).addTo(this.map);
                }
                //contenemos la cantidad de coordinadas
                let length = this.itemCoordinate.length;
                //realizamos el calculo medio de n cantidad de puntos
                let center_position = new window.L.LatLng(latitud / length, longitud / length);
                this.map.attributionControl.setPrefix('');
                //pasamos al mapa el punto medio de lo puntos y zoom por defecto del mapa
                this.map.setView(center_position, this.zoom);
            }
        },
    }
</script>

<style scoped>

    #map {
        position: relative !important;
        z-index: 0;
        width: 100%;
        height: 400px;
    }
</style>
