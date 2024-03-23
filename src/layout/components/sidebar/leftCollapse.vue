<script setup lang="ts">
import { computed } from "vue";
import useStore from "@/store";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

const iconClass = computed(() => {
  return [
    "ml-4",
    "mb-1",
    "w-[16px]",
    "h-[16px]",
    "inline-block",
    "align-middle",
    "cursor-pointer",
    "duration-[100ms]",
  ];
});

const themeColor = computed(() => useStore.themeStore.getThemeColor);

const emit = defineEmits<{
  (e: "toggleClick"): void;
}>();

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div class="collapse-container">
    <IconifyIconOffline
      v-tippy="{
        content: isActive ? '点击折叠' : '点击展开',
        theme: 'light',
        hideOnClick: 'toggle',
        placement: 'right',
      }"
      :icon="MenuFold"
      :class="[iconClass]"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
      @click="toggleClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.collapse-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 0 6px -3px var(--el-color-primary);
}
</style>
