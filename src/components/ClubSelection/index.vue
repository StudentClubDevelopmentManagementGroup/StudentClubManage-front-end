<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import useStore from "@/store";

const props = defineProps({
  status: {
    type: Boolean, // true：表示内部界面切换管理的社团，false：表示外部界面用于选择进入的社团管理端
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
  }
};

const formatLabel = (item) => {
  return `${item.department_name}—${item.club_name}—${item.role}`;
};

watch(currentClub, (newValue, oldValue) => {
  currentSelection.value = newValue;
});

onMounted(() => {
  useStore.useClubStore.getClubOptionsList();
});
</script>

<template>
  <div class="selection-container">
    <span>选择管理基地：</span>
    <el-select
      filterable
      v-model="currentSelection"
      placeholder="请输入/选择管理的基地"
      value-key="club_id"
      @change="handleSelectionChange"
    >
      <el-option
        v-for="item in options"
        :key="item.club_id"
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
