<template>
  <div class="sidebar-logo-container" :class="{ collapses: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span v-else class="sidebar-title">欢迎您！{{ name }}</span>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">欢迎您！{{ name }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import logo from "@/assets/logo.png";
import useStore from "@/store";
const props = defineProps({
  collapse: Boolean,
});
const name  =  computed(() => useStore.userStore.getName);
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
  box-shadow: 0 0 6px -3px var(--el-color-primary);
  
  .sidebar-logo-link {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;
    padding-left: 10px;

    img {
      display: inline-block;
      height: 32px;
      border-radius: 4px;
    }

    .sidebar-title {
      display: inline-block;
      height: 32px;
      margin: 2px 0 0 12px;
      overflow: hidden;
      font-size: 18px;
      font-weight: 600;
      line-height: 32px;
      color: $subMenuActiveText;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

