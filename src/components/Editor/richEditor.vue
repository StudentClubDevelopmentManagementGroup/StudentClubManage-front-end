<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, shallowRef, toRef } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import announcementApi from "@/api/announcement";
import constants from "@/config";
import { message } from "@/utils/message";
import { GetToken } from "@/utils/auth";

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
  server: `${constants.baseUrl}/club/announcement/file/upload`,
  fieldName: "file",
  maxFileSize: 5 * 1024 * 1024,
  base64LimitSize: 5 * 1024,
  headers: { "Guet-S-C-M-S-Token": GetToken() },
  allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"],
  // 自定义插入图片
  customInsert(res: any, insertFn) {
    insertFn(`${constants.baseUrl}/club/announcement/file/get?file_id=${res.data}`);

    // flieApi
    //   .getFlie(res.data)
    //   .then((data) => {
    //     insertFn(data);
    //   })
    //   .catch((error) => {
    //     message("上传失败", { type: "error" });
    //   });
  },
};

const handleCreated = (editor) => {
  editorRef.value = editor;
};

onMounted(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.config.onchangeTimeout = 2000;
  props.modelValue && editor.setHtml(props.modelValue);
});

const editorClear = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.clear();
};

const editorText = () => {
  return editorRef.value.getHtml();
};

const setEditorText = (html) => {
  editorRef.value.setHtml(html);
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

defineExpose({ editorClear, editorText, setEditorText });
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
    />
    <hr class="border-t border-slate-300" />
  </div>
</template>
