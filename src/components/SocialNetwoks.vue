<template>
  <!--social networks-->
  <div
    id="social-networks"
    class="position-absolute text-white d-flex flex-column text-center"
  >
    >
    <div class="p-2"><i class="far fa-envelope"></i></div>
    <div class="p-2"><i class="fab fa-facebook-f"></i></div>
    <div class="p-2"><i class="fab fa-twitter"></i></div>
    <div class="p-2"><i class="fab fa-instagram"></i></div>
    <div class="align-self-center">
      <div class="social-vertical-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialNetwoks',
};
</script>

<style scoped>
#social-networks {
  z-index: 3;
  bottom: 0;
  width: 100px;
}

.social-vertical-line {
  height: 80px;
  width: 0;
  border: 2px solid #fff;
}
</style>
