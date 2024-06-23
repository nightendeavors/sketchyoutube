// store/modules/confirmDialog.js
const state = {
  memo: {},
};

const mutations = {

  setMemo(state, memo) {
    console.log("come here " + memo.id);
    state.memo = memo;
  },
};

const actions = {
  setMemo({ commit }, memo) {
    commit("setMemo", memo);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
