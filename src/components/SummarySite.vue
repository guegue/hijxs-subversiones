<template>
  <div class="pt-3">
    <b-row class="justify-content-center m-0">
      <b-col class="p-4 col-10 ml-5 border border-summary">
        {{ description }}
      </b-col>
    </b-row>
  </div>
</template>

<script>
import sitesMixin from '../mixins/webSitesMixin';

export default {
  name: 'SummarySite',
  mixins: [sitesMixin],
  data: () => {
    return {
      description: '',
    };
  },
  mounted() {
    const dataSite = this.getSites(this.$idDefauldSite);

    dataSite.then((data) => {
      this.description = data['o:summary'];
    });
  },
};
</script>

<style scoped>
.border-summary {
  border-radius: 9px;
  font-family: 'Lato,Arial,Tahoma,sans-serif';
  color: #5d5d5d;
  font-size: 1.2em;
  font-weight: 400;
}
</style>
