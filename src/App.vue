<template>
  <div id="app">
    <HomePage/>
  </div>
</template>

<script>
    import HomePage from './views/HomePage.vue';

    export default {
        name: 'app',
        components: {
            HomePage
        }
    }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');

  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Open Sans', sans-serif;
  }

</style>