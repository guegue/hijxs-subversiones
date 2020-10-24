<template>
  <div
    v-b-tooltip.hover
    class="compare-square change-view-timeline"
    title="Cambiar vista"
    @click="changeViewTimeline"
  >
    <span class="change-view-timeline-icon"></span>
  </div>
  <!--<span class="compare-square sidebar-compare-timeline-no-close text-white float-right" @click="changeViewTimeline"><i
            class="fas fa-eye fa-lg"></i></span>-->
</template>

<script>
export default {
  name: 'TimelineChangeView',
  methods: {
    changeViewTimeline() {
      this.$root.$emit('changeViewTimeline');
    },
  },
};
</script>

<style scoped>
.compare-square {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 5px;

  background-color: #65b32e;
  border: none;
  cursor: pointer;
}

.change-view-timeline-icon {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background: url('../../assets/img/automatic-rotation-1.png') no-repeat center
    center;
}

.change-view-timeline-icon:hover {
  cursor: pointer;
}
</style>
