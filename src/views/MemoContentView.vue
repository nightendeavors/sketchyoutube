<template>
  <div>
    <div style="height: 10px"></div>
    <button @click="saveChanges">Save Changes</button>

    <div style="padding: 15px">
      <textarea
        v-model="myMemo.content"
        @blur="updateProjectData"
        rows="70"
        cols="80"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import StorageManager from "@/scripts/StorageManager";

export default {
  data() {
    return {
      myMemo: {},
      projectId: null,
      videoUrl: "",
    };
  },
  computed: {
    ...mapState("memoState", ["memo"]),
  },
  mounted() {
    this.myMemo = this.memo;
  },
  methods: {
    updateProjectData() {
      StorageManager.updateMemo(this.myMemo);
    },
    saveChanges() {
      // 실제로 필요한 작업을 여기에 수행할 수 있습니다.
      // console.log("Changes saved:", this.myMemo.content);
      StorageManager.updateMemo(this.myMemo);
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 80%;
  font-family: monospace;
}
</style>
