// store/modules/confirmDialog.js
const state = {
  confirmDialogVisible: false,
  confirmMessage: "",
  confirmResolve: null,
};

const mutations = {
  SHOW_CONFIRM_DIALOG(state, message) {
    state.confirmMessage = message;
    state.confirmDialogVisible = true;
  },
  HIDE_CONFIRM_DIALOG(state) {
    state.confirmDialogVisible = false;
  },
  SET_CONFIRM_RESOLVE(state, resolve) {
    state.confirmResolve = resolve;
  },
};

const actions = {
  showConfirmDialog({ commit }, message) {
    return new Promise((resolve) => {
      commit("SHOW_CONFIRM_DIALOG", message);
      commit("SET_CONFIRM_RESOLVE", resolve);
    });
  },
  confirm({ commit, state }) {
    commit("HIDE_CONFIRM_DIALOG");
    state.confirmResolve(true);
  },
  cancel({ commit, state }) {
    commit("HIDE_CONFIRM_DIALOG");
    state.confirmResolve(false);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
