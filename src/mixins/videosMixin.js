export default {
    data: () => {
        return {
            videosUrl: [],
            videos: [],
            cantVideos: null,
        }
    },
    methods: {
        getClassVideo(page) { //page =2 Galeria de videos, page=1 página principal mostrar sólo 6 videos
            this.$axios(this.$domainOmeka + 'api/items?resource_class_id=38&site_id=12') // site Linea de Tiempo Rafael Salgado
                .then((response) => this.getVideo(response, page))
                .then((videos) => {
                    this.$nextTick(() => {

                        this.cantVideos = videos;

                        window.lightGallery(document.getElementById('video-gallery'), {
                            videojs: true
                        });
                        
                    });
                })
        },
        getVideo(response, page) {
            return new Promise((resolved, reject) => {

                var itemsPadres= response.data.length;
                var countVideos=0;
                var maxVideos = parseInt(page) === 1 ?itemsPadres: 6;

                if (itemsPadres > 0) {
                    response.data.forEach((element, indice) => {

                        if (typeof element['o:media'][0]['@id'] !== 'undefined' && indice < maxVideos) {

                            var itemsAnidados = element['o:media'].length;
                            element['o:media'].forEach((items, index)=>{
                            this.$axios(items['@id'])
                                .then(async (response) => {

                                    let json = response.data;

                                    let propertyVideo = {
                                        'url': '',
                                        'title': '',
                                        'titleShort': '',
                                        'char': '',
                                        'idVideo': '',
                                        'type': '',
                                        'imgThumbnail': '',
                                        'imgVideo': '',
                                        'description': ''
                                    };

                                    if (json['o:ingester'] === 'upload') // Video Mp4
                                    {
                                        if(json['o:media_type'].split('/')[0]==='video')
                                        {
                                            propertyVideo.url = json['o:original_url'];
                                            propertyVideo.title = json['o:source'];
                                            propertyVideo.titleShort = json['o:source'].substring(0, 39);
                                            propertyVideo.char = json['o:source'].substring(0, 1);
                                            propertyVideo.idVideo = json['o:id'];
                                            propertyVideo.type = 'Mp4';
                                            propertyVideo.imgThumbnail = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.imgVideo = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.description = element['dcterms:description'][0]['@value'].substring(0, 126) + '...';

                                            await this.videos.push(propertyVideo);
                                            countVideos+=1;
                                        }

                                    } else if (json['o:ingester'] === 'youtube' || json['o:ingester'] === 'oembed') // Video youtube or vimeo
                                    {
                                        propertyVideo.url = (json['o:ingester'] === 'youtube') ?
                                            '//youtube.com/embed/' + json['data'].id + '?wmode=opaque&amp;enablejsapi=1' :
                                            '//player.vimeo.com/video/' + json['data'].id + '?autoplay=1&amp;api=1';
                                        propertyVideo.title = json['dcterms:title'][0]['@value'];
                                        propertyVideo.titleShort = json['dcterms:title'][0]['@value'].substring(0, 39);
                                        propertyVideo.char = json['dcterms:title'][0]['@value'].substring(0, 1);
                                        propertyVideo.idVideo = json['o:id'];
                                        propertyVideo.type = (json['o:ingester'] === 'youtube') ? 'youtube' : 'vimeo';
                                        propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                        propertyVideo.imgVideo = json['o:thumbnail_urls'].large;
                                        propertyVideo.description = element['dcterms:description'][0]['@value'].substring(0, 126) + '...';

                                        await this.videos.push(propertyVideo);
                                        countVideos+=1;
                                    }

                                    if (parseInt(itemsPadres) - 1 === indice && index===parseInt(itemsAnidados)-1)
                                    {
                                        resolved(countVideos);
                                    }


                                   });

                                })
                               /* .catch((error) => {
                                    // eslint-disable-next-line no-console
                                    console.log('Error ' + error);
                                });*/
                        }
                    });
                }
            });
        }
    }

}
