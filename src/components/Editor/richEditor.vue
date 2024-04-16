<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import E from "wangeditor";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const reditor = ref(null);
let editor: E;

onMounted(() => {
  editor = new E(reditor.value);
  // 配置 onchange 回调函数
  editor.config.onchange = (newHtml: any) => {
    emit("update:modelValue", newHtml);
  };

  // 配置触发 onchange 的时间频率，默认为 200ms
  editor.config.onchangeTimeout = 500; // 修改为 500ms
  editor.create();

  // 使用 "父组件或本组件" 的默认数据 进行初始化
  editor.txt.html(props.modelValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    // 监听父组件数据变化 (例如：加载网络请求返回的数据)
    editor.txt.html(newValue);
  }
);

</script>

<template>
  <div class="editor-container">
    <div ref="reditor"></div>
  </div>
</template>

<style lang="scss" scoped>
.editor-container {
  :deep(.w-e-text-container) {
    text-align: left;
  }
}
</style>
