<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { useRouter } from "vue-router";
import Image from "@/components/Image";

const router = useRouter();
const hanldeSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
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
