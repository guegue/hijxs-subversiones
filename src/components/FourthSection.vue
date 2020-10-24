<template>
  <b-container fluid class="video-section position-relative">
    <!--horizontal line-->
    <b-row class="ml-5 pl-5">
      <b-col sm="12" md="12" lg="12">
        <hr class="line-top-title" />
      </b-col>
    </b-row>
    <!--Title Section-->
    <b-row class="ml-5 pl-5 mb-4">
      <b-col sm="12" md="12" lg="12">
        <h1 class="title-video text-uppercase">VIDEOS</h1>
      </b-col>
    </b-row>
    <!--Social Network-->
    <social-network class="position-absolute"></social-network>

    <!--Videos Square-->
    <b-row class="justify-content-center content-video">
      <b-col v-for="row in rowVideo" :key="row" sm="10" md="10" lg="10">
        <ul id="video-gallery" class="video list-unstyled w-video">
          <li
            v-for="(video, index) in videos"
            :id="'video-' + index"
            :key="'#video' + index"
            class="m-1 video-square video"
            @click.prevent="showVideo($event, index)"
          >
            <!--    {{videos[index].video}} -->
            <a href="">
              <img class="img-responsive" :src="video.thumb" height="150px" />
              <div class="demo-gallery-poster">
                <img
                  src="https://sachinchoolur.github.io/lightgallery.js/static/img/play-button.png"
                />
              </div>
              <div class="video_item_section video_item_stats clearfix">
                <span class="pb-1"> {{ video.titleShort }}</span>
              </div>
            </a>
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SocialNetwork from '../components/SocialNetwoks';
import videosMixin from '../mixins/videosMixin';

require('@/assets/css/videos.css');

export default {
  name: 'FourthSection',
  components: {
    SocialNetwork,
  },
  mixins: [videosMixin],
  data: () => {
    return {
      rowVideo: 1,
    };
  },
  created() {
    this.getClassVideo(1); // 1 página principal mostrar solo 6 videos como máximo
  },
  mounted() {},
  updated() {
    if (this.videos.length === this.cantVideos) {
      /* window.lightGallery(document.getElementById('video-gallery'), {
                    videojs: true
                }); */
    }
  },
  methods: {},
};
</script>

<!-- module -->
<style scoped>
.video-section {
  background-image: url('https://www.carbonbrief.org/wp-content/uploads/2018/10/ocean-sunrays-1550x804.jpg');
  height: 600px;
  min-height: 600px;
  max-height: 100%;
  width: 100%;
}

.content-video {
  width: 60%;
  float: right;
}

ul#video-gallery li {
  float: right;
}
</style>
