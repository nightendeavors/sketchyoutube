// store/modules/confirmDialog.js
const state = {
  showSectionButtons: true,
  showVideo: false,
  lastSelectedShotId: "",
};

const mutations = {

  setShowSectionButtons(state, value) {
    state.showSectionButtons = value;
  },
  setLastSelectedShotId(state, id) {
    state.lastSelectedShotId = id;
  },
  setShowVideo(state, value) {
    state.showVideo = value;
  },
};

const actions = {
  setShowSectionButtons({ commit }, value) {
    commit("setShowSectionButtons", value);
  },
  setLastSelectedShotId({ commit }, id) {
    commit("setLastSelectedShotId", id);
  },
  setShowVideo({ commit }, value) {
    commit("setShowVideo", value);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
