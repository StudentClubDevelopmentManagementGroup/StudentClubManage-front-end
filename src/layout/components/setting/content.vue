<script setup>
import { ref, reactive, toRefs, defineEmits } from "vue";

const emit = defineEmits([
  "change",
  "fixedHeader",
  "sidebarLogo",
  "hideTabs",
  "hideFooter",
]);

const contentFormRef = ref(null);
const state = reactive({
  showHeader: true,
  fixedHeader: false,
  hideFooter: false,
  hideTabs: false,
  sidebarLogo: true,
});

const handleChange = () => {
  emit("change");
};

const handleFixedChange = () => {
  emit("fixedHeader");
};

const handleSidebarLogoChange = () => {
  emit("sidebarLogo");
};

const handleTabsChange = () => {
  emit("hideTabs");
};

const handleFooterChange = () => {
  emit("hideFooter");
};
</script>

<template>
  <el-form
    ref="contentFormRef"
    label-position="left"
    class="content-form"
    label-width="150px"
  >
    <el-form-item label="隐藏顶栏" prop="primary">
      <el-switch v-model="state.showHeader" @change="handleChange"> </el-switch>
    </el-form-item>
    <el-form-item label="固定顶栏" prop="primary">
      <el-switch v-model="state.fixedHeader" @change="handleFixedChange">
      </el-switch>
    </el-form-item>
    <el-form-item label="侧边logo" prop="primary">
      <el-switch v-model="state.sidebarLogo" @change="handleSidebarLogoChange">
      </el-switch>
    </el-form-item>
    <el-form-item label="隐藏标签页" prop="primary">
      <el-switch v-model="state.hideTabs" @change="handleTabsChange">
      </el-switch> </el-form-item
    ><el-form-item label="隐藏页脚" prop="primary">
      <el-switch v-model="state.hideFooter" @change="handleFooterChange">
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.content-form {
  width: 100%;
}
:deep(.el-switch__core) {
  --el-switch-off-color: var(--pure-switch-off-color);
  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}
</style>
