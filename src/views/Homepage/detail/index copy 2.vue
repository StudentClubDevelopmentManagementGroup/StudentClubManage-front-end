<script setup>
import { ref, reactive, onMounted, h, createVNode, resolveComponent } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import announcementApi from "@/api/announcement";

import Image from "@/components/Image";

const route = useRoute();

const testHtml = ref("<div><Image src='/a/image/13.jpg' /></div>");

const content = reactive({
  title: "",
  html: "",
  publish_time: "",
  department_name: "",
  club_name: "",
  author_name: "",
});

const imageMap = new Map();
const tags = [];

function getfilePathFromUrl(url) {
  // 格式一般为：http://guet-student-club-management-system.oss-cn-guangzhou.aliyuncs.com/upload/club/announcement/file/3454918bed7149de932038432fbf6ef5.jpg?Expires=1718085095&OSSAccessKeyId=LTAI5tFJPBYi4LkSofQyzHvW&Signature=ExC0g6FeMWCxgM94ZUMeRp5MM%2Fo%3D
  // 获取文件的 file_id
  const pathAndQuery = url.split("?")[0]; // 去除查询字符串部分

  var startIndex = pathAndQuery.indexOf("/", 8) + 1; // 跳过协议

  return "/a" + pathAndQuery.slice(pathAndQuery.indexOf("/", startIndex)); // 排除域名部分与/upload部分
}

// function isParentContainImages(parentElement, selector = "img") {
//   // 使用 querySelectorAll 来查找父元素内所有的 img 元素
//   const images = parentElement.querySelectorAll(selector);
//   // 如果找到了至少一个 img 元素，则返回 true
//   return images.length > 0;
// }

// const CatchImages2mountHtml = (html) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");
//   const childrens = doc.body.children;

//   // const images = doc.querySelectorAll("img");
//   // const p = doc.querySelectorAll("p");

//   for (let i = 0; i < childrens.length; i++) {
//     var child = childrens[i];
//     if (isParentContainImages(child)) {
//       imageMap.set(i, []);
//       var images = child.querySelectorAll("img");
//       images.forEach((img) => {
//         imageMap.get(i).push({
//           src: getfilePathFromUrl(img.src),
//           style: img.style,
//           parentStyle: child.style,
//         });
//         child.removeChild(img);
//       });
//     } else {
//       tags.push(child);
//     }
//   }

//   // console.log("ImageMap", imageMap);
//   // console.log("tags", tags);
//   // console.log(doc.body);
// };

const fetchContent = () => {
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

const parseHtml = (html) => {
  // 这里使用 DOMParser 来解析 HTML 字符串为 DOM 节点
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 查找所有的 <img> 标签
  const imgs = doc.querySelectorAll("img");
  const VNodeList = [h("p", "这是一段标识文本")];

  imgs.forEach((imgElement) => {
    console.log("style", imgElement.style, "\nlength", imgElement.style.length);
    // 创建一个 Vue 组件的虚拟节点
    const imageVNode = h(Image, {
      src: getfilePathFromUrl(imgElement.src),
      alt: imgElement.alt,
      containerStyle: "inline-block",
    });
    // 将 <img> 标签替换为 Vue 组件的虚拟节点（这里只是逻辑上的替换，实际 DOM 不会被改变）
    // 注意：我们不能直接替换 DOM 中的元素，因为 Vue 使用虚拟 DOM
    // 所以我们需要在渲染函数中构建新的虚拟 DOM 树

    // 你可以在这里进行更复杂的 DOM 操作或转换，但请记住这只是在内存中进行的
    // 并且你需要将结果转换回字符串或构建一个新的 VNode 树
    VNodeList.push(imageVNode);
  });

  // 直接构建一个简单的 VNode 树
  return h("div", VNodeList);
};

const renderComponent = () => {
  // 在这里调用 processHtml 函数，并返回构建的 VNode 树
  return parseHtml(content.html);
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
            <div v-if="renderComponent">
              <component :is="renderComponent" />
            </div>
            <!-- <div v-html="content.html" /> -->
            <!-- <p style="text-align: center">
              <Image
                containerStyle="inline-block"
                style="width: 152px; height: 228.56px"
                src="/a/club/announcement/file/19b7f199e9884493858259b54596cfca.jpg"
              />
            </p> -->
          </div>
          <!-- <div class="my-4" v-html="testHtml"></div> -->
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
