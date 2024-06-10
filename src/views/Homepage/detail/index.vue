<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import announcementApi from "@/api/announcement";

import Image from "@/components/Image";

const route = useRoute();

const content = reactive({
  title: "",
  html: "",
  publish_time: "",
  department_name: "",
  club_name: "",
  author_name: "",
});

const fetchContent = () => {
  console.log("fetchContent");
  return new Promise((resolve, reject) => {
    announcementApi
      .getNoticeContent(route.query.announcementId)
      .then((data) => {
        content.title = data.title;
        content.html = data.content;
        content.publish_time = data.publish_time;
        content.department_name = data.department_name;
        content.club_name = data.club_name;
        content.author_name = data.author_name;
      })
      .catch((err) => {
        console.warn(err.message);
      });
  });
};

onMounted(() => {
  fetchContent();
});
</script>

<template>
  <div id="container">
    <!--  -->
    <div />
    <!--  -->
    <div>
      <div class="container-width m-auto">
        <div class="article-container px-28 flex flex-col items-center justify-center">
          <div class="mb-4 mt-8 text-xl font-semibold text-black">
            {{ content.title }}
          </div>
          <el-divider class="!border-t-2 !border-black !my-0" />
          <div class="text-base text-gray-400 mt-2">
            <span class="mr-4">学院：{{ content.department_name }}</span>
            <span class="mr-4">社团：{{ content.club_name }}</span>
            <span class="mr-4">发布者：{{ content.author_name }}</span>
            <span class="mr-4">发布时间：{{ content.publish_time }}</span>
          </div>
          <div class="my-4 w-full h-full" v-html="content.html" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#container {
  min-height: 624px;

  > div:first-child {
    min-height: 50px;
    background: #0071ae;
  }

  > div:nth-child(2) {
    min-height: 574px;
    background: #fff;
  }
}

.article-container {
}
</style>
