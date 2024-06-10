<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store";

import constants from "@/config";
import baseApi from "@/api/base.js";
import announcementApi from "@/api/announcement.js";

import { IconifyIconOnline } from "@/components/Icon";

const router = useRouter();

const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);
const list4 = ref([]);

const fetchDataList1 = () => {
  const body = {
    page_num: 1,
    page_size: 10,
  };
  // 获取社团信息列表
  return new Promise((resolve, reject) => {
    baseApi
      .getBaseList(body)
      .then((data) => {
        list1.value = data.records;
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};

const fetchDataList2 = () => {
  const body = {
    page_num: 1,
    page_size: 4,
  };
  // TODO: 获取公告信息列表
  return new Promise((resolve, reject) => {
    announcementApi
      .getAllNotice(body)
      .then((data) => {
        list2.value = data.records;
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};

const fetchDataList3 = () => {
  const body = {
    page_num: 1,
    page_size: 4,
  };
  // TODO：获取招新信息列表
  return new Promise((resolve, reject) => {});
};

const fetchDataList4 = () => {
  const body = {
    page_num: 1,
    page_size: 4,
  };
  // TODO：获取活动/比赛信息列表
  return new Promise((resolve, reject) => {});
};

const handleClickBtn1 = () => {
  // 跳转到更多社团信息列表
  useStore.navigationStore.setRouteStatus(true);
  router.replace("/homepage/list");
};

const handleClickBtn2 = () => {
  // 跳转到更多活动/比赛信息列表
  useStore.navigationStore.setRouteStatus(true);
  router.replace("/homepage/list");
};

const handleClickBtn3 = () => {
  // 跳转到更多招新信息列表
};

const handleClickBtn4 = () => {
  //  跳转到更多公告信息列表
};

const handleClickList1 = (val) => {
  useStore.navigationStore.setRouteStatus(true);
  router.replace(`/homepage/list?club_name=${val.club_name}`);
};

const handleClickList2 = (val) => {
  useStore.navigationStore.setRouteStatus(true);
  router.replace(`/homepage/detail?announcementId=${val.announcement_id}`);
};

const handleClickList3 = (val) => {
  console.log("handleClickList3", val);
};

const handleClickList4 = (val) => {
  console.log("handleClickList4", val);
};

onMounted(() => {
  fetchDataList1();
  fetchDataList2();
  fetchDataList3();
  fetchDataList4();
});
</script>

<template>
  <div class="container-width m-auto bg-white p-5">
    <!--  -->
    <div class="inner1 flex">
      <!-- 左上角 -->
      <div class="flex-1">
        <el-card class="!border-0" shadow="never">
          <template #header>
            <div
              class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3 flex justify-between"
            >
              <div>社团信息</div>
              <el-button class="!p-2" v-ripple text @click="handleClickBtn1"
                >更多<el-icon><DArrowRight /></el-icon
              ></el-button>
            </div>
          </template>
          <div
            v-if="list1.length !== 0"
            class="cursor-pointer flex group rounded-lg p-2 text-black hover:bg-sky-500 hover:ring-sky-500"
            v-for="item in list1"
            :key="item"
            @click="handleClickList1(item)"
          >
            <div class="flex flex-1 group-hover:text-white">
              <IconifyIconOnline
                icon="hugeicons:school"
                class="w-[20px] h-[20px] mr-1 text-blue-500 group-hover:text-white"
              />
              {{ item.department_name }}
            </div>
            <div class="flex flex-1 font-semibold group-hover:text-white">
              <IconifyIconOnline
                icon="gravity-ui:persons"
                class="w-[20px] h-[20px] mr-1 text-blue-400 group-hover:text-white"
              />
              {{ item.club_name }}
            </div>
          </div>
          <div v-else class="p-8 text-grey text-xl text-gray-500 text-center">
            暂无数据
          </div>
        </el-card>
      </div>
      <!-- 右上角 -->
      <div class="flex-1">
        <el-card class="!border-0" shadow="never">
          <template #header>
            <div
              class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3 flex justify-between"
            >
              <div>公告信息</div>
              <el-button class="!p-2" v-ripple text @click="handleClickBtn2"
                >更多<el-icon><DArrowRight /></el-icon
              ></el-button>
            </div>
          </template>
          <div
            v-if="list2.length !== 0"
            class="cursor-pointer relative group rounded-lg p-3 pb-7 bg-white shadow-lg hover:bg-sky-500 hover:ring-sky-500"
            v-for="item in list2"
            :key="item"
            @click="handleClickList2(item)"
          >
            <el-text
              class="!text-black !font-semibold !text-lg group-hover:!text-white"
              line-clamp="1"
            >
              <a
                :href="
                  constants.serverUrl +
                  '#/homepage/detail?announcementId=' +
                  item.announcement_id
                "
                >{{ item.title }}</a
              >
            </el-text>

            <el-text class="w-full !text-base group-hover:text-white" line-clamp="1">
              {{ item.summary }}
            </el-text>

            <el-text
              class="w-[100px] !text-base absolute end-1 bottom-1 group-hover:text-black"
            >
              {{ item.publish_time.slice(0, 10) }}
            </el-text>
          </div>
          <div v-else class="p-8 text-grey text-xl text-gray-500 text-center">
            暂无数据
          </div>
        </el-card>
      </div>
    </div>
    <!--  -->
    <div class="inner2 flex">
      <!-- 左下角 -->
      <div class="flex-1">
        <el-card class="!border-0" shadow="never">
          <template #header>
            <div
              class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3 flex justify-between"
            >
              <div>招新信息</div>
              <el-button class="!p-2" v-ripple text @click="handleClickBtn3"
                >更多<el-icon><DArrowRight /></el-icon
              ></el-button>
            </div>
          </template>
          <div
            v-if="list3.length !== 0"
            class="cursor-pointer flex group rounded-lg p-2 text-black hover:bg-sky-500 hover:ring-sky-500"
            v-for="item in list3"
            :key="item"
            @click="handleClickList3(item)"
          ></div>
          <div v-else class="p-8 text-grey text-xl text-gray-500 text-center">
            暂无数据
          </div>
        </el-card>
      </div>
      <!-- 右下角 -->
      <div class="flex-1">
        <el-card class="!border-0" shadow="never">
          <template #header>
            <div
              class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3 flex justify-between"
            >
              <div>活动/比赛信息</div>
              <el-button class="!p-2" v-ripple text @click="handleClickBtn4"
                >更多<el-icon><DArrowRight /></el-icon
              ></el-button>
            </div>
          </template>
          <div
            v-if="list4.length !== 0"
            class="cursor-pointer relative group rounded-lg p-3 pb-7 bg-white shadow-lg hover:bg-sky-500 hover:ring-sky-500"
            v-for="item in list4"
            :key="item"
            @click="handleClickList4(item)"
          >
            <el-text
              class="w-full !text-black !font-semibold !text-lg group-hover:!text-white"
              line-clamp="1"
            >
              <a
                :href="
                  constants.serverUrl +
                  '#/homepage/detail?announcementId=' +
                  item.announcement_id
                "
                >{{ item.title }}</a
              >
            </el-text>

            <el-text class="w-full !text-base group-hover:text-white" line-clamp="1">
              {{ item.summary }}
            </el-text>

            <el-text
              class="w-[100px] !text-base absolute end-1 bottom-1 group-hover:text-black"
            >
              {{ item.publish_time.slice(0, 10) }}
            </el-text>
          </div>
          <div v-else class="p-8 text-grey text-xl text-gray-500 text-center">
            暂无数据
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inner1,
.inner2 {
  .el-card {
    margin: 0 20px;
  }
  ::v-deep(.el-card__header) {
    padding: 0;
  }

  ::v-deep(.el-card__body) {
    padding: 12px 15px !important;
  }
}
</style>
