<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    />
    <b-modal
      ref="item-detail"
      no-close-on-backdrop
      size="xl"
      scrollable
      modal-class="modal-item-detail"
      no-close-on-esc
      header-text-variant="light"
      hide-footer @shown="modalShown">

      <template slot="modal-header">
        <b-row class="mr-1 ml-1 pt-1">
          <div class="item-title-modal">
            {{ itemTitle }}
          </div>
          <div class="ml-auto">
            <span
              v-if="modalButtonBack"
              class="modal-button-back"
              @click="showModalItemDetail(itemId, false)"
            >
              <i class="far fa-arrow-alt-circle-left fa-3x"></i>
            </span>
            <span
              class="modal-button-close ml-2"
              @click="hideModalItemDetail"
            >
              <i class="far fa-times-circle fa-3x"></i>
            </span>
          </div>
        </b-row>
        <b-row v-if="modalButtonBack" class="mr-1 ml-1">
          <a
            v-b-tooltip.hover
            title="Regresar al elemento anterior"
            href="#"
            @click="showModalItemDetail(itemId, false)"
          >
            {{ itemRelatedTitle }}
          </a>
        </b-row>
      </template>

      <b-row>
        <b-col cols="8">
          <div class="ml-1 text-justify">
            <p class="font-italic">{{ itemSummary }}</p>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="7">
          <div class="ml-1 mt-2 text-justify">
            <p>{{ itemDescription }}</p>
          </div>
        </b-col>
        <b-col>
          <b-card-body>
            <div class="map-container">
              <l-map ref="itemMap">
                <l-tile-layer :url="urlImageMap" :attribution="attributionMap"></l-tile-layer>
                <l-marker v-for="(marker, index) in itemMarkers" :key="index"
                          :lat-lng="marker"></l-marker>
              </l-map>
              </LMap>
              {{ itemProvenance }}
            </div>
          </b-card-body>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col cols="12" class="tabs-modal">
          <div>
            <b-tabs v-model="tabIndex" content-class="mt-3" fill>
              <b-tab :title-item-class="media.image.length === 0 ? 'd-none' : ''">
                <template slot="title">
                  <div class="button-media-icon-modal">
                    <i class="fas fa-image"></i>
                  </div>
                  IMÁGENES
                </template>
                <template>
                  <div class="row text-center text-lg-left m-5">
                    <div
                      v-for="(image, index) in media.image" :key="index"
                      class="col-lg-3 col-md-4 col-6"
                    >
                      <a
                        :id="'images-' + index"
                        href="javascript:"
                        class="d-block mb-4 images"
                        :data-index="index"
                        @click="showImagesVideos"
                      >
                        <img
                          class="img-fluid img-thumbnail"
                          :src="image.thumbnail"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </template>
              </b-tab>
              <b-tab :title-item-class="media.video.length === 0 ? 'd-none' : ''">
                <template slot="title">
                  <div class="button-media-icon-modal">
                    <i class="fas fa-play-circle"></i>
                  </div>
                  VIDEOS
                </template>
                <template>
                  <div class="row text-center text-lg-left m-5">
                    <div
                      v-for="(video, index) in media.video" :key="index"
                      class="col-lg-3 col-md-4 col-6"
                    >
                      <a
                        :id="'videos-' + index"
                        href="javascript:"
                        class="d-block mb-4 videos"
                        :data-index="index"
                        @click="showImagesVideos"
                      >
                        <img
                          v-if="video.thumbnail !== null"
                          class="img-fluid img-thumbnail"
                          :src="video.thumbnail"
                          alt=""
                        />
                        <img
                          v-else
                          class="img-fluid img-thumbnail img-thumbnail-video-not-found"
                          src="../assets/img/video-thumbnail-not-found.png"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </template>
              </b-tab>
              <b-tab :title-item-class="media.application.length === 0 ? 'd-none' : ''">
                <template slot="title">
                  <div class="button-media-icon-modal">
                    <i class="far fa-file-alt"></i>
                  </div>
                  DOCUMENTOS
                </template>
                <template>
                  <div class="row text-center text-lg-left m-5">
                    <div
                      v-for="(doc, index) in media.application" :key="index"
                      class="col-lg-3 col-md-4 col-6"
                    >
                      <h6>{{ doc.name }}</h6>
                      <a
                        :id="'doc-' + index"
                        href="javascript:"
                        class="d-block mb-4 doc"
                        :data-index="index"
                        @click="showModalItemDocumentDetailIndividual(doc.url)"
                      >
                        <img
                          class="img-fluid img-thumbnail"
                          :src="doc.thumbnail"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </template>
              </b-tab>
              <b-tab :title-item-class="media.audio.length === 0 ? 'd-none' : ''">
                <template slot="title">
                  <div class="button-media-icon-modal">
                    <i class="fas fa-file-audio"></i>
                  </div>
                  AUDIOS
                </template>
                <template>
                  <b-row class="audio-player-wrapper">
                    <b-col cols="6" class="mb-5 mx-auto">
                      <aplayer v-if="media.audio.length > 0" :music="audioList[0]" :list="audioList"/>
                    </b-col>
                  </b-row>
                </template>
              </b-tab>
              <b-tab :title-item-class="itemsRelatedEspecific.length === 0 ? 'd-none' : ''">
                <template slot="title">
                  <div class="button-media-icon-modal">
                    <i class="fab fa-discourse"></i>
                  </div>
                  RELACIONADOS
                </template>
                <template>
                  <div class="row text-center m-5">
                    <div v-for="(itemRelated, index) in itemsRelatedEspecific" :key="index"
                         class="col-lg-3 col-md-4 col-6">
                      <b-card
                        class="card-item-related"
                        no-body
                        style="max-width: 20rem"
                        :img-src="
                          itemRelated.hasMedia
                            ? itemRelated.image
                            : 'https://placekitten.com/380/200'
                        "
                        img-alt="Image"
                        img-top
                        header-class="card-item-related-header"
                        @click="
                          showModalItemDetail(
                            itemRelated.id,
                            (selectedRelated = true)
                          )
                        "
                      >
                        <h4 slot="header">{{ itemRelated.title }}</h4>
                      </b-card>
                    </div>
                  </div>
                </template>
              </b-tab>
            </b-tabs>
          </div>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      ref="item-document-detail-individual"
      no-close-on-backdrop
      size="xl"
      scrollable
      modal-class="modal-item-detail modal-item-detail-document"
      header-text-variant="light"
      hide-footer
      @hidden="hideModalItemDocumentDetailIndividual"
    >
      <template slot="modal-header" slot-scope="{ close }">
        {{ itemTitle }}
        <span
          class="modal-button-close float-right"
          @click="hideModalItemDocumentDetailIndividual"
        ><i class="far fa-times-circle fa-3x"></i
        ></span>
      </template>

      <b-row>
        <b-col cols="10 mx-auto">
          <div>
            <b-embed :src="documentUrl"></b-embed>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon} from 'vue2-leaflet';
