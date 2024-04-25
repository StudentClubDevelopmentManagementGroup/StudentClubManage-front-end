<script setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { Dialog } from "@/components/Dialog";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <Dialog />
  </el-config-provider>
</template>

<style scoped lang="scss">
#app::-webkit-scrollbar {
  display: none;
}
</style>
