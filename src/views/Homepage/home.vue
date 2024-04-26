<script setup>
import { reactive, ref, watch, toRaw, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import testData from "./test-data/mock.js";
import useStore from "@/store";

const router = useRouter();

const handleClick2Page = (value) => {
  console.log("点击了", value);
};

onMounted(() => {});
</script>

<template>
  <div id="container" class="container__center">
    <div class="wrapper grid1">
      <div class="grid1-title">社团信息</div>
      <div class="grid1-title">活动/比赛信息</div>
      <div class="grid1-left-body">
        <div class="body-carousel">
          <!-- TODO: 图片URL的读取权限总是访问失败 -->
          <el-carousel height="auto" :interval="4000">
            <el-carousel-item v-for="item in testData.imageList" :key="item">
              <img
                class="image cursor-pointer"
                @click="handleClick2Page(item)"
                :src="item"
                alt="图片失败"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="body-carousel">
          <el-carousel height="auto" :interval="4000">
            <el-carousel-item v-for="item in testData.imageList" :key="item">
              <img
                class="image cursor-pointer"
                @click="handleClick2Page(item)"
                :src="item"
                alt="图片失败"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="grid1-right-body">
        <el-card v-for="item in testData.imageList">
          <div style="height: 210px">
            <img
              class="image cursor-pointer"
              @click="handleClick2Page(item)"
              :src="item"
              alt="图片失败"
            />
          </div>
          <div style="padding: 14px">
            <span class="time">2024-4-25</span>
            <div @click="handleClick2Page(item)" class="title cursor-pointer">
              长度努力达到第二行的标题文本占位符
            </div>
            <div class="description">
              长度努力努努力努力努力努力努力努力努力努力力努力努力努力努力努力超过第三行的部分全文文本占位符
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="wrapper grid2">2</div>
    <div class="wrapper grid3">3</div>
  </div>
</template>

<style scoped>
#container {
  background: #fff;
  padding: 20px;
  display: grid;
}
.wrapper {
  display: grid;
}
.grid1 {
  grid-template-columns: 1fr 1fr;
}
.grid1-title {
  font-size: larger;
  color: #17529e;
  font-weight: 600;
  margin-left: 16px;
  padding: 10px 0;
}
.grid1-left-body {
  display: grid;
  grid-template-rows: 2fr 2fr;
}
.body-carousel {
  padding: 15px 20px;
}
.el-carousel__item {
  height: 425px;
}
.grid1-right-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.grid1-right-body > .el-card {
  margin: 10px;
}
.grid1-right-body:deep() .el-card__body {
  padding: 0;
}
.image {
  height: 100%;
  width: 100%;
}
.time {
  font-size: medium;
  font-weight: 600;
  color: #4c9ce7;
}
.title {
  width: fit-content;
  font-size: larger;
  font-weight: 600;
  color: #000;
  margin-top: 12px;
}
.description {
  font-size: large;
  color: #000;

  margin-top: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@supports (-webkit-line-clamp: 3) {
  .description {
    /* 对于支持-webkit-line-clamp的浏览器，显示多行文本 */
    overflow: hidden; /* 隐藏超出的内容 */
    display: -webkit-box; /* 将对象作为弹性盒子模型显示 */
    -webkit-box-orient: vertical; /* 从上到下的堆叠 */
    -webkit-line-clamp: 3; /* 显示行数 */
    white-space: normal;
    margin-top: 18px;
  }
}
.grid2 {
}
.grid3 {
}
</style>
