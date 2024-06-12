<script setup>
import { ref, reactive, onMounted, createApp } from "vue";

import { useRoute } from "vue-router";
import announcementApi from "@/api/announcement";

import myImage from "@/components/Image";

// 引入需要的Elment Plus
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { ElSkeleton, ElImage } from "element-plus";

const route = useRoute();
const content = reactive({
  title: "",
  html: "",
  publish_time: "",
  department_name: "",
  club_name: "",
  author_name: "",
});

const images = [];

function getFilePathFromUrl(url) {
  // 格式一般为：http://guet-student-club-management-system.oss-cn-guangzhou.aliyuncs.com/upload/club/announcement/file/3454918bed7149de932038432fbf6ef5.jpg?Expires=1718085095&OSSAccessKeyId=LTAI5tFJPBYi4LkSofQyzHvW&Signature=ExC0g6FeMWCxgM94ZUMeRp5MM%2Fo%3D
  // 获取文件的 file_id
  const pathAndQuery = url.split("?")[0]; // 去除查询字符串部分

  var startIndex = pathAndQuery.indexOf("/", 8) + 1; // 跳过协议

  return "/a" + pathAndQuery.slice(pathAndQuery.indexOf("/", startIndex)); // 排除域名部分与/upload部分
}

function isParentContainImages(parentElement, selector = "img") {
  // 使用 querySelectorAll 来查找父元素内所有的 img 元素
  const images = parentElement.querySelectorAll(selector);
  // 如果找到了至少一个 img 元素，则返回 true
  return images.length > 0;
}

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
        processHTML(data.content);
        resolve(data);
      })
      .catch((err) => {
        console.warn(err.message);
        reject(err);
      });
  });
};

const processHTML = (html) => {
  // 这里使用 DOMParser 来解析 HTML 字符串为 DOM 节点
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const children = doc.body.children;

  for (let i = 0; i < children.length; i++) {
    var child = children[i];
    if (isParentContainImages(child)) {
      var imgs = child.querySelectorAll("img");

      imgs.forEach((img) => {
        var span = document.createElement("span");
        var figure = document.createElement("figure");
        figure.classList.add("IMAGE_PLACEHOLDERS");
        figure.style.cssText = "width:fit-content";
        span.style.cssText = child.style.cssText;
        span.appendChild(figure);
        images.push({
          src: getFilePathFromUrl(img.src),
          alt: img.alt,
          style: img.style.cssText,
        });
        img.src = "";
        if (img.nextSibling) {
          child.insertBefore(span, img.nextSibling);
        } else {
          child.appendChild(span);
        }
        img.remove();
      });
    }
  }

  // 将修改后的 DOM 结构转换回 HTML 字符串
  content.html = doc.body.innerHTML;
};

onMounted(async () => {
  await fetchContent();

  const mountPoint = document.getElementsByClassName("IMAGE_PLACEHOLDERS");
  const point = Array.from(mountPoint);
  point.forEach((imgTag, index) => {
    var props = {
      src: images[index].src,
      alt: images[index].alt,
      containerStyle: "inline-block",
      style: images[index].style,
    };

    createApp(myImage, props)
      // .use([ElImage, ElSkeleton], { zhCn })
      .use(ElSkeleton, { zhCn })
      .use(ElImage, { zhCn })
      .mount(imgTag);
  });
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
            <div v-html="content.html" />
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

.article-container {
}
</style>
