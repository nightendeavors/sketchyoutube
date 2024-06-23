<template>
  <div>
    <div class="shot-container" :class="{ checked: shot.checked }">
      <div class="shot-column index">
        {{ orderId }}

        <input
          style="margin-top: 15px"
          type="checkbox"
          v-model="shot.checked"
        />
      </div>
      <div class="shot-column main-inputs">
        <textarea
          v-model="shot.script"
          ref="scriptTextarea"
          rows="2"
          placeholder="Script"
          @input="onTextChanged"
          @blur="updateShotScript(true)"
          @focus="handleFocus(true)"
        ></textarea>
        <textarea
          v-model="shot.description"
          rows="1"
          ref="descriptionTextarea"
          placeholder="Description"
          @input="onDescriptionTextChanged"
          @blur="updateShotScript(false)"
          @focus="handleFocus(false)"
        ></textarea>
      </div>

      <div class="shot-column fixed-time">
        <input
          style="width: 30px"
          type="number"
          v-model.number="shot.fixedEstimatedTime"
          placeholder="Number"
        />
        <div style="height: 4px"></div>
        <div style="text-align: center">{{ calculatedEstimatedTime }}s</div>
      </div>
    </div>
    <div v-if="lastSelectedShotId == shot.id" class="shot-column buttons">
      <div>
        <button style="margin-right: 5px" @click="onClick('remove')">
          Del
        </button>
        <button style="margin-right: 5px" @click="onClick('add')">Add</button>
        <button style="margin-right: 5px" @click="onClick('left')">Up</button>
        <button style="margin-right: 5px" @click="onClick('right')">
          Down
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { defineProps } from "vue";
import { mapActions, mapState } from "vuex";
import MyUtil from "./../scripts/MyUtil";
export default {
  props: {
    shot: {
      type: Object,
      required: true, // shot prop은 필수로 전달받아야 합니다.
      default: () => ({
        id: "0",
        script: "",
        description: "",
        fixedEstimatedTime: 0,
        estimatedTime: 0,
        checked: false,
      }),
    },
    selectedSectionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      textLength: 0,
      textAreaMinHeight: null, // 최소 높이를 저장할 변수
    };
  },
  watch: {
    shot(newVal) {
      this.$nextTick(() => {
        this.onTextChanged();
        this.onDescriptionTextChanged();
      });
    },
  },
  computed: {
    ...mapState("uiState", ["lastSelectedShotId"]),
    calculatedEstimatedTime() {
      return Math.max(this.shot.estimatedTime, this.shot.fixedEstimatedTime);
    },
  },
  mounted() {},
  created() {
    this.initializeShot(this.shot);
    this.updateEstimation();
  },
  methods: {
    ...mapActions(["updateShot", "deleteShot", "addShotAtIndex", "moveShot"]),
    ...mapActions("confirmDialog", ["showConfirmDialog"]),
    ...mapActions("uiState", [
      "setShowSectionButtons",
      "setLastSelectedShotId",
    ]),
    updateShotScript(isScript) {
      let sectionId = this.selectedSectionId;
      let shotData = this.shot;
      this.updateShot({ sectionId: sectionId, updatedShot: shotData });
    },

    handleFocus(isScript) {
      this.setLastSelectedShotId(this.shot.id);
      this.setShowSectionButtons(false);
    },
    initializeShot(shot) {
      const defaults = {
        id: "0",
        script: "",
        description: "",
        fixedEstimatedTime: 0,
        estimatedTime: 0,
        checked: false,
      };
      // console.log("shot " + shot.script);

      // 기본 값 설정
      for (const key in defaults) {
        if (!shot.hasOwnProperty(key)) {
          this.$set(shot, key, defaults[key]);
        }
      }
    },
    async onClick(what) {
      switch (what) {
        case "remove":
          if (
            //아무것도 없는 칸이면 걍 바로 삭제
            MyUtil.isStringEmptyOrNull(this.shot.description) &&
            MyUtil.isStringEmptyOrNull(this.shot.script)
          ) {
            this.deleteShot({
              sectionId: this.selectedSectionId,
              shotId: this.shot.id,
            });
            return;
          }
          const result = await this.showConfirmDialog(
            "Are you sure you want to delete this item?"
          );
          if (result) {
            this.deleteShot({
              sectionId: this.selectedSectionId,
              shotId: this.shot.id,
            });
          }

          break;
        case "left":
          this.moveShot({
            sectionId: this.selectedSectionId,
            shotId: this.shot.id,
            direction: "left",
          });
          break;
        case "right":
          this.moveShot({
            sectionId: this.selectedSectionId,
            shotId: this.shot.id,
            direction: "right",
          });
          break;
        case "add":
          this.addShotAtIndex({
            sectionId: this.selectedSectionId,
            shotId: this.shot.id,
          });
          break;
      }
    },
    onTextChanged() {
      this.updateEstimation();
      this.autoResize();
    },
    onDescriptionTextChanged() {
      const textarea = this.$refs.descriptionTextarea;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    autoResize() {
      const textarea = this.$refs.scriptTextarea;
      if (this.textAreaMinHeight === null) {
        // 초기 최소 높이를 설정
        this.textAreaMinHeight = textarea.scrollHeight;
      }
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(
        this.textAreaMinHeight,
        textarea.scrollHeight
      )}px`;
    },
    updateEstimation() {
      this.shot.estimatedTime = this.calculateVideoLength(this.shot.script);
    },
    calculateVideoLength(script) {
      let englishCharCount = 0;
      let koreanCharCount = 0;

      // 한글과 영어 문자를 구분하여 각각의 개수를 센다
      for (let i = 0; i < script.length; i++) {
        const char = script.charAt(i);
        if (char.match(/[a-zA-Z]/)) {
          englishCharCount++;
        } else if (char.match(/[\u3131-\uD79D]/)) {
          // 한글 범위
          koreanCharCount++;
        }
      }

      // 평균 단어 길이와 말하기 속도를 기반으로 시간을 계산
      const words = englishCharCount / 5;
      const englishMinutes = words / 300;
      const koreanMinutes = koreanCharCount / 330;

      const totalMinutes = englishMinutes + koreanMinutes;
      const totalSeconds = totalMinutes * 60;

      // 최소 시간을 1초로 설정하고, 소수점 1자리까지 반올림
      return Math.max(1, Math.round(totalSeconds * 10) / 10);
    },
  },
};
</script>
<style>
.shot-container {
  display: flex;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  background-color: #f9f9f9; /* 배경색 추가 */
}
.shot-container.checked {
  background-color: #f5eed9;
}

.shot-column {
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-right: 1px solid #ddd; /* 세로선 추가 */
}

.shot-column:last-child {
  border-right: none; /* 마지막 칼럼에는 세로선을 제거 */
}

.index {
  flex: 0 0 10px;
}

.main-inputs {
  flex: 3;
}

.main-inputs input {
  width: 100%; /* 입력 필드 너비를 칼럼 너비에 맞춤 */
  min-width: 150px; /* 최소 너비 설정 */
}

.buttons {
  flex: 0.35;
}
.fixed-time {
  flex: 0.05;
}

.shot-column:last-child {
  flex: 0 0 20px;
}

.shot-column input,
.shot-column textarea,
.shot-column button {
  margin-bottom: 5px;
}

textarea {
  width: 97%; /* 전체 너비 사용 */
  padding: 5px; /* 패딩 추가 */
  border: 2px solid #ccc; /* 테두리 설정 */
  border-radius: 5px; /* 테두리 둥글게 처리 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: border-color 0.1s, box-shadow 0.1s; /* 부드러운 전환 효과 */
  resize: vertical; /* 세로 크기 조정만 가능하게 설정 */
}

textarea:focus {
  border-color: #0056b3; /* 포커스 시 테두리 색 변경 */
  box-shadow: 0 2px 8px rgba(0, 56, 179, 0.2); /* 포커스 시 그림자 색 변경 */
}

textarea::placeholder {
  color: #aaa; /* 플레이스홀더 텍스트 색상 */
}
</style>
