<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, shallowRef, toRef } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import flieApi from "@/api/file";
import constants from "@/config";
import { message } from "@/utils/message";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请输入内容...",
  },
});

const emits = defineEmits(["update:modelValue"]);

const mode = "simple";

const valueHtml = toRef(props.modelValue);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const toolbarConfig: any = {
  excludeKeys: ["fullScreen", "codeBlock", "insertVideo"],
};
const editorConfig = { placeholder: props.placeholder, MENU_CONF: {} };

editorConfig.MENU_CONF["uploadImage"] = {
  server: `${constants.baseUrl}/upload_file_to_local_file_system`,
  fieldName: "file",
  maxFileSize: 5 * 1024 * 1024,
  base64LimitSize: 5 * 1024,
  allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"],
  // 自定义插入图片
  customInsert(res: any, insertFn) {
    flieApi
      .getFlieUrl(res.data)
      .then((data) => {
        insertFn(data);
      })
      .catch((error) => {
        message("上传失败", { type: "error" });
      });
  },
};

const handleCreated = (editor) => {
  editorRef.value = editor;
};

const handleChange = () => {
  emits("update:modelValue", valueHtml);
};

const editor = editorRef.value;
onMounted(() => {
  if (editor == null) return;
  editor.config.onchangeTimeout = 2000;
  props.content && editor.setHtml(props.content);
});


onBeforeUnmount(() => {
  if (editor == null) return;
  editor.destroy();
});
</script>

<template>
  <div class="wangeditor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      style="height: 500px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
