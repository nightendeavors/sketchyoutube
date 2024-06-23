<template>
  <div>
    <h1>Edit Project Data</h1>
    <div>
      videoUrl
      <input v-model="videoUrl" />
      <button @click="saveVideoUrl">Save</button>
    </div>
    <textarea
      v-model="jsonString"
      @input="updateProjectData"
      rows="70"
      cols="80"
    ></textarea>
    <button @click="saveChanges">Save Changes</button>
    <!-- <pre>{{ project }}</pre> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      jsonString: "",
      projectId: null,
      videoUrl: "",
    };
  },
  async mounted() {
    let paramId = this.$route.params.id;
    console.log("log : " + this.$route.params.id);
    if (!paramId) {
      this.$router.replace("/");
    }
    this.projectId = paramId;
    await this.loadDataFromId(this.projectId);
    this.jsonString = JSON.stringify(this.project, null, 2);
  },
  computed: {
    // selectedSection() {
    //   return this.sections.find(
    //     (section) => section.id === this.selectedSectionId
    //   );
    // },
    ...mapGetters({
      project: "getProject", // 'getSections' getter를 'sections'라는 컴퓨티드 프로퍼티로 매핑
    }),
  },
  methods: {
    ...mapActions(["saveProject", "loadDataFromId", "setVideoUrl"]),
    updateProjectData() {},
    saveChanges() {
      this.saveProject(JSON.parse(this.jsonString));
      // 실제로 필요한 작업을 여기에 수행할 수 있습니다.
      // console.log("Changes saved:", this.project);
    },
    saveVideoUrl() {
      // console.log(this.videoUrl);
      this.setVideoUrl(this.videoUrl);
      window.location.reload();
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 80%;
  font-family: monospace;
  margin-bottom: 20px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>
