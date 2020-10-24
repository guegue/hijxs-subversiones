<template>
  <b-modal
    ref="document-item"
    size="xl"
    no-close-on-backdrop
    :title="documentProperty[1]"
  >
    <div class="w-mT">
      <b-row class="content-modal-doc">
        <b-col class="pl-3 col-12">
          <!-- <div class="header-content">
                        <h4></h4>
                    </div>-->
          <div class="body-content">
            <embed :src="documentProperty[0]" />
          </div>
        </b-col>
      </b-row>
    </div>

    <div slot="modal-footer" class="w-100"></div>
  </b-modal>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    documentProperty: Array,
  },
  data: () => {
    return {
      documento: null,
    };
  },
  watch: {
    documentProperty(newvalue, oldValue) {
      this.$refs['document-item'].show();
    },
  },
  methods: {},
};
</script>

<style scoped>
.w-mT {
  /* width: 80%;*/
  margin: auto;
  min-height: 70vh !important;
  max-height: 70vh !important;
  overflow-y: auto;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 23px !important;
  padding-top: 100px;
  margin-top: 100px;
  position: absolute;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #e5f1ff;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #f0f5fb;
  background-color: #152f4e; /*007bff */
}

:vertical {
  height: 100px;
}
.body-content embed {
  width: 100%;
  height: 66vh;
}
</style>
