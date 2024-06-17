<script setup lang="ts">
import { computed, PropType } from "vue";
import calendarIcon from "@/assets/svg/calendar.svg?component";
import { message } from "@/utils/message";
import { GetToken } from "@/utils/auth";
import constants from "@/config";

import axios from "axios";

interface CardProductType {
  number: string;
  id: string;
  is_deleted: string;
  update_time: string;
  club_id: string;
  area: string;
  date_time: string;
  arranger_id: string;
  arranger_name: string;
  cleaner_id: string;
  cleaner_name: string;
  image_file: any;
  is_mixed: boolean;
}

const props = defineProps({
  duty: {
    type: Object as PropType<CardProductType>,
  },
});

const isNow = computed(() => {
  const serverDate = new Date(props.duty.date_time.replace(/-/g, "/"));
  const currentDate = new Date();
  return serverDate > currentDate;
});

const emit = defineEmits(["manage-product", "delete-item"]);

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": props.duty.image_file },
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": props.duty.image_file },
]);

const httpRequest = (image) => {
  const { file } = image;
  const { date_time, cleaner_id, club_id } = props.duty;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("date_time", date_time);
  formData.append("member_id", cleaner_id);
  formData.append("club_id", club_id);
  axios({
    method: "POST",
    url: constants.baseUrl + "/club/duty/report_results",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "Guet-S-C-M-S-Token": GetToken(),
    },
  }).then((res) => {
    const data = res.data
    console.log(data);
    
    if (data.status_code / 100 === 2) {
      props.duty.image_file = data.data;
      message("上传成功", { type: "success" });
    }
    else{
      message("上传失败", { type: "error" });

    }
  });
};
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div :class="cardLogoClass">
          <calendarIcon />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            :color="duty.image_file ? '#eee' : isNow ? '#F89898' : '#00a870'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ duty.image_file ? "已完成" : isNow ? "未完成" : "已超时" }}
          </el-tag>
        </div>
      </el-row>
      <el-descriptions :column="2" class="mt-3">
        <el-descriptions-item label="安排人学号 :">{{
          duty.arranger_id
        }}</el-descriptions-item>
        <el-descriptions-item label="姓名 :">{{
          duty.arranger_name
        }}</el-descriptions-item>
        <el-descriptions-item label="值日生学号 :">{{
          duty.cleaner_id
        }}</el-descriptions-item>
        <el-descriptions-item label="姓名 :">{{
          duty.cleaner_name
        }}</el-descriptions-item>
        <el-descriptions-item label="房间号 :">{{
          duty.number
        }}</el-descriptions-item>
        <el-descriptions-item label="打扫面积 :"
          >{{ duty.area }}m²</el-descriptions-item
        >
        <el-descriptions-item label="打扫时间 :">{{
          duty.date_time
        }}</el-descriptions-item>
        <el-descriptions-item label="混合 :">
          <el-tag type="primary">{{
            duty.is_mixed ? "合室" : "非合室"
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="完成图片 :"
          label-align="right"
          align="center"
        >
          <el-image
            v-if="duty.image_file"
            preview-teleported
            loading="lazy"
            :src="duty.image_file"
            :preview-src-list="duty.image_file"
            fit="cover"
            class="w-[148px] h-[148px]"
          />
        </el-descriptions-item>
      </el-descriptions>
      <el-upload
        v-if="!duty.image_file"
        :http-request="httpRequest"
        accept="image/*"
        multiple
        :show-file-list="false"
        class="float-right"
      >
        <el-button type="primary">上传图片</el-button></el-upload
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 24px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
