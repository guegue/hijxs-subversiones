<template>
  <b-container id="footer" fluid>
    <top-bar
      :flag="false"
      :index-menu="indexMenu"
      :menu-site="menuSite"
      class="ml-0 mr-0 pt-5"
    ></top-bar>

    <b-row class="justify-content-center text-right p-3 mr-5 text-white">
      <b-col sm="12" md="12" lg="12">
        <b-container class="p-2">
          <small>
            &copy; Todos los derechos reservados,
            {{ new Date().getFullYear() }}</small
          >
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import TopBar from '../components/TopBar';

export default {
  name: 'SixthSection',
  components: {
    TopBar,
  },
  props: { indexMenu: null, menuSite: Array },
  data: () => {
    return {};
  },
};
</script>

<style scoped>
#footer {
  background-color: #1f3954;
}
</style>
