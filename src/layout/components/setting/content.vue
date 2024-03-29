<script setup>
import { ref, reactive, toRefs, defineEmits } from "vue";

const emit = defineEmits(["change", "fixedHeader", "sidebarLogo","hideTabs","hideFooter"]);

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
  emit("hideTabs")
}

const handleFooterChange = () => {
  emit("hideFooter")
}
</script>

<template>
  <el-form
    ref="contentFormRef"
    :model="colors"
    label-position="left"
    class="content-form"
    label-width="150px"
  >
    <el-form-item label="隐藏顶栏" prop="primary">
      <el-switch
        v-model="state.showHeader"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleChange"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="固定顶栏" prop="primary">
      <el-switch
        v-model="state.fixedHeader"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleFixedChange"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="侧边logo" prop="primary">
      <el-switch
        v-model="state.sidebarLogo"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleSidebarLogoChange"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="隐藏标签页" prop="primary">
      <el-switch
        v-model="state.hideTabs"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleTabsChange"
      >
      </el-switch> </el-form-item
    ><el-form-item label="隐藏页脚" prop="primary">
      <el-switch
        v-model="state.hideFooter"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleFooterChange"
      >
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.content-form {
  width: 100%;
}
</style>
