<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import RichEditor from "@/components/Editor/richEditor.vue";
import useStore from "@/store";
import noticeApi from "@/api/announcement";
import { useRenderIcon } from "@/components/Icon/hooks";
import Draft from "./draft/draft.vue";
import NoticeList from "./introduce/introduce-list.vue";
import { Delete } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import textUtil from "@/utils/text.ts";

const clubStore = useStore.clubStore;
const club_id = computed(() => clubStore.getCurrentClub().club_id);

const selected = ref("0");
const richEditor = ref();

const notice = ref({
  club_id: club_id.value,
  title: "",
  content: "",
  summary: "",
  draft_id: "",
});

const generateTitle = () => `简介`;

const addNotice = () => {
  notice.value.content = richEditor.value.editorText();
  notice.value.summary = textUtil.extractSummary(notice.value.content);
  notice.value.title = generateTitle();
  noticeApi
    .addNotice(notice.value)
    .then(() => {
      message("发布成功", { type: "success" });
      richEditor.value.editorClear();
      notice.value = {
        club_id: club_id.value,
        title: "",
        content: "",
        summary: "",
        draft_id: "",
      };
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const addDraft = () => {
  notice.value.content = richEditor.value.editorText();
  notice.value.summary = textUtil.extractSummary(notice.value.content);
  notice.value.title = generateTitle();
  noticeApi
    .addDraft(notice.value)
    .then(() => {
      message("保存成功", { type: "success" });
      richEditor.value.editorClear();
      notice.value = {
        club_id: club_id.value,
        title: "",
        content: "",
        summary: "",
        draft_id: "",
      };
    })
    .catch((e) => {
      console.error(e.message);
    });
};

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

const updateDraft = (draftId) => {
  noticeApi
    .getDraftContent(draftId)
    .then((data) => {
      notice.value.draft_id = data.draft_id;
      notice.value.content = data.content;
      notice.value.title = generateTitle(); // 覆盖草稿原有标题
      richEditor.value.setEditorText(data.content);
    })
    .catch((error) => {});
  selected.value = "0";
};
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="!p-5">
      <el-tabs v-model="selected">
        <el-tab-pane name="0">
          <template #label>
            <span>编辑简介</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label>
            <span>历史简介</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="2">
          <template #label>
            <span>草稿箱</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div v-if="selected == '0'">
        <el-form :inline="true" class="search-form bg-bg_color w-[99/100] overflow-auto">
          <el-form-item>
            <el-button type="danger" :icon="Delete" @click="clearText" v-ripple>
              一键清空
            </el-button>
          </el-form-item>
          <RichEditor
            ref="richEditor"
            :model-value="notice.content"
            placeholder="请输入公告正文..."
          ></RichEditor>
          <div class="mt-4 flex justify-center">
            <el-button
              type="primary"
              :icon="useRenderIcon('mingcute:horn-fill')"
              @click="addNotice"
            >
              发布简介
            </el-button>
            <el-button
              type="primary"
              :icon="useRenderIcon('ri:save-fill')"
              @click="addDraft"
              plain
            >
              存草稿
            </el-button>
          </div>
        </el-form>
      </div>
      <div v-if="selected == '1'">
        <NoticeList />
      </div>
      <div v-if="selected == '2'">
        <Draft @updateDraft="updateDraft" />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
