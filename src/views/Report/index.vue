<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import RichEditor from "@/components/Editor/richEditor.vue";
import useStore from "@/store";
import noticeApi from "@/api/announcement";
import { useRenderIcon } from "@/components/Icon/hooks";
import { Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import textUtil from "@/utils/text.ts";
import formatUtil from "@/utils/formatter";

const club_id = computed(() => useStore.userStore.getClubId);

const selected = ref("0");
const richEditor = ref();

const notice = ref({
  club_id: club_id.value,
  title: "",
  content: "",
  summary: "",
  draft_id: "",
});

const clearText = () => {
  richEditor.value.editorClear();
  notice.value = {
    club_id: club_id.value,
    title: "",
    content: "",
    summary: "",
    draft_id: "",
  };
};

</script>

<template>
  <div class="main">
    <el-card shadow="never" class="!p-5">
      <el-tabs v-model="selected">
        <el-tab-pane name="0">
          <template #label>
            <span>编辑年终汇报</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label>
            <span>所有年终汇报</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div v-if="selected == '0'">
        <el-form
          :inline="true"
          class="search-form bg-bg_color w-[99/100] overflow-auto"
        >
          <el-form-item>
            <el-input
              v-model="notice.title"
              placeholder="请输入年终汇报标题"
              clearable
              show-word-limit
              maxlength="30"
              type="text"
              class="!w-[690px] !h-[55px] !text-xl"
            />
            <el-button
              type="danger"
              :icon="Delete"
              class="ml-16"
              @click="clearText"
            >
              一键清空
            </el-button></el-form-item
          ><RichEditor
            ref="richEditor"
            :model-value="notice.content"
            placeholder="请输入年终汇报正文..."
          ></RichEditor>
          <div class="mt-4 flex justify-center">
            <el-button
              type="primary"
              :icon="useRenderIcon('mingcute:horn-fill')"
            >
              发布年终汇报
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
