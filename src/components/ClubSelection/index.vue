<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import useStore from "@/store";

const props = defineProps({
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const { status } = props;

const options = computed(() => useStore.useClubStore.getClubOptions());
const currentClub = computed(() => useStore.useClubStore.getCurrentClub());

const currentSelection = ref(currentClub.value);

const handleSelectionChange = (val) => {
  if (status) {
    useStore.useClubStore.setCurrentClub(val);
  } else {
  }
};

const formatLabel = (item) => {
  return `${item.departmentName}—${item.clubName}—${item.role}`;
};

watch(currentClub, (newValue, oldValue) => {
  currentSelection.value = newValue;
});

onMounted(() => {
  if (options.value.length === 0) {
    useStore.useClubStore.getClubOptionsList();
  }
});
</script>

<template>
  <div class="selection-container">
    <span>选择管理基地：</span>
    <el-select
      filterable
      v-model="currentSelection"
      placeholder="请输入/选择管理的基地"
      value-key="clubId"
      @change="handleSelectionChange"
    >
      <el-option
        v-for="item in options"
        :key="item.clubId"
        :label="formatLabel(item)"
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