import itemMixin from '../mixins/itemMixin';

export default {
  name: 'ModalItemDetail',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  mixins: [
    itemMixin,
  ],
  data() {
    return {
      tabIndex: 0,
      documentUrl: null,
      audioUrl: null,
      itemId: '',
      itemTitle: '',
      itemSummary: '',
      itemDescription: '',
      itemProvenance: '',
      itemMarkers: [],
      itemCenterMarker: '',
      modalButtonBack: false,
      itemRelatedTitle: '',
      media: {
        image: [],
        video: [],
        application: [],
        audio: [],
      },
      audioList: [],
      itemsRelatedEspecific: [],
      modalDocumentIsVisible: false,
      urlImageMap: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attributionMap:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      isLoading: false,
      fullPage: true,
    };
  },
  mounted() {
    // Cerrar modal luego de quitar el focus de imágenes o videos
    document.addEventListener('keydown', (evt) => {
      evt = evt || window.event;
      let isEscape = false;

      if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
        isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {

        if (document.querySelector('.lightgallery') === null && this.modalDocumentIsVisible === false) {
          this.$refs['item-detail'].hide();
        }
      }
    });
  },
  methods: {
    async loadMediaItem(idItem) {

      this.media = {
        image: [],
        video: [],
        application: [],
        audio: []
      };

      this.audioList = [];

      const responseItem = await this.$axios(`${this.$domainOmeka}api/items/${idItem}`);
      const item = responseItem.data;

      // Si el item tiene multimedia
      if (item['o:media'].length > 0) {
        if ((typeof item['o:media'][0]['@id']) !== 'undefined') {

          // Se recorre cada recurso para determinar el tipo archivo multimedia
          for (const mediaItem of item['o:media']) {

            const urlMediaItem = mediaItem['@id'];

            const response = await this.$axios(urlMediaItem);

            let provider;
            let mediaType;
            let urlResource;
            let nameResource;
            let thumbnailResource;
            let squareThumbnailResource;
            let resource;
            let hasExternalProvider;

            // El proveedor del arhivo multimedia
            provider = response.data['o:ingester'];

            // Url del recurso
            urlResource = response.data['o:original_url'];

            // Nombre del recurso
            nameResource = response.data['o:source'];

            // Thumbnail del recurso
            squareThumbnailResource = response.data['o:thumbnail_urls'].square;

            if (squareThumbnailResource !== undefined) {

              thumbnailResource = squareThumbnailResource;
            } else {
              thumbnailResource = null
            }

            // Si es cualquier de estos proveedores entonces se entiende que es video
            if (provider === 'vimeo' || provider === 'youtube') {
              mediaType = 'video';

              urlResource = response.data['o:source'];
              nameResource = null;

              hasExternalProvider = true;
            } else if (response.data['o:media_type'] !== null) {
              mediaType = response.data['o:media_type'].split("/")[0];
              hasExternalProvider = false;
            }

            // Cada recurso multimedia
            resource = {
              provider: hasExternalProvider,
              url: urlResource,
              name: nameResource,
              thumbnail: thumbnailResource
            };

            if (mediaType === 'image') {
              this.media.image.push(resource);
            } else if (mediaType === 'video') {
              this.media.video.push(resource);
            } else if (mediaType === 'application') {
              this.media.application.push(resource);
            } else if (mediaType === 'audio') {
              this.media.audio.push(resource);
              this.audioList.push({
                title: resource.name,
                artist: 'Hijxs',
                src: resource.url,
                pic: resource.thumbnail
              });
            } else {

            }

          }
        }
      }
    },
    modalShown() {
      const map = this.$refs.itemMap.mapObject;
      map.invalidateSize();

      if (this.itemCenterMarker !== null && this.itemMarkers.length > 0) {
        const [...coordinates] = this.itemMarkers.map(marker => [marker.lat, marker.lng]);
        map.fitBounds([...coordinates]);
        map.panTo(this.itemCenterMarker);
      }
    },
    showImagesVideos(event) {
      const imagesVideos = [];
      let target, targetId;
      let sources = [];

      const index = event.currentTarget.getAttribute('data-index');

      target = event.currentTarget.classList;
      targetId = event.currentTarget.id;

      /* Si es ver videos se debe validar si son proveidos por app externa o son subidos a omeka
                *  en dependencia de eso es como se deben pasar a lightgallery
                * */
      if (target.contains('videos')) {
        sources = this.media.video;

        sources.forEach((video) => {

          let videoSource = {};

          // Si el video es de vimeo/youtube
          if (video.provider) {
            videoSource = {
              src: video.url,
              thumb: video.thumbnail
            }
          } else {
            videoSource = {
              html: `<video class="lg-video-object lg-html5" controls><source src="${video.url}" type="video/mp4">${video.name}</video>`,
              thumb: video.thumbnail
            }
          }

          imagesVideos.push(videoSource);
        });
      }

      if (target.contains('images')) {
        sources = this.media.image;

        sources.forEach((image) => {
          const imageSource = {
            src: image.url,
            thumb: image.thumbnail
          };

          imagesVideos.push(imageSource);
        });
      }

      lightGallery(document.getElementById(targetId), {
        index: parseInt(index, 10),
        dynamic: true,
        dynamicEl: imagesVideos,
        addClass: 'lightgallery'
      });

    },
    async showModalItemDetail(idItem, selectedRelated) {
      if (!selectedRelated) {
        this.itemId = idItem;
      }

      // Muestra en el item relacionado el titulo del padre
      if (selectedRelated) {
        this.itemRelatedTitle = this.itemTitle;
      } else {
        this.itemRelatedTitle = '';
      }

      this.isLoading = true;

      let lat = 0;
      let lng = 0;
      this.itemMarkers = [];

      this.modalButtonBack = false;

      if (selectedRelated) {
        this.modalButtonBack = !this.modalButtonBack;
      }

      const url = `${this.$domainOmeka}api/items/${idItem}`;

      const response = await this.$axios(url);
      const item = response.data;

      this.itemTitle = item['dcterms:title'][0]['@value'];
      this.itemSummary = item['dcterms:abstract'][0]['@value'];
      this.itemDescription = item['dcterms:description'][0]['@value'];
      this.itemProvenance = item['dcterms:provenance'][0]['@value'];

      if (item['o-module-mapping:marker'] !== undefined) {
        const promesas = [];
        for (const marker of item['o-module-mapping:marker']) {
          promesas.push(this.obtenerCoordenadasItem(marker['@id']));
        }
        const coordenadas = await Promise.all(promesas);

        coordenadas.forEach(marker => {
          lat += marker['o-module-mapping:lat'];
          lng += marker['o-module-mapping:lng'];

          this.itemMarkers.push(L.latLng(
            marker['o-module-mapping:lat'],
            marker['o-module-mapping:lng']
          ));
        });

        this.itemCenterMarker = L.latLng(
          lat / this.itemMarkers.length,
          lng / this.itemMarkers.length,
        );

      } else {
        const geocoder = new google.maps.Geocoder();
        const address = this.itemProvenance;

        await geocoder.geocode({'address': address}, (response, status) => {
          if (status === 'OK') {
            const firstResult = response[0];
            const latG = firstResult.geometry.location.lat();
            const lngG = firstResult.geometry.location.lng();

            this.itemMarkers.push(L.latLng(latG, lngG));

            this.itemCenterMarker = L.latLng(latG, lngG);

            this.loadMapG();

          } else {
            console.log(`Google maps no se pudo cargar: ${status}`);
          }

        });
      }

      await this.loadMediaItem(idItem);

      this.loadItemsRelatad().then(() => {
        this.itemsRelatedEspecific = [];

        this.itemsRelated.forEach((itemRelated) => {
          if (idItem === itemRelated.id_item_related) {
            this.itemsRelatedEspecific.push(itemRelated);
          }
        });
      });

      this.isLoading = false;

      if (selectedRelated !== false) {
        const media = Object.values(this.media);
        for (let i = 0; i < media.length; i += 1) {
          if (media[i].length > 0) {

            this.tabIndex = i;
            break;
          }
        }
      }

      if (selectedRelated === false) {
        this.tabIndex = 4; // Corresponde a "RELACIONADOS"
      }

      this.$refs['item-detail'].show();
    },
    async obtenerCoordenadasItem(url) {
      const mappingMarkers = await this.$axios(url);
      return mappingMarkers.data;

    },
    hideModalItemDetail() {
      this.$refs['item-detail'].hide();
    },
    showModalItemDocumentDetailIndividual(url) {

      this.selectDocument(url);

      this.$refs['item-document-detail-individual'].show();
      this.modalDocumentIsVisible = true;
    },
    hideModalItemDocumentDetailIndividual() {
      this.$refs['item-document-detail-individual'].hide();
      this.modalDocumentIsVisible = false;
    },
    selectDocument(url) {
      this.documentUrl = url;
    },
    selectAudio(url) {
      this.audioUrl = url;
    },
    loadMapG() {
      const map = this.$refs.itemMap.mapObject;

      map.invalidateSize();

      map.whenReady(() => {
        const [...coordinates] = this.itemMarkers.map(marker => [marker.lat, marker.lng]);

        map.fitBounds([...coordinates]);
        map.panTo(this.itemCenterMarker);
      });
    }
  }
};
</script>

