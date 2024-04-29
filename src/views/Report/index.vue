<script setup lang="ts">
import { ref } from "vue";
import RichEditor from "@/components/Editor/richEditor.vue";

const editorValue = ref("默认数据");
const richHtml = ref();
const handleUpdateValue = (val: any) => {
  console.log(val);
  
  richHtml.value = val;
};
</script>

<template>
  <div class="main">
    <RichEditor
      :model-value="editorValue"
      @update:modelValue="handleUpdateValue"
    ></RichEditor>
  </div>
</template>

<style lang="scss" scoped></style>
