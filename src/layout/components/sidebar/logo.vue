<script setup lang="ts">
import logo from "@/assets/logo.png";
const props = defineProps({
  collapse: Boolean,
});
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapses: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        title="欢迎您"
        class="sidebar-logo-link"
        :to="'/'"
      >
        <img :src="logo" alt="logo" />
        <span class="sidebar-title">欢迎您</span>
      </router-link>
      <router-link
        v-else
        key="expand"
        title="欢迎您"
        class="sidebar-logo-link"
        :to="'/'"
      >
        <img :src="logo" alt="logo" />
        <span class="sidebar-title">欢迎您</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;

  .sidebar-logo-link {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;
    padding-left: 10px;

    img {
      display: inline-block;
      height: 32px;
    }

    .sidebar-title {
      display: inline-block;
      height: 32px;
      margin: 2px 0 0 12px;
      overflow: hidden;
      font-size: 18px;
      font-weight: 600;
      line-height: 32px;
      color: black;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