<style scoped>
@import '~leaflet/dist/leaflet.css';

.audio-player-wrapper {
  margin: 0;
}

.map-container {
  width: 100%;
  height: 270px;
}

.button-media-icon-modal {
  color: #152f4e;
  background: white;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  display: inline-block;
  padding-top: 1px;
  padding-left: 1px;
}

.card {
  border: 0;
}

.card-body {
  padding: 0;
}

.tabs-modal {
  padding: 0 !important;
}

.img-fluid {
  height: 100% !important;
}

.card-item-related:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: 0.5s;
  color: #65b32e;
}

.card-item-related-header {
  background: #213853;
  min-height: 100px;
}

.modal-button-close:hover {
  cursor: pointer;
  color: #65b32e;
}

.modal-button-back:hover {
  cursor: pointer;
  color: #65b32e;
}

.item-title-modal {
  position: absolute;
  font-size: 30px;
  font-weight: bold;
}

.img-thumbnail-video-not-found {
  background: transparent !important;
}
</style>

<style>
@import '~leaflet/dist/leaflet.css';

.aplayer-pic .aplayer-play {
  border: 2px solid #fff !important;
  background: #000 !important;
}

.aplayer-pic .aplayer-pause {
  border: 2px solid #fff !important;
  background: #000 !important;
}

.nav-tabs {
  background: #213853;
  border: 0 !important;
}

.nav-tabs .nav-link {
  color: white;
}

.nav-tabs .nav-link:hover,
.nav-tabs .nav-link:focus {
  color: #65b32e !important;
  border: 0;
}

.nav-tabs .nav-link.active {
  color: #65b32e !important;
  background: #213853 !important;
  border-color: #65b32e !important;
  border-left: 0;
  border-top: 0;
  border-right: 0;
  border-bottom: 5px solid;
}

.modal-item-detail > .modal-dialog {
}

.modal-item-detail > .modal-dialog > .modal-content {
  color: white;
  background: #152f4e;
  border-radius: 0;
}

.modal-item-detail > .modal-dialog > .modal-content > .modal-header {
  display: inline-block !important;
  color: white;
  background: #152f4e;
  border-radius: 0;
  border: 0;
}

.modal-item-detail > .modal-dialog > .modal-content > .modal-body {
  color: white;
  background: #152f4e;
}

.modal-item-detail-document > .modal-dialog {
  top: 10%;
  width: 62%;
}
</style>

<style>
.vld-overlay.is-full-page {
  z-index: 1500 !important;
}
</style>
