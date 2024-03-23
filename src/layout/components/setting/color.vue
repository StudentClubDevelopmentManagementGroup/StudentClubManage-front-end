<script setup>
import { reactive, ref } from "vue";

const emits = defineEmits(["submit"]);

const formRef = ref(null);
const colors = reactive({
  primary: "#1890FF",
});
const predefineColors = ref([
  "#1890ff",
  "#f5222d",
  "#fa541c",
  "#faad14",
  "#13c2c2",
  "#52c41a",
  "#2f54eb",
  "#722ed1",
]);
const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<template>
  <el-form
    ref="formRef"
    :model="colors"
    class="theme-form"
    label-position="left"
    label-width="70px"
  >
    <el-form-item label="主题色" prop="primary">
      <el-color-picker
        v-model="colors.primary"
        :predefine="predefineColors"
        show-alpha
      ></el-color-picker>
    </el-form-item>
    <el-form-item>
      <div class="color-buttons">
        <el-button type="primary" @click="$emit('submit', colors.primary)"
          >切换</el-button
        >
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.theme-form {
  .color-buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
