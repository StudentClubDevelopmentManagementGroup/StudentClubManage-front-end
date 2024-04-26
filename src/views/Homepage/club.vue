<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const hanldeSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<template>
  <div id="container">2</div>
</template>

<style scoped>
#container {
  /* TODO：标记 */
  background: red;
  display: grid;
  justify-content: center;
}
</style>
