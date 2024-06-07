<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import Image from "@/components/Image";
import { message } from "@/utils/message";

const route = useRoute();
const hanldeSelect = (key, keyPath) => {
  console.log(key, keyPath);
};

onMounted(() => {
  message(`获取到的参数为：${JSON.stringify(route.query)}`);
});
</script>

<template>
  <div id="container">
    <Image
      src="/a/image/13.jpg"
      fit="contain"
      :empty-image-style="{
        width: '150px',
      }"
    />
  </div>
</template>

<style scoped>
#container {
  /* TODO：标记 */
  background: red;
  display: grid;
  justify-content: center;
}
</style>
