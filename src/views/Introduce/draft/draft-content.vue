<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./hook.tsx";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    draft_id: "",
    create_time: "",
    update_time: "",
    content: "",
    title: "",
  }),
});
const contentRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return contentRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <div ref="contentRef">
    <div style="text-align: center">
      <h2>{{ newFormInline.title }}</h2>
    </div>
    <br />
    <div>
      <span class="name">创建时间：</span>
      <span>{{ newFormInline.create_time }}</span>
    </div>
    <div>
      <span class="name">更新时间：</span>
      <span>{{ newFormInline.update_time }}</span>
    </div>
    <br />
    <div v-html="newFormInline.content"></div>
  </div>
</template>
