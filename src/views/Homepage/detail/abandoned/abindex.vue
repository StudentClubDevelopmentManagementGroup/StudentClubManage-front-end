<script setup lang="ts">
/**
 * @deprecated 这个界面配套废弃的图片组件而抛弃使用
 */

import { ref, reactive, onMounted, shallowRef } from "vue";

import { useRoute } from "vue-router";
import DOMPurify from "dompurify";

import useStore from "@/store";
import announcementApi from "@/api/announcement";

import DomTreeRenderer from "./DomTreeRenderer.vue";

const route = useRoute();

const content = reactive({
  title: "",
  html: "",
  publish_time: "",
  department_name: "",
  club_name: "",
  author_name: "",
});

function getFilePathFromUrl(url) {
  // 格式一般为：http://guet-student-club-management-system.oss-cn-guangzhou.aliyuncs.com/upload/club/announcement/file/3454918bed7149de932038432fbf6ef5.jpg?Expires=1718085095&OSSAccessKeyId=LTAI5tFJPBYi4LkSofQyzHvW&Signature=ExC0g6FeMWCxgM94ZUMeRp5MM%2Fo%3D
  // 获取文件的 file_id
  const pathAndQuery = url.split("?")[0]; // 去除查询字符串部分

  var startIndex = pathAndQuery.indexOf("/", 8) + 1; // 跳过协议

  return "/a" + pathAndQuery.slice(pathAndQuery.indexOf("/", startIndex)); // 排除域名部分与/upload部分
}

const fetchContent = () => {
  return new Promise((resolve, reject) => {
    announcementApi
      .getNoticeContent(route.query.announcementId)
      .then((data) => {
        useStore.navigationStore.updateNaviOptionTabName(route.fullPath, data.title);
        content.title = data.title;
        content.html = DOMPurify.sanitize(data.content);
        content.publish_time = data.publish_time;
        content.department_name = data.department_name;
        content.club_name = data.club_name;
        content.author_name = data.author_name;
        resolve(data);
      })
      .catch((err) => {
        console.warn(err.message);
        reject(err);
      });
  });
};

const rootElement = ref([]);

const traverseDOM = (node) => {
  let containImg = false;
  // 创建一个表示当前节点的对象
  const nodeObject = {
    element: node,
    children: [],
    containImg: false,
  };

  // 如果节点是元素节点
  if (node.nodeType === Node.ELEMENT_NODE) {
    // 检查当前节点是否为img元素
    if (node.tagName === "IMG") {
      containImg = true;
      // tagName: shallowRef(myImage), // 获取组件的引用对象
      nodeObject.element = {
        tagName: "IMG",
        style: node.style,
        src: getFilePathFromUrl(node.src),
        alt: node.alt,
        containerStyle: "inline-block",
        imagePreview: true,
      };
    } else {
      // 递归处理子节点
      Array.from(node.childNodes).forEach((childNode) => {
        const childNodeObject = traverseDOM(childNode);
        nodeObject.children.push(childNodeObject);
        // 如果子节点包含img，则更新当前节点的containsImg字段
        if (childNodeObject.containImg) {
          containImg = true;
        }
      });
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    // 文本节点，可以包装在span中或直接保留textContent
    var span = document.createElement("span");
    span.innerHTML = node.textContent;
    nodeObject.element = span;
  }
  // 设置containsImg字段
  nodeObject.containImg = containImg;

  return nodeObject;
};

onMounted(async () => {
  await fetchContent();

  const body = new DOMParser().parseFromString(content.html, "text/html").body;
  rootElement.value = traverseDOM(body).children;
});
</script>

<template>
  <div id="container">
    <!--  -->
    <div />
    <!--  -->
    <div>
      <div class="container-width m-auto">
        <div class="article-container mx-28 flex flex-col items-center justify-center">
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
          <div class="my-4 w-full">
            <dom-tree-renderer v-for="(item, i) in rootElement" :key="i" :node="item" />
          </div>
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
</style>
