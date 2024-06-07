<script setup>
/**
 * //TODO: 首页一版 被废弃 未完工
 */
import { reactive, ref, watch, toRaw, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import testData from "./test-data/mock.js";
import useStore from "@/store";
import Image from "@/components/Image";

const router = useRouter();

const handleClick2Page = (value) => {
  console.log("点击了", value);
};

onMounted(() => {});
</script>

<template>
  <div class="container-width m-auto bg-white p-5">
    <div class="grid grid1">
      <div class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3">社团信息</div>
      <div class="text-xl text-blue-800 font-semibold ml-4 pt-3 pb-3">活动/比赛信息</div>
      <div>
        <div class="pt-4 pr-5 pl-5">
          <!-- TODO: 图片URL的读取权限总是访问失败 -->
          <el-carousel height="auto" :interval="4000">
            <el-carousel-item v-for="item in testData.remoteImageList" :key="item">
              <Image
                class="card-image"
                @click="handleClick2Page(item)"
                fit="fill"
                :src="item"
              />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="pt-4 pr-5 pl-5">
          <el-carousel height="auto" :interval="4000">
            <el-carousel-item v-for="item in testData.remoteImageList" :key="item">
              <Image
                class="card-image"
                @click="handleClick2Page(item)"
                fit="fill"
                :src="item"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="grid grid1-right-body">
        <el-card
          class="h-[425px] mt-4 mr-2.5 ml-2.5"
          v-for="item in testData.remoteImageList"
        >
          <div class="h-[210px]">
            <Image
              class="card-image"
              @click="handleClick2Page(item)"
              fit="fill"
              :src="item"
              preview
            />
          </div>

          <div class="pr-5 pl-5 pt-4 pb-2">
            <el-text class="w-full !text-lg !font-semibold" type="primary" line-clamp="1"
              >2024-04-25</el-text
            >
            <el-text
              @click="handleClick2Page(item)"
              class="w-full cursor-pointer !text-xl !text-black font-semibold"
              line-clamp="2"
            >
              标题占位符 标题占位符 标题占位符 标题占位符 标题占位符
            </el-text>
            <el-text class="w-full !mt-2 !text-base !text-black" line-clamp="3">
              描述内容占位符 描述内容占位符 描述内容占位符 描述内容占位符 描述内容占位符
              描述内容占位符 描述内容占位符
            </el-text>
          </div>
        </el-card>
      </div>
    </div>
    <div class="grid grid2">2</div>
    <div class="grid grid3">3</div>
  </div>
</template>

<style scoped lang="scss">
.grid1 {
  grid-template-columns: 1fr 1fr;

  ::v-deep(.el-carousel__item) {
    height: 425px;
  }

  .grid1-right-body {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    ::v-deep(.el-card__body) {
      padding: 0;
    }
  }

  .card-image {
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
}
</style>
