export default {
  data: () => {
    return {
      videosUrl: [],
      videos: [],
      cantVideos: null,
    };
  },
  methods: {
    showVideo(event, index) {
      const targetId = event.currentTarget.id;

      window.lightGallery(document.getElementById(targetId), {
        dynamic: true,
        dynamicEl: this.videos,
        index,
        videojs: true,
        closable: false,
        cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        controls: true,
        autoplay: false,
        progressBar: true,
        thumbnail: true,
        videoAutoplay: false,
        autoplayControls: false,
        hideBarsDelay: 1000
      });
    },
    getClassVideo(page) {
      // page =2 Galeria de videos, page=1 página principal mostrar sólo 6 videos
      this.$axios(
        `${this.$domainOmeka}api/items?resource_class_id=38&site_id=12`
      ) // &site_id=12 site Linea de Tiempo Rafael Salgado
        .then((response) => this.getVideo(response, page))
        .then((videos) => {
          this.$nextTick(() => {
            this.cantVideos = videos;
          });
        });
    },
    getVideo(response, page) {
      return new Promise((resolved, reject) => {
        const itemsPadres = response.data.length;
        let countVideos = 0;
        const maxVideos = parseInt(page) === 1 ? 6 : itemsPadres;

        if (itemsPadres > 0) {
          response.data.forEach((element, indice) => {
            if (
              typeof element['o:media'][0]['@id'] !== 'undefined' &&
              indice < maxVideos
            ) {
              const itemsAnidados = element['o:media'].length;
              element['o:media'].forEach((items, index) => {
                this.$axios(items['@id']).then(async (response) => {
                  const json = response.data;

                  const propertyVideo = {};

                  if (
                    json['o:ingester'] === 'upload' &&
                    ((page === 1 && countVideos < 6) || page === 2)
                  ) {
                    // Video Mp4
                    if (json['o:media_type'].split('/')[0] === 'video') {
                      propertyVideo.html = `<video
                                              class="lg-video-object lg-html5 video-js vjs-default-skin vjs-big-play-centered"
                                              controls
                                              preload="none">
                                              <source
                                                src="${json['o:original_url']}"
                                                type="video/mp4"
                                              >
                                                ${json['o:source']}
                                            </video>`;
                      propertyVideo.thumb =
                        'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                      propertyVideo.titleShort = json['o:source'].substring(
                        0,
                        39
                      );
                      propertyVideo.title = json['o:source'];

                      await this.videos.push(propertyVideo);
                      countVideos += 1;
                    }
                  } else if (
                    (json['o:ingester'] === 'youtube' ||
                      json['o:ingester'] === 'oembed') &&
                    ((page === 1 && countVideos < 6) || page === 2)
                  ) {
                    propertyVideo.title = json['dcterms:title'][0]['@value'];
                    propertyVideo.src = json['o:source'];
                    propertyVideo.thumb = json['o:thumbnail_urls'].medium;
                    propertyVideo.titleShort = json['dcterms:title'][0][
                      '@value'
                      ].substring(0, 39);

                    await this.videos.push(propertyVideo);
                    countVideos += 1;
                  }
                  if (
                    parseInt(itemsPadres) - 1 === indice &&
                    index === parseInt(itemsAnidados) - 1
                  ) {
                    resolved(countVideos);
                  }
                });
              });
            }
          });
        }
      });
    },
  },
};
