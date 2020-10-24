<template>
  <b-row v-if="showAlert" class="justify-content-center">
    <div
      class="alert alert-info alert-dismissible fade show mt-5 w-50 text-center"
      role="alert"
    >
      <strong>Aviso!</strong> No se ha encontrado ningun resultado.
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click="closeAlert"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </b-row>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    callCloseAlert: Function,
    showAlert: Boolean,
  },
  data: () => {
    return {};
  },
  methods: {
    closeAlert() {
      this.callCloseAlert('reset');
    },
  },
};
</script>

<style scoped></style>
