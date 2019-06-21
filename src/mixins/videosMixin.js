export default {
    data: () => {
        return {
            videosUrl: [],
            videos: [],
            cantVideos: null,
        }
    },
    methods: {
        showVideo(event, index){
            let targetId = event.currentTarget.id;

         /*   let video = {
                html: this.videos[index].html,
                thumb: this.videos[index].thumb
            };*/


            window.lightGallery(document.getElementById(targetId), {
                 dynamic: true,
                 dynamicEl: this.videos,
                 index:index,
                 videojs: true,
                 closable: false,
                 cssEasing : 'cubic-bezier(0.25, 0, 0.25, 1)',
                 controls: true,
                 autoplay:false,
                 progressBar:true,
                 thumbnail : true,
                 videoAutoplay : false,
                 autoplayControls:false,
             })
        },
        getClassVideo(page) { //page =2 Galeria de videos, page=1 página principal mostrar sólo 6 videos
            this.$axios(this.$domainOmeka + 'api/items?resource_class_id=38&site_id=12') //&site_id=12 site Linea de Tiempo Rafael Salgado
                .then((response) => this.getVideo(response, page))
                .then((videos) => {
                    this.$nextTick(() => {
                        this.cantVideos = videos;

                       /* window.lightGallery(document.getElementById('video-gallery'), {
                            videojs: true
                        });
*/
                      /*  window.lightGallery(document.getElementById('dynamic'), {
                            mode: 'lg-fade',
                            dynamic: true,
                            cssEasing : 'cubic-bezier(0.25, 0, 0.25, 1)',
                            controls: true,
                            download:false,
                            autoplay:false,
                            progressBar:false,
                            thumbnail : true,
                            videoAutoplay : false,
                            autoplayControls:false,
                            pager:false,
                            zoom:false,
                            share:false,
                            fullscreen:true,
                            dynamicEl: this.videos
                        })*/
                        
                    });
                })
        },
        getVideo(response, page) {
            return new Promise((resolved, reject) => {

                var itemsPadres= response.data.length;
                var countVideos=0;
                var maxVideos = parseInt(page) === 1 ?6:itemsPadres;

                if (itemsPadres > 0) {
                    response.data.forEach((element, indice) => {

                        if (typeof element['o:media'][0]['@id'] !== 'undefined' && indice < maxVideos) {

                            var itemsAnidados = element['o:media'].length;
                            element['o:media'].forEach((items, index)=>{
                            this.$axios(items['@id'])
                                .then(async (response) => {

                                    let json = response.data;

                                    let propertyVideo = {};

                                    if (json['o:ingester'] === 'upload' && ((page===1 && countVideos<6) || page===2)) // Video Mp4
                                    {
                                        if(json['o:media_type'].split('/')[0]==='video')
                                        {
                                            /*propertyVideo.url = json['o:original_url'];
                                            propertyVideo.title = json['o:source'];
                                            propertyVideo.titleShort = json['o:source'].substring(0, 39);
                                            propertyVideo.char = json['o:source'].substring(0, 1);
                                            propertyVideo.idVideo = json['o:id'];
                                            propertyVideo.type = 'Mp4';
                                            propertyVideo.imgThumbnail = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.imgVideo = 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.description = element['dcterms:description'][0]['@value'].substring(0, 126) + '...';*/

                                            propertyVideo.html= '<video class="lg-video-object lg-html5" controls preload="none"><source src="' + json['o:original_url'] + '" type="video/mp4">' + json['o:source'] + '</video>';
                                            propertyVideo.thumb= 'https://sub-versiones.hijosdeperu.org/files/medium/bd560d32c4900d5b594951d717640ebb582c41ab.jpg';
                                            propertyVideo.titleShort = json['o:source'].substring(0,39);
                                            propertyVideo.title = json['o:source'];

                                            await this.videos.push(propertyVideo);
                                            countVideos+=1;
                                        }

                                    } else if ((json['o:ingester'] === 'youtube' || json['o:ingester'] === 'oembed') && ((page===1 && countVideos<6) || page===2)) // Video youtube or vimeo
                                    {
                                        /*propertyVideo.url = (json['o:ingester'] === 'youtube') ?
                                            '//youtube.com/embed/' + json['data'].id + '?wmode=opaque&amp;enablejsapi=1' :
                                            '//player.vimeo.com/video/' + json['data'].video_id+ '?autoplay=1&amp;api=1';*/
                                      //  console.log(json['o:ingester'],propertyVideo.url, json['dcterms:title'][0]['@value']);
                                     /*   propertyVideo.title = json['dcterms:title'][0]['@value'];
                                        propertyVideo.titleShort = json['dcterms:title'][0]['@value'].substring(0, 39);
                                        propertyVideo.char = json['dcterms:title'][0]['@value'].substring(0, 1);
                                        propertyVideo.idVideo = json['o:id'];
                                        propertyVideo.type = (json['o:ingester'] === 'youtube') ? 'youtube' : 'vimeo';
                                        propertyVideo.imgThumbnail = json['o:thumbnail_urls'].medium;
                                        propertyVideo.imgVideo = json['o:thumbnail_urls'].large;
                                        propertyVideo.description = element['dcterms:description'][0]['@value'].substring(0, 126) + '...';*/
                                        propertyVideo.title = json['dcterms:title'][0]['@value'];
                                        propertyVideo.src= json['o:source'];
                                        propertyVideo.thumb = json['o:thumbnail_urls'].medium;
                                        propertyVideo.titleShort = json['dcterms:title'][0]['@value'].substring(0, 39);

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
