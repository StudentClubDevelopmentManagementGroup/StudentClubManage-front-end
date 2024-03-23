<script setup>
import { ref, reactive, toRefs, defineEmits } from "vue";

const emit = defineEmits(["change", "fixedHeader", "sidebarLogo"]);

const contentFormRef = ref(null);
const state = reactive({
  showHeader: true,
  fixedHeader: false,
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
</script>

<template>
  <el-form
    ref="contentFormRef"
    :model="colors"
    label-position="left"
    class="content-form"
    label-width="100px"
  >
    <el-form-item label="顶栏" prop="primary">
      <el-switch
        v-model="state.showHeader"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleChange"
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
    <el-form-item label="固定顶栏" prop="primary">
      <el-switch
        v-model="state.fixedHeader"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleFixedChange"
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
