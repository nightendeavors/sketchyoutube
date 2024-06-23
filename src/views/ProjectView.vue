<template>
  <div class="container">
    <div class="top">
      <div style="margin-top: 5px">
        <div style="text-align: left">
          <input
            v-model="projectName"
            @blur="onProjectNameChanged()"
            placeholder="Number"
          />
          <!-- {{ projectName }} -->

          <button style="margin-left: 5px" @click="addSection">
            New Section
          </button>
          <button style="margin-left: 5px" @click="onBackClicked">Back</button>
        </div>

        <div>
          <div>
            Section Control -
            <button @click="onClick('add')">Add</button>
            <button @click="onClick('left')">Left</button>
            <button @click="onClick('right')">Right</button>
            <button @click="onClick('remove')">Remove</button>
          </div>
        </div>
      </div>
      <div v-if="showVideo">
        <youtube-embed :videoId="videoUrl" />
      </div>

      <div style="height: 5px"></div>
      <div class="sections-container">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          class="section-box"
          :class="{ selected: selectedSectionId === section.id }"
          :style="getStyle(section)"
          @click="clickSectionBox({ id: section.id, index })"
        >
          {{ "" }}
        </div>
      </div>

      <div style="height: 5px"></div>
      <div style="text-align: left">{{ getEstimatedSectionTime() }} sec</div>
      <div>
        <button style="margin-right: 5px" @click="addShot()">Add Shot</button>
        <button style="margin-right: 5px" @click="toggleShowMemo">Memo</button>
        <button v-if="videoUrl" @click="setShowVideo(!showVideo)">Video</button>
      </div>
    </div>

    <div class="scrollable">
      <Section ref="refSection" />
      <button style="margin-right: 5px" @click="addShot()">Add Shot</button>
      <div style="height: 5px"></div>
    </div>

    <div v-if="showMemo" class="bottom">
      <textarea
        class="fullsize-textarea"
        v-model="memo"
        placeholder="Memo"
        @blur="updateMemo()"
      ></textarea>
    </div>
  </div>
</template>

<script>
import Section from "../components/Section.vue";
import { mapGetters, mapActions, mapState } from "vuex";
import MyUtil from "@/scripts/MyUtil";
import YoutubeEmbed from "@/components/YoutubeEmbed.vue";

export default {
  components: {
    Section,
    YoutubeEmbed,
  },
  data() {
    return {
      projectId: null,
      showMemo: false,
      projectName: "",
      memo: "",
    };
  },
  async mounted() {
    let paramId = this.$route.params.id;
    if (!paramId) {
      this.$router.replace("/");
    }
    this.projectId = paramId;
    await this.loadDataFromId(this.projectId);

    this.memo = this.getMemo;
    this.projectName = this.getProjectName;
    if (!MyUtil.isStringEmptyOrNull(this.memo)) {
      this.showMemo = true;
    }
  },
  computed: {
    ...mapGetters({
      selectedSectionId: "getSelectedSectionId",
      sections: "getSections", // 'getSections' getter를 'sections'라는 컴퓨티드 프로퍼티로 매핑
      getProjectName: "getProjectName",
      getMemo: "getMemo",
      videoUrl: "getVideoUrl",
    }),
    ...mapState("uiState", ["showSectionButtons", "showVideo"]),
  },
  methods: {
    ...mapActions([
      "addSection",
      "selectSection",
      "loadDataFromId",
      "setMemo",
      "setProjectName",
    ]),
    ...mapActions("uiState", ["setShowSectionButtons", "setShowVideo"]),
    clickSectionBox(id, index) {
      this.selectSection(id, index);
      this.setShowSectionButtons(true);
    },
    getStyle(section) {
      const maxEstimatedTime = this.getEstimatedTotalTime(section);

      const baseWidth = 0.8; // 기본 너비
      const widthPerTimeUnit = window.innerWidth / 800; // 시간 단위당 너비 증가량
      // console.log("inner width : " + window.innerWidth);

      const width = baseWidth + maxEstimatedTime * widthPerTimeUnit;
      return {
        width: `${width}px`,
      };
    },
    onClick(what) {
      if (!this.$refs.refSection) {
        return;
      }
      this.$refs.refSection.manageSection(what);
    },
    getEstimatedTotalTime(section) {
      if (section.hasOwnProperty("totalEstimatedTime")) {
        return section.totalEstimatedTime;
      } else {
        return 0;
      }
    },
    toggleShowMemo() {
      this.showMemo = !this.showMemo;
    },
    updateMemo() {
      this.setMemo(this.memo);
    },
    addShot() {
      if (!this.$refs.refSection) {
        return;
      }
      this.$refs.refSection.addShotFromParent();
    },
    onProjectNameChanged() {
      this.setProjectName({ id: this.projectId, name: this.projectName });
    },
    getEstimatedSectionTime() {
      if (!this.$refs.refSection) {
        return;
      }
      return this.$refs.refSection.getEstimatedSectionTime();
    },
    onBackClicked() {
      this.$router.replace("/");
    },
  },
};
</script>

<style>
.sections-container {
  display: flex; /* Flexbox를 사용하여 요소들을 수평으로 배치 */
  flex-wrap: wrap; /* 내용이 너무 많으면 다음 줄로 넘김 */
}

.section-box {
  cursor: pointer;
  padding: 5px;
  height: 15px;
  border: 1px solid #ccc;
  margin-right: 5px; /* 섹션 사이에 오른쪽 여백 추가 */
}

.section-box.selected {
  background-color: #dff4f8; /* 선택된 박스의 배경색 */
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 전체 화면 높이 */
}

.top,
.bottom {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
}
.top {
  padding-left: 10px;
  padding-right: 10px;
}

.scrollable {
  overflow-y: auto; /* 세로 스크롤 */
  padding: 10px;
}

.bottom {
  background-color: #ebfafd; /* 파란색 계열 */
  height: 30%;
}
.fullsize-textarea {
  width: 100%; /* 부모의 너비에 맞춤 */
  height: 100%; /* 부모의 높이에 맞춤 */
  padding: 8px; /* 내부 패딩 */
  border: 1px solid #e0e0e0; /* 경계선 스타일 */
  box-sizing: border-box; /* border와 padding을 너비와 높이 계산에 포함 */
  resize: none; /* 사용자가 크기 조정 불가 */
}
</style>
