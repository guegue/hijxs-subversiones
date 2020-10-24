<template>
  <div id="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';

export default {
  name: 'ItemsMap',
  components: {},
  props: ['itemCoordinate'],
  data() {
    return {
      zoom: 4,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [],
      isShowMap: false,
      map: null,
    };
  },
  watch: {
    itemCoordinate() {
      let latitud = 0;
      let longitud = 0;

      if (!this.isShowMap) {
        this.map = new window.L.Map('map');

        window.L.tileLayer(this.url, {
          attribution: this.attribution,
          maxZoom: 13,
        }).addTo(this.map);

        this.isShowMap = true;
      }

      for (const coordinate of this.itemCoordinate) {
        latitud += coordinate.lat;
        longitud += coordinate.lng;

        // posicion del marcador latitud, longitud
        const marker_location = new window.L.LatLng(
          coordinate.lat,
          coordinate.lng
        );
        // creamos un marcador  y le establecemos su posicion
        const marker = new window.L.Marker(marker_location);
        // agregamos el marcador al mapa
        this.map.addLayer(marker);
        // agregamos un popup al marcador que contiene el titulo
        //  marker.bindPopup(coordinate.title);
        let img = '';
        if (coordinate.img != null) img = coordinate.img;

        const customPopup =
          `<p>${coordinate.title}</p> <img src='${img}' alt='' width='190px'/>` +
          `<p><b>Place: </b> Fray Bentos, Perú</b></p>`;

        // specify popup options
        const customOptions = {
          maxWidth: '500',
          className: 'custom',
        };

        window.L.marker([coordinate.lat, coordinate.lng])
          .bindPopup(customPopup, customOptions)
          .addTo(this.map);
      }
      // contenemos la cantidad de coordinadas
      const { length } = this.itemCoordinate;
      // realizamos el calculo medio de n cantidad de puntos
      const center_position = new window.L.LatLng(
        latitud / length,
        longitud / length + 6
      );
      this.map.attributionControl.setPrefix('');
      // pasamos al mapa el punto medio de lo puntos y zoom por defecto del mapa
      this.map.setView(center_position, this.zoom);
    },
  },
  mounted() {},
};
</script>

<style scoped>
#map {
  position: relative !important;
  z-index: 0;
  width: 100%;
  height: 400px;
}
</style>
