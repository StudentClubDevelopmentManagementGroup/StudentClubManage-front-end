<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import fileApi from "@/api/file";

import notFound from "@/assets/not-found-img.svg";

interface EmptyImageStyle {
  width: string;
  height: string;
}

const props = defineProps({
  /** 指定图片源（与原生 img 元素相同）*/
  src: {
    type: String,
    default: "",
  },
  /** 确定图片在容器中如何调整大小以适应（类似于 CSS 的 object-fit 属性） */
  fit: {
    type: String,
    values: ["", "contain", "cover", "fill", "none", "scale-down"],
    default: "",
  },
  /** 原生属性alt */
  alt: {
    type: String,
    default: "",
  },
  /** 启用图片的懒加载 */
  // TODO: el-image的懒加载适配骨架的时候有加载不出来图片的bug!
  lazy: {
    type: Boolean,
    default: false,
  },
  /** 确定是否将图片查看器附加到 body 中（适用于嵌套的父元素） */
  previewTeleported: {
    type: Boolean,
    default: false,
  },
  /**
   * @Description 非ElImage的原生属性
   */
  /** 是否允许预览图片 */
  imagePreview: {
    type: Boolean,
    default: false,
  },
  /** 骨架加载是否启用， true表示正在加载；false表示加载完成 */
  skeletonLoading: {
    type: Boolean,
    default: true,
  },
  /** 控制 ElImage 加载图片资源失败/空资源时的未找到图片的 SVG 大小 */
  emptyImageStyle: {
    type: Object as () => EmptyImageStyle,
  },
  /** 控制图片容器的嵌入样式 */
  containerStyle: {
    type: String,
    value: ["block", "inline", "inline-block"],
    default: "block",
  },
});

// // 请求头携带缓存时间
// service.defaults.headers['Cache-control'] = 'max-age=1800' // 设置缓存时间为30分钟
// // 浏览器将遵循服务器明确指定的 MIME 类型
// service.defaults.headers['X-Content-Type-Options'] = 'nosniff'

const { src, imagePreview, skeletonLoading, emptyImageStyle, containerStyle } = props;

const ImageRef = ref();
const url = ref("");
const previewSrcList = ref([]);
const loading = ref(skeletonLoading);
const errorCount = ref(0);

const computedEmptyImageStyle = computed(() => {
  if (!emptyImageStyle && ImageRef.value) {
    // 根据如容器的宽度和高度计算自己的高度和宽度
    const parentWidth = Math.round(ImageRef.value.offsetWidth * 0.5);
    const parentHeight = Math.round(ImageRef.value.offsetHeight * 0.5);

    if (parentWidth === 0 || parentHeight === 0) {
      return {
        width: `100px`,
        height: `100px`
      };
    } else {
      return {
        width: `${parentWidth}px`,
        height: `${parentHeight}px`,
      };
    }
  } else {
    // 自定义参数
    return {
      width: `${emptyImageStyle?.width}`,
      height: `${emptyImageStyle?.height}`,
    };
  }
});

const getFileUrl = (file_id: String) => {
  return new Promise((resolve, reject) => {
    fileApi
      .getFlieUrl(file_id)
      .then((data) => {
        url.value = data;
        if (imagePreview) {
          previewSrcList.value.push(data);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};

const handleError = () => {
  errorCount.value++;
  if (errorCount.value <= 2) {
    // 两次重新加载的机会
    getFileUrl(src);
  } else {
    loading.value = false;
  }
};

const handleSuccess = () => {
  loading.value = false;
};

onMounted(() => {
  getFileUrl(src);
  setTimeout(() => {
    loading.value = false;
  }, 6000);
});
</script>

<template>
  <div :style="`display:${containerStyle}`">
    <!-- 预加载骨架部分 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" />
      </template>
    </el-skeleton>
    <!-- 图片加载部分 -->
    <div class="image-container" ref="ImageRef">
      <el-image
        v-show="!loading"
        v-bind="$props"
        :src="url"
        :key="url"
        :alt="alt"
        :preview-src-list="previewSrcList"
        @error="handleError"
        @load="handleSuccess"
      >
        <template #error>
          <notFound class="not-found" :style="computedEmptyImageStyle" />
        </template>
      </el-image>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-skeleton {
  width: 100%;
  height: 100%;

  .el-skeleton__item {
    width: 100%;
    height: 100%;
  }
}
.image-container {
  width: 100%;
  height: 100%;

  .el-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
