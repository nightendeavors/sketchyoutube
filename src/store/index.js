import Vue from "vue";
import Vuex from "vuex";
import StorageManager from "@/scripts/StorageManager";
import confirmDialog from "./modules/confirmDialog";
import uiState from "./modules/uiState";
import memoState from "./modules/memoState"
var uuid = require("uuid");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    project: {
      id: "asdf",
      project_name: "test",

      sections: [
        {
          id: "1",
          title: "Section 1",
          shots: [
            {
              id: "1",
              script: "Intro",
              description: "Initial scene of the video",
            },
          ],
        },
        {
          id: "2",
          title: "Section 2",
          shots: [
            { id: "1", script: "Climax", description: "Climax of the video" },
            { id: "2", script: "Cliaamax", description: "Climax of the video" },
          ],
        },
      ],
      memo: "",
      videoUrl: "",
    },
    selectedSectionId: "1",
    selectedSectionIndex: 0,
  },
  getters: {
    getSections: (state) => state.project.sections,
    getSelectedSectionId: (state) => state.selectedSectionId,
    getSelectedSection(state) {
      const section = state.project.sections.find((s) => s.id === state.selectedSectionId);
      return section;
    },
    getSelectedSectionIndex: (state) => state.selectedSectionIndex,
    getProject: (state) => state.project,
    getProjectName: (state) => state.project.project_name,
    getMemo: (state) => state.project.memo,
    getVideoUrl: (state) => state.project.videoUrl,
  },
  mutations: {
    updateSelectedSectionId(state) {
      if (state.project.sections.length > 0) {
        state.selectedSectionId = state.project.sections[0].id;
      }
    },
    setProject(state, project) {
      state.project = project;
    },
    saveProject(state, project) {
      state.project = project;
      StorageManager.updateProject(state.project);
    },
    addSectionAtIndex(state, sectionId) {
      const newSectionId = uuid.v4();
      let newSection = {
        id: newSectionId,
        title: `Section ${newSectionId}`,
        shots: [],
      };

      if (sectionId === -1) {
        const shot = {
          id: uuid.v4(),
          script: "",
          description: "",
        };

        newSection.shots.push(shot);
        state.project.sections.push(newSection);
      } else {
        const index = state.project.sections.findIndex((s) => s.id === sectionId);
        // console.log("index : " + index);
        if (index !== -1) {
          state.project.sections.splice(index, 0, newSection);
        }
      }

      StorageManager.updateProject(state.project);
    },
    deleteSection(state, sectionId) {
      const index = state.project.sections.findIndex((s) => s.id === sectionId);
      if (index !== -1) {
        state.project.sections.splice(index, 1);
        StorageManager.updateProject(state.project);
      }
    },
    swapSection(state, { index, index2 }) {
      const temp = state.project.sections[index];
      state.project.sections[index] = state.project.sections[index2];

      Vue.set(state.project.sections, index2, temp);
      StorageManager.updateProject(state.project);
    },
    addShotAtIndex(state, { sectionId, shotId }) {
      const section = state.project.sections.find((s) => s.id === sectionId);
      const newShotId = uuid.v4();
      const shot = {
        id: newShotId,
        script: "",
        description: "",
        fixedEstimatedTime: 1,
        estimatedTime: 1,
      };

      if (shotId === -1) {
        section.shots.push(shot);
      } else {
        const index = section.shots.findIndex((item) => item.id === shotId);
        if (index !== -1) {
          section.shots.splice(index, 0, shot);
        }
      }

      StorageManager.updateProject(state.project);
    },
    updateShot(state, { sectionId, updatedShot }) {
      const section = state.project.sections.find((s) => s.id === sectionId);
      let shot = section.shots.find((s) => s.id === updatedShot.id);
      shot = updatedShot;
      const totalEstimatedTime = section.shots.reduce((sum, shot) => {
        const estimatedTime = shot.hasOwnProperty("estimatedTime") && shot.estimatedTime > 0 ? shot.estimatedTime : 0;
        const fixedEstimatedTime = shot.hasOwnProperty("fixedEstimatedTime") && shot.fixedEstimatedTime > 0 ? shot.fixedEstimatedTime : 0;
        return sum + Math.max(estimatedTime, fixedEstimatedTime);
      }, 0);
      // console.log("estimatedTimes :" + totalEstimatedTime);
      Vue.set(section, "totalEstimatedTime", parseFloat(totalEstimatedTime.toFixed(1)));

      StorageManager.updateProject(state.project);
    },
    deleteShot(state, { sectionId, shotId }) {
      const section = state.project.sections.find((s) => s.id === sectionId);
      const index = section.shots.findIndex((item) => item.id === shotId);
      if (index !== -1) {
        section.shots.splice(index, 1);
        StorageManager.updateProject(state.project);
      }
    },
    swapShot(state, { section, index, index2 }) {
      const temp = section.shots[index];
      section.shots[index] = section.shots[index2];

      Vue.set(section.shots, index2, temp);
      StorageManager.updateProject(state.project);
    },
    selectSection(state, { id, index }) {
      state.selectedSectionId = id;
      state.selectedSectionIndex = index;
    },
    setMemo(state, data) {
      state.project.memo = data;
      StorageManager.updateProject(state.project);
    },
    setVideoUrl(state, url) {
      state.project.videoUrl = url;
      StorageManager.updateProject(state.project);
    },

    setProjectName(state, { id, name }) {
      console.log(id);
      console.log(name);
      state.project.project_name = name;
      StorageManager.updateProject(state.project);
      StorageManager.changeProjectName(id, name);
    }

  },
  actions: {
    async loadDataFromId({ commit }, id) {
      const project = await StorageManager.getProject(id);
      if (project) {
        commit("setProject", project);
        commit("updateSelectedSectionId");
      }
    },
    saveProject({ commit }, project) {
      if (project) {
        commit("saveProject", project);
      }
    },
    addSection({ commit }) {
      commit("addSectionAtIndex", -1);
    },
    addSectionAtIndex({ commit }, sectionId) {
      commit("addSectionAtIndex", sectionId);
    },
    moveSection({ state, commit }, { sectionId, direction }) {
      const index = state.project.sections.findIndex((s) => s.id === sectionId);

      if (direction === "left") {
        if (index > 0) {
          const index2 = index - 1;
          commit("swapSection", { index, index2 });
        }
      } else {
        if (index < state.project.sections.length - 1) {
          const index2 = index + 1;
          commit("swapSection", { index, index2 });
        }
      }
    },
    deleteSection({ commit }, sectionId) {
      commit("deleteSection", sectionId);
      commit("updateSelectedSectionId");
    },
    addShot({ commit }, sectionId) {
      let shotId = -1;
      commit("addShotAtIndex", { sectionId, shotId });
    },
    addShotAtIndex({ commit }, { sectionId, shotId }) {
      commit("addShotAtIndex", { sectionId, shotId });
    },
    updateShot({ commit }, { sectionId, updatedShot }) {
      commit("updateShot", { sectionId, updatedShot });
    },
    moveShot({ state, commit }, { sectionId, shotId, direction }) {
      const section = state.project.sections.find((s) => s.id === sectionId);
      let index = section.shots.findIndex((s) => s.id === shotId);

      if (direction === "left") {
        if (index > 0) {
          const index2 = index - 1;
          commit("swapShot", { section, index, index2 });
        }
      } else {
        if (index < section.shots.length - 1) {
          const index2 = index + 1;
          commit("swapShot", { section, index, index2 });
        }
      }
    },
    deleteShot({ commit }, { sectionId, shotId }) {
      commit("deleteShot", { sectionId, shotId });
    },
    selectSection({ commit }, { id, index }) {
      commit("selectSection", { id, index });
    },
    setMemo({ commit }, data) {
      commit("setMemo", data);
    },
    setVideoUrl({ commit }, url) {
      commit("setVideoUrl", url);
    },

    setProjectName({ commit }, { id, name }) {
      commit("setProjectName", { id, name });
    }
  },
  modules: {
    confirmDialog,
    uiState,
    memoState
  },
});
