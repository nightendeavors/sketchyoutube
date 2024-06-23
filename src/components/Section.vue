<template>
  <div>
    <div v-for="(shot, index) in section.shots" :key="shot.id">
      <Shot
        :shot="shot"
        :selectedSectionId="selectedSectionId"
        :orderId="getOrderId(index + 1)"
      />
    </div>

    <div style="height: 5px"></div>
  </div>
</template>

<script>
import Shot from "./Shot.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Shot,
  },
  computed: {
    // selectedSection() {
    //   return this.sections.find(
    //     (section) => section.id === this.selectedSectionId
    //   );
    // },
    ...mapGetters({
      selectedSectionId: "getSelectedSectionId", // 'getSections' getter를 'sections'라는 컴퓨티드 프로퍼티로 매핑
      section: "getSelectedSection",
      sectionIndex: "getSelectedSectionIndex",
    }),
  },
  methods: {
    ...mapActions([
      "addShot",
      "addSectionAtIndex",
      "moveSection",
      "deleteSection",
    ]),
    ...mapActions("confirmDialog", ["showConfirmDialog"]),
    getOrderId(index) {
      return this.numberToLetters(this.sectionIndex) + index;
    },
    async manageSection(what) {
      switch (what) {
        case "remove":
          const result = await this.showConfirmDialog(
            "Are you sure you want to delete this item?"
          );
          if (result) {
            // 삭제 작업 수행
            console.log("Item deleted");
            this.deleteSection(this.selectedSectionId);
          } else {
            console.log("Deletion cancelled");
          }
          break;
        case "left":
          this.moveSection({
            sectionId: this.selectedSectionId,
            direction: "left",
          });
          break;
        case "right":
          this.moveSection({
            sectionId: this.selectedSectionId,
            direction: "right",
          });
          break;
        case "add":
          this.addSectionAtIndex(this.selectedSectionId);
          break;
      }
    },
    numberToLetters(num) {
      const upperCaseStart = 65; // 'A'
      const lowerCaseStart = 97; // 'a'
      const alphabetLength = 26;

      let result = "";

      while (num >= 0) {
        let letterCode;

        if (num < alphabetLength) {
          letterCode = upperCaseStart + num;
          result += String.fromCharCode(letterCode);
          break;
        } else if (num < alphabetLength * 2) {
          letterCode = lowerCaseStart + (num - alphabetLength);
          result += String.fromCharCode(letterCode);
          break;
        } else {
          // If num exceeds 51 (for 'A' to 'Z' and 'a' to 'z')
          let upperMultiplier = Math.floor(num / (alphabetLength * 2));
          num -= upperMultiplier * (alphabetLength * 2);

          if (num < alphabetLength) {
            letterCode = upperCaseStart + num;
          } else {
            letterCode = lowerCaseStart + (num - alphabetLength);
          }

          result += String.fromCharCode(letterCode);
          num = upperMultiplier - 1;
        }
      }

      return result;
    },
    getEstimatedSectionTime() {
      if (this.section.hasOwnProperty("totalEstimatedTime")) {
        return this.section.totalEstimatedTime;
      } else {
        return 0;
      }
    },
    addShotFromParent() {
      this.addShot(this.selectedSectionId);
    },
  },
};
</script>
