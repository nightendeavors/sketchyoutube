<!-- ConfirmDialog.vue -->
<template>
  <div v-if="visible" class="confirm-dialog">
    <div class="dialog-overlay"></div>
    <div class="dialog-content">
      <p>{{ message }}</p>
      <button @click="confirm">OK</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("confirmDialog", {
      visible: (state) => state.confirmDialogVisible,
      message: (state) => state.confirmMessage,
    }),
  },
  methods: {
    ...mapActions("confirmDialog", ["confirm", "cancel"]),
  },
};
</script>

<style>
/* 간단한 스타일 */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 10;
}
</style>
