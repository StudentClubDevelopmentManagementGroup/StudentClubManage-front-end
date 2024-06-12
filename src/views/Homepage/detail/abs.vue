<template>
  <div>
    <component :is="dynamicContent" />
  </div>
</template>

<script>
import { defineComponent, h, createApp, Fragment } from "vue";
import Image from "@/components/Image";

export default defineComponent({
  props: {
    htmlContent: String,
  },
  methods: {
    getfilePathFromUrl(url) {
      // 格式一般为：http://guet-student-club-management-system.oss-cn-guangzhou.aliyuncs.com/upload/club/announcement/file/3454918bed7149de932038432fbf6ef5.jpg?Expires=1718085095&OSSAccessKeyId=LTAI5tFJPBYi4LkSofQyzHvW&Signature=ExC0g6FeMWCxgM94ZUMeRp5MM%2Fo%3D
      // 获取文件的 file_id
      const pathAndQuery = url.split("?")[0]; // 去除查询字符串部分

      var startIndex = pathAndQuery.indexOf("/", 8) + 1; // 跳过协议

      return "/a" + pathAndQuery.slice(pathAndQuery.indexOf("/", startIndex)); // 排除域名部分与/upload部分
    },
  },
  computed: {
    dynamicContent() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${this.htmlContent}</div>`, "text/html");
      const body = doc.body;
      const images = body.getElementsByTagName("img");

      // 遍历并替换<img>标签
      Array.from(images).forEach((img) => {
        const imageComponent = h(Image, {
          src: this.getfilePathFromUrl(img.src),
          alt: img.alt,
          containerStyle: "inline-block",
        });
        // 使用Vue的渲染函数创建Image组件的VNode，并替换<img>元素
        img.parentNode.replaceChild(document.createTextNode(""), img); // 先移除<img>元素
        const fragment = document.createDocumentFragment();
        // 方法
        let count = 0;
        const vnodeToDOM = (vnode) => {
          count += 1;
          console.log(count, "vnodeToDom", vnode);
          if (vnode.type === Fragment) {
            vnode.children.forEach(vnodeToDOM);
          } else {
            console.log("name", vnode.type.name);
            console.log("tag", vnode.tag);
            const element = document.createElement(vnode.type.name || vnode.tag);
            vnode.props?.attrs &&
              Object.entries(vnode.props.attrs).forEach(([key, value]) => {
                element.setAttribute(key, value);
              });
            if (vnode.children) {
              vnode.children.forEach((childVnode) => {
                if (typeof childVnode === "string") {
                  element.textContent = childVnode;
                } else {
                  vnodeToDOM(childVnode);
                  element.appendChild(childVnode.el);
                }
              });
            }
            fragment.appendChild(element);
          }
        };
        // 方法
        console.log("imageComponent", imageComponent);
        const vnode = h(Fragment, {}, imageComponent); // 使用Fragment包裹Image组件
        vnode.el = document.createElement("div"); // 创建一个临时的div元素作为挂载点
        vnodeToDOM(vnode); // 将VNode转换为DOM元素并添加到fragment中
        img.parentNode.insertBefore(vnode.el.firstChild, img.nextSibling); // 插入转换后的DOM元素
      });

      // 注意：这里返回的是一个DOM元素，而不是Vue的VNode。在实际应用中，可能需要更复杂的处理来确保响应性和组件的完整性。
      return () => body.firstChild; // 返回一个返回DOM节点的函数，以便在模板中使用
    },
  },
});
</script>
