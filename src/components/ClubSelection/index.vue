<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { message } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  /** 社团选择器状态 */
  status: {
    // true：表示内部界面切换管理的社团，false：表示外部界面用于选择进入的社团管理端
    type: Boolean,
    default: true,
    required: false,
  },
  /** 是否显示标签 */
  showLabel: {
    type: Boolean,
    default: true,
    required: false,
  },
  /** 编辑标签 */
  label: {
    type: String,
    default: "",
    required: false,
  },
});

const { status, showLabel, label } = props;

const options = computed(() => useStore.clubStore.getClubOptions());
const currentClub = computed(() => useStore.clubStore.getCurrentClub());
const isSuperAdmin = computed(() => useStore.clubStore.getRoleSuperAdmin());
const currentRoute = ref("");

const currentSelection = ref(status ? currentClub.value : "");

const formatLabel = (item) => {
  return `${item.department_name}—${item.club_name}—${item.role}`;
};

const handleSelectionChange = (val) => {
  useStore.clubStore.setCurrentClub(val);
  useStore.clubStore.setCurrentRole(val.role);
  currentRoute.value = route.fullPath;
  // 刷新界面
  if (status) {
    router.push("/refresh").then(() => {
      router.replace({ path: currentRoute.value });
    });
  }
};

watch(currentClub, (newValue) => {
  currentSelection.value = newValue;
});

onMounted(async () => {
  useStore.clubStore.clearOptionsList()
  useStore.clubStore.isAvailable();
  if (isSuperAdmin.value) {
    if (status && !currentClub.value) {
      message("当前为：超级管理员，请选择需要管理的基地", {
        type: "info",
        showClose: false,
      });
    }
    await useStore.clubStore.getClubOptionsList();
  } else {
    await useStore.clubStore.getMyClubOptionList();
  }
  // 保证角色权限来自于后端
  let index = useStore.clubStore.findOptionRole(currentSelection.value);
  if (index > -1) {
    useStore.clubStore.setCurrentClub(options.value[index]);
    useStore.clubStore.setCurrentRole(options.value[index].role);
  }
});
</script>

<template>
  <div class="selection-container">
    <span v-if="showLabel && !label">{{ status ? "当前基地:" : "选择管理基地:" }}</span>
    <span v-else>{{ label }}</span>
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
  display: flex;
  align-items: center;

  .el-select {
    width: 300px;
  }

  span {
    width: 100%;
    width: fit-content;
    color: #000;
    text-align: right;
    font-weight: 600;
    padding-right: 12px;
  }
}
</style>
