<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./hook.tsx";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    announcement_id: "",
    author_id: "",
    author_name: "",
    content: "",
    publish_time: "",
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
      <span class="name">时间：</span>
      <span>{{ newFormInline.publish_time }}</span>
      &nbsp; &nbsp; &nbsp; &nbsp;
      <span class="name">作者：</span>
      <span>{{ newFormInline.author_id + newFormInline.author_name }}</span>
    </div>
    <br />
    <div v-html="newFormInline.content"></div>
  </div>
</template>
