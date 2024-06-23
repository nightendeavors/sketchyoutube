<template>
  <div class="header-contents">
    <div style="height: 15px"></div>
    <input v-model="title" type="text" placeholder="Enter a title" />
    <button @click="newProject">New</button>

    <div style="height: 15px"></div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th class="fixed-width-date">Date</th>
            <th class="fixed-width">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in sortedItems" :key="project.id">
            <td @click="loadProject(project.id)">
              {{ project.name }}
            </td>
            <td class="fixed-width-date">
              {{ formatDate(project.createdAt) }}
            </td>
            <td class="fixed-width">
              <i
                class="mdi mdi-content-copy action-icon"
                @click="copyProject(project.id)"
                title="Copy"
              ></i>
              <i
                class="mdi mdi-cog action-icon"
                @click="loadSetting(project.id)"
                title="Setting"
              ></i>

              <i
                class="mdi mdi-trash-can action-icon"
                @click="deleteProject(project.id)"
                title="Delete"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { mapActions } from "vuex";
import StorageManager from "./../scripts/StorageManager";

export default {
  data() {
    return {
      title: "",
      test: 0,
      projects: [],
    };
  },
  async mounted() {
    this.projects = await StorageManager.loadProjects();
  },
  computed: {
    sortedItems() {
      return this.projects.slice().sort((a, b) => {
        if (!a.createdAt) return 1; // a의 createdAt이 없는 경우
        if (!b.createdAt) return -1; // b의 createdAt이 없는 경우
        return new Date(b.createdAt) - new Date(a.createdAt); // 최신순으로 정렬
      });
    },
  },
  methods: {
    ...mapActions("confirmDialog", ["showConfirmDialog"]),
    async newProject() {
      if (!this.title) {
        alert("Please enter a title");
        return;
      }

      let genId = this.generateUUID();
      let realId = await StorageManager.newProject({
        newId: genId,
        title: this.title,
      });
      this.$router.push("/project/" + realId);
    },
    async copyProject(id) {
      await StorageManager.copyProject(id);
      window.location.reload();
    },
    loadProject(id) {
      this.$router.push("/project/" + id);
    },
    loadSetting(id) {
      this.$router.push("/projectsetting/" + id);

      // await addDoc(collection(db, "items"), { name: "abc" });
    },
    async deleteProject(id) {
      const result = await this.showConfirmDialog(
        "Are you sure you want to delete this item?"
      );
      if (result) {
        await StorageManager.deleteProject(id);
        window.location.reload();
      } else {
        console.log("Deletion cancelled");
      }
    },
    generateUUID() {
      return uuidv4();
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const now = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const currentYear = now.getFullYear();

      // 올해인지 확인
      if (year === currentYear) {
        return `${month}/${day}`;
      } else {
        return `${year}/${month}/${day}`;
      }
    },
  },
};
</script>
<style scoped>
.table-container {
  padding-left: 10px;
  padding-right: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px; /* 폰트 크기를 줄입니다 */
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}
th {
  background-color: #f4f4f4;
}
td button {
  margin-right: 5px;
  font-size: 12px; /* 버튼 폰트 크기를 줄입니다 */
}
.fixed-width {
  width: 95px; /* 제목 칸의 너비를 고정합니다 */
  word-break: break-word; /* 긴 단어를 줄바꿈 합니다 */
  white-space: normal; /* 여러 줄로 표시될 수 있도록 합니다 */
}
.fixed-width-date {
  width: 55px; /* 제목 칸의 너비를 고정합니다 */
  word-break: break-word; /* 긴 단어를 줄바꿈 합니다 */
  white-space: normal; /* 여러 줄로 표시될 수 있도록 합니다 */
}
.action-icon {
  margin-right: 13px;
  cursor: pointer;
  font-size: 18px; /* 아이콘 폰트 크기를 키웁니다 */
  vertical-align: middle;
}
</style>
