<script setup lang="ts">
import { ref, computed, watch } from "vue";
import useStore from "@/store";

const options = computed(() => useStore.useClubStore.getClubOptions());
const currentClub = computed(() => useStore.useClubStore.getCurrentClub());

const currentSelection = ref(currentClub.value.clubName);

const handleSelectionChange = (val) => {
  useStore.useClubStore.setCurrentClub(val);
};

watch(currentClub, (newValue, oldValue) => {
  currentSelection.value = newValue;
});
</script>

<template>
  <div class="selection-container">
    <span>选择管理基地：</span>
    <el-select
      v-model="currentSelection"
      placeholder="请选择管理基地"
      value-key="club_id"
      @change="handleSelectionChange"
    >
      <el-option
        v-for="item in options"
        :key="item.club_id"
        :label="item.clubName"
        :value="item"
      ></el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.selection-container {
  height: 100%;
  width: fit-content;
  min-width: 338px;
  margin: 0 16px;
  display: flex;
  align-items: center;

  .el-select {
    width: 300px !important;
  }

  span {
    min-width: 112px;
    color: #000;
    text-align: right;
    font-weight: 600;
  }
}
</style>
