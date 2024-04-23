<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div id="container">
    <div id="wrapper" class="container__mw">
      <div id="inner" class="container__center">
        <div>
          <img src="@/assets/logo10.png" alt="" />
        </div>
        <div>
          <div>
            版权所有：桂林电子科技大学　校址：中国广西桂林金鸡路1号　邮编：541004　传真：0773-2290083
          </div>
          <div>占位符</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#wrapper {
  background-image: url("@/assets/footer-pattern.png");
  background-color: rgb(0, 113, 174);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
#inner {
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#inner > div:first-child {
  height: 100%;
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;
}
#inner > div:last-child {
  color: #fff;
  padding-left: 24px;
  flex: 2;
  display: flex;
  flex-direction: column;
}
#inner > div img {
  width: 90%;
}
</style>
